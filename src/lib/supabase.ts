import { createClient } from '@supabase/supabase-js';
import { Curso, OpcionHorario, RestriccionesEstudiante } from '../types';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://demo-optiramos.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const hhmm = (t: string) => (t || '').slice(0, 5); // TIME de Postgres '08:30:00' -> '08:30'

export async function fetchCursosFromSupabase(): Promise<Curso[]> {
  try {
    // Alias PostgREST (alias:columna) para mapear el esquema de schema.sql al tipo Curso
    const { data: cursosData, error: cursosErr } = await supabase
      .from('cursos')
      .select(`
        id,
        codigo,
        nombre,
        creditos,
        carrera,
        secciones (
          id,
          seccion:numero_seccion,
          profesor,
          cupos_disponibles,
          bloques_horario (
            dia,
            inicio:hora_inicio,
            fin:hora_fin,
            sala
          )
        )
      `);

    if (cursosErr || !cursosData || cursosData.length === 0) {
      console.info('Supabase: Usando dataset local (no configurado o tabla vacía)', cursosErr?.message ?? '');
      return [];
    }

    return cursosData.map((c: any) => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre,
      creditos: c.creditos || 6,
      departamento: 'General',
      nivel: c.carrera || 'MBAn UAI',
      secciones: (c.secciones ?? [])
        .map((s: any) => ({
          id: s.id,
          seccion: s.seccion,
          profesor: s.profesor,
          cupos_disponibles: s.cupos_disponibles,
          bloques: (s.bloques_horario ?? []).map((b: any) => ({
            dia: b.dia,
            inicio: hhmm(b.inicio),
            fin: hhmm(b.fin),
            sala: b.sala
          }))
        }))
        .sort((a: any, b: any) => a.seccion - b.seccion)
    }));
  } catch (e) {
    console.warn('Error conectando a Supabase, usando MOCK_COURSES', e);
    return [];
  }
}

export async function guardarLogOptimizacion(
  restricciones: RestriccionesEstudiante,
  opciones: OpcionHorario[],
  tiempoMs: number
) {
  const horarios = opciones.map(o => ({
    id: o.id,
    origen: o.origen,
    score: o.score,
    secciones: o.ramos.map(r => ({ codigo: r.codigo, seccion: r.seccion }))
  }));
  const { error } = await supabase.from('optimizaciones_log').insert([
    {
      usuario_email: restricciones.usuario,
      ramos_solicitados: restricciones.ramos_requeridos,
      restricciones,
      horarios_generados: horarios,
      tiempo_ejecucion_ms: tiempoMs
    }
  ]);
  if (error) {
    console.info('Log no persistido en Supabase:', error.message);
  }
}
