// Vercel Serverless Function · POST /api/optimize
// Llama a Gemini con el prompt versionado (src/prompts/optimizer_prompt.txt)
// y devuelve las propuestas crudas del LLM. La validación anti-alucinaciones
// (secciones inexistentes, choques, días prohibidos) ocurre en src/lib/optimizer.ts.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Modelo principal y modelo de respaldo (se usa si el principal está saturado, falla o hace timeout)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash';
const PRESUPUESTO_MS = 27_000;        // bajo el maxDuration de 30 s de vercel.json
const TIMEOUT_PRINCIPAL_MS = 10_000;  // el modelo lite responde en ~1-3 s; si no, pasa al respaldo

let systemPromptCache: string | null = null;

function cargarSystemPrompt(): string {
  if (!systemPromptCache) {
    systemPromptCache = readFileSync(
      join(process.cwd(), 'src', 'prompts', 'optimizer_prompt.txt'),
      'utf-8'
    );
  }
  return systemPromptCache;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'GEMINI_API_KEY no configurada en el servidor' }, 503);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Body JSON inválido' }, 400);
  }

  const { cursos, restricciones } = body ?? {};
  if (!Array.isArray(cursos) || !restricciones || !Array.isArray(restricciones.ramos_requeridos)) {
    return json({ error: 'Se requieren "cursos" y "restricciones.ramos_requeridos"' }, 400);
  }

  // Solo se envían al LLM los ramos solicitados (menos tokens, menos ruido)
  const catalogo = cursos
    .filter((c: any) => restricciones.ramos_requeridos.includes(c.codigo))
    .map((c: any) => ({
      codigo: c.codigo,
      nombre_curso: c.nombre,
      secciones: (c.secciones ?? []).map((s: any) => ({
        seccion: s.seccion,
        profesor: s.profesor,
        bloques: (s.bloques ?? []).map((b: any) => ({ dia: b.dia, inicio: b.inicio, fin: b.fin })),
      })),
    }));

  if (catalogo.length === 0) {
    return json({ error: 'Ninguno de los ramos solicitados existe en el catálogo' }, 400);
  }

  const userMessage = [
    'CATÁLOGO DE CURSOS DISPONIBLES (JSON):',
    JSON.stringify(catalogo),
    '',
    'RESTRICCIONES DEL ESTUDIANTE (JSON):',
    JSON.stringify({
      ramos_requeridos: restricciones.ramos_requeridos,
      dias_prohibidos: restricciones.dias_prohibidos ?? [],
      preferencia_horario: restricciones.preferencia_horario ?? 'indiferente',
      minimizar_huecos: Boolean(restricciones.minimizar_huecos),
      profesores_excluidos: restricciones.profesores_excluidos ?? [],
    }),
  ].join('\n');

  const inicio = Date.now();
  const requestBody = JSON.stringify({
    systemInstruction: { parts: [{ text: cargarSystemPrompt() }] },
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
  });

  const intentos = [
    { modelo: GEMINI_MODEL, timeout: TIMEOUT_PRINCIPAL_MS },
    { modelo: GEMINI_FALLBACK_MODEL, timeout: Infinity },
  ];
  let ultimoError = 'Error desconocido';

  for (const { modelo, timeout } of intentos) {
    const restante = PRESUPUESTO_MS - (Date.now() - inicio);
    if (restante < 2_000) break;

    const resultado = await llamarGemini(modelo, apiKey, requestBody, Math.min(timeout, restante));
    if (resultado.ok) {
      return json({
        modelo,
        latencia_ms: Date.now() - inicio,
        opciones: Array.isArray(resultado.data?.opciones) ? resultado.data.opciones : [],
      });
    }
    ultimoError = `${modelo}: ${resultado.error}`;
    console.error('Intento fallido con Gemini', ultimoError);
  }

  return json({ error: ultimoError }, 502);
}

type ResultadoGemini = { ok: true; data: any } | { ok: false; error: string };

async function llamarGemini(
  modelo: string,
  apiKey: string,
  requestBody: string,
  timeoutMs: number
): Promise<ResultadoGemini> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: requestBody,
      }
    );

    if (!res.ok) {
      const detalle = await res.text();
      console.error('Gemini error', modelo, res.status, detalle.slice(0, 300));
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const texto: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) return { ok: false, error: 'respuesta sin contenido' };

    try {
      return { ok: true, data: JSON.parse(texto) };
    } catch {
      return { ok: false, error: 'JSON inválido' };
    }
  } catch (err: any) {
    return { ok: false, error: err?.name === 'AbortError' ? `timeout (${timeoutMs} ms)` : 'error de red' };
  } finally {
    clearTimeout(timer);
  }
}
