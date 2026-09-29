import React from 'react';
import { RestriccionesEstudiante, DiaSemana } from '../types';
import { SlidersHorizontal, CalendarX, Sun, Moon, Sparkles, UserX, Check } from 'lucide-react';

interface RestrictionPanelProps {
  restricciones: RestriccionesEstudiante;
  onChange: (updated: RestriccionesEstudiante) => void;
  profesoresDisponibles: string[];
}

const DIAS_DISPONIBLES: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export const RestrictionPanel: React.FC<RestrictionPanelProps> = ({
  restricciones,
  onChange,
  profesoresDisponibles,
}) => {
  const toggleDiaProhibido = (dia: DiaSemana) => {
    const existe = restricciones.dias_prohibidos.includes(dia);
    const updatedDias = existe
      ? restricciones.dias_prohibidos.filter(d => d !== dia)
      : [...restricciones.dias_prohibidos, dia];

    onChange({ ...restricciones, dias_prohibidos: updatedDias });
  };

  const toggleProfesorExcluido = (prof: string) => {
    const existe = restricciones.profesores_excluidos.includes(prof);
    const updatedProfs = existe
      ? restricciones.profesores_excluidos.filter(p => p !== prof)
      : [...restricciones.profesores_excluidos, prof];

    onChange({ ...restricciones, profesores_excluidos: updatedProfs });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">2. Filtros & Restricciones Personales</h2>
          <p className="text-xs text-slate-400">Configura tus días libres y preferencias de horario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Días sin clases */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <CalendarX className="h-4 w-4 text-rose-400" />
            Días Libres Prohibidos (Sin Clases)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIAS_DISPONIBLES.map(dia => {
              const isForbidden = restricciones.dias_prohibidos.includes(dia);
              return (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDiaProhibido(dia)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isForbidden
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-sm shadow-rose-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {dia} {isForbidden && '🚫'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferencia de Horario */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-amber-400" />
            Preferencia Bloque del Día
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'mañanas', label: 'Mañanas', icon: Sun, color: 'text-amber-400' },
              { id: 'tardes', label: 'Tardes', icon: Moon, color: 'text-indigo-400' },
              { id: 'indiferente', label: 'Indiferente', icon: Sparkles, color: 'text-slate-400' },
            ].map(item => {
              const IconComponent = item.icon;
              const isSelected = restricciones.preferencia_horario === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange({ ...restricciones, preferencia_horario: item.id as any })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 mb-1 ${item.color}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Checkbox Minimizar Huecos & Profesores Excluidos */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Toggle Huecos */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-white block">Minimizar Baches/Huecos</span>
            <span className="text-[11px] text-slate-400">Priorizar bloques de clases continuas</span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...restricciones, minimizar_huecos: !restricciones.minimizar_huecos })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              restricciones.minimizar_huecos ? 'bg-indigo-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              restricciones.minimizar_huecos ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Excluir Profesores */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserX className="h-3.5 w-3.5 text-rose-400" />
            Excluir Profesores (Opcional)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {profesoresDisponibles.map(prof => {
              const isExcluded = restricciones.profesores_excluidos.includes(prof);
              return (
                <button
                  key={prof}
                  type="button"
                  onClick={() => toggleProfesorExcluido(prof)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                    isExcluded
                      ? 'bg-rose-950/60 border-rose-500/80 text-rose-300 line-through'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {prof}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
