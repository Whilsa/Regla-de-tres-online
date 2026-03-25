import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  Users, 
  Clock, 
  Maximize, 
  Zap, 
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface Step {
  title: string;
  content: React.ReactNode;
  question?: {
    text: string;
    options: string[];
    correctIndex: number;
    feedback: string;
  };
  visual?: React.ReactNode;
}

interface ResourcesWorkExplanationProps {
  onBack: () => void;
  isKids: boolean;
}

export const ResourcesWorkExplanation: React.FC<ResourcesWorkExplanationProps> = ({ onBack, isKids }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const theme = {
    bg: isKids ? 'bg-slate-900' : 'bg-[#F5F5F0]',
    card: isKids ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200',
    text: isKids ? 'text-white' : 'text-slate-800',
    secondaryText: isKids ? 'text-slate-300' : 'text-slate-500',
    accent: isKids ? 'text-orange-400' : 'text-[#5A5A40]',
    button: isKids ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#5A5A40] hover:bg-[#4A4A30]',
  };

  const AMAZON_LINK = "https://www.amazon.es/nueva-F%C3%ADsica-los-espacios-%C2%ABdism%C3%A9tricos%C2%BB-ebook/dp/B0BLF9D8LY";

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(Primera álgebra de magnitudes)/g);
    return parts.map((part, i) => 
      part === "Primera álgebra de magnitudes" 
        ? <a key={i} href={AMAZON_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors">{part}</a>
        : part
    );
  };

  const steps: Step[] = [
    {
      title: "El gran misterio: ¿Recursos = Trabajo?",
      content: (
        <div className="space-y-4">
          <p>Hasta ahora hemos visto cómo aplicar el método a la "regla de tres" (simple, compuesta, directa o inversa).</p>
          <p>Siempre decimos lo mismo: <span className="font-bold text-orange-500">Recursos = Trabajo</span>.</p>
          <p>Pero... ¿te has parado a pensar <span className="italic">por qué</span> esto es así según la {renderTextWithLinks("Primera álgebra de magnitudes")}?</p>
        </div>
      ),
      question: {
        text: "¿Qué crees que sucede cuando multiplicamos obreros por días?",
        options: [
          "Obtenemos un número más grande sin sentido físico",
          "Creamos una nueva magnitud que representa el esfuerzo realizado",
          "Simplemente seguimos una regla que nos enseñaron"
        ],
        correctIndex: 1,
        feedback: "¡Exacto! No es solo un número, es una combinación geométrica que da sentido al trabajo."
      },
      visual: (
        <div className="flex items-center justify-center gap-4 h-40">
          <div className="flex flex-col items-center gap-2">
            <Users size={40} className="text-blue-400" />
            <span className="text-sm font-bold">Recursos</span>
          </div>
          <div className="text-2xl font-bold">=</div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={40} className="text-yellow-400" />
            <span className="text-sm font-bold">Trabajo</span>
          </div>
        </div>
      )
    },
    {
      title: "La Díada: El ADN de la medida",
      content: (
        <div className="space-y-4">
          <p>Toda medida es una <span className="font-bold">Díada</span>. Está formada por dos elementos: un <span className="text-blue-500">número</span> y una <span className="text-orange-500">magnitud</span> (o elemento dimensional).</p>
          <p>Por ejemplo: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">2 obreros</span>.</p>
          <p>El '2' es cuántos hay, pero 'obrero' es lo que le da el <span className="font-bold">sentido físico</span>.</p>
        </div>
      ),
      question: {
        text: "Si tenemos '3 días', ¿cuál es el elemento dimensional?",
        options: ["El número 3", "La palabra 'días'", "Ambos por igual"],
        correctIndex: 1,
        feedback: "¡Correcto! 'Días' es la magnitud que define qué estamos midiendo."
      },
      visual: (
        <div className="flex items-center justify-center h-40">
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 flex gap-4 items-baseline">
            <span className="text-5xl font-black text-blue-400">2</span>
            <span className="text-3xl font-bold text-orange-400">obreros</span>
          </div>
        </div>
      )
    },
    {
      title: "Suma Geométrica (Díadas Homogéneas)",
      content: (
        <div className="space-y-4">
          <p>Imagina que cada 'obrero' es un segmento de línea.</p>
          <p>Si tenemos 2 obreros, simplemente ponemos un segmento tras otro. Es una <span className="font-bold">adición geométrica</span>.</p>
          <p>Como son la misma magnitud (homogéneas), el resultado es un segmento más largo.</p>
        </div>
      ),
      visual: (
        <div className="flex flex-col items-center justify-center h-40 gap-6">
          <div className="flex gap-1">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: 60 }}
              className="h-2 bg-blue-400 rounded-full relative"
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">1 obrero</span>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.5 }}
              className="h-2 bg-blue-400 rounded-full relative"
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">1 obrero</span>
            </motion.div>
          </div>
          <div className="text-sm font-bold">Total: 2 obreros (Segmento largo)</div>
        </div>
      )
    },
    {
      title: "Multiplicación Geométrica (Díadas Heterogéneas)",
      content: (
        <div className="space-y-4">
          <p>¿Pero qué pasa si tenemos <span className="text-blue-400">2 obreros</span> y <span className="text-green-400">3 días</span>?</p>
          <p>¡Son magnitudes distintas! No podemos sumarlas en una línea.</p>
          <p>La {renderTextWithLinks("Primera álgebra de magnitudes")} nos dice que debemos <span className="font-bold underline">multiplicarlas geométricamente</span>.</p>
        </div>
      ),
      question: {
        text: "Al multiplicar dos segmentos de diferentes magnitudes, ¿qué figura crees que se forma?",
        options: ["Un círculo", "Un triángulo", "Un área (rectángulo)"],
        correctIndex: 2,
        feedback: "¡Exacto! La combinación de dos dimensiones distintas genera una superficie: el Área del Trabajo."
      },
      visual: (
        <div className="flex items-center justify-center h-48">
          <div className="relative">
            <motion.div 
              initial={{ height: 0 }} animate={{ height: 80 }}
              className="w-2 bg-blue-400 absolute -left-4 top-0 rounded-full"
            />
            <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-sm rotate-270">2 obreros</span>
            
            <motion.div 
              initial={{ width: 0 }} animate={{ width: 120 }}
              className="h-2 bg-green-400 absolute left-0 -bottom-4 rounded-full"
            />
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-sm">3 días</span>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
              className="w-[120px] h-[80px] bg-yellow-400/30 border-2 border-yellow-400 border-dashed flex items-center justify-center"
            >
              <span className="text-sm font-bold text-yellow-500">TRABAJO (Área)</span>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "El caso de la Velocidad",
      content: (
        <div className="space-y-4">
          <p>La física tradicional dice que la velocidad es km/h o km por hora.</p>
          <p>Pero piénsalo... ¿has visto alguna vez una "hora a la inversa" en la naturaleza? ¿Se puede percibir?</p>
          <p>La {renderTextWithLinks("Primera álgebra de magnitudes")} explica que la velocidad es una relación dentro de una díada, no una "inversa" matemática sin sentido físico.</p>
        </div>
      ),
      question: {
        text: "Si combinamos Velocidad y Tiempo, ¿qué obtenemos como 'Trabajo'?",
        options: ["Aceleración", "Distancia recorrida", "Más tiempo"],
        correctIndex: 1,
        feedback: "¡Correcto! La Distancia es el resultado (el área) de aplicar una Velocidad durante un Tiempo."
      },
      visual: (
        <div className="flex items-center justify-center h-40 gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 text-center">
            <div className={`text-sm uppercase font-bold ${isKids ? 'text-blue-300' : 'opacity-60'}`}>Recurso 1</div>
            <div className="font-bold">Velocidad</div>
          </div>
          <div className="text-xl">×</div>
          <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
            <div className={`text-sm uppercase font-bold ${isKids ? 'text-green-300' : 'opacity-60'}`}>Recurso 2</div>
            <div className="font-bold">Tiempo</div>
          </div>
          <div className="text-xl">=</div>
          <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30 text-center">
            <div className={`text-sm uppercase font-bold ${isKids ? 'text-yellow-300' : 'opacity-60'}`}>Trabajo</div>
            <div className="font-bold">Distancia</div>
          </div>
        </div>
      )
    },
    {
      title: "Aritmetización vs Realidad",
      content: (
        <div className="space-y-4">
          <p>Llevamos siglos cayendo en la <span className="text-red-400 font-bold">Aritmetización</span>: tratar a las magnitudes como simples números.</p>
          <p>El Sistema Internacional usa lenguajes formales que olvidan el <span className="italic">sentido físico</span>.</p>
          <p>La {renderTextWithLinks("Primera álgebra de magnitudes")} es la única que resuelve este problema desde Newton, devolviendo la geometría a la física.</p>
        </div>
      ),
      visual: (
        <div className="flex items-center justify-center h-40">
          <div className="relative w-64 h-24 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none select-none font-mono text-sm leading-tight">
               {Array.from({length: 200}).map((_, i) => (Math.random() > 0.5 ? '0' : '1'))}
             </div>
             <div className="text-center z-10">
               <div className={`text-red-400 font-mono text-sm line-through ${isKids ? 'opacity-70' : 'opacity-50'}`}>Solo números</div>
               <div className="text-green-400 font-bold text-lg">Magnitudes Físicas</div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Dismetría: El siguiente nivel",
      content: (
        <div className="space-y-4">
          <p>¿Y si un metro no midiera lo mismo en todas partes? Por ejemplo, ¿mide igual en la Tierra que cerca de un <span className="font-bold">agujero negro</span>?</p>
          <p>De esto trata la <span className="text-purple-400 font-bold">Dismetría</span>.</p>
          <p>Gracias a ella, se dan respuestas a la Teoría Cuántica, el número Pi y la Relatividad de Einstein.</p>
        </div>
      ),
      visual: (
        <div className="flex items-center justify-center h-40">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 0.8, 1],
              rotate: [0, 10, -10, 0],
              borderRadius: ["20%", "50%", "30%", "20%"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl shadow-purple-500/20"
          />
        </div>
      )
    },
    {
      title: "¡Sigue explorando!",
      content: (
        <div className="space-y-6">
          <p>Esta es solo la punta del iceberg. La {renderTextWithLinks("Primera álgebra de magnitudes")} cambia por completo nuestra forma de entender el universo.</p>
          <div className="grid grid-cols-1 gap-3">
            <a 
              href="https://www.amazon.es/nueva-F%C3%ADsica-los-espacios-%C2%ABdism%C3%A9tricos%C2%BB-ebook/dp/B0BLF9D8LY" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-orange-400" />
                <span className="font-medium text-sm">Libro: La nueva Física de los espacios dismétricos</span>
              </div>
              <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
            </a>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <p className={`text-sm ${isKids ? 'text-orange-300' : 'text-orange-400'} font-bold uppercase mb-2`}>Artículos en acceso abierto</p>
              <p className="text-sm opacity-90">Busca los trabajos del autor sobre Dismetría y {renderTextWithLinks("Primera álgebra de magnitudes")} para profundizar de forma gratuita.</p>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div className="flex items-center justify-center h-32">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
      )
    }
  ];

  const handleAnswer = (index: number) => {
    if (answered !== null) return;
    setAnswered(index);
    setShowFeedback(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setAnswered(null);
      setShowFeedback(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnswered(null);
      setShowFeedback(false);
    }
  };

  const step = steps[currentStep];

  return (
    <div className={`min-h-screen ${theme.bg} p-4 md:p-8 flex flex-col items-center justify-center`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-3xl ${theme.card} ${theme.text} rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 ${theme.secondaryText} hover:text-white transition-colors text-sm font-bold uppercase tracking-widest`}
          >
            <ArrowLeft size={18} />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full ${isKids ? 'bg-orange-500/20 text-orange-400' : 'bg-[#5A5A40]/10 text-[#5A5A40]'} text-sm font-bold uppercase tracking-widest`}>
              Explicación Interactiva
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full">
          <motion.div 
            className={`h-full ${isKids ? 'bg-orange-500' : 'bg-[#5A5A40]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className={`text-3xl md:text-4xl font-black ${theme.text} leading-tight`}>
                  {step.title}
                </h2>
              </div>

              {/* Visual Component */}
              {step.visual && (
                <div className={`p-6 rounded-2xl ${isKids ? 'bg-white/5' : 'bg-slate-50'} border border-white/5`}>
                  {step.visual}
                </div>
              )}

              {/* Text Content */}
              <div className={`text-lg leading-relaxed ${theme.secondaryText}`}>
                {step.content}
              </div>

              {/* Question Section */}
              {step.question && (
                <div className={`p-6 rounded-2xl ${isKids ? 'bg-orange-500/10 border-orange-500/20' : 'bg-slate-100 border-slate-200'} border space-y-4`}>
                  <div className="flex items-center gap-3">
                    <HelpCircle className={theme.accent} size={24} />
                    <h4 className={`font-bold ${theme.text}`}>{step.question.text}</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {step.question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={answered !== null}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          answered === idx
                            ? idx === step.question?.correctIndex
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'bg-red-500/20 border-red-500 text-red-400'
                            : answered !== null && idx === step.question?.correctIndex
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : `bg-white/5 border-transparent ${theme.text} hover:border-white/20`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {answered === idx && (
                            idx === step.question?.correctIndex ? <CheckCircle2 size={18} /> : <Zap size={18} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {showFeedback && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm font-medium ${answered === step.question.correctIndex ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {step.question.feedback}
                    </motion.p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between bg-black/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
            } ${theme.text}`}
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          <div className={`text-sm font-mono ${theme.secondaryText}`}>
            PASO {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || (step.question && answered === null)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
              currentStep === steps.length - 1 || (step.question && answered === null)
                ? 'opacity-30 cursor-not-allowed bg-slate-700'
                : theme.button + ' text-white scale-100 hover:scale-105 active:scale-95'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResourcesWorkExplanation;
