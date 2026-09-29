import React, { useState } from 'react';
import { OpcionHorario } from '../types';
import { X, Calendar, FileSpreadsheet, Copy, Check, Download } from 'lucide-react';

interface ExportModalProps {
  opcion: OpcionHorario | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ opcion, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!opcion) return null;

  const handleDownloadICal = () => {
    // Generate simple .ics calendar string
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//OptiRamos UAI//Planificador Horarios//ES\n";

    opcion.ramos.forEach(ramo => {
      ramo.bloques.forEach(bloque => {
        icsContent += `BEGIN:VEVENT\nSUMMARY:[${ramo.codigo}] ${ramo.nombre} (Sec. ${ramo.seccion})\nDESCRIPTION:Profesor: ${ramo.profesor} | MBAn UAI\nLOCATION:${bloque.sala || 'Campus UAI'}\nEND:VEVENT\n`;
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OptiRamos_Horario_Opcion_${opcion.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    let csv = "Codigo,Nombre,Seccion,Profesor,Dia,Inicio,Fin,Sala\n";
    opcion.ramos.forEach(r => {
      r.bloques.forEach(b => {
        csv += `"${r.codigo}","${r.nombre}",${r.seccion},"${r.profesor}","${b.dia}","${b.inicio}","${b.fin}","${b.sala || 'A-101'}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OptiRamos_Resumen_Horario.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyResumen = () => {
    let texto = `OptiRamos · Horario Selección MBAn UAI (Score: ${opcion.score}/100)\n\n`;
    opcion.ramos.forEach(r => {
      const bloquesStr = r.bloques.map(b => `${b.dia} ${b.inicio}-${b.fin}`).join(', ');
      texto += `• [${r.codigo}] ${r.nombre} (Sec. ${r.seccion} - Prof. ${r.profesor}) -> ${bloquesStr}\n`;
    });

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 border border-slate-700/80 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Exportar Combinación Horario</h3>
            <p className="text-xs text-slate-400">Guarda en tu calendario personal o exporta en resumen</p>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3 pt-2">
          
          <button
            onClick={handleDownloadICal}
            className="w-full p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Google Calendar / Apple iCal (.ics)</h4>
                <p className="text-xs text-slate-400">Importa los eventos directamente a tu aplicación de calendario</p>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
          </button>

          <button
            onClick={handleDownloadCSV}
            className="w-full p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Archivo Excel / CSV</h4>
                <p className="text-xs text-slate-400">Tabla con ramos, profesores, salas y horarios</p>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-400 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={copyResumen}
            className="w-full p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {copied ? '¡Copiado al Portapapeles!' : 'Copiar Resumen en Texto'}
                </h4>
                <p className="text-xs text-slate-400">Ideal para compartir por WhatsApp o correo</p>
              </div>
            </div>
          </button>

        </div>

        <div className="pt-2 text-right">
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
