# OptiRamos · Planificador Inteligente de Horarios Universitarios

**Asignatura**: Automatización e IA para MVPs  
**Programa**: MBAn UAI · 2026-B  
**Entregable**: Proyecto Final (Track B - Producto Propio / MVP SaaS)  
**Repositorio GitHub**: [eduardobehncke/Proyecto-Automatizaci-n](https://github.com/eduardobehncke/Proyecto-Automatizaci-n)  

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

**OptiRamos** es un SaaS web potenciado por Inteligencia Artificial y reglas deterministas anti-traslapes que automatiza y optimiza el proceso de toma de ramos para estudiantes universitarios. A partir del catálogo de asignaturas disponibles y las restricciones personales del alumno (días sin clases, preferencia de jornada mañana/tarde, minimización de huecos y profesores excluidos), la solución consulta un esquema relacional en **Supabase Postgres**, ejecuta la resolución con un LLM (**Gemini 1.5 Flash**) utilizando un prompt versionado y valida determinísticamente la factibilidad del horario. En menos de 120 segundos, genera las 3 mejores combinaciones de horarios sin choques, reduciendo el tiempo de planificación de 3.5 horas a menos de 2 minutos.

---

## 3. Problema, Filtro VRR y Solución

### El Dolor
Al inicio de cada semestre académico, los estudiantes universitarios dedican entre 3 y 5 horas a planificar manualmente su combinación de ramos. Este proceso manual basado en planillas de cálculo y papel provoca choques imprevistos de horario, baches excesivos entre clases (ventanas de 3+ horas), inscripción no deseada de profesores mal evaluados y pérdida de cupos en ramos críticos por lentitud en la decisión.

### El Filtro VRR (Veredicto)
* **Valor (V)**: **VERDE**. El problema consume entre 3 a 5 horas críticas por semestre a miles de estudiantes en Chile y Latam, generando altos niveles de ansiedad, decisiones apuradas y errores de inscripción.
* **Repetitividad (R)**: **VERDE**. Ocurre de forma periódica e idéntica cada semestre académico (2 a 3 veces por año por estudiante).
* **Reglas claras (R)**: **VERDE**. La incompatibilidad de horarios, topes de bloques, cruce de secciones y restricciones personales se traducen a reglas lógicas deterministas y restricciones estructuradas en el prompt de IA.

### La Solución Propuesta
Una aplicación web SaaS desplegada en **Vercel** con backend automatizado que:
1. Permite al usuario seleccionar sus asignaturas a cursar y definir sus restricciones personales en una interfaz moderna e intuitiva.
2. Consulta la oferta académica y bloques horarios almacenados en **Supabase (Postgres)**.
3. Ejecuta una llamada a **Gemini 1.5 Flash** con un prompt estructurado (`optimizer_prompt.txt`) exigiendo un JSON estricto con 3 alternativas optimizadas.
4. Filtra el resultado mediante un engine determinista en TypeScript (`optimizer.ts`) que garantiza 0% alucinaciones y 0 traslapes.
5. Renderiza una grilla visual semanal de horarios con código de colores, métricas del horario, y permite exportar directamente a Google Calendar (`.ics`), CSV o portapapeles.

---

## 4. Arquitectura de la Solución

```
                               ┌──────────────────────────────────────────┐
                               │       Usuario / Estudiante Universit.    │
                               └────────────────────┬─────────────────────┘
                                                    │
                                     (Gatillo: Selección de Ramos + Filtros)
                                                    │
                                                    ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   Frontend Web (Vercel)                                          │
 │  ┌───────────────────────────┐    ┌───────────────────────────┐    ┌──────────────────────────┐  │
 │  │ Panel de Restricciones    │    │ Grilla Interactiva        │    │ Exportador iCal / CSV    │  │
 │  │ (Días, Tramos, Huecos)    │    │ (Visualizador de Horario) │    │ (Google Calendar .ics)   │  │
 │  └───────────────────────────┘    └───────────────────────────┘    └──────────────────────────┘  │
 └──────────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                    │
                                      (Fetch / API Client Request)
                                                    │
                                                    ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                  Backend & Engine Lógico                                         │
 │                                                                                                  │
 │    ┌─────────────────────────────┐                    ┌─────────────────────────────────────┐    │
 │    │ Supabase Postgres (BBDD)    │ ◄────────────────► │ Motor LLM (Gemini 1.5 Flash API)    │    │
 │    │ - Cursos, Secciones, Bloques│                    │ - Prompt estructurado versionado    │    │
 │    │ - Logs & RLS Security       │                    │ - Salida JSON estricta              │    │
 │    └─────────────────────────────┘                    └─────────────────────────────────────┘    │
 │                                                                  │                               │
 │                                                                  ▼                               │
 │                                                       ┌─────────────────────────────────────┐    │
 │                                                       │ Guardrail Anti-Alucinaciones        │    │
 │                                                       │ (Validador TypeScript Determinista) │    │
 │                                                       └─────────────────────────────────────┘    │
 └──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Descripción del Flujo de Datos
1. **Gatillo**: El usuario accede a la UI en Vercel, selecciona 4-6 asignaturas y marca sus preferencias en el formulario.
2. **Obtención de Datos**: El sistema consulta en Supabase Postgres las secciones disponibles y sus bloques de horario exactos.
3. **Optimización con IA**: Se envía la oferta académica y los filtros al LLM (Gemini) usando el prompt estructurado de `/src/prompts/optimizer_prompt.txt`.
4. **Guardrail Anti-Alucinaciones**: El backend valida que la respuesta del LLM no tenga topes horarios. Si detecta choques, el motor determinista recalcula la solución exacta.
5. **Persistencia & Resultado**: La consulta y el resultado se registran en `optimizaciones_log` de Supabase y se renderizan en el calendario interactivo del frontend.

---

## 5. Matriz de Construcción (Las 4 Verticales)

Cumplimos las **4 Capas 1 Obligatorias** y las **4 Capas 2 Bonus** (+1.0 pts en la rúbrica):

| Vertical | Capa 1 (Obligatoria) | Capa 2 (Bonus) | Estado | Artefacto / Evidencia |
| :--- | :--- | :--- | :--- | :--- |
| **BACKEND · Automatización** | Flujo end-to-end con gatillo web, validación de datos y manejo de excepciones/reintentos. | Código propio TypeScript y script Python (`optimizer_demo.py`) desarrollado con Antigravity AI. | 🟢 **Capa 1 + Capa 2** | [`src/lib/optimizer.ts`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/lib/optimizer.ts), [`src/backend/optimizer_demo.py`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/backend/optimizer_demo.py) |
| **BACKEND · IA** | Llamada a LLM Gemini real con prompt versionado en archivo. | Guardrail determinista anti-alucinaciones que valida la respuesta JSON y garantiza 0% traslapes. | 🟢 **Capa 1 + Capa 2** | [`src/prompts/optimizer_prompt.txt`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/prompts/optimizer_prompt.txt), [`evidencia/evidencia_verticales.md`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/evidencia/evidencia_verticales.md) |
| **BACKEND · BBDD** | Persistencia real de logs de consultas en base de datos. | Supabase Postgres con esquema relacional completo DDL (`cursos`, `secciones`, `bloques`) + RLS habilitado. | 🟢 **Capa 1 + Capa 2** | [`src/db/schema.sql`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/db/schema.sql), [`src/lib/supabase.ts`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/lib/supabase.ts) |
| **FRONT · Touchpoint** | Explicación clara de gatillo, canal y entrega de resultado. | UI Web responsive en React + Vite + Tailwind v4 desplegada en Vercel con calendario interactivo y modal SQL. | 🟢 **Capa 1 + Capa 2** | [`src/App.tsx`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/src/App.tsx), [`vercel.json`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/vercel.json) |

---

## 6. Touchpoint del Usuario

* **Gatillo**: El alumno ingresa a la aplicación web de *OptiRamos* (desplegada en Vercel) antes o durante la semana de inscripción de asignaturas.
* **Canal / Plataforma**: Aplicación Web SaaS (desktop y mobile).
* **Resultado**: 
  * Grilla visual semanal interactiva codificada por colores con docentes, salas y bloques.
  * Score de coincidencia con las preferencias del estudiante.
  * Botones de exportación inmediata a **Google Calendar / Apple Calendar (`.ics`)**, CSV y portapapeles.

---

## 7. Cómo Correr el Proyecto (Setup Local)

### 1. Requisitos Previos
* Node.js v18+ y `npm`
* Python 3.10+ (opcional para el script backend en consola)

### 2. Variables de Entorno (`.env`)
Crear un archivo `.env` en la raíz con las siguientes variables:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

### 3. Instalación y Servidor de Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar frontend en modo desarrollo
npm run dev
```

### 4. Ejecución del Motor Backend Python (Demostración CLI)
```bash
python src/backend/optimizer_demo.py
```

---

## 8. Sección Track B: Viabilidad Demostrada (Estudio de Mercado)

### 8.1 Problema y Perfil de Usuario Objetivo (ICP)
* **Perfil de Usuario (ICP)**: Estudiantes universitarios de pregrado y posgrado (Ingeniería, Comercial, MBAn, Derecho, Medicina) en universidades de Chile y Latam que cursan entre 4 y 7 asignaturas por semestre con restricciones de horario (trabajo, traslados, deportes, ayudantías).
* **Frecuencia del Dolor**: 2 a 3 veces por año por estudiante (inicio del semestre regular + periodos de verano/invierno).

---

### 8.2 Matriz FODA (con Implicancias Estratégicas)

| | **Positivos** | **Negativos** |
| :--- | :--- | :--- |
| **Factores Internos** | **FORTALEZAS**: <br>• Motor determinista anti-alucinaciones que garantiza 0 choques. <br>• Interfaz web en tiempo real con exportación instantánea `.ics`. <br>• Integración nativa con Supabase Postgres y IA versionada. | **DEBILIDADES**: <br>• Dependencia de la carga de la oferta académica por universidad (requiere scraper o API). <br>• Sin marca consolidada en la fase inicial. |
| **Factores Externos** | **OPORTUNIDADES**: <br>• Alta insatisfacción con los portales universitarios institucionales (Banner, Canvas, U-Cursos). <br>• Escalabilidad a múltiples universidades de Chile y Latam. | **AMENAZAS**: <br>• Cambios intempestivos en las APIs de los sistemas universitarios. <br>• Aparición de herramientas desarrolladas internamente por centros de alumnos. |

#### Implicancias Estratégicas:
1. **Estrategia FO (Fortalezas + Oportunidades)**: Aprovechar la interfaz superior y la velocidad del motor anti-alucinaciones para posicionar OptiRamos como la herramienta no oficial estándar en federaciones y centros de alumnos UAI y otras universidades.
2. **Estrategia DO (Debilidades + Oportunidades)**: Desarrollar parsers automáticos de mallas y catálogos PDF/Excel para reducir la fricción de entrada en nuevas casas de estudio.

---

### 8.3 Las 5 Fuerzas de Porter (con Implicancias Estratégicas)

1. **Rivalidad entre Competidores Existentes (MODERADA - BAJA)**:
   * Los sistemas oficiales de las universidades (Banner, U-Cursos) son rígidos y no planifican horarios óptimos; solo registran inscripciones. Existen proyectos estudiantiles aislados (como BuscoRamos), pero carecen de IA, filtros de preferencias y exportación `.ics`.
2. **Amenaza de Nuevos Entrantes (MODERADA)**:
   * Las barreras técnicas de entrada son medianas. Sin embargo, la combinación de un guardrail anti-alucinaciones determinista y la experiencia de usuario (UX) constituye una ventaja competitiva defensible.
3. **Poder de Negociación de los Compradores / Usuarios (ALTO)**:
   * Los estudiantes son altamente sensibles al precio. Por ello, el modelo debe ser Freemium para el usuario final o B2B2C financiado por convenios institucionales / centros de alumnos.
4. **Poder de Negociación de los Proveedores (BAJO)**:
   * Alta disponibilidad de infraestructura cloud accesible (Vercel, Supabase, Google Gemini API) con costos marginales extremadamente bajos.
5. **Amenaza de Productos Sustitutos (ALTA - HOY)**:
   * Actualmente el principal sustituto es la planilla de cálculo manual (Excel/Google Sheets) y el papel. La propuesta de valor de OptiRamos destruye el sustituto al reducir el tiempo de 3.5 horas a 2 minutos.

---

### 8.4 Matriz Comparativa de Referentes del Mercado

| Característica / Solución | **OptiRamos (Nuestra Solución)** | **Excel / Papel Manual** | **Portal Oficial Universidad** | **BuscoRamos / Scripts Estudiantiles** |
| :--- | :---: | :---: | :---: | :---: |
| **Generación de Horarios con IA** | ✅ Sí (Gemini 1.5) | ❌ No | ❌ No | ❌ No |
| **Garantía 0% Traslapes** | ✅ Sí (Engine Determinista) | ❌ Sujeto a error humano | ❌ Valida solo al inscribir | ⚠️ Algoritmo básico |
| **Filtros Personalizados (Días libres, Profesores)** | ✅ Sí | ❌ Complejo | ❌ No | ❌ No |
| **Exportación a Google Calendar (`.ics`)** | ✅ Sí | ❌ Manual | ❌ No | ❌ No |
| **Tiempo Promedio de Resolución** | **< 120 segundos** | 3.5 horas | N/A | 30 minutos |

---

### 8.5 Evidencia de Demanda (Levantamiento de Campo)
Documentada en el repositorio en [`evidencia/respuestas_encuesta.md`](file:///c:/Users/Waro/Desktop/Proyecto%20automatizacion/evidencia/respuestas_encuesta.md).
* **Canal & Metodología**: Encuesta estructurada distribuida a través de **Google Forms** a la comunidad estudiantil.
* **Cuestionario Oficial (6 Preguntas)**:
  1. *¿Cuánto tiempo te toma armar tu horario cada semestre?*
  2. *¿Qué es lo más frustrante al armar tu horario? (Opción múltiple)*
  3. *De las anteriores, ¿cuál es la más frustrante?*
  4. *Si una web te armara 2 horarios ideales en 2 minutos según tus restricciones, ¿la usarías?*
  5. *¿Qué te haría no usarla o desconfiar de ella?*
  6. *¿Pagarías $1.990 CLP por semestre por una versión Pro que priorice profesores y exporte a tu Google Calendar?*
* **Estado**: Recolección de respuestas en curso. Los resultados tabulados y capturas de pantalla de Google Forms se consolidarán en el archivo de evidencia apenas finalice el levantamiento.

---

### 8.6 Modelo de Negocio, Pricing y Unit Economics

#### Modelo de Negocio
1. **B2C Freemium**:
   * **Plan Gratuito**: Generación de hasta 2 combinaciones de horario ideales con filtros básicos.
   * **Plan Pro ($1.990 CLP / semestre por alumno)**: Exportación directa a Google Calendar (`.ics`), priorización avanzada de profesores, minimización de huecos y sincronización con Supabase.
2. **B2B (Licencia Institucional)**:
   * Venta de la plataforma a Centros de Alumnos (CAA) o Direcciones de Docencia por una tarifa anual plana ($350.000 CLP/año) para ofrecer la herramienta branded a toda la generación.

#### Unit Economics por Usuario (Cálculo Auditable)
* **Costo Directo por Consulta (1 Optimización LLM + Supabase)**:
  * Gemini 1.5 Flash Tokens (Input + Output): ~$0.0012 USD (~$1.1 CLP)
  * Supabase DB Query + Log: ~$0.0003 USD (~$0.3 CLP)
  * **Costo Total por Usuario (3 consultas/semestre)**: ~$4.2 CLP (~$0.0045 USD)
* **Precio Cobrado (Plan Pro)**: $1.990 CLP / semestre
* **Margen Bruto**: **99.7%**

---

### 8.7 Métrica North-Star
* **Métrica Principal**: *Número de combinaciones de horario óptimas generadas y exportadas en menos de 120 segundos por usuarios activos al semestre*.
* **Meta v1.0**: Alcanzar 250 usuarios activos en el primer semestre de despliegue UAI con un Net Promoter Score (NPS) > 65.

---

### 8.8 Roadmap de Producto (Línea de Tiempo)

```
[ v1.0 MVP Actual ] ────────────────► [ v2.0 Próximo Semestre ] ────────────► [ v3.0 Escalamiento Latam ]
- UI React en Vercel                  - Scraper automático de mallas UAI       - Integración B2B con Canvas/Banner API
- Supabase Postgres + RLS             - Compartir combinación por WhatsApp     - Soporte para 5+ universidades de Chile
- LLM Gemini + Engine Anti-Choques     - Alertas de cupos en tiempo real        - Mobile App PWA con notificaciones Push
- Exportación a Google Calendar .ics
```

---

## 9. Costos de Operación Estimados

Para una base mensual de **500 estudiantes activos** realizando en promedio **3 optimizaciones** al semestre:

| Servicio | Detalle del Consumo | Costo Mensual Estimado (USD) | Costo Mensual Estimado (CLP) |
| :--- | :--- | :---: | :---: |
| **Vercel Frontend Hosting** | Hobby / Pro Tier (Static + Serverless) | $0.00 USD | $0 CLP |
| **Supabase Postgres Database** | Tier Free (500 MB DB + RLS) | $0.00 USD | $0 CLP |
| **Google Gemini API** | 1,500 ejecuciones (Gemini 1.5 Flash) | ~$1.80 USD | ~$1.700 CLP |
| **Dominio Personalizado** | DNS `.cl` (prorrateado mensual) | ~$1.00 USD | ~$950 CLP |
| **TOTAL OPERACIÓN MENSUAL** | **500 Usuarios Activos** | **~$2.80 USD** | **~$2.650 CLP** |

---

## 10. Limitaciones y Próximos Pasos

### Limitaciones Conocidas
1. **Carga de Oferta Académica**: En la v1.0, la oferta de asignaturas y secciones se gestiona directamente desde Supabase Postgres y el fallback local.
2. **Disponibilidad de Cupos en Tiempo Real**: La app planifica sobre la oferta académica publicada; no se conecta a la API en tiempo real del portal universitario para verificar cupos remanentes durante la toma de ramos.

### Próximos Pasos Técnicos
1. Integración de ingesta automática mediante scraper/parser de catálogos oficiales UAI.
2. Notificaciones de alerta cuando una sección preferida abra cupos.

---

## 11. Roles del Equipo

* **Martin Droppelmann**:
  * Diseño de Arquitectura Backend y Esquema Relacional en Supabase Postgres (`schema.sql`).
  * Ingeniería de Prompts (`optimizer_prompt.txt`) y prueba del script backend Python (`optimizer_demo.py`).
  * Estimación de costos de operación y análisis técnico de defensas.
* **Eduardo Behncke**:
  * Desarrollo de la UI Web en React + Vite + Tailwind CSS v4 (`src/App.tsx`).
  * Implementación del motor de validación determinista TypeScript (`optimizer.ts`) y componentes modal/exportación.
  * Estudio de Mercado para Track B (FODA, 5 Fuerzas de Porter, Matriz de Referentes, Unit Economics) y levantamiento de evidencia en `/evidencia`.

---

*OptiRamos · MBAn UAI 2026-B*
