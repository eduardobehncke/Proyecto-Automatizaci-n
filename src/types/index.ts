export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface BloqueHorario {
  dia: DiaSemana;
  inicio: string; // e.g. "08:30"
  fin: string;    // e.g. "10:00"
  sala?: string;
}

export interface Seccion {
  id?: string;
  seccion: number;
  profesor: string;
  cupos_disponibles?: number;
  bloques: BloqueHorario[];
}

export interface Curso {
  id?: string;
  codigo: string;
  nombre: string;
  creditos: number;
  departamento: string;
  nivel: string;
  secciones: Seccion[];
}

export interface RestriccionesEstudiante {
  usuario: string;
  dias_prohibidos: DiaSemana[];
  preferencia_horario: 'mañanas' | 'tardes' | 'indiferente';
  minimizar_huecos: boolean;
  ramos_requeridos: string[]; // codigos de ramos
  profesores_excluidos: string[];
}

export interface RamoCombinacion {
  codigo: string;
  nombre: string;
  seccion: number;
  profesor: string;
  creditos: number;
  bloques: BloqueHorario[];
  color: string;
}

export interface OpcionHorario {
  id: string;
  score: number;
  resumen_pros: string[];
  total_creditos: number;
  huecos_horas: number;
  ramos: RamoCombinacion[];
}

export interface OptimizationResponse {
  exito: boolean;
  mensaje: string;
  opciones: OpcionHorario[];
  total_evaluadas: number;
  tiempo_ejecucion_ms: number;
  usos_llm: boolean;
}
