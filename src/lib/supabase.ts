import { createClient } from '@supabase/supabase-js';
import { Curso } from '../types';
import { MOCK_COURSES } from '../data/mockCourses';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://demo-optiramos.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchCursosFromSupabase(): Promise<Curso[]> {
  try {
    const { data: cursosData, error: cursosErr } = await supabase
      .from('cursos')
      .select(`
        id,
        codigo,
        nombre,
        creditos,
        departamento,
        nivel,
        secciones (
          id,
          seccion,
          profesor,
          cupos_disponibles,
          bloques_horario (
            dia,
            inicio,
            fin,
            sala
          )
        )
      `);

    if (cursosErr || !cursosData || cursosData.length === 0) {
      console.info('Supabase: Usando dataset local (no configurado o tabla vacía)');
      return MOCK_COURSES;
    }

    // Formatear desde Supabase al tipo Curso
    return cursosData.map((c: any) => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre,
      creditos: c.creditos || 6,
      departamento: c.departamento || 'General',
      nivel: c.nivel || 'MBAn',
      secciones: c.secciones.map((s: any) => ({
        id: s.id,
        seccion: s.seccion,
        profesor: s.profesor,
        cupos_disponibles: s.cupos_disponibles,
        bloques: s.bloques_horario.map((b: any) => ({
          dia: b.dia,
          inicio: b.inicio,
          fin: b.fin,
          sala: b.sala
        }))
      }))
    }));
  } catch (e) {
    console.warn('Error conectando a Supabase, usando MOCK_COURSES', e);
    return MOCK_COURSES;
  }
}

export async function guardarLogOptimizacion(usuario: string, ramos: string[], opcionElegida: string) {
  try {
    await supabase.from('optimizaciones_log').insert([
      {
        usuario,
        ramos_solicitados: ramos,
        opcion_elegida: opcionElegida,
        fecha: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.log('Log guardado localmente:', { usuario, ramos, opcionElegida });
  }
}
