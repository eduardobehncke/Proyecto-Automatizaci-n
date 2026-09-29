import React from 'react';
import { Clock, Zap, CheckCircle2, Calendar, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 to-slate-950">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        {/* VRR Filter Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Filtro VRR Validado: Valor • Repetitividad • Reglas Claras</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Planifica tu Semestre en{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Menos de 120 Segundos
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal">
          Selecciona tus ramos del MBAn UAI, ajusta tus preferencias de horario y deja que el motor de IA con validación determinista genere tus combinaciones perfectas sin choques.
        </p>

        {/* Value Prop Badges */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          
          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Ahorro de Tiempo</h4>
              <p className="text-xs text-slate-400 mt-0.5">De 3 a 5 horas de armado manual a 2 minutos automatizados.</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">0 Choques Horarios</h4>
              <p className="text-xs text-slate-400 mt-0.5">Filtro doble: Prompt IA + Validación determinista en código.</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Supabase Live BBDD</h4>
              <p className="text-xs text-slate-400 mt-0.5">Consulta directa de catálogo de cursos y secciones en tiempo real.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
