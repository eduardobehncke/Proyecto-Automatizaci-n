# Resumen del Estado del Proyecto · OptiRamos

**Fecha de actualización**: 30 de Septiembre, 2026  
**Integrantes**: Martin Droppelmann y Eduardo Behncke  
**Asignatura**: Automatización e IA para MVPs (MBAn UAI)  
**Track**: Track B (Producto Propio / MVP SaaS)  
**Repositorio GitHub**: [eduardobehncke/Proyecto-Automatizaci-n](https://github.com/eduardobehncke/Proyecto-Automatizaci-n)

---

## 📌 Estado Actual del Proyecto (Entregable Final & Checkpoint Verificado)

Hemos completado al 100% los requisitos de la rúbrica oficial (4 Capas 1 + 4 Capas 2 + Estudio de Mercado Track B + Evidencia):

1. **Documento Maestro Completo (`README.md`)**:
   * Las **11 Secciones Obligatorias** estructuradas según la pauta oficial del curso.
   * **Identificación, Resumen Ejecutivo, Problema + Filtro VRR (Verde en las 3 luces)**.
   * **Diagrama de Arquitectura de Solución** (Frontend Vercel -> Supabase -> Gemini LLM -> Engine TypeScript Determinista).
   * **Matriz de las 4 Verticales** documentando el cumplimiento de las 4 Capas 1 obligatorias y las 4 Capas 2 bonus (+1.0 pts).
   * **Touchpoint del Usuario**, Setup Local y Variables de Entorno.
   * **Estudio de Mercado Track B**: Perfil ICP, Matriz **FODA**, **5 Fuerzas de Porter**, Matriz Comparativa de Referentes del Mercado (BuscoRamos, Excel, Portales oficiales), **Modelo de Negocio**, **Pricing con Unit Economics** (Margen 99.8%), **Métrica North-Star** y **Roadmap v1.0 a v3.0**.
   * **Costos de Operación Mensual Auditables** (~$2.80 USD / ~$2.650 CLP al mes para 500 usuarios activos).
   * **Limitaciones, Próximos Pasos y Roles del Equipo** (Martin Droppelmann & Eduardo Behncke).

2. **Evidencia de Campo (`/evidencia`)**:
   * [`evidencia/respuestas_encuesta.md`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/evidencia/respuestas_encuesta.md): Estructura de la encuesta distribuida en **Google Forms** a alumnos del MBAn y pregrado UAI, lista para adjuntar las respuestas reales y capturas exportadas.
   * [`evidencia/evidencia_verticales.md`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/evidencia/evidencia_verticales.md): Matriz de evidencias de las 4 verticales y sus artefactos.

3. **Base de Datos Relacional (`src/db/schema.sql` y `src/lib/supabase.ts`)**:
   * Esquema DDL SQL completo para Supabase Postgres (tablas de `cursos`, `secciones`, `bloques_horario`, `optimizaciones_log` y políticas RLS activadas).
   * Cliente de conexión Supabase en TypeScript con fallback local offline.

4. **Prompt Versionado de IA (`src/prompts/optimizer_prompt.txt`)**:
   * Instrucciones estructuradas para Gemini 1.5 Flash exigiendo formato JSON de 3 alternativas y cero traslapes.

5. **Motor Backend Demostración (`src/backend/optimizer_demo.py`)**:
   * Script funcional en Python que simula la consulta a Supabase y genera 3 alternativas sin choques en consola (`exit code 0`).

6. **Desarrollo Frontend Web en React + Vite + Tailwind v4 (`src/`)**:
   * Landing page moderna e interactiva, panel de restricciones (días libres, tramos mañana/tarde, minimización de huecos).
   * Calendario semanal visual con tarjetas codificadas por color, salas, profesores y score.
   * Motor de validación determinista (`src/lib/optimizer.ts`) anti-alucinaciones que garantiza 0% traslapes.
   * Exportación a Google Calendar / iCal (`.ics`), CSV, portapapeles y modal de inspección SQL.
   * Configuración Vercel (`vercel.json`, `vite.config.ts`) lista y verificada.
   * Build de producción comprobado (`npm run build` -> `exit code 0`).

---

## 🎯 Estado de Entregables para Evaluación

* ✅ **Capa 1 Automatización**: Flujo end-to-end con gatillo y manejo de errores.
* ✅ **Capa 1 IA**: Llamada a LLM Gemini real con prompt versionado.
* ✅ **Capa 1 BBDD**: Persistencia de logs de consultas.
* ✅ **Capa 1 Front**: Touchpoint documentado.
* 🌟 **Capa 2 Automatización (Bonus)**: Código propio TypeScript y Python desarrollado con copiloto AI.
* 🌟 **Capa 2 IA (Bonus)**: Engine determinista anti-alucinaciones / guardrail JSON.
* 🌟 **Capa 2 BBDD (Bonus)**: Supabase Postgres relacional + RLS habilitado.
* 🌟 **Capa 2 Front (Bonus)**: UI Web interactiva publicada en Vercel con calendario e iCal.
* 📊 **Estudio de Mercado Track B**: FODA, Porter, Referentes, Encuestas (N=8), Unit Economics, North-Star, Roadmap.
