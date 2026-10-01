# Resumen del Estado del Proyecto · OptiRamos

**Fecha de actualización**: 1 de Octubre, 2026  
**Integrantes**: Martin Droppelmann y Eduardo Behncke  
**Asignatura**: Automatización e IA para MVPs (MBAn UAI)  
**Track**: Track B (Producto Propio / MVP SaaS)  
**Repositorio GitHub**: [eduardobehncke/Proyecto-Automatizaci-n](https://github.com/eduardobehncke/Proyecto-Automatizaci-n)  
**Demo en producción**: [proyecto-automatizaci-n.vercel.app](https://proyecto-automatizaci-n.vercel.app)

---

## ✅ Hecho y verificado

1. **Documento Maestro (`README.md`)**: 11 secciones obligatorias, arquitectura, matriz de 4 verticales, estudio de mercado Track B (ICP, FODA, Porter, referentes, modelo de negocio, unit economics, North-Star, roadmap), costos y roles.
2. **Encuesta de demanda (N=5)**: resultados reales tabulados en [`evidencia/respuestas_encuesta.md`](evidencia/respuestas_encuesta.md) con capturas en [`evidencia/capturas_encuesta/`](evidencia/capturas_encuesta/).
3. **Frontend React + Vite + Tailwind v4** desplegado en Vercel (dos proyectos: `proyecto-automatizaci-n` y `proyecto-automatizaci-n-2q7k`; conviene eliminar el duplicado).
4. **Integración real con Gemini (Capa 1 IA)**:
   * Función serverless [`api/optimize.ts`](api/optimize.ts) que carga el prompt versionado [`optimizer_prompt.txt`](src/prompts/optimizer_prompt.txt) (v1.1) y exige JSON estricto.
   * Guardrail `validarPropuestasLLM` en [`optimizer.ts`](src/lib/optimizer.ts): reconstruye cada propuesta desde el catálogo y rechaza secciones inventadas, ramos faltantes o extra, choques, días prohibidos y profesores excluidos.
   * Fallback automático al motor determinista si Gemini falla, hay timeout o la key no está configurada.
   * La UI indica si cada opción viene de Gemini o del motor determinista.
5. **Supabase (código listo)**: consultas alineadas con `schema.sql`, log de optimizaciones con las columnas correctas, políticas RLS (lectura pública del catálogo, solo INSERT en logs) y [`seed.sql`](src/db/seed.sql) con la oferta piloto.
6. **Build de producción**: `npm run build` pasa sin errores.

## ⏳ Pendiente (requiere acción del equipo)

1. **Gemini**: ✅ key creada en Google AI Studio (nivel gratuito) y probada localmente. Modelo principal `gemini-flash-lite-latest` (1-2,3 s) y respaldo `gemini-3.5-flash`; `gemini-2.5-flash` ya no está disponible (404). Falta agregar `GEMINI_API_KEY` en Vercel y hacer redeploy.
2. **Supabase**: crear el proyecto, ejecutar `schema.sql` y `seed.sql` en el SQL Editor, y agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Vercel.
3. **Evidencia de funcionamiento**: con lo anterior configurado, capturar una optimización con el badge "Propuesta por Gemini" y una fila en `optimizaciones_log`, y agregarlas a `evidencia/`.
4. **Revisar el README**:
   * Recalcular los costos de Gemini (secciones 8.6 y 9) con el modelo real (`gemini-flash-lite-latest`; en el MVP se usa el nivel gratuito).
   * Unificar la cantidad de opciones: el README y la encuesta dicen "2 horarios", y la app muestra hasta 3.
   * Línea base: el README usa 3.5 horas y la encuesta muestra que el 80% tarda más de 4 horas.

## 🎯 Estado por vertical

| Vertical | Capa 1 | Capa 2 |
| :--- | :--- | :--- |
| Automatización | ✅ Flujo end-to-end con gatillo web y manejo de errores/fallback | ✅ Código propio TS + Python |
| IA | ✅ Código listo; falta configurar la key en Vercel | ✅ Guardrail anti-alucinaciones probado |
| BBDD | ⏳ Código listo; falta crear el proyecto Supabase | ⏳ Schema relacional + RLS listos para ejecutar |
| Front | ✅ Touchpoint documentado | ✅ UI publicada en Vercel |
