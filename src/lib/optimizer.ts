import { Curso, RestriccionesEstudiante, OpcionHorario, RamoCombinacion, BloqueHorario } from '../types';
import { COLOR_PALETTE } from '../data/mockCourses';

function convertirMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function hayChoqueBloques(b1: BloqueHorario, b2: BloqueHorario): boolean {
  if (b1.dia !== b2.dia) return false;
  const inicio1 = convertirMinutos(b1.inicio);
  const fin1 = convertirMinutos(b1.fin);
  const inicio2 = convertirMinutos(b2.inicio);
  const fin2 = convertirMinutos(b2.fin);

  return !(fin1 <= inicio2 || inicio1 >= fin2);
}

export function evaluarCombinacionValida(combo: RamoCombinacion[]): boolean {
  const todosBloques: BloqueHorario[] = [];
  for (const ramo of combo) {
    for (const b of ramo.bloques) {
      for (const bExistente of todosBloques) {
        if (hayChoqueBloques(b, bExistente)) {
          return false; // Choque detectado
        }
      }
      todosBloques.push(b);
    }
  }
  return true;
}

export function calcularHuecosYScore(combo: RamoCombinacion[], restricciones: RestriccionesEstudiante) {
  let totalHuecosHoras = 0;
  const pros: string[] = ["0 choques de horario verificados"];

  // Agrupar bloques por día
  const porDia: Record<string, BloqueHorario[]> = {};
  for (const ramo of combo) {
    for (const b of ramo.bloques) {
      if (!porDia[b.dia]) porDia[b.dia] = [];
      porDia[b.dia].push(b);
    }
  }

  // Verificar días prohibidos
  for (const dia of restricciones.dias_prohibidos) {
    if (porDia[dia] && porDia[dia].length > 0) {
      return { score: -1, huecos: 99, pros: [] }; // Invalida por día prohibido
    }
  }

  if (restricciones.dias_prohibidos.length > 0) {
    pros.push(`Respeta restricción de días libres (${restricciones.dias_prohibidos.join(', ')})`);
  }

  // Calcular huecos entre clases por día
  let clasesEnManana = 0;
  let clasesEnTarde = 0;

  for (const dia in porDia) {
    const bloques = porDia[dia].sort((a, b) => convertirMinutos(a.inicio) - convertirMinutos(b.inicio));
    for (let i = 0; i < bloques.length - 1; i++) {
      const finActual = convertirMinutos(bloques[i].fin);
      const inicioSiguiente = convertirMinutos(bloques[i + 1].inicio);
      if (inicioSiguiente > finActual) {
        const gapMinutos = inicioSiguiente - finActual;
        totalHuecosHoras += gapMinutos / 60;
      }
    }

    for (const b of bloques) {
      if (convertirMinutos(b.inicio) < 12 * 60) clasesEnManana++;
      else clasesEnTarde++;
    }
  }

  let scoreBase = 100;
  scoreBase -= totalHuecosHoras * 8; // Penalizar huecos

  if (restricciones.preferencia_horario === 'mañanas' && clasesEnManana >= clasesEnTarde) {
    scoreBase += 15;
    pros.push("Concentración óptima de clases por la mañana");
  } else if (restricciones.preferencia_horario === 'tardes' && clasesEnTarde > clasesEnManana) {
    scoreBase += 15;
    pros.push("Horario vespertino según preferencia");
  }

  if (totalHuecosHoras === 0) {
    pros.push("Horario continuado sin baches libres");
  } else if (totalHuecosHoras <= 2) {
    pros.push(`Baches mínimos (${totalHuecosHoras.toFixed(1)} hrs semanales)`);
  }

  // Profesores excluidos
  for (const ramo of combo) {
    if (restricciones.profesores_excluidos.includes(ramo.profesor)) {
      return { score: -1, huecos: 99, pros: [] };
    }
  }

  return {
    score: Math.max(60, Math.min(100, Math.round(scoreBase))),
    huecos: totalHuecosHoras,
    pros
  };
}

export function optimizarHorariosLocal(
  cursosBase: Curso[],
  restricciones: RestriccionesEstudiante
): OpcionHorario[] {
  const ramosRequeridos = restricciones.ramos_requeridos;
  const cursosSeleccionados = cursosBase.filter(c => ramosRequeridos.includes(c.codigo));

  if (cursosSeleccionados.length === 0) return [];

  // Mapear cada curso con sus opciones de secciones
  const opcionesSeccionesPorCurso: RamoCombinacion[][] = cursosSeleccionados.map((curso, index) => {
    const colorScheme = COLOR_PALETTE[index % COLOR_PALETTE.length];
    return curso.secciones.map(sec => ({
      codigo: curso.codigo,
      nombre: curso.nombre,
      seccion: sec.seccion,
      profesor: sec.profesor,
      creditos: curso.creditos,
      bloques: sec.bloques,
      color: colorScheme.bg
    }));
  });

  // Generar producto cartesiano
  function cartesian(arr: RamoCombinacion[][]): RamoCombinacion[][] {
    return arr.reduce<RamoCombinacion[][]>(
      (a, b) => a.flatMap(d => b.map(e => [...d, e])),
      [[]]
    );
  }

  const todasLasCombinaciones = cartesian(opcionesSeccionesPorCurso);
  const resultadosValidos: OpcionHorario[] = [];

  todasLasCombinaciones.forEach((combo, idx) => {
    if (evaluarCombinacionValida(combo)) {
      const evalRes = calcularHuecosYScore(combo, restricciones);
      if (evalRes.score > 0) {
        const totalCreditos = combo.reduce((acc, curr) => acc + curr.creditos, 0);
        resultadosValidos.push({
          id: `opcion-${idx + 1}`,
          score: evalRes.score,
          resumen_pros: evalRes.pros,
          total_creditos: totalCreditos,
          huecos_horas: evalRes.huecos,
          ramos: combo
        });
      }
    }
  });

  // Ordenar por mayor score y limitar a las mejores 3 opciones
  resultadosValidos.sort((a, b) => b.score - a.score);
  return resultadosValidos.slice(0, 3);
}
