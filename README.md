# OptiRamos · Planificador Inteligente de Horarios Universitarios

**Asignatura**: Automatización e IA para MVPs  
**Programa**: MBAn UAI · 2026-B  
**Entregable**: Tarea 2 (Checkpoint de Avance - Sesión 7) / Proyecto Final  

---

## 1. Identificación

* **Nombre del Proyecto**: OptiRamos
* **Integrantes**:
  * Martin Droppelmann
  * Eduardo Behncke
* **Track Elegido**: Track B (Producto Propio / MVP de SaaS / Herramienta Interna)
* **Tipo Declarado**: MVP de SaaS & Herramienta de Automatización con IA

---

## 2. Resumen Ejecutivo

**OptiRamos** es un SaaS/plataforma web con inteligencia artificial que automatiza y optimiza el proceso de toma de ramos para estudiantes universitarios. A partir del catálogo de asignaturas disponibles y las restricciones personales del alumno (días prohibidos, baches de horario, preferencia de profesores), la solución consulta una base de datos vectorial/relacional (Supabase) y ejecuta una evaluación mediante un modelo de lenguaje (LLM). En menos de 2 minutos, genera de 2 a 3 combinaciones de horarios óptimas sin choques, eliminando la frustración y reduciendo el tiempo de planificación de 3 horas a menos de 120 segundos.

---

## 3. Problema, Filtro VRR y Solución

### El Dolor
Al inicio de cada semestre, los estudiantes universitarios dedican entre 3 y 5 horas a planificar manualmente su combinación de ramos. Este proceso manual provoca choques de horario, baches excesivos entre clases, asignación no deseada de profesores y pérdida de ramos clave por lentitud en la decisión.

### El Filtro VRR (Veredicto)
* **Valor (V)**: **VERDE**. El problema consume entre 3 a 5 horas críticas por semestre a miles de estudiantes y genera altos niveles de ansiedad y errores de inscripción.
* **Repetitividad (R)**: **VERDE**. Ocurre de forma periódica e idéntica cada semestre académico (2 a 3 veces por año por estudiante).
* **Reglas claras (R)**: **VERDE**. La lógica de incompatibilidad de horarios, topes de bloques, cruce de secciones y prioridades se puede traducir a reglas deterministas y restricciones de prompt de IA.

### La Solución Propuesta
Una aplicación web desplegada en Vercel con backend automatizado que:
1. Permite al usuario seleccionar sus asignaturas a cursar y marcar sus restricciones en un formulario simple.
2. Consulta el catálogo de ramos en **Supabase (Postgres)**.
3. Ejecuta una llamada a **LLM (Gemini/OpenAI)** con un prompt estructurado que resuelve y valida combinaciones sin topes.
4. Muestra en un calendario interactivo las opciones resultantes y permite guardarlas o exportarlas a Google Calendar.

---

## 4. Arquitectura Preliminar

```
[Usuario / Estudiante]
       │
       ▼
[Interfaz Web en Vercel] ──(Formulario de Restricciones)──┐
       │                                                 │
       ▼                                                 ▼
[Backend / Serverless] ◄─────────────────── [Supabase Postgres (Ramos / Oferta)]
       │
       ├──────► [Llamada a LLM con Prompt Estratégico (Gemini/OpenAI)]
       │
       ▼
[Resultado Optimizando Horario sin Choques]
       │
       ├──────► [Persistencia & Logs en Supabase]
       └──────► [Visualización en Calendario Web]
```

### Descripción del Flujo de Datos
1. **Gatillo**: El usuario envía sus asignaturas seleccionadas y filtros desde la web en Vercel.
2. **Obtención de datos**: El backend consulta en Supabase las secciones y bloques horarios de los ramos seleccionados.
3. **Optimización con IA**: El backend envía las secciones y las restricciones del usuario al LLM, exigiendo un JSON estructurado con las opciones sin topes.
4. **Persistencia & Resultado**: La respuesta se valida, se registra en Supabase para logs/auditoría y se renderiza en la grilla visual de la web.

---

## 5. Las 4 Verticales (Estado de Construcción)

| Vertical | Capa 1 (Obligatoria) | Capa 2 (Bonus) | Estado | Artefacto / Link |
| :--- | :--- | :--- | :--- | :--- |
| **BACKEND · Automatización** | Flujo end-to-end con gatillo webhook/schedule y retry/error handling. | Código propio construido con copiloto (scripts Node/Python). | 🟡 En progreso | `src/backend/` |
| **BACKEND · IA** | Al menos 1 llamada a LLM real con prompt versionado en archivo. | Agente con RAG / Guardrails + Evals documentados. | 🟡 En progreso | `src/prompts/optimizer_prompt.txt` |
| **BACKEND · BBDD** | Persistencia real de datos o logs. | Supabase (Postgres) con esquema propio + RLS. | 🟢 Definido | `src/db/schema.sql` |
| **FRONT · Touchpoint** | Explicación clara de gatillo, canal y entrega de resultado. | UI web propia en Vercel integrada al backend. | 🟡 En progreso | `src/ui/` |

---

## 6. Touchpoint del Usuario

* **Gatillo**: El alumno ingresa a la aplicación web de *OptiRamos* desplegada en Vercel.
* **Canal / Plataforma**: Aplicación Web responsive.
* **Resultado**: Grilla visual e interactiva de horarios semanales sin topes + resumen explicativo de ventajas de cada alternativa + opción de exportar/guardar.

---

## 7. Plan de Cierre (Requisito Checkpoint Tarea 2)

### 1. Funcionalidades y Artefactos Pendientes
* Poblar la base de datos de Supabase con el dataset de prueba (15-20 ramos realistas del MBAn/UAI).
* Completar el script de backend de integración entre Supabase y la API del LLM.
* Diseñar la interfaz web en Vercel para seleccionar ramos y visualizar el calendario de resultados.
* Ejecutar la encuesta de demanda (Google Forms) con al menos 5-10 respuestas reales de estudiantes y guardar las capturas en `/evidencia`.

### 2. Roles del Equipo
* **Martin Droppelmann**: Lógica Backend, Integración con Supabase, Prompts de IA y Documentación de Arquitectura.
* **Eduardo Behncke**: Desarrollo Frontend en Vercel, Estudio de Mercado (Porter, FODA, Pricing) y Levantamiento de Evidencia de Demanda.

### 3. Riesgo Principal Identificado
* **Riesgo**: Que el LLM alucine o genere combinaciones con choques horarios imperceptibles en llamadas complejas.
* **Plan de Mitigación**: Implementar un filtro de validación determinista previo/posterior en código (TypeScript/Python) que revise que no existan traslapes exactos de bloques antes de enviar el resultado al usuario.

---

## 8. Cómo Correr el Proyecto (Setup Preliminar)

1. Clonar el repositorio.
2. Configurar las variables de entorno en `.env`:
   ```env
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_key
   GEMINI_API_KEY=tu_gemini_api_key
   ```
3. Instalar dependencias e iniciar servidor local:
   ```bash
   npm install
   npm run dev
   ```

---
*OptiRamos · MBAn UAI 2026-B*
