import { Curso } from '../types';

export const MOCK_COURSES: Curso[] = [
  {
    codigo: "IND-501",
    nombre: "Automatización e IA para MVPs",
    creditos: 6,
    departamento: "Ingeniería Industrial & Data",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Benjamín Happey",
        cupos_disponibles: 12,
        bloques: [
          { dia: "Martes", inicio: "08:30", fin: "10:00", sala: "A-201" },
          { dia: "Jueves", inicio: "08:30", fin: "10:00", sala: "A-201" }
        ]
      },
      {
        seccion: 2,
        profesor: "Benjamín Happey",
        cupos_disponibles: 5,
        bloques: [
          { dia: "Martes", inicio: "10:15", fin: "11:45", sala: "A-202" },
          { dia: "Jueves", inicio: "10:15", fin: "11:45", sala: "A-202" }
        ]
      }
    ]
  },
  {
    codigo: "FIN-602",
    nombre: "Finanzas Corporativas Avanzadas",
    creditos: 6,
    departamento: "Finanzas & Economía",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Carlos Mendoza",
        cupos_disponibles: 8,
        bloques: [
          { dia: "Martes", inicio: "10:15", fin: "11:45", sala: "B-104" },
          { dia: "Jueves", inicio: "10:15", fin: "11:45", sala: "B-104" }
        ]
      },
      {
        seccion: 2,
        profesor: "Laura Prieto",
        cupos_disponibles: 15,
        bloques: [
          { dia: "Lunes", inicio: "08:30", fin: "10:00", sala: "B-105" },
          { dia: "Miércoles", inicio: "08:30", fin: "10:00", sala: "B-105" }
        ]
      }
    ]
  },
  {
    codigo: "MKT-503",
    nombre: "Marketing Estratégico & Analytics",
    creditos: 5,
    departamento: "Marketing",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Andrea Silva",
        cupos_disponibles: 20,
        bloques: [
          { dia: "Lunes", inicio: "10:15", fin: "11:45", sala: "C-301" },
          { dia: "Miércoles", inicio: "10:15", fin: "11:45", sala: "C-301" }
        ]
      },
      {
        seccion: 2,
        profesor: "Felipe Morales",
        cupos_disponibles: 14,
        bloques: [
          { dia: "Martes", inicio: "14:00", fin: "15:30", sala: "C-302" },
          { dia: "Jueves", inicio: "14:00", fin: "15:30", sala: "C-302" }
        ]
      }
    ]
  },
  {
    codigo: "OPE-504",
    nombre: "Gestión de Operaciones & Supply Chain",
    creditos: 6,
    departamento: "Operaciones",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Roberto Gómez",
        cupos_disponibles: 9,
        bloques: [
          { dia: "Martes", inicio: "12:00", fin: "13:30", sala: "A-108" },
          { dia: "Jueves", inicio: "12:00", fin: "13:30", sala: "A-108" }
        ]
      },
      {
        seccion: 2,
        profesor: "Patricia Torres",
        cupos_disponibles: 18,
        bloques: [
          { dia: "Lunes", inicio: "14:00", fin: "15:30", sala: "A-109" },
          { dia: "Miércoles", inicio: "14:00", fin: "15:30", sala: "A-109" }
        ]
      }
    ]
  },
  {
    codigo: "EST-505",
    nombre: "Estadística Aplicada & Machine Learning",
    creditos: 6,
    departamento: "Data Science",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Gonzalo Valdés",
        cupos_disponibles: 10,
        bloques: [
          { dia: "Lunes", inicio: "12:00", fin: "13:30", sala: "Lab-4" },
          { dia: "Miércoles", inicio: "12:00", fin: "13:30", sala: "Lab-4" }
        ]
      }
    ]
  },
  {
    codigo: "ECO-506",
    nombre: "Economía de Empresas & Mercados",
    creditos: 5,
    departamento: "Economía",
    nivel: "MBAn Trimestre 2",
    secciones: [
      {
        seccion: 1,
        profesor: "Matías Zúñiga",
        cupos_disponibles: 16,
        bloques: [
          { dia: "Viernes", inicio: "08:30", fin: "11:45", sala: "B-201" }
        ]
      }
    ]
  }
];

export const COLOR_PALETTE = [
  { bg: 'bg-indigo-950/80', border: 'border-indigo-500/50', text: 'text-indigo-200', pill: 'bg-indigo-500/20 text-indigo-300' },
  { bg: 'bg-emerald-950/80', border: 'border-emerald-500/50', text: 'text-emerald-200', pill: 'bg-emerald-500/20 text-emerald-300' },
  { bg: 'bg-amber-950/80', border: 'border-amber-500/50', text: 'text-amber-200', pill: 'bg-amber-500/20 text-amber-300' },
  { bg: 'bg-cyan-950/80', border: 'border-cyan-500/50', text: 'text-cyan-200', pill: 'bg-cyan-500/20 text-cyan-300' },
  { bg: 'bg-fuchsia-950/80', border: 'border-fuchsia-500/50', text: 'text-fuchsia-200', pill: 'bg-fuchsia-500/20 text-fuchsia-300' },
  { bg: 'bg-rose-950/80', border: 'border-rose-500/50', text: 'text-rose-200', pill: 'bg-rose-500/20 text-rose-300' },
];
