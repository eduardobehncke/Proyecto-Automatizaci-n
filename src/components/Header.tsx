import React from 'react';
import { Sparkles, Database, ShieldCheck, Cpu, Code2, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenSqlModal: () => void;
  isConnectedSupabase: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSqlModal, isConnectedSupabase }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                OptiRamos
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                v2.0 MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Planificador Inteligente de Horarios · MBAn UAI
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSqlModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all"
            title="Ver esquema SQL e integración Supabase"
          >
            <Database className={`h-3.5 w-3.5 ${isConnectedSupabase ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Supabase Postgres</span>
            <span className={`h-2 w-2 rounded-full ${isConnectedSupabase ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          </button>

          {/* IA Status Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-950/40 text-purple-300 border border-purple-800/40">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>LLM Gemini</span>
          </div>

          {/* Validation Shield */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Anti-Choques</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Team Info */}
          <div className="hidden lg:flex flex-col text-right text-[11px] text-slate-400">
            <span className="font-medium text-slate-200">M. Droppelmann & E. Behncke</span>
            <span className="text-slate-400">MBAn UAI 2026-B</span>
          </div>

        </div>

      </div>
    </header>
  );
};
