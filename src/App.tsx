import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CourseSelector } from './components/CourseSelector';
import { RestrictionPanel } from './components/RestrictionPanel';
import { ScheduleGrid } from './components/ScheduleGrid';
import { OptionCard } from './components/OptionCard';
import { ExportModal } from './components/ExportModal';
import { SupabaseDataModal } from './components/SupabaseDataModal';
import { Curso, RestriccionesEstudiante, OpcionHorario } from './types';
import { MOCK_COURSES } from './data/mockCourses';
import { optimizarHorariosLocal, validarPropuestasLLM, combinarOpciones } from './lib/optimizer';
import { solicitarPropuestasLLM } from './lib/llm';
import { fetchCursosFromSupabase, guardarLogOptimizacion } from './lib/supabase';
import { Sparkles, Zap, RefreshCw, AlertTriangle, Layers, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>(MOCK_COURSES);
  const [selectedCodigos, setSelectedCodigos] = useState<string[]>([
    'IND-501', 'FIN-602', 'MKT-503', 'OPE-504'
  ]);
  const [restricciones, setRestricciones] = useState<RestriccionesEstudiante>({
    usuario: 'estudiante@uai.cl',
    dias_prohibidos: ['Viernes'],
    preferencia_horario: 'mañanas',
    minimizar_huecos: true,
    ramos_requeridos: ['IND-501', 'FIN-602', 'MKT-503', 'OPE-504'],
    profesores_excluidos: []
  });

  const [opciones, setOpciones] = useState<OpcionHorario[]>([]);
  const [selectedOpcionId, setSelectedOpcionId] = useState<string | null>(null);
  const [exportOpcion, setExportOpcion] = useState<OpcionHorario | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isConnectedSupabase, setIsConnectedSupabase] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fuenteMsg, setFuenteMsg] = useState<string | null>(null);

  // Load courses from Supabase on mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchCursosFromSupabase();
      if (data && data.length > 0) {
        setCursos(data);
        setIsConnectedSupabase(true);
      }
    }
    loadData();
  }, []);

  // Update ramos_requeridos when selectedCodigos changes
  useEffect(() => {
    setRestricciones(prev => ({
      ...prev,
      ramos_requeridos: selectedCodigos
    }));
  }, [selectedCodigos]);

  // Extract unique professors for filter
  const profesoresDisponibles = Array.from(
    new Set(cursos.flatMap(c => c.secciones.map(s => s.profesor)))
  );

  const handleToggleCurso = (codigo: string) => {
    setSelectedCodigos(prev =>
      prev.includes(codigo) ? prev.filter(c => c !== codigo) : [...prev, codigo]
    );
  };

  const handleSelectAll = () => {
    setSelectedCodigos(cursos.map(c => c.codigo));
  };

  const handleClearAll = () => {
    setSelectedCodigos([]);
  };

  const handleGenerarHorarios = async () => {
    if (selectedCodigos.length === 0) {
      setErrorMsg('Debes seleccionar al menos 1 ramo para optimizar el horario.');
      return;
    }

    setErrorMsg(null);
    setFuenteMsg(null);
    setIsGenerating(true);
    const inicio = performance.now();

    // 1. Motor determinista: siempre disponible (fallback y relleno de opciones)
    const opcionesMotor = optimizarHorariosLocal(cursos, restricciones);

    // 2. Gemini vía /api/optimize + guardrail anti-alucinaciones
    let opcionesLLM: OpcionHorario[] = [];
    let fuente: string;
    try {
      const llm = await solicitarPropuestasLLM(cursos, restricciones);
      const { validas, rechazadas } = validarPropuestasLLM(cursos, restricciones, llm.opciones);
      opcionesLLM = validas;
      fuente = `${llm.modelo}: ${validas.length} propuesta(s) validada(s)` +
        (rechazadas > 0 ? `, ${rechazadas} rechazada(s) por el guardrail` : '') +
        ` · ${llm.latencia_ms} ms`;
    } catch (err) {
      console.warn('LLM no disponible, usando motor determinista', err);
      fuente = 'Gemini no disponible: resultados del motor determinista';
    }

    const resultados = combinarOpciones(opcionesLLM, opcionesMotor);
    const tiempoMs = Math.round(performance.now() - inicio);
    setIsGenerating(false);

    if (resultados.length === 0) {
      setErrorMsg('No se encontraron combinaciones sin choques para los ramos y restricciones seleccionados. Intenta liberar días prohibidos o quitar algún ramo conflictivo.');
      setOpciones([]);
      setSelectedOpcionId(null);
      return;
    }

    setFuenteMsg(fuente);
    setOpciones(resultados);
    setSelectedOpcionId(resultados[0].id);

    // Confetti celebration for successful generation!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Log optimization asynchronously
    guardarLogOptimizacion(restricciones, resultados, tiempoMs);
  };

  const opcionSeleccionada = opciones.find(o => o.id === selectedOpcionId) || opciones[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <Header
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        isConnectedSupabase={isConnectedSupabase}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 1 & 2: Course Selector & Restriction Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CourseSelector
            cursos={cursos}
            selectedCodigos={selectedCodigos}
            onToggleCurso={handleToggleCurso}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          <div className="space-y-6">
            <RestrictionPanel
              restricciones={restricciones}
              onChange={setRestricciones}
              profesoresDisponibles={profesoresDisponibles}
            />

            {/* Optimize Trigger Button Card */}
            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/20 text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Motor Optimización Determinista + LLM Gemini</span>
              </div>

              <button
                type="button"
                onClick={handleGenerarHorarios}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-xl font-extrabold text-white text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Optimizando Horarios Sin Choques...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 fill-current" />
                    <span>⚡ Generar Combinaciones Óptimas</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400">
                Calcula todas las permutaciones posibles de secciones y descarta cualquier choque de horario instantáneamente.
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm flex items-start space-x-3 animate-in fade-in">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-100">Atención</h4>
              <p className="text-xs text-rose-300 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {opciones.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  Resultados Generados ({opciones.length} Combinaciones Validadas)
                </h2>
                <p className="text-xs text-slate-400">
                  Selecciona una opción para visualizar su grilla semanal detallada en el calendario
                </p>
                {fuenteMsg && (
                  <p className="text-[11px] text-purple-300 mt-1">{fuenteMsg}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                <span>0 Choques de Horario Garantizados</span>
              </div>
            </div>

            {/* Cards for Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {opciones.map((opcion, idx) => (
                <OptionCard
                  key={opcion.id}
                  opcion={opcion}
                  numero={idx + 1}
                  isSelected={opcion.id === selectedOpcionId}
                  onSelect={() => setSelectedOpcionId(opcion.id)}
                  onExport={() => setExportOpcion(opcion)}
                />
              ))}
            </div>

            {/* Interactive Timetable Grid */}
            {opcionSeleccionada && (
              <ScheduleGrid
                opcion={opcionSeleccionada}
                opcionNumero={opciones.findIndex(o => o.id === opcionSeleccionada.id) + 1}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 OptiRamos · Proyecto MVP Automatización e IA para MVPs · MBAn UAI</p>
          <div className="flex items-center space-x-4">
            <span>Martin Droppelmann</span>
            <span>•</span>
            <span>Eduardo Behncke</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        opcion={exportOpcion}
        onClose={() => setExportOpcion(null)}
      />

      <SupabaseDataModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        isConnected={isConnectedSupabase}
      />

    </div>
  );
};
