import React from 'react';
import { OpcionHorario } from '../types';
import { Check, Download, ShieldCheck, Star, Sparkles, AlertCircle } from 'lucide-react';

interface OptionCardProps {
  opcion: OpcionHorario;
  numero: number;
  isSelected: boolean;
  onSelect: () => void;
  onExport: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  opcion,
  numero,
  isSelected,
  onSelect,
  onExport,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'glass-panel border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
          : 'glass-panel border-slate-800 bg-slate-900/40 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Opción #{numero}
            </span>
            {opcion.origen === 'llm' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-300" />
                Propuesta por Gemini
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
                Motor determinista
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
            {opcion.nombre || `Combinación ${numero}`}
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> 0 Choques
            </span>
          </h3>
        </div>

        {/* Score Badge */}
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{opcion.score}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Puntaje MVP</div>
        </div>
      </div>

      {/* Pros list */}
      <div className="mt-3 space-y-1">
        {opcion.resumen_pros.map((pro, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>{pro}</span>
          </div>
        ))}
      </div>

      {/* Ramos breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
        {opcion.ramos.map((r) => (
          <span
            key={r.codigo}
            className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
          >
            {r.codigo} (Sec. {r.seccion})
          </span>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isSelected
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {isSelected ? 'Seleccionado en Calendario' : 'Ver en Calendario'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition-all"
        >
          <Download className="h-3.5 w-3.5 text-indigo-400" />
          Exportar iCal
        </button>
      </div>
    </div>
  );
};
