# Registros de Evidencia de Construcción (Las 4 Verticales)

Este documento centraliza la evidencia de funcionamiento y artefactos construidos para las 4 verticales evaluadas en el Proyecto Final (Track B).

---

## 1. Vertical BACKEND · Automatización
* **Capa 1 (Obligatoria)**: Motor de optimización end-to-end (`src/lib/optimizer.ts` en TypeScript y `src/backend/optimizer_demo.py` en Python) con gatillo desde interfaz web, validación de reglas de negocio, manejo de excepciones y reintentos.
* **Capa 2 (Bonus - Código Propio)**: Algoritmo determinista anti-traslapes e integración con Supabase + Gemini LLM guiado mediante especificaciones detalladas con el copiloto AI (Antigravity).

---

## 2. Vertical BACKEND · IA
* **Capa 1 (Obligatoria)**: Llamada estructurada a Gemini 1.5/Flash mediante prompt versionado en `src/prompts/optimizer_prompt.txt`.
* **Capa 2 (Bonus - Guardrails & Agente)**: Capa de guardrails deterministas en TypeScript que valida que la salida del LLM cumpla con 0 traslapes de horario y formato JSON de 3 alternativas evaluadas.

---

## 3. Vertical BACKEND · Base de Datos
* **Capa 1 (Obligatoria)**: Persistencia de logs de optimización y registros de consultas en Supabase Postgres (`optimizaciones_log`).
* **Capa 2 (Bonus - Supabase + RLS)**: Esquema DDL relacional completo (`src/db/schema.sql`) para tablas `cursos`, `secciones`, `bloques_horario`, `optimizaciones_log` con políticas de Row Level Security (RLS) habilitadas y cliente en `src/lib/supabase.ts`.

---

## 4. Vertical FRONTEND · Touchpoint / Interfaz
* **Capa 1 (Obligatoria)**: Touchpoint claro documentado en el README (§6) indicando gatillo, canal (SaaS Web Vercel) y entrega (calendario semanal interactivo + exportación).
* **Capa 2 (Bonus - UI Web Publicada en Vercel)**: Aplicación web React 18 + Vite + Tailwind CSS v4 con selector interactivo de cursos del MBAn UAI, panel de filtros y restricciones, grilla de horarios semanales, exportación a Google Calendar / iCal (`.ics`), modal de inspección SQL y diseño responsivo premium (`src/App.tsx`, `src/components/`).
