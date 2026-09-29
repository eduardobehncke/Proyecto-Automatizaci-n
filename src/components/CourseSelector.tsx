import React, { useState } from 'react';
import { Curso } from '../types';
import { BookOpen, Check, Search, Filter, Info, Users, Clock } from 'lucide-react';

interface CourseSelectorProps {
  cursos: Curso[];
  selectedCodigos: string[];
  onToggleCurso: (codigo: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  cursos,
  selectedCodigos,
  onToggleCurso,
  onSelectAll,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCurso, setExpandedCurso] = useState<string | null>(null);

  const filteredCursos = cursos.filter(c =>
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              1. Selección de Ramos
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                {selectedCodigos.length} seleccionados
              </span>
            </h2>
            <p className="text-xs text-slate-400">Elige los asignaturas que deseas inscribir este semestre</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSelectAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Seleccionar Todos
          </button>
          <button
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 transition-colors"
          >
            Desmarcar
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por código (IND-501), nombre o departamento..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredCursos.map((curso) => {
          const isSelected = selectedCodigos.includes(curso.codigo);
          const isExpanded = expandedCurso === curso.codigo;

          return (
            <div
              key={curso.codigo}
              className={`rounded-xl border p-3.5 transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onToggleCurso(curso.codigo)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {curso.codigo}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {curso.creditos} Créditos
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                    {curso.nombre}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {curso.departamento} • {curso.secciones.length} Secciones dispo.
                  </p>
                </div>

                {/* Checkbox button */}
                <button
                  onClick={() => onToggleCurso(curso.codigo)}
                  className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'border border-slate-700 bg-slate-800 text-transparent hover:border-slate-500'
                  }`}
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </button>
              </div>

              {/* Toggle sections info expand */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => setExpandedCurso(isExpanded ? null : curso.codigo)}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  {isExpanded ? 'Ocultar secciones' : 'Ver secciones y profesores'}
                </button>
              </div>

              {/* Expanded Sections Detail */}
              {isExpanded && (
                <div className="mt-2.5 space-y-2 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 text-xs">
                  {curso.secciones.map((sec) => (
                    <div key={sec.seccion} className="flex flex-col space-y-1 pb-1.5 border-b border-slate-800 last:border-none last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">
                          Sección {sec.seccion} — {sec.profesor}
                        </span>
                        {sec.cupos_disponibles !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                            {sec.cupos_disponibles} cupos
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
                        {sec.bloques.map((b, i) => (
                          <span key={i} className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            <Clock className="h-2.5 w-2.5 text-indigo-400" />
                            {b.dia} {b.inicio}-{b.fin} ({b.sala || 'A-101'})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
