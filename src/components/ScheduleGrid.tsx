import React from 'react';
import { OpcionHorario, DiaSemana } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, User, Award } from 'lucide-react';

interface ScheduleGridProps {
  opcion: OpcionHorario;
  opcionNumero: number;
}

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

// Grid time slots from 08:30 to 18:00
const TIME_SLOTS = [
  { label: '08:30 - 10:00', inicio: '08:30', fin: '10:00' },
  { label: '10:15 - 11:45', inicio: '10:15', fin: '11:45' },
  { label: '12:00 - 13:30', inicio: '12:00', fin: '13:30' },
  { label: '14:00 - 15:30', inicio: '14:00', fin: '15:30' },
  { label: '15:45 - 17:15', inicio: '15:45', fin: '17:15' },
];

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({ opcion, opcionNumero }) => {

  // Map courses to time slots
  const getBloqueEnSlot = (dia: DiaSemana, slotInicio: string) => {
    for (const ramo of opcion.ramos) {
      for (const b of ramo.bloques) {
        if (b.dia === dia && b.inicio === slotInicio) {
          return { ramo, bloque: b };
        }
      }
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Vista de Calendario — Opción #{opcionNumero}
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Score: {opcion.score}/100
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {opcion.ramos.length} ramos • {opcion.total_creditos} créditos • {opcion.huecos_horas} hrs baches semanales
            </p>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr>
              <th className="p-2 bg-slate-900/90 text-[11px] font-bold text-slate-400 border border-slate-800 rounded-tl-xl w-28 text-center">
                Horario
              </th>
              {DIAS.map((dia, idx) => (
                <th
                  key={dia}
                  className={`p-2 bg-slate-900/90 text-xs font-bold text-slate-200 border border-slate-800 text-center ${
                    idx === DIAS.length - 1 ? 'rounded-tr-xl' : ''
                  }`}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.label}>
                <td className="p-2 bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-400 text-center font-medium">
                  {slot.label}
                </td>
                {DIAS.map((dia) => {
                  const match = getBloqueEnSlot(dia, slot.inicio);

                  if (!match) {
                    return (
                      <td
                        key={dia}
                        className="p-2 border border-slate-800/40 bg-slate-950/30 text-center text-slate-700 text-[10px]"
                      >
                        <span className="opacity-20">—</span>
                      </td>
                    );
                  }

                  const { ramo, bloque } = match;

                  return (
                    <td
                      key={dia}
                      className="p-1 border border-slate-800 align-top"
                    >
                      <div
                        className={`h-full p-2.5 rounded-xl border ${ramo.color} border-slate-700/50 shadow-md transition-all hover:scale-[1.02] cursor-pointer`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white border border-slate-700/60">
                            {ramo.codigo}
                          </span>
                          <span className="text-[10px] font-medium text-slate-300">
                            Sec. {ramo.seccion}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                          {ramo.nombre}
                        </h4>

                        <div className="mt-2 space-y-0.5 text-[10px] text-slate-300/90">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="truncate">{ramo.profesor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0 text-indigo-400" />
                            <span>Sala: {bloque.sala || 'A-101'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
