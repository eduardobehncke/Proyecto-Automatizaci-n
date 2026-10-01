import { Curso, RestriccionesEstudiante, PropuestaLLM } from '../types';

export interface RespuestaLLM {
  modelo: string;
  latencia_ms: number;
  opciones: PropuestaLLM[];
}

// Llama a la función serverless /api/optimize (Gemini). Lanza error si no está disponible
// para que el llamador use el motor determinista como fallback.
export async function solicitarPropuestasLLM(
  cursos: Curso[],
  restricciones: RestriccionesEstudiante,
  timeoutMs = 35_000
): Promise<RespuestaLLM> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursos, restricciones }),
      signal: controller.signal
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data as RespuestaLLM;
  } finally {
    clearTimeout(timer);
  }
}
