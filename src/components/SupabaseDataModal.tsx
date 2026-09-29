import React, { useState } from 'react';
import { X, Database, Code, CheckCircle, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupabaseDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
}

const SCHEMA_SQL = `-- OptiRamos · Supabase Postgres Schema (src/db/schema.sql)
CREATE TABLE IF NOT EXISTS cursos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    creditos INT DEFAULT 6,
    departamento VARCHAR(100),
    nivel VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS secciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    seccion INT NOT NULL,
    profesor VARCHAR(150) NOT NULL,
    cupos_disponibles INT DEFAULT 20
);

CREATE TABLE IF NOT EXISTS bloques_horario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seccion_id UUID REFERENCES secciones(id) ON DELETE CASCADE,
    dia VARCHAR(20) NOT NULL, -- 'Lunes', 'Martes', etc.
    inicio TIME NOT NULL,     -- '08:30:00'
    fin TIME NOT NULL,        -- '10:00:00'
    sala VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS optimizaciones_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario VARCHAR(150) NOT NULL,
    ramos_solicitados TEXT[] NOT NULL,
    opcion_elegida VARCHAR(50),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Security Policies
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de cursos" ON cursos FOR SELECT USING (true);
`;

export const SupabaseDataModal: React.FC<SupabaseDataModalProps> = ({
  isOpen,
  onClose,
  isConnected,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copySql = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 space-y-5 border border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Integración BBDD Supabase</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isConnected ? 'Postgres Conectado' : 'Modo Fallback / Demo'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Persistencia relacional de Ramos, Secciones, Bloques y Logs RLS</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Tablas Creadas</span>
            <span className="font-bold text-white">4 Tablas (Relaciones FX)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Seguridad RLS</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Activa
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ramos MBAn Mock</span>
            <span className="font-bold text-indigo-400">6 Cursos / 11 Secciones</span>
          </div>
        </div>

        {/* SQL Schema Code Viewer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-indigo-400" />
              Esquema DDL Postgres (`src/db/schema.sql`)
            </label>
            <button
              onClick={copySql}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copiado SQL' : 'Copiar DDL'}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-56 leading-relaxed">
            {SCHEMA_SQL}
          </pre>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-slate-800">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            Abrir Supabase Console <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
