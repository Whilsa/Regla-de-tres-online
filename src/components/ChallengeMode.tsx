import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Bomb, 
  Timer, 
  Trophy, 
  Skull, 
  History, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Grid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Problem {
  id: number;
  text: string;
  solution: number;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

interface Stats {
  totalGames: number;
  gamesWon: number;
  bestTime: number | null; // in seconds
  lastPlayedDate: string | null; // YYYY-MM-DD
  streak: number;
}

interface ChallengeModeProps {
  onBack: () => void;
  isKids: boolean;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onBack, isKids }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'WON' | 'EXPLODED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentInputs, setCurrentInputs] = useState<string[]>(['', '', '']);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    gamesWon: 0,
    bestTime: null,
    lastPlayedDate: null,
    streak: 0
  });

  // Manual navigation for carousel
  const nextSlide = () => setActiveStatIndex(prev => (prev + 1) % 5);
  const prevSlide = () => setActiveStatIndex(prev => (prev - 1 + 5) % 5);

  // Daily seed for problems
  const today = new Date().toISOString().split('T')[0];

  const problems = useMemo(() => {
    // Simple seeded random to generate 3 problems daily
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const generateProblem = (diff: number, index: number): Problem => {
      const r1 = seededRandom(seed + index * 10);
      const r2 = seededRandom(seed + index * 20);
      
      let text = "";
      let solution = 0;
      let difficulty: 'Fácil' | 'Medio' | 'Difícil' = 'Fácil';

      if (diff === 0) {
        // Regla de Tres Directa: Manzanas y Precio
        // 2kg -> 4€, 3kg -> ? (6€)
        const baseKg = 2;
        const basePrice = 4;
        const targetKg = 3;
        solution = (targetKg * basePrice) / baseKg;
        text = `Si 2 kg de manzanas cuestan 4€, ¿cuánto costarán ${targetKg} kg?`;
        difficulty = 'Fácil';
      } else if (diff === 1) {
        // Regla de Tres Inversa: Obreros y Días
        // 2 obreros -> 6 días, 4 obreros -> ? (3 días)
        const initialWorkers = 2;
        const initialDays = 6;
        const targetWorkers = 4;
        solution = (initialWorkers * initialDays) / targetWorkers;
        text = `Si 2 obreros tardan 6 días en terminar un muro, ¿cuántos días tardarán ${targetWorkers} obreros?`;
        difficulty = 'Medio';
      } else {
        // Regla de Tres Compuesta: Grifos, Litros y Horas
        // 2 grifos, 100L -> 4h
        // 4 grifos, 200L -> ? (4h) -> Ajustado para solución 4
        solution = 4;
        text = `Si 2 grifos llenan un depósito de 100 litros en 4 horas, ¿cuántas horas tardarán 4 grifos en llenar un depósito de 200 litros?`;
        difficulty = 'Difícil';
      }

      return { id: index, text, solution: Math.round(solution), difficulty };
    };

    return [generateProblem(0, 0), generateProblem(1, 1), generateProblem(2, 2)];
  }, [today]);

  const [todayResult, setTodayResult] = useState<'WON' | 'EXPLODED' | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('bomb_challenge_stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(parsed);
      // If played today, we don't know the result unless we store it specifically for today
      // For now, let's just check if they played today
    }
    
    const todayStatus = localStorage.getItem(`bomb_challenge_result_${today}`);
    if (todayStatus) {
      setTodayResult(todayStatus as 'WON' | 'EXPLODED');
      setGameState(todayStatus as 'WON' | 'EXPLODED');
    }
  }, [today]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      setGameState('EXPLODED');
      updateStats(false);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const updateStats = (won: boolean) => {
    const newStats = { ...stats };
    newStats.totalGames += 1;
    if (won) {
      newStats.gamesWon += 1;
      const timeUsed = 300 - timeLeft;
      if (newStats.bestTime === null || timeUsed < newStats.bestTime) {
        newStats.bestTime = timeUsed;
      }
    }

    // Streak logic
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPlayedDate === yesterdayStr) {
      newStats.streak += 1;
    } else if (stats.lastPlayedDate !== today) {
      newStats.streak = 1;
    }
    
    newStats.lastPlayedDate = today;
    setStats(newStats);
    localStorage.setItem('bomb_challenge_stats', JSON.stringify(newStats));
    localStorage.setItem(`bomb_challenge_result_${today}`, won ? 'WON' : 'EXPLODED');
  };

  const handleKeypadInput = (num: string) => {
    if (gameState !== 'PLAYING') return;
    
    const newInputs = [...currentInputs];
    newInputs[activeInputIndex] = num;
    setCurrentInputs(newInputs);

    // Check if correct
    if (parseInt(num) === problems[activeInputIndex].solution) {
      if (activeInputIndex === 2) {
        setGameState('WON');
        updateStats(true);
      } else {
        setActiveInputIndex(prev => prev + 1);
      }
    } else {
      setGameState('EXPLODED');
      updateStats(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasPlayedToday = stats.lastPlayedDate === today && gameState === 'IDLE';

  return (
    <div className={`fixed inset-0 z-[9999] ${isKids ? 'bg-slate-950' : 'bg-slate-900'} overflow-y-auto flex flex-col`}>
      {/* Header */}
      <div className="w-full px-6 py-6 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-[10000] border-b border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs flex items-center gap-2">
          <Bomb size={14} className="animate-pulse" />
          Desafío diario
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: The Bomb or Result Carousel */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            {gameState === 'IDLE' || gameState === 'PLAYING' ? (
              <motion.div 
                key="bomb-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-[450px] aspect-[1/1] flex items-center justify-center"
              >
                {/* Dynamite Bundle */}
                <div className="relative w-full h-full flex items-center justify-center scale-100 sm:scale-110 lg:scale-125">
                  {/* Back Row of Dynamite (3 sticks) */}
                  <div className="absolute flex gap-2 -translate-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={`back-${i}`} className="w-14 h-64 bg-gradient-to-r from-red-800 via-red-600 to-red-900 rounded-full shadow-2xl border-b-8 border-black/30 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Front Row of Dynamite (4 sticks) */}
                  <div className="relative flex gap-2 z-10">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={`front-${i}`} className="w-14 h-64 bg-gradient-to-r from-red-700 via-red-500 to-red-800 rounded-full shadow-2xl border-b-8 border-black/30 relative overflow-hidden group">
                        {/* Highlight */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)]" />
                        {/* TNT Label (Subtle) */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-black/20 rotate-90 tracking-widest uppercase">HIGH EXPLOSIVE TNT</div>
                      </div>
                    ))}
                  </div>

                  {/* Straps (Black Tape) */}
                  <div className="absolute top-14 w-[115%] h-14 bg-slate-900 z-20 shadow-2xl border-y border-white/5 flex items-center justify-around px-4">
                    <div className="w-1 h-full bg-white/5" />
                    <div className="w-1 h-full bg-white/5" />
                  </div>
                  <div className="absolute bottom-14 w-[115%] h-14 bg-slate-900 z-20 shadow-2xl border-y border-white/5 flex items-center justify-around px-4">
                    <div className="w-1 h-full bg-white/5" />
                    <div className="w-1 h-full bg-white/5" />
                  </div>

                  {/* Wires (Tangled look) */}
                  <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none overflow-visible" viewBox="0 0 400 300">
                    {/* Red Wire */}
                    <motion.path
                      d="M 120 150 C 80 100, 40 180, 20 220"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={gameState === 'PLAYING' ? { strokeDashoffset: [0, 20] } : {}}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    {/* Blue Wire */}
                    <motion.path
                      d="M 280 150 C 320 100, 360 180, 380 220"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Yellow Wire */}
                    <motion.path
                      d="M 200 80 C 180 40, 120 40, 100 80"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Green Wire */}
                    <motion.path
                      d="M 200 220 C 220 260, 280 260, 300 220"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Central Control Panel (The "Brain") */}
                  <motion.div 
                    animate={gameState === 'PLAYING' ? {
                      x: [0, -1.5, 1.5, -1.5, 1.5, 0],
                      y: [0, 0.5, -0.5, 0.5, -0.5, 0],
                      transition: { repeat: Infinity, duration: 0.08 }
                    } : {}}
                    className="absolute z-40 w-80 bg-slate-950 rounded-3xl border-[6px] border-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-5 flex flex-col items-center"
                  >
                    {/* Digital Timer (Large and Clear) */}
                    <div className="w-full bg-black rounded-xl p-4 mb-5 border-2 border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative overflow-hidden">
                      {/* Scanline effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(220,38,38,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                      
                      <div className="flex flex-col items-center relative z-10">
                        <div className="flex justify-between w-full px-2 mb-1">
                          <span className="text-[9px] font-mono text-red-500/60 uppercase tracking-widest font-bold">Status: {gameState}</span>
                          <span className="text-[9px] font-mono text-red-500/60 uppercase tracking-widest font-bold">Model: TNT-X3</span>
                        </div>
                        <span className={`text-6xl font-mono font-black tracking-tighter ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-red-600'}`} style={{ 
                          textShadow: '0 0 20px rgba(220, 38, 38, 0.9), 0 0 40px rgba(220, 38, 38, 0.4)',
                          fontFamily: '"JetBrains Mono", monospace'
                        }}>
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>

                    {/* Keypad (Integrated) */}
                    <div className="grid grid-cols-3 gap-3 w-full mb-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleKeypadInput(num.toString())}
                          disabled={gameState !== 'PLAYING'}
                          className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-black transition-all ${
                            gameState === 'PLAYING' 
                              ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-90 shadow-[0_4px_0_rgb(0,0,0)] active:shadow-none active:translate-y-1 border border-white/5' 
                              : 'bg-slate-950 text-slate-800 cursor-not-allowed border border-white/5'
                          } ${num === 0 ? 'col-start-2' : ''}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    {/* Status Indicators & Red Button */}
                    <div className="flex flex-col items-center w-full px-2 gap-4">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex gap-2">
                          {[0, 1, 2].map((i) => (
                            <div 
                              key={`light-${i}`}
                              className={`w-4 h-4 rounded-full border border-black shadow-inner transition-all duration-500 ${
                                activeInputIndex > i || gameState === 'WON'
                                  ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' 
                                  : 'bg-green-950'
                              }`} 
                            />
                          ))}
                        </div>
                        
                        {/* Decorative Red Button */}
                        <div className="w-10 h-10 rounded-full bg-red-900 border-4 border-slate-900 shadow-lg flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-red-600 shadow-inner" />
                        </div>
                      </div>

                      {/* Main Status Light */}
                      <div className="flex items-center gap-2 w-full justify-center py-2 border-t border-white/5">
                        <div className={`w-3 h-3 rounded-full ${gameState === 'PLAYING' ? 'bg-red-500 animate-pulse' : 'bg-red-950'}`} />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Active</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="carousel-view"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-[500px] flex flex-col items-center"
              >
                <div className="w-full mb-6 text-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Resumen del día</span>
                  <h3 className={`text-2xl font-black mt-1 ${isKids ? 'text-white' : 'text-slate-900'}`}>Tus Estadísticas</h3>
                </div>

                <div className="relative w-full aspect-square flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeStatIndex === 0 && (
                      <motion.div 
                        key="slide-result"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[3rem] shadow-2xl border-4 border-white/20 backdrop-blur-md ${
                          gameState === 'WON' ? 'bg-green-500/90' : 'bg-red-600/90'
                        }`}
                      >
                        {gameState === 'WON' ? (
                          <>
                            <Trophy size={100} className="text-white mb-6 drop-shadow-lg" />
                            <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">¡DESACTIVADA!</h2>
                            <p className="text-green-100 text-2xl font-bold">Has salvado el día.</p>
                          </>
                        ) : (
                          <>
                            <Skull size={100} className="text-white mb-6 drop-shadow-lg" />
                            <h2 className="text-7xl font-black text-white mb-2 tracking-tighter">¡BOOM!</h2>
                            <p className="text-red-100 text-2xl font-bold">Vuelve mañana.</p>
                          </>
                        )}
                      </motion.div>
                    )}
                    {activeStatIndex === 1 && (
                      <motion.div 
                        key="slide-total"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[3rem] shadow-2xl border-4 border-white/20 backdrop-blur-md ${isKids ? 'bg-slate-800/90' : 'bg-slate-100/90'}`}
                      >
                        <History size={100} className={`${isKids ? 'text-blue-400' : 'text-blue-600'} mb-6`} />
                        <h2 className={`text-4xl font-black mb-2 tracking-tighter ${isKids ? 'text-white' : 'text-slate-900'}`}>Partidas Totales</h2>
                        <div className={`text-7xl font-black ${isKids ? 'text-blue-400' : 'text-blue-600'}`}>{stats.totalGames}</div>
                      </motion.div>
                    )}
                    {activeStatIndex === 2 && (
                      <motion.div 
                        key="slide-streak"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[3rem] shadow-2xl border-4 border-white/20 backdrop-blur-md ${isKids ? 'bg-slate-800/90' : 'bg-slate-100/90'}`}
                      >
                        <Zap size={100} className="text-orange-500 mb-6" />
                        <h2 className={`text-4xl font-black mb-2 tracking-tighter ${isKids ? 'text-white' : 'text-slate-900'}`}>Racha Actual</h2>
                        <div className="text-7xl font-black text-orange-500">{stats.streak} días</div>
                      </motion.div>
                    )}
                    {activeStatIndex === 3 && (
                      <motion.div 
                        key="slide-winrate"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[3rem] shadow-2xl border-4 border-white/20 backdrop-blur-md ${isKids ? 'bg-slate-800/90' : 'bg-slate-100/90'}`}
                      >
                        <CheckCircle2 size={100} className="text-green-500 mb-6" />
                        <h2 className={`text-4xl font-black mb-2 tracking-tighter ${isKids ? 'text-white' : 'text-slate-900'}`}>Tasa de Victorias</h2>
                        <div className="text-7xl font-black text-green-500">
                          {stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0}%
                        </div>
                      </motion.div>
                    )}
                    {activeStatIndex === 4 && (
                      <motion.div 
                        key="slide-best"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[3rem] shadow-2xl border-4 border-white/20 backdrop-blur-md ${isKids ? 'bg-slate-800/90' : 'bg-slate-100/90'}`}
                      >
                        <Timer size={100} className="text-purple-500 mb-6" />
                        <h2 className={`text-4xl font-black mb-2 tracking-tighter ${isKids ? 'text-white' : 'text-slate-900'}`}>Mejor Tiempo</h2>
                        <div className="text-7xl font-black text-purple-500">
                          {stats.bestTime ? formatTime(stats.bestTime) : '--:--'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Controls */}
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-[60]"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-[60]"
                  >
                    <ChevronRight size={32} />
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-3 mt-8">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button 
                      key={`dot-${i}`}
                      onClick={() => setActiveStatIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeStatIndex === i ? 'bg-blue-500 w-8' : 'bg-slate-400/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Problems */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-2">
          <div className={`${isKids ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-2 rounded-[2.5rem] p-8 shadow-xl`}>
            <h2 className={`text-3xl font-black mb-6 ${isKids ? 'text-white' : 'text-slate-900'}`}>
              {gameState === 'IDLE' ? '¿Estás listo?' : 
               gameState === 'PLAYING' ? 'Códigos de desactivación' : 
               'Desafío completado'}
            </h2>

            {gameState === 'IDLE' ? (
              <div className="space-y-6">
                <p className={`${isKids ? 'text-slate-300' : 'text-slate-600'} text-lg leading-relaxed`}>
                  Tienes 5 minutos para resolver 3 problemas de proporcionalidad. Cada solución es una cifra del código de desactivación.
                </p>
                <div className={`p-6 rounded-2xl ${isKids ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border flex items-start gap-4`}>
                  <AlertTriangle className="text-red-500 shrink-0" size={24} />
                  <p className={`text-sm font-bold ${isKids ? 'text-red-400' : 'text-red-700'}`}>
                    ¡Cuidado! Si introduces una cifra incorrecta, la bomba explotará inmediatamente. Solo tienes un intento al día.
                  </p>
                </div>
                
                {stats.lastPlayedDate === today && gameState === 'IDLE' ? (
                  <div className="p-8 text-center bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-300">
                    <p className="text-slate-500 font-bold">Ya has jugado el desafío de hoy. ¡Vuelve mañana!</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setGameState('PLAYING')}
                    className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black text-2xl rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    COMENZAR DESAFÍO
                  </button>
                )}
              </div>
            ) : gameState === 'PLAYING' ? (
              <div className="relative min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {problems.filter((_, idx) => idx === activeInputIndex).map((p, idx) => {
                    const actualIdx = activeInputIndex;
                    return (
                      <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={`p-8 rounded-[2rem] border-2 transition-all bg-blue-500/10 border-blue-500 shadow-lg`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                              p.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-500' :
                              p.difficulty === 'Medio' ? 'bg-orange-500/20 text-orange-500' :
                              'bg-red-500/20 text-red-500'
                            }`}>
                              Nivel {actualIdx + 1}: {p.difficulty}
                            </span>
                          </div>
                          <div className="text-sm font-black text-slate-400">
                            Problema {actualIdx + 1} de 3
                          </div>
                        </div>
                        
                        <p className={`text-2xl font-bold leading-relaxed ${isKids ? 'text-white' : 'text-slate-800'}`}>
                          {p.text}
                        </p>

                        <div className="mt-8 flex items-center gap-4 p-4 bg-black/5 rounded-2xl border border-black/5">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-black">
                            ?
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Esperando entrada</div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500"
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-8 rounded-[2rem] ${isKids ? 'bg-slate-700/50' : 'bg-slate-50'} border-2 border-dashed ${isKids ? 'border-slate-600' : 'border-slate-200'} text-center`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${gameState === 'WON' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {gameState === 'WON' ? <Trophy size={40} /> : <Skull size={40} />}
                  </div>
                  <h3 className={`text-2xl font-black mb-2 ${isKids ? 'text-white' : 'text-slate-900'}`}>
                    {gameState === 'WON' ? '¡Misión cumplida!' : '¡Misión fallida!'}
                  </h3>
                  <p className={`${isKids ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                    {gameState === 'WON' 
                      ? 'Has desactivado la bomba con éxito. Tus estadísticas han sido actualizadas.' 
                      : 'La bomba ha explotado. Revisa tus estadísticas acumuladas en el carrusel de la izquierda.'}
                  </p>
                  <button 
                    onClick={onBack}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all shadow-lg"
                  >
                    VOLVER AL MENÚ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
