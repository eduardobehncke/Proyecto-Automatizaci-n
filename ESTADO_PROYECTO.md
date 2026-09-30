# Resumen del Estado del Proyecto · OptiRamos

**Fecha de actualización**: 30 de Septiembre, 2026  
**Integrantes**: Martin Droppelmann y Eduardo Behncke  
**Asignatura**: Automatización e IA para MVPs (MBAn UAI)  
**Track**: Track B (Producto Propio / MVP SaaS)  
**Repositorio GitHub**: [eduardobehncke/Proyecto-Automatizaci-n](https://github.com/eduardobehncke/Proyecto-Automatizaci-n)

---

## 📌 Estado Actual del Proyecto (Tarea 2 - Checkpoint de Avance & MVP Web)

Hemos completado y dejado verificado el esqueleto funcional y la interfaz web para **OptiRamos**:

1. **Documento Maestro (`README.md`)**:
   * Identificación del grupo, track B (SaaS) y tipo de entregable.
   * Planteamiento del dolor, Filtro VRR (Valor, Repetitividad, Reglas claras) y propuesta de solución.
   * Diagrama de arquitectura (Vercel -> Supabase -> LLM).
   * Matriz de las 4 Verticales (Capas 1 y 2).
   * **Plan de Cierre**: Funcionalidades pendientes, roles asignados a Martín y Eduardo, y plan de mitigación contra alucinaciones del LLM.

2. **Base de Datos Relacional (`src/db/schema.sql` y `src/lib/supabase.ts`)**:
   * Esquema DDL SQL completo preparado para Supabase Postgres (tablas de `cursos`, `secciones`, `bloques_horario`, `optimizaciones_log` y políticas RLS).
   * Cliente de conexión Supabase en TypeScript con fallback local para desarrollo offline.

3. **Prompt Versionado de IA (`src/prompts/optimizer_prompt.txt`)**:
   * Instrucciones estructuradas en archivo para el LLM exigiendo formato JSON válido y cero traslapes.

4. **Motor Backend Demostración (`src/backend/optimizer_demo.py`)**:
   * Script funcional en Python que simula la consulta a Supabase con ramos del MBAn UAI (`IND-501`, `FIN-602`, `MKT-503`, `OPE-504`), aplica las restricciones y genera 3 alternativas sin choques en consola.
   * **Estado**: Probado y ejecutado exitosamente (`exit code 0`).

5. **Desarrollo del Frontend Web en React + Vite + Tailwind v4 (`src/`)**:
   * **UI Modern e Interactiva**: Landing page con selección dinámica de ramos del MBAn UAI, panel de restricciones (días libres, preferencia mañana/tarde, minimización de huecos, exclusión de profesores).
   * **Calendario Interactivo de Resultados**: Grilla semanal visual (Lunes a Viernes 08:30 - 17:15) con tarjetas de cursos codificadas por colores, salas, profesores y breakdown de puntajes MVP.
   * **Motor de Validación Determinista (`src/lib/optimizer.ts`)**: Algoritmo en TypeScript anti-choques que previene alucinaciones del LLM y garantiza 0 traslapes.
   * **Exportación & Integración Supabase**: Exportación a Google Calendar / iCal (`.ics`), CSV y portapapeles, junto con modal de inspección SQL Supabase (`src/components/SupabaseDataModal.tsx`).
   * **Configuración Vercel**: `vercel.json` y `vite.config.ts` listos.
   * **Build de Producción**: Verificado exitosamente (`npm run build` -> `exit code 0`).

6. **Control de Versiones GitHub**:
   * Repositorio inicializado, configurado como público y sincronizado en la rama `main`: `https://github.com/eduardobehncke/Proyecto-Automatizaci-n.git`.

---

## 🎯 Próximos Pasos (Para Continuar en el Nuevo Chat)

1. **Despliegue Live en Vercel**:
   * Confirmar la URL pública en Vercel (importando el repo `eduardobehncke/Proyecto-Automatizaci-n`).
2. **Evidencia de Demanda (Google Forms)**:
   * Recopilar 5 a 10 respuestas de la encuesta de toma de ramos UAI y guardar capturas en `/evidencia`.
3. **Completar Documentación del Estudio de Mercado (Track B)**:
   * Redactar la matriz **FODA** y las **5 Fuerzas de Porter** en el `README.md`.
   * Definir el modelo de negocio, Pricing y Métrica North-Star.
