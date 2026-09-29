# Resumen del Estado del Proyecto · OptiRamos

**Fecha de actualización**: 29 de Septiembre, 2026  
**Integrantes**: Martin Droppelmann y Eduardo Behncke  
**Asignatura**: Automatización e IA para MVPs (MBAn UAI)  
**Track**: Track B (Producto Propio / MVP SaaS)  

---

## 📌 Estado Actual del Proyecto (Tarea 2 - Checkpoint de Avance)

Hemos completado y dejado verificado el esqueleto funcional para la **Tarea 2**:

1. **Documento Maestro (`README.md`)**:
   * Identificación del grupo, track y tipo de entregable.
   * Planteamiento del dolor, Filtro VRR (Valor, Repetitividad, Reglas claras) y propuesta de solución.
   * Diagrama de arquitectura preliminar (Vercel -> Supabase -> LLM).
   * Matriz de las 4 Verticales (Capas 1 y 2).
   * **Plan de Cierre (Ítem C obligado Tarea 2)**: Funcionalidades pendientes, roles asignados a Martín y Eduardo, y plan de mitigación contra alucinaciones del LLM.

2. **Base de Datos (`src/db/schema.sql`)**:
   * Esquema SQL completo preparado para Supabase Postgres (tablas de `cursos`, `secciones`, `bloques_horario`, `optimizaciones_log` y políticas RLS).

3. **Prompt Versionado de IA (`src/prompts/optimizer_prompt.txt`)**:
   * Instructions estructuradas en archivo para el LLM exigiendo formato JSON válido y cero traslapes.

4. **Motor Backend Demostración (`src/backend/optimizer_demo.py`)**:
   * Script funcional en Python que simula la consulta a Supabase con ramos del MBAn UAI (`IND-501`, `FIN-602`, `MKT-503`, `OPE-504`), aplica las restricciones y genera 3 alternativas sin choques en consola.
   * **Estado del script**: Probado y ejecutado exitosamente (`exit code 0`).

5. **Desarrollo del Frontend Web en React + Vite + Vercel (`src/`)**:
   * **UI Modern e Interactiva**: Landing page con selección dinámica de ramos del MBAn UAI, panel de restricciones (días libres, preferencia mañana/tarde, minimización de huecos, exclusión de profesores).
   * **Calendario Interactivo de Resultados**: Grilla semanal visual (Lunes a Viernes 08:30 - 17:15) con tarjetas de cursos codificadas por colores, salas, profesores y breakdown de puntajes MVP.
   * **Motor de Validación Determinista (`src/lib/optimizer.ts`)**: Algoritmo en TypeScript anti-choques que previene alucinaciones del LLM y garantiza 0 traslapes.
   * **Exportación & Integración Supabase**: Exportación a Google Calendar / iCal (`.ics`), CSV y portapapeles, junto con modal de inspección SQL Supabase (`src/components/SupabaseDataModal.tsx`) y configuración para despliegue automático en Vercel (`vercel.json`).

---

## 🎯 Próximos Pasos Inmediatos

1. **Conexión Live con Supabase & Vercel**:
   * Configurar las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el proyecto de Vercel.
   * Ejecutar el despliegue a producción en Vercel (`vercel --prod` o push a GitHub).
2. **Evidencia de Demanda**:
   * Recopilar 5-10 respuestas del Google Forms y guardar las capturas en `evidencia/`.
