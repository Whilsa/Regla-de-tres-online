import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  ChevronRight, 
  RefreshCcw, 
  BookOpen, 
  Calculator,
  AlertCircle,
  Lightbulb,
  PlayCircle,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  Castle
} from 'lucide-react';
import { Mode } from './types';
import { GeminiService } from './services/geminiService';
import { ExerciseChat } from './components/ExerciseChat';
import { ResourcesWorkExplanation } from './components/ResourcesWorkExplanation';
import { ChallengeMode } from './components/ChallengeMode';

const gemini = new GeminiService();

type View = 'SELECTION' | 'DASHBOARD' | 'THEORY' | 'EXERCISE' | 'SOLUTION' | 'HELP_ME' | 'RESOURCES_WORK_EXPLANATION' | 'CHALLENGE';

interface TypewriterProps {
  text: string;
  onComplete?: () => void;
  onProgress?: (length: number) => void;
  key?: React.Key;
}

const AMAZON_LINK = "https://www.amazon.es/nueva-F%C3%ADsica-los-espacios-%C2%ABdism%C3%A9tricos%C2%BB-ebook/dp/B0BLF9D8LY/ref=sr_1_1?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=472FCKUHDEK0&dib=eyJ2IjoiMSJ9.gdrdMrAOVuxSpSXIqkdVai0uu6ihwF585slo9Nr3rT4.8Nc7j5Z6As7CCT8IljCU4a9fspyvuIkdmyEBqfdWl6A&dib_tag=se&keywords=la+nueva+f%C3%ADsica+de+los+espacios+dism%C3%A9tricos&qid=1764834450&s=digital-text&sprefix=la+nueva+f%C3%ADsica+de+los+espacios+dism%C3%A9tricos%2Cdigital-text%2C41&sr=1-1";

const renderTextWithLinks = (text: string) => {
  if (!text) return text;
  
  // Clean up symbols requested by user: **, $$, ##
  // We strip them but keep the content inside
  let cleanedText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bolding **text** -> text
    .replace(/\$\$(.*?)\$\$/g, '$1') // Remove $$math$$ -> math
    .replace(/##\s?(.*?)/g, '$1')    // Remove ## Header -> Header
    .replace(/\$/g, '');             // Remove single $
    
  const parts = cleanedText.split(/(Primera álgebra de magnitudes)/g);
  const renderedParts = parts.map((part, i) => 
    part === "Primera álgebra de magnitudes" 
      ? <a key={i} href={AMAZON_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors font-bold">{part}</a>
      : part
  );

  return renderedParts;
};

const ExplodingText = () => {
  const texts = ["Regla de tres", "Supérala", "La intuición no vale"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-12 flex items-center justify-center mt-8 overflow-hidden relative w-full pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ 
            opacity: 0, 
            scale: 2.5,
            rotate: [0, -5, 5, -10],
            filter: "blur(10px)",
            transition: { duration: 0.4, ease: "anticipate" }
          }}
          className="text-xl font-black text-orange-500 uppercase tracking-[0.2em] text-center whitespace-nowrap"
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Typewriter = ({ text, onComplete, onProgress }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      const newLength = i + 1;
      setDisplayedText(text.slice(0, newLength));
      if (onProgress) onProgress(newLength);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="whitespace-pre-wrap">{renderTextWithLinks(displayedText)}</span>;
};


const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-[10%] text-5xl"
      >
        🚀
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
        className="absolute top-40 right-[15%] text-5xl"
      >
        🌈
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, -25, 0],
          x: [0, 20, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ repeat: Infinity, duration: 6, delay: 2, ease: "easeInOut" }}
        className="absolute bottom-40 left-[15%] text-5xl"
      >
        🍦
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 360, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, delay: 0.5, ease: "linear" }}
        className="absolute bottom-10 right-[10%] text-5xl"
      >
        🎡
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
      >
        ✨
      </motion.div>
    </div>
  );
};

const Magnitude = ({ text, step }: { text: string, step: number }) => {
  const isHidden = step === 5;
  const getThreshold = (t: string) => {
    if (t.includes('obreros')) return 1;
    if (t.includes('horas diarias')) return 2;
    if (t.includes('días')) return 3;
    if (t.includes('muro')) return 4;
    return 99;
  };

  const isCrossed = step >= getThreshold(text);

  return (
    <motion.span 
      className="inline-block relative mx-1 overflow-hidden whitespace-nowrap"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isHidden ? 0 : 1,
        width: isHidden ? 0 : 'auto',
        marginRight: isHidden ? 0 : 4,
        marginLeft: isHidden ? 0 : 4
      }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      <span className={isCrossed ? 'text-slate-400' : ''}>{text}</span>
      {isCrossed && (
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute inset-x-0 top-1/2 h-[2px] bg-red-500 origin-left"
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.span>
  );
};

const Operator = ({ step, id }: { step: number, id?: string }) => {
  const isArithmetic = step === 5;
  return (
    <div className="inline-flex items-center justify-center w-6 h-6 mx-1">
      <AnimatePresence mode="wait">
        <motion.span 
          key={isArithmetic ? 'dot' : 'star'}
          layoutId={id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="font-bold text-xl"
        >
          {isArithmetic ? '·' : '*'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [view, setView] = useState<View>('SELECTION');
  const [content, setContent] = useState<string>('');
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = (selectedAge: number) => {
    const selectedMode = selectedAge < 13 ? 'NIÑOS' : 'ADULTOS';
    setMode(selectedMode);
    setView('DASHBOARD');
  };

  const [theoryStep, setTheoryStep] = useState(0);
  const [theoryInput, setTheoryInput] = useState('');
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
  const [currentSolutionStep, setCurrentSolutionStep] = useState(0);
  const [selectedDiadas, setSelectedDiadas] = useState<string[]>([]);
  const [selectedDiadaToClassify, setSelectedDiadaToClassify] = useState<string | null>(null);
  const [classifiedDiadas, setClassifiedDiadas] = useState<{ [key: string]: 'RECURSOS' | 'TRABAJO' }>({});
  const [classificationError, setClassificationError] = useState<string | null>(null);
  const [equalityState, setEqualityState] = useState<{
    enunciado: { recursos: string[], trabajo: string[] },
    pregunta: { recursos: string[], trabajo: string[] }
  }>({
    enunciado: { recursos: [], trabajo: [] },
    pregunta: { recursos: [], trabajo: [] }
  });
  const [activeEqualityPart, setActiveEqualityPart] = useState<'ENUNCIADO' | 'PREGUNTA'>('ENUNCIADO');
  const [geometricSubStep, setGeometricSubStep] = useState(1);
  const [typewriterProgress, setTypewriterProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showSymbolExplanation, setShowSymbolExplanation] = useState(false);

  const [isDivided, setIsDivided] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [cancellationState, setCancellationState] = useState(0);
  const [resolutionPhase, setResolutionPhase] = useState<'START' | 'STEP1' | 'STEP2' | 'RESULT' | 'TEXT'>('START');
  const [practiceView, setPracticeView] = useState<'MENU' | 'HELP_ME' | 'PRACTICE'>('MENU');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analizando las magnitudes de tu problema...",
    "Identificando la ley física aplicable...",
    "Planteando las igualdades fundamentales...",
    "Preparando la resolución paso a paso...",
    "Casi listo, ajustando los detalles finales..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingProgress(0);
      setLoadingMessageIndex(0);
      const startTime = Date.now();
      const duration = 40000; // 40 seconds

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 98);
        setLoadingProgress(progress);
        
        // Update message every 8 seconds
        setLoadingMessageIndex(Math.min(Math.floor(elapsed / 8000), loadingMessages.length - 1));
      }, 100);
    } else {
      setLoadingProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (view === 'THEORY' && theoryStep === 11) {
      setResolutionPhase('START');
      const timer1 = setTimeout(() => setResolutionPhase('STEP1'), 5000);
      const timer2 = setTimeout(() => setResolutionPhase('STEP2'), 10000);
      const timer3 = setTimeout(() => setResolutionPhase('RESULT'), 15000);
      const timer4 = setTimeout(() => setResolutionPhase('TEXT'), 18000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [view, theoryStep]);

   const THEORY_STEPS = [
    {
      id: 1,
      content: "Bienvenido/a a esta introducción teórica. Soy la IA de Daniel Arnaiz Boluda, y mi propósito es enseñarte a plantear y resolver problemas matemáticos comúnmente conocidos como “regla de tres” aplicando el nuevo Método de la Primera álgebra de magnitudes, demostrado y aceptado por la comunidad científica.",
      buttonText: "¡Vamos!"
    },
    {
      id: 2,
      content: "Para comenzar, debemos desaprender ciertas convenciones clásicas. Como podrás comprobar, bajo nuestro marco de trabajo el planteamiento es exactamente igual para cualquier caso; no hay diferencia entre lo que tradicionalmente llaman proporcionalidad directa e inversa. Nuestro método unifica todos los escenarios bajo un único principio lógico y físico insoslayable: RECURSOS = TRABAJO. Seguimos el esquema de combinar las díadas que suponen los recursos necesarios para obtener un trabajo determinado, operando en álgebra de magnitudes mediante multiplicación geométrica.",
      buttonText: "Quiero saber más"
    },
    {
      id: 3,
      content: "Empecemos por la base de todo. Toda medida es una díada. Una díada está formada inexcusablemente por dos partes: un elemento numérico y un elemento dimensional (la magnitud). Esta magnitud es la que dota de auténtico sentido físico a la medida; un número aislado no representa la realidad física del problema. Ejemplos de díadas son: 3 metros, 2 obreros, 4 horas, etc. ¿Lo entiendes?",
      buttonText: "¡Sí!"
    },
    {
      id: 4,
      type: "INTERACTIVE",
      content: "Para ilustrar este concepto, vamos a utilizar el siguiente problema maestro. Haz clic en las díadas (número+magnitud) que observas en el problema:",
      problemText: "Cinco obreros trabajando 6 horas diarias construyen un muro en dos días, ¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?",
      diadas: ["Cinco obreros", "6 horas diarias", "un muro", "dos días", "cuánto tardarán", "cuatro obreros", "7 horas diarias"],
      buttonText: "Continuar"
    },
    {
      id: 5,
      type: "GEOMETRIC_ALGEBRA",
      content: [
        "Para poder operar con las magnitudes se introduce el álgebra geométrica dado que trata a los elementos dimensionales como segmentos de una determinada longitud. Así, «metro de largo» es un segmento de una longitud determinada. Si se añaden más segmentos de esta misma dimensión dan lugar a otro más largo determinado por el número abstracto, por ejemplo «3» segmentos, lo que se ha dado en llamar proporción homogénea.",
        "Si se añaden segmentos de otra dimensión, como «metro de ancho», tendrán igual o distinta longitud a los anteriores, pero ya no se pueden añadir a continuación de los «metro de largo» porque son de distinta naturaleza, debiéndose multiplicar entre sí dando lugar geométricamente a un área que representa el tercer elemento dimensional resultante, la «superficie». Esto es la proporción heterogénea."
      ],
      buttonText: "Seguir"
    },
    {
      id: 6,
      type: "HETEROGENEOUS_EXAMPLE",
      content: [
        "Lo mismo ocurre en nuestro ejemplo. «Cinco obreros trabajando 6 horas diarias construyen un muro en dos días, ¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?»",
        "En él observamos las díadas que has identificado correctamente, y al combinarlas nos damos cuenta de que son díadas heterogéneas al tener distinta dimensión, de tal forma que multiplicando el número de obreros que trabajan durante un tiempo determinado se obtiene el muro que construyen. Es decir, los lados de la superficie son los recursos y la superficie es el trabajo obtenido."
      ],
      buttonText: "Continuar"
    },
    {
      id: 7,
      type: "IDENTIFY_PARTS",
      content: "Para avanzar en la resolución, debemos dividir el problema completo en dos partes fundamentales. Haz clic en cada una de ellas en el texto de abajo para identificarlas:",
      problemText: "Cinco obreros trabajando 6 horas diarias construyen un muro en dos días, ¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?",
      parts: [
        { text: "Cinco obreros trabajando 6 horas diarias construyen un muro en dos días", label: "Enunciado", description: "Es la parte donde todas las díadas son conocidas (elemento numérico y dimensional)." },
        { text: "¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?", label: "Pregunta", description: "Es la parte donde se encuentra la incógnita (el elemento numérico de una de las díadas)." }
      ],
      buttonText: "Continuar"
    },
    {
      id: 8,
      type: "EQUALITY",
      content: "La igualdad de las díadas de recursos con el trabajo forman la proporción real de magnitudes. \nTendremos una proporción para el enunciado donde conocemos todas las medidas y una segunda proporción para la pregunta en la que desconocemos un dato numérico. \nClasifica las díadas del problema arrastrándolas (o haciendo clic) a su grupo correspondiente.",
      problemText: "Cinco obreros trabajando 6 horas diarias construyen un muro en dos días, ¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?",
      diadas: ["Cinco obreros", "6 horas diarias", "un muro", "dos días", "cuánto tardarán", "cuatro obreros", "7 horas diarias"],
      enunciado: {
        recursos: ["Cinco obreros", "6 horas diarias", "dos días"],
        trabajo: ["un muro"]
      },
      pregunta: {
        recursos: ["cuatro obreros", "7 horas diarias", "cuánto tardarán"],
        trabajo: ["un muro"]
      },
      buttonText: "A por las proporciones"
    },
    {
      id: 9,
      type: "DIVISION",
      content: "Al dividir miembro a miembro las dos igualdades, estamos aplicando una propiedad fundamental: si dividimos cosas iguales por cosas iguales, los resultados son iguales.",
      buttonText: "¡Dividamos!"
    },
    {
      id: 10,
      type: "CANCELLATION",
      content: "Conforme a la Primera álgebra de magnitudes, cuando una magnitud se divide entre sí misma se obtiene el número abstracto 1. Esto permite simplificar la expresión y despejar nuestra incógnita manteniendo la coherencia física del problema.",
      buttonText: "¡Qué interesante!"
    },
    {
      id: 11,
      type: "RESOLUTION",
      content: "Recuperando la díada original a la que pertenece x son 2,14 días.\n\n¡Enhorabuena! Acabas de aprender la verdadera proporcionalidad de magnitudes. Ahora estás listo/a para practicar con problemas reales aplicando este método infalible.",
      buttonText: "¡A practicar!"
    }
  ];

  const loadTheory = async (topic: string, step: number = 0, userResponse?: string) => {
    setIsLoading(true);
    setError(null);
    setView('THEORY');
    
    if (step === 0) {
      setTheoryStep(1);
      setSelectedDiadas([]);
      setShowSuccess(false);
      setIsLoading(false);
      return;
    }

    if (step < THEORY_STEPS.length) {
      setTheoryStep(step + 1);
      if (step + 1 === 4 || step + 1 === 7) {
        setSelectedDiadas([]);
        setShowSuccess(false);
      }
      if (step + 1 === 5 || step + 1 === 6) {
        setGeometricSubStep(1);
        setShowSuccess(false);
      }
      if (step + 1 === 8) {
        setEqualityState({
          enunciado: { recursos: [], trabajo: [] },
          pregunta: { recursos: [], trabajo: [] }
        });
        setActiveEqualityPart('ENUNCIADO');
        setShowSuccess(false);
      }
      if (step + 1 === 9) {
        setIsDivided(false);
        setAnimationComplete(false);
        setShowSuccess(false);
        setShowSymbolExplanation(false);
      }
      if (step + 1 === 10) {
        setCancellationState(0);
        setShowSuccess(false);
      }
      if (step + 1 === 11) {
        setResolutionPhase('START');
        setShowSuccess(false);
      }
      setIsLoading(false);
      return;
    }

    if (step === THEORY_STEPS.length && topic === 'Introducción teórica') {
      setView('DASHBOARD');
      setIsLoading(false);
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 20000)
      );
      
      const res = await Promise.race([
        gemini.getTheory(topic, mode!, step, userResponse),
        timeoutPromise
      ]) as string;
      
      setContent(res || '');
      setTheoryStep(step + 1);
    } catch (err) {
      if (err instanceof Error && err.message === 'TIMEOUT') {
        setError('La IA está tardando demasiado. Por favor, inténtalo de nuevo.');
      } else {
        setError('Error al cargar la teoría.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTheorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoryInput.trim() || isLoading) return;
    const input = theoryInput.trim();
    setTheoryInput('');
    loadTheory('Introducción teórica', theoryStep, input);
  };

  const handleNextTheoryStep = () => {
    if (theoryStep < THEORY_STEPS.length) {
      loadTheory('Introducción teórica', theoryStep);
    } else {
      setView('DASHBOARD');
    }
  };

  const handlePreviousTheoryStep = () => {
    if (theoryStep > 1) {
      // To go back to step N, we need to call loadTheory with step N-1
      // Since theoryStep is 1-indexed, to go back to theoryStep - 1, we pass theoryStep - 2
      loadTheory('Introducción teórica', theoryStep - 2);
    }
  };

  const loadExercise = async () => {
    setIsLoading(true);
    setError(null);
    setView('EXERCISE');
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 20000)
      );
      
      const res = await Promise.race([
        gemini.getExercise(mode!),
        timeoutPromise
      ]) as string;
      
      setCurrentExercise(res || '');
      setContent(res || '');
    } catch (err) {
      if (err instanceof Error && err.message === 'TIMEOUT') {
        setError('La IA está tardando demasiado. Por favor, inténtalo de nuevo.');
      } else {
        setError('Error al cargar el ejercicio.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const splitSolution = (text: string) => {
    // Split by step markers and remove leading/trailing numbers
    const steps = text.split(/(?:\d+\.\s*)?(?:1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|Paso \d|(?:\d\.\s+1️⃣)|(?:\d\.\s+2️⃣)|(?:\d\.\s+3️⃣)|(?:\d\.\s+4️⃣)|(?:\d\.\s+5️⃣)|(?:\d\.\s+6️⃣)|(?:\d\.\s+7️⃣)|(?:\d\.\s+8️⃣)|(?:\d\.\s+9️⃣)|^\d\.\s+|(?:\n\d\.\s+))/gm)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.replace(/\s*\d+\.$/, '')); // Remove trailing numbers like "2."
    
    // Remove the 9th step (index 8) if it exists, as it's reiterative
    if (steps.length >= 9) {
      steps.splice(8, 1);
    }
    return steps;
  };

  const loadSolution = async () => {
    setIsLoading(true);
    setError(null);
    setView('SOLUTION');
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 20000)
      );
      
      const res = await Promise.race([
        gemini.solveExercise(currentExercise, mode!),
        timeoutPromise
      ]) as string;
      
      const steps = splitSolution(res || '');
      setSolutionSteps(steps);
      setCurrentSolutionStep(0);
      setContent(steps[0] || '');
      setShowSuccess(false);
    } catch (err) {
      if (err instanceof Error && err.message === 'TIMEOUT') {
        setError('La IA está tardando demasiado. Por favor, inténtalo de nuevo.');
      } else {
        setError('Error al cargar la solución.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setMode(null);
    setView('SELECTION');
    setContent('');
    setCurrentExercise('');
    setError(null);
    setPracticeView('MENU');
    setSolutionSteps([]);
    setCurrentSolutionStep(0);
  };

  const isKids = mode === 'NIÑOS';

  const theme = isKids ? {
    bg: 'bg-[#FFFBEB] bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:24px_24px]',
    font: 'font-playful',
    nav: 'bg-white/80 border-b-4 border-orange-200 backdrop-blur-md',
    card: 'bg-white rounded-[3.5rem] shadow-xl shadow-orange-200/50 border-4 border-orange-400 overflow-hidden relative',
    primary: 'bg-gradient-to-br from-orange-400 to-orange-600',
    primaryText: 'text-orange-600',
    accent: 'bg-orange-100 text-orange-700',
    button: 'rounded-[2rem] shadow-lg hover:shadow-orange-200 transition-all',
    textColor: 'text-slate-800',
    secondaryText: 'text-slate-600',
    mutedBg: 'bg-orange-50',
    borderColor: 'border-orange-200'
  } : {
    bg: 'bg-[#F8F9FA]',
    font: 'font-serif',
    nav: 'bg-white/90 border-b border-slate-200 backdrop-blur-md',
    card: 'bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden',
    primary: 'bg-[#5A5A40]',
    primaryText: 'text-[#5A5A40]',
    accent: 'bg-slate-100 text-slate-700',
    button: 'rounded-xl',
    textColor: 'text-slate-900',
    secondaryText: 'text-slate-600',
    mutedBg: 'bg-slate-50',
    borderColor: 'border-slate-200'
  };

  // Selection View
  if (view === 'SELECTION') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4 font-serif overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="w-20 h-20 bg-[#5A5A40] rounded-3xl flex items-center justify-center text-white shadow-lg"
            >
              <GraduationCap size={40} />
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-6 tracking-tight leading-tight">
            <Typewriter text={"La regla de tres de\nDaniel Arnaiz Boluda"} />
          </h1>
          <p className="text-slate-400 text-center mb-4 italic text-base uppercase tracking-widest leading-relaxed">
            <Typewriter text={"SUPERANDO LA ARCAICA\nREGLA DE TRES CLÁSICA"} />
          </p>
          <p className="text-slate-700 text-center mb-10 font-medium text-xl leading-relaxed">
            <Typewriter text={"Método basado en la\nPrimera álgebra de magnitudes"} />
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => handleStart(10)}
              className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-orange-50 border-2 border-orange-100 hover:border-orange-300 hover:bg-orange-100 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-orange-500 rounded-2xl shadow-sm border border-orange-100">
                  <BookOpen size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-xl">Modo Niños</div>
                  <div className="text-base text-orange-600 italic">Aprende jugando</div>
                </div>
              </div>
              <ChevronRight className="text-orange-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleStart(20)}
              className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-100 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                  <Calculator size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-xl">Modo Adultos</div>
                  <div className="text-base text-indigo-600 italic">Enfoque profesional</div>
                </div>
              </div>
              <ChevronRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <ExplodingText />
        </motion.div>
      </div>
    );
  }

  if (view === 'CHALLENGE') {
    return (
      <ChallengeMode 
        onBack={() => setView('DASHBOARD')}
        isKids={isKids}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.font} ${theme.textColor} transition-colors duration-500`}>
      {/* Navbar */}
      <nav className={`${theme.nav} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view !== 'DASHBOARD' && (
              <button 
                onClick={() => setView('DASHBOARD')}
                className={`p-2 hover:bg-white/5 rounded-full transition-colors`}
              >
                <ArrowLeft size={20} className={theme.primaryText} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${theme.primary} rounded-xl flex items-center justify-center ${isKids ? 'text-white' : 'text-[#121212]'} shadow-md`}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className={`font-bold ${theme.textColor} leading-tight`}>Regla de tres online ─ la verdadera proporcionalidad de magnitudes</h2>
                <p className={`text-sm uppercase tracking-widest font-bold ${theme.primaryText}`}>
                  {isKids ? '🌟 Modo Niños 🌟' : 'Modo Adultos'}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={resetApp}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.secondaryText} hover:text-white transition-colors`}
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'DASHBOARD' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Theory Card */}
              <div className={`${theme.card} p-8 flex flex-col`}>
                <div className={`w-14 h-14 ${isKids ? 'bg-yellow-400/20 text-yellow-400' : 'bg-amber-400/20 text-amber-400'} rounded-2xl flex items-center justify-center mb-6`}>
                  <Lightbulb size={28} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${theme.textColor}`}>{isKids ? '¡Aprende el método!' : 'Aprender método'}</h3>
                <p className={`${theme.secondaryText} mb-8 flex-1 min-h-[160px] md:min-h-[140px]`}>
                  <Typewriter 
                    text={isKids 
                      ? 'Descubre el método basado en la Primera álgebra de magnitudes. ¡Aprenderás que la intuición es innecesaria!' 
                      : 'Descubre el método basado en la Primera álgebra de magnitudes, la única que resuelve el problema de la aritmetización de la física.\nNo se puede operar con magnitudes como si fuera mera aritmética.\n¿Proporcionalidad directa o inversa? Aprenderás que eso es pura intuición, y es innecesaria.'} 
                  />
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => loadTheory('Introducción teórica')}
                    className={`w-full flex items-center justify-between p-4 ${theme.button} ${theme.mutedBg} border ${theme.borderColor} hover:border-orange-400/50 transition-all group`}
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle size={18} className={`${isKids ? 'text-yellow-400' : 'text-amber-400'} group-hover:text-white`} />
                      <span className={`font-bold ${theme.textColor}`}>Empezar</span>
                    </div>
                    <ChevronRight size={18} className={`${theme.secondaryText} opacity-50 group-hover:opacity-100`} />
                  </button>

                  <button 
                    onClick={() => setView('RESOURCES_WORK_EXPLANATION')}
                    className={`w-full flex items-center justify-between p-5 ${theme.button} ${isKids ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-gradient-to-r from-[#5A5A40] to-[#7A7A60]'} text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-2 rounded-xl ${isKids ? 'bg-white/20' : 'bg-white/10'}`}>
                        <Lightbulb size={20} className="text-white animate-pulse" />
                      </div>
                      <span className="font-black text-lg tracking-tight whitespace-nowrap">¿Por qué RECURSOS = TRABAJO?</span>
                    </div>
                    <ChevronRight size={20} className="text-white opacity-70 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </button>

                  <a 
                    href="https://dergipark.org.tr/en/pub/jmetp/article/1612062"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex flex-col p-4 ${theme.button} bg-blue-50 border border-blue-100 hover:border-blue-300 transition-all group`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className="text-blue-500" />
                        <span className="font-bold text-blue-700">Leer artículo completo</span>
                      </div>
                      <ChevronRight size={18} className="text-blue-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-blue-600/80 leading-tight ml-7">
                      En este artículo científico se muestran todas las demostraciones y estudios estadísticos sobre la eficacia didáctica de este método
                    </p>
                  </a>
                </div>
              </div>

              {/* Practice Card */}
              <div className={`${theme.card} p-8 flex flex-col`}>
                <div className={`w-14 h-14 ${isKids ? 'bg-pink-400/20 text-pink-400' : 'bg-emerald-400/20 text-emerald-400'} rounded-2xl flex items-center justify-center mb-6`}>
                  <PlayCircle size={28} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${theme.textColor}`}>{isKids ? '¡A Jugar!' : 'Practicar Ejercicios'}</h3>
                
                <p className={`${theme.secondaryText} mb-8 flex-1 min-h-[160px] md:min-h-[140px]`}>
                  <Typewriter 
                    text={isKids 
                      ? 'Resuelve retos divertidos con caramelos, juguetes y amigos.' 
                      : 'Pon a prueba tus conocimientos con problemas reales diseñados para tu nivel.'} 
                  />
                </p>
                <div className="space-y-3">
                  <motion.button 
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        isKids ? "0 10px 25px -3px rgba(244, 114, 182, 0.4)" : "0 10px 25px -3px rgba(16, 185, 129, 0.3)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    onClick={() => {
                      setPracticeView('HELP_ME');
                      setView('HELP_ME');
                    }}
                    className={`w-full flex items-center justify-between p-4 ${theme.button} ${isKids ? 'bg-pink-50 border-pink-200 hover:border-pink-400/50' : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400/50'} border transition-all group`}
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb size={18} className={`${isKids ? 'text-pink-400' : 'text-emerald-400'} group-hover:text-emerald-600`} />
                      <span className={`font-bold ${theme.textColor}`}>Ayúdame con mi ejercicio</span>
                    </div>
                    <ChevronRight size={18} className={`${theme.secondaryText} opacity-50 group-hover:opacity-100`} />
                  </motion.button>

                  <button 
                    onClick={() => {
                      setPracticeView('PRACTICE');
                      setView('HELP_ME');
                    }}
                    className={`w-full py-5 ${theme.button} ${isKids ? 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900'} text-white font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <Calculator size={24} />
                    {isKids ? '¡Nuevos ejercicios!' : 'Nuevos ejercicios'}
                  </button>

                  <button 
                    onClick={() => {
                      setView('CHALLENGE');
                    }}
                    className={`w-full py-5 ${theme.button} ${isKids ? 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700' : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black'} text-white font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden`}
                  >
                    <Castle size={24} />
                    {isKids ? '¡Desafío diario!' : 'Desafío diario'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {(view === 'THEORY' || view === 'EXERCISE' || view === 'SOLUTION') && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={theme.card}
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <span className={`px-4 py-1.5 ${theme.accent} rounded-full text-sm font-bold uppercase tracking-widest`}>
                    {view === 'THEORY' ? 'Teoría' : view === 'EXERCISE' ? 'Ejercicio' : view === 'HELP_ME' ? 'Ayuda Personalizada' : 'Solución'}
                  </span>
                  {view === 'EXERCISE' && !isLoading && (
                    <button 
                      onClick={loadSolution}
                      className={`flex items-center gap-2 ${theme.primaryText} font-bold hover:underline disabled:opacity-50`}
                    >
                      {isKids ? 'Ver Respuesta' : 'Ver Solución'} <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-8">
                    <div className="w-full max-w-md space-y-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                          <p className={`${theme.primaryText} font-bold italic text-lg`}>
                            {isKids ? '¡Preparando la magia! ✨' : loadingMessages[loadingMessageIndex]}
                          </p>
                          <span className={`text-sm font-mono ${theme.secondaryText}`}>{Math.round(loadingProgress)}%</span>
                        </div>
                        <div className={`w-full h-4 ${theme.mutedBg} rounded-full overflow-hidden border ${theme.borderColor} shadow-inner`}>
                          <motion.div 
                            className={`h-full ${theme.primary}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                          />
                        </div>
                      </div>
                      <p className="text-center text-sm text-slate-400 italic animate-pulse">
                        {isKids ? 'Esto puede tardar un poquito, ¡ten paciencia!' : 'La IA está procesando tu problema. Esto puede tardar hasta 40 segundos.'}
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="py-20 text-center">
                    <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                    <p className="text-red-600 font-bold">{error}</p>
                    <button onClick={() => setView('DASHBOARD')} className={`mt-6 ${theme.primaryText} underline`}>Volver al panel</button>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed">
                    {view === 'THEORY' && theoryStep <= THEORY_STEPS.length ? (
                      <div className={theoryStep === 9 ? "space-y-2" : "space-y-6"}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-10 h-10 rounded-full ${theme.primary} text-white flex items-center justify-center font-bold shadow-md`}>
                            {theoryStep}
                          </div>
                          <h3 className={`text-2xl font-bold ${theme.primaryText}`}>
                            {isKids ? 'Paso Mágico' : (
                              theoryStep === 1 ? "Acaba con la intuición de la regla de tres" :
                              theoryStep === 2 ? "Recursos = trabajo" :
                              theoryStep === 3 ? "¿Qué es una díada?" :
                              theoryStep === 4 ? "¿Ya distingues las díadas?" :
                              theoryStep === 5 ? "¿Díada homogénea o heterogénea?" :
                              theoryStep === 6 ? "¿Y en nuestro ejemplo?" :
                              theoryStep === 7 ? "Enunciado y pregunta" :
                              theoryStep === 8 ? "Igualdades para enunciado y pregunta" :
                              theoryStep === 9 ? "Dividiendo igualdades" :
                              theoryStep === 10 ? "Simplificación de magnitudes" :
                              theoryStep === 11 ? "¡Resultado final!" : "Concepto Clave"
                            )}
                          </h3>
                        </div>

                        {!(THEORY_STEPS[theoryStep - 1].type === 'GEOMETRIC_ALGEBRA' || THEORY_STEPS[theoryStep - 1].type === 'HETEROGENEOUS_EXAMPLE') && (
                          <AnimatePresence>
                            {(THEORY_STEPS[theoryStep - 1].type !== 'DIVISION' || resolutionPhase === 'TEXT') && (
                              <motion.div 
                                initial={THEORY_STEPS[theoryStep - 1].type === 'DIVISION' ? { opacity: 0, y: -20 } : false}
                                animate={{ opacity: 1, y: 0 }}
                                className={`${[9, 11].includes(theoryStep) ? 'p-4 min-h-[80px]' : 'p-8 min-h-[200px]'} rounded-3xl ${theme.mutedBg} border ${theme.borderColor} relative overflow-hidden`}
                              >
                                {isKids && <FloatingIcons />}
                                <div className={`whitespace-pre-wrap ${isKids ? 'text-xl' : 'text-xl'} leading-relaxed ${theme.textColor} relative z-10`}>
                                {THEORY_STEPS[theoryStep - 1].type !== 'RESOLUTION' && (
                                  <Typewriter 
                                    key={theoryStep}
                                    text={THEORY_STEPS[theoryStep - 1].content as string} 
                                    onComplete={() => {
                                      if (!THEORY_STEPS[theoryStep - 1].type) {
                                        setShowSuccess(true);
                                      }
                                      if (THEORY_STEPS[theoryStep - 1].type === 'CANCELLATION') {
                                        // No longer auto-crossing here, handled by button
                                      }
                                    }}
                                  />
                                )}
                                </div>
                                <div className={`absolute -right-4 -bottom-4 opacity-5 ${theme.primaryText}`}>
                                  <BookOpen size={120} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {THEORY_STEPS[theoryStep - 1].type === 'GEOMETRIC_ALGEBRA' || THEORY_STEPS[theoryStep - 1].type === 'HETEROGENEOUS_EXAMPLE' ? (
                          <div className="space-y-8">
                            <div className={`p-8 rounded-3xl ${theme.mutedBg} border ${theme.borderColor} relative overflow-hidden min-h-[200px]`}>
                              {isKids && <FloatingIcons />}
                              <div className={`whitespace-pre-wrap ${isKids ? 'text-xl' : 'text-xl'} leading-relaxed ${theme.textColor} relative z-10`}>
                                {THEORY_STEPS[theoryStep - 1].type === 'HETEROGENEOUS_EXAMPLE' ? (
                                  <Typewriter 
                                    key={`${theoryStep}-part2`}
                                    text={(THEORY_STEPS[theoryStep - 1].content as string[])[geometricSubStep - 1]} 
                                    onComplete={() => setShowSuccess(true)}
                                    onProgress={(p) => setTypewriterProgress(p)}
                                  />
                                ) : (
                                  <Typewriter 
                                    key={`${theoryStep}-${geometricSubStep}`}
                                    text={Array.isArray(THEORY_STEPS[theoryStep - 1].content) 
                                      ? (THEORY_STEPS[theoryStep - 1].content as string[])[geometricSubStep - 1] 
                                      : THEORY_STEPS[theoryStep - 1].content as string} 
                                    onComplete={() => setShowSuccess(true)}
                                    onProgress={(p) => setTypewriterProgress(p)}
                                  />
                                )}
                              </div>
                              <div className={`absolute -right-4 -bottom-4 opacity-5 ${theme.primaryText}`}>
                                <BookOpen size={120} />
                              </div>
                            </div>
                            
                            {(!(THEORY_STEPS[theoryStep - 1].type === 'HETEROGENEOUS_EXAMPLE' && geometricSubStep === 1)) && (
                              <div className={`flex justify-center items-center h-[280px] ${theme.mutedBg} rounded-3xl border ${theme.borderColor} overflow-hidden relative`}>
                                <svg width="100%" height="100%" viewBox="0 0 600 280" className="max-w-full">
                                  {THEORY_STEPS[theoryStep - 1].type === 'GEOMETRIC_ALGEBRA' ? (
                                  <AnimatePresence>
                                    {geometricSubStep >= 1 && (
                                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {/* Segment 1 */}
                                        <motion.line 
                                          x1="50" y1="65" 
                                          x2="200" y2="65" 
                                          stroke="#5A5A40" strokeWidth="6" strokeLinecap="round"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 1 }}
                                        />
                                        <motion.line x1="50" y1="55" x2="50" y2="75" stroke={isKids ? '#fb923c' : '#5A5A40'} strokeWidth="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                                        <motion.line x1="200" y1="55" x2="200" y2="75" stroke={isKids ? '#fb923c' : '#5A5A40'} strokeWidth="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
                                        
                                        <motion.text 
                                          x="125" y="45" 
                                          textAnchor="middle" className={`font-bold ${isKids ? 'fill-orange-400' : 'fill-[#5A5A40]'}`}
                                          style={{ fontSize: '20px' }}
                                          initial={{ opacity: 0 }}
                                          animate={geometricSubStep === 1 && typewriterProgress < 250 ? { opacity: 1 } : { opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          metro de largo
                                        </motion.text>
                                      </motion.g>
                                    )}
                                    
                                    {geometricSubStep >= 1 && (
                                      <motion.g>
                                        {/* Segment 2 */}
                                        <motion.line 
                                          x1="200" y1="65" 
                                          x2="350" y2="65" 
                                          stroke="#5A5A40" strokeWidth="6" strokeLinecap="round"
                                          initial={{ opacity: 0, x: 50 }}
                                          animate={geometricSubStep === 1 && typewriterProgress > 180 ? { opacity: 1, x: 0 } : (geometricSubStep > 1 ? { opacity: 1, x: 0 } : { opacity: 0 })}
                                          transition={{ duration: 0.5 }}
                                        />
                                        <motion.line 
                                          x1="350" y1="55" x2="350" y2="75" stroke={isKids ? '#fb923c' : '#5A5A40'} strokeWidth="3" 
                                          initial={{ opacity: 0 }} 
                                          animate={geometricSubStep === 1 && typewriterProgress > 180 ? { opacity: 1 } : (geometricSubStep > 1 ? { opacity: 1 } : { opacity: 0 })} 
                                          transition={{ delay: 0.2 }} 
                                        />
                                        <motion.text 
                                          x="275" y="45" 
                                          textAnchor="middle" className={`font-bold ${isKids ? 'fill-orange-400' : 'fill-[#5A5A40]'}`}
                                          style={{ fontSize: '20px' }}
                                          initial={{ opacity: 0 }}
                                          animate={geometricSubStep === 1 && typewriterProgress > 180 && typewriterProgress < 250 ? { opacity: 1 } : { opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          metro de largo
                                        </motion.text>
                                        
                                        {/* Segment 3 */}
                                        <motion.line 
                                          x1="350" y1="65" 
                                          x2="500" y2="65" 
                                          stroke="#5A5A40" strokeWidth="6" strokeLinecap="round"
                                          initial={{ opacity: 0, x: 100 }}
                                          animate={geometricSubStep === 1 && typewriterProgress > 220 ? { opacity: 1, x: 0 } : (geometricSubStep > 1 ? { opacity: 1, x: 0 } : { opacity: 0 })}
                                          transition={{ duration: 0.5 }}
                                        />
                                        <motion.line 
                                          x1="500" y1="55" x2="500" y2="75" stroke={isKids ? '#fb923c' : '#5A5A40'} strokeWidth="3" 
                                          initial={{ opacity: 0 }} 
                                          animate={geometricSubStep === 1 && typewriterProgress > 220 ? { opacity: 1 } : (geometricSubStep > 1 ? { opacity: 1 } : { opacity: 0 })} 
                                          transition={{ delay: 0.2 }} 
                                        />
                                        <motion.text 
                                          x="425" y="45" 
                                          textAnchor="middle" className={`font-bold ${isKids ? 'fill-orange-400' : 'fill-[#5A5A40]'}`}
                                          style={{ fontSize: '20px' }}
                                          initial={{ opacity: 0 }}
                                          animate={geometricSubStep === 1 && typewriterProgress > 220 && typewriterProgress < 250 ? { opacity: 1 } : { opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          metro de largo
                                        </motion.text>

                                        {/* Final combined label */}
                                        <motion.text 
                                          x="275" y="45" 
                                          textAnchor="middle" className={`font-bold ${isKids ? 'fill-orange-400' : 'fill-[#5A5A40]'}`}
                                          style={{ fontSize: '20px' }}
                                          initial={{ opacity: 0 }}
                                          animate={geometricSubStep === 1 && typewriterProgress >= 250 ? { opacity: 1 } : (geometricSubStep > 1 ? { opacity: 1 } : { opacity: 0 })}
                                          transition={{ duration: 0.8, ease: "easeInOut" }}
                                        >
                                          3 metros de largo
                                        </motion.text>
                                      </motion.g>
                                    )}

                                    {geometricSubStep === 2 && (
                                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <motion.line 
                                          x1="50" y1="65" 
                                          x2="50" y2="215" 
                                          stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"
                                          initial={{ pathLength: 0 }}
                                          animate={typewriterProgress > 60 ? { pathLength: 1 } : { pathLength: 0 }}
                                          transition={{ duration: 1 }}
                                        />
                                        <motion.line x1="40" y1="215" x2="60" y2="215" stroke="#3b82f6" strokeWidth="3" initial={{ opacity: 0 }} animate={typewriterProgress > 100 ? { opacity: 1 } : { opacity: 0 }} />
                                        
                                        <motion.text 
                                          x="35" y="140" 
                                          textAnchor="middle" className="font-bold fill-[#3b82f6]"
                                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '20px' }}
                                          initial={{ opacity: 0 }}
                                          animate={typewriterProgress > 80 ? { opacity: 1 } : { opacity: 0 }}
                                          transition={{ delay: 0.5 }}
                                        >
                                          metro de ancho
                                        </motion.text>

                                        {typewriterProgress > 250 && (
                                          <motion.rect 
                                            x="50" y="65" width="450" height="150"
                                            fill="#F27D26" fillOpacity="0.2"
                                            stroke="#F27D26" strokeWidth="2" strokeDasharray="4 4"
                                            initial={{ opacity: 0, scaleY: 0 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            style={{ transformOrigin: 'top' }}
                                            transition={{ duration: 1 }}
                                          />
                                        )}
                                        {typewriterProgress > 280 && (
                                          <motion.text 
                                            x="275" y="150" 
                                            textAnchor="middle" className="font-black fill-[#F27D26]"
                                            style={{ fontSize: '32px' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                          >
                                            SUPERFICIE
                                          </motion.text>
                                        )}
                                      </motion.g>
                                    )}
                                  </AnimatePresence>
                                ) : (
                                  <AnimatePresence>
                                    {geometricSubStep === 2 && (
                                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {/* Horizontal side: Tiempo */}
                                        <motion.line 
                                          x1="150" y1="100" x2="450" y2="100" 
                                          stroke="#5A5A40" strokeWidth="6" strokeLinecap="round"
                                          initial={{ pathLength: 0 }}
                                          animate={typewriterProgress > 50 ? { pathLength: 1 } : { pathLength: 0 }}
                                          transition={{ duration: 1 }}
                                        />
                                        <motion.text 
                                          x="300" y="80" textAnchor="middle" className="font-bold fill-[#5A5A40]"
                                          style={{ fontSize: '24px' }}
                                          initial={{ opacity: 0 }}
                                          animate={typewriterProgress > 80 ? { opacity: 1 } : { opacity: 0 }}
                                        >
                                          tiempo
                                        </motion.text>

                                        {/* Vertical side: n.º de obreros */}
                                        <motion.line 
                                          x1="150" y1="100" x2="150" y2="250" 
                                          stroke="#2563eb" strokeWidth="6" strokeLinecap="round"
                                          initial={{ pathLength: 0 }}
                                          animate={typewriterProgress > 120 ? { pathLength: 1 } : { pathLength: 0 }}
                                          transition={{ duration: 1 }}
                                        />
                                        <motion.text 
                                          x="130" y="175" textAnchor="middle" className="font-bold fill-[#2563eb]"
                                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '24px' }}
                                          initial={{ opacity: 0 }}
                                          animate={typewriterProgress > 150 ? { opacity: 1 } : { opacity: 0 }}
                                        >
                                          n.º de obreros
                                        </motion.text>

                                        {/* Area: muro */}
                                        <motion.rect 
                                          x="150" y="100" width="300" height="150"
                                          fill="#F27D26" fillOpacity="0.2"
                                          stroke="#F27D26" strokeWidth="2" strokeDasharray="4 4"
                                          initial={{ opacity: 0, scaleY: 0 }}
                                          animate={typewriterProgress > 250 ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
                                          style={{ transformOrigin: 'top' }}
                                          transition={{ duration: 1 }}
                                        />
                                        <motion.text 
                                          x="300" y="185" textAnchor="middle" className="font-black fill-[#F27D26]"
                                          style={{ fontSize: '32px' }}
                                          initial={{ opacity: 0 }}
                                          animate={typewriterProgress > 300 ? { opacity: 1 } : { opacity: 0 }}
                                        >
                                          muro
                                        </motion.text>
                                      </motion.g>
                                    )}
                                  </AnimatePresence>
                                )}
                              </svg>
                            </div>
                            )}

                            <div className="flex justify-center">
                              {showSuccess && (
                                <button
                                  onClick={() => {
                                    if (geometricSubStep === 1) {
                                      setGeometricSubStep(2);
                                      setShowSuccess(false);
                                      setTypewriterProgress(0);
                                    } else {
                                      loadTheory('Introducción teórica', theoryStep);
                                    }
                                  }}
                                  className={`px-10 py-3 ${theme.primary} text-white font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg`}
                                >
                                  {geometricSubStep === 1 ? 'Seguir' : THEORY_STEPS[theoryStep - 1].buttonText}
                                  <ChevronRight size={24} className={isKids ? 'text-white' : 'text-[#121212]'} />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {THEORY_STEPS[theoryStep - 1].type === 'INTERACTIVE' ? (
                              <div className="space-y-6">
                                <div className={`p-8 rounded-3xl ${isKids ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-[#F5F5F0] border border-[#5A5A40]/10'} shadow-inner`}>
                                  <p className="text-xl font-medium leading-relaxed text-gray-900">
                                {(() => {
                                  const text = THEORY_STEPS[theoryStep - 1].problemText!;
                                  const diadas = THEORY_STEPS[theoryStep - 1].diadas!;
                                  
                                  // Simple way to make diadas clickable
                                  let parts: React.ReactNode[] = [text];
                                  
                                  diadas.forEach(diada => {
                                    const newParts: React.ReactNode[] = [];
                                    parts.forEach(part => {
                                      if (typeof part === 'string') {
                                        const split = part.split(diada);
                                        split.forEach((s, i) => {
                                          newParts.push(s);
                                          if (i < split.length - 1) {
                                            const isSelected = selectedDiadas.includes(diada);
                                            newParts.push(
                                              <button
                                                key={`${diada}-${i}`}
                                                onClick={() => {
                                                  if (!isSelected) {
                                                    const newSelected = [...selectedDiadas, diada];
                                                    setSelectedDiadas(newSelected);
                                                    if (newSelected.length === diadas.length) {
                                                      setShowSuccess(true);
                                                      setTimeout(() => {
                                                        loadTheory('Introducción teórica', theoryStep);
                                                      }, 3000);
                                                    }
                                                  }
                                                }}
                                                className={`px-1 rounded transition-all ${
                                                  isSelected 
                                                    ? 'bg-green-500 text-white shadow-sm font-bold' 
                                                    : 'bg-transparent hover:bg-slate-100 text-slate-800 cursor-pointer font-normal'
                                                } mx-0.5`}
                                              >
                                                {diada}
                                              </button>
                                            );
                                          }
                                        });
                                      } else {
                                        newParts.push(part);
                                      }
                                    });
                                    parts = newParts;
                                  });
                                  
                                  return parts;
                                })()}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className={`text-base font-bold ${theme.primaryText} flex items-center gap-2`}>
                                <Lightbulb size={18} className="text-orange-400" />
                                {isKids ? 'Díadas por encontrar:' : 'Díadas pendientes:'} <span className="text-xl">{THEORY_STEPS[theoryStep - 1].diadas!.length - selectedDiadas.length}</span>
                              </p>
                              
                              {showSuccess && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-2 text-green-600 font-bold"
                                >
                                  <CheckCircle2 size={20} />
                                  <span>{isKids ? '¡Increíble! ¡Lo has pillado!' : '¡Enhorabuena! Lo has entendido.'}</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        ) : THEORY_STEPS[theoryStep - 1].type === 'IDENTIFY_PARTS' ? (
                          <div className="space-y-6">
                            <div className={`p-8 rounded-3xl ${isKids ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-[#F5F5F0] border border-[#5A5A40]/10'} shadow-inner`}>
                              <p className="text-xl font-medium leading-relaxed text-gray-900">
                                {(() => {
                                  const stepData = THEORY_STEPS[theoryStep - 1];
                                  const text = stepData.problemText!;
                                  const parts = stepData.parts!;
                                  
                                  let result: React.ReactNode[] = [text];
                                  
                                  parts.forEach((part: any, partIdx: number) => {
                                    const newResult: React.ReactNode[] = [];
                                    result.forEach(item => {
                                      if (typeof item === 'string') {
                                        const split = item.split(part.text);
                                        split.forEach((s, i) => {
                                          newResult.push(s);
                                          if (i < split.length - 1) {
                                            const isSelected = selectedDiadas.includes(part.text);
                                            newResult.push(
                                              <button
                                                key={`part-${partIdx}-${i}`}
                                                onClick={() => {
                                                  if (!isSelected) {
                                                    const newSelected = [...selectedDiadas, part.text];
                                                    setSelectedDiadas(newSelected);
                                                    if (newSelected.length === parts.length) {
                                                      setShowSuccess(true);
                                                    }
                                                  }
                                                }}
                                                className={`px-2 py-1 rounded-xl transition-all relative group ${
                                                  isSelected 
                                                    ? 'bg-blue-500 text-white shadow-md font-bold' 
                                                    : 'bg-white/50 hover:bg-blue-100 text-slate-800 cursor-pointer border border-blue-200/30'
                                                } mx-1 my-1`}
                                              >
                                                {part.text}
                                                {isSelected && (
                                                  <motion.span 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm"
                                                  >
                                                    {part.label}
                                                  </motion.span>
                                                )}
                                              </button>
                                            );
                                          }
                                        });
                                      } else {
                                        newResult.push(item);
                                      }
                                    });
                                    result = newResult;
                                  });
                                  
                                  return result;
                                })()}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {THEORY_STEPS[theoryStep - 1].parts!.map((part: any, idx: number) => {
                                const isSelected = selectedDiadas.includes(part.text);
                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className={`p-4 rounded-2xl border-2 transition-all ${
                                      isSelected 
                                        ? 'bg-blue-50 border-blue-400 shadow-md' 
                                        : 'bg-white border-slate-100 opacity-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {idx + 1}
                                      </div>
                                      <h4 className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>{part.label}</h4>
                                    </div>
                                    <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                      {part.description}
                                    </p>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {showSuccess && (
                              <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-green-50 border-2 border-green-200 rounded-3xl flex items-center gap-4"
                              >
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                  <CheckCircle2 size={24} />
                                </div>
                                <div>
                                  <p className="font-bold text-green-800 text-lg">¡Excelente identificación!</p>
                                  <p className="text-green-700">Has separado correctamente los datos conocidos de la incógnita.</p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ) : THEORY_STEPS[theoryStep - 1].type === 'EQUALITY' ? (
                          <div className="space-y-8">
                            <div className={`p-8 rounded-3xl ${isKids ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-[#F5F5F0] border border-[#5A5A40]/10'} shadow-inner`}>
                              <p className="text-xl font-medium leading-relaxed text-gray-900">
                                {(() => {
                                  const text = THEORY_STEPS[theoryStep - 1].problemText!;
                                  const diadas = THEORY_STEPS[theoryStep - 1].diadas!;
                                  let parts: React.ReactNode[] = [text];
                                  
                                  diadas.forEach(diada => {
                                    const newParts: React.ReactNode[] = [];
                                    parts.forEach(part => {
                                      if (typeof part === 'string') {
                                        const split = part.split(diada);
                                        split.forEach((s, i) => {
                                          newParts.push(s);
                                          if (i < split.length - 1) {
                                            const isUsedInEnunciado = equalityState.enunciado.recursos.includes(diada) || equalityState.enunciado.trabajo.includes(diada);
                                            const isUsedInPregunta = equalityState.pregunta.recursos.includes(diada) || equalityState.pregunta.trabajo.includes(diada);
                                            const isUsed = isUsedInEnunciado && isUsedInPregunta;
                                            const isSelected = selectedDiadaToClassify === diada;
                                            
                                            newParts.push(
                                              <button
                                                key={`${diada}-${i}`}
                                                onClick={() => !isUsed && setSelectedDiadaToClassify(diada)}
                                                className={`px-1 rounded transition-all ${
                                                  isUsed 
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                    : isSelected
                                                      ? 'bg-blue-600 text-white shadow-md scale-110'
                                                      : 'bg-white border border-slate-300 text-slate-800 hover:border-blue-400 cursor-pointer'
                                                } font-bold mx-0.5`}
                                              >
                                                {diada}
                                              </button>
                                            );
                                          }
                                        });
                                      } else {
                                        newParts.push(part);
                                      }
                                    });
                                    parts = newParts;
                                  });
                                  return parts;
                                })()}
                              </p>
                            </div>

                            <div className="space-y-8">
                              {/* Pregunta first as requested */}
                              {(['PREGUNTA', 'ENUNCIADO'] as const).map((part) => (
                                <div key={part} className="space-y-4">
                                  <h4 className={`text-xl font-bold ${theme.primaryText}`}>
                                    {part === 'ENUNCIADO' ? 'Proporción del enunciado' : 'Proporción de la pregunta'}
                                  </h4>
                                  <div className={`p-8 rounded-3xl border-2 ${part === 'ENUNCIADO' ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'} transition-all`}>
                                    <div className="flex flex-wrap items-center justify-center gap-3 text-2xl font-bold">
                                      {/* Recursos Box */}
                                      <div 
                                        onClick={() => {
                                          if (selectedDiadaToClassify) {
                                            const stepData = THEORY_STEPS[theoryStep - 1];
                                            const correctData = part === 'ENUNCIADO' ? stepData.enunciado! : stepData.pregunta!;
                                            if (correctData.recursos.includes(selectedDiadaToClassify)) {
                                              setEqualityState(prev => ({
                                                ...prev,
                                                [part.toLowerCase()]: {
                                                  ...prev[part.toLowerCase() as 'enunciado' | 'pregunta'],
                                                  recursos: [...prev[part.toLowerCase() as 'enunciado' | 'pregunta'].recursos, selectedDiadaToClassify]
                                                }
                                              }));
                                              setSelectedDiadaToClassify(null);
                                              setClassificationError(null);
                                            } else {
                                              setClassificationError(`Esta díada no es un recurso del ${part.toLowerCase()}.`);
                                            }
                                          }
                                        }}
                                        className={`flex flex-wrap gap-2 p-3 ${theme.mutedBg} rounded-xl border-2 border-dashed min-w-[150px] justify-center transition-all ${selectedDiadaToClassify ? 'border-blue-400 cursor-pointer hover:bg-blue-500/10' : 'border-slate-200'}`}
                                      >
                                        {equalityState[part.toLowerCase() as 'enunciado' | 'pregunta'].recursos.length > 0 ? (
                                          equalityState[part.toLowerCase() as 'enunciado' | 'pregunta'].recursos.map((d, i) => (
                                            <span key={`${d}-${i}`} className="flex items-center">
                                              {i > 0 && <span className="mx-2 text-slate-300"> * </span>}
                                              <span className="text-blue-600">({d})</span>
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-slate-300 text-base italic font-normal">Haz clic aquí para colocar Recursos</span>
                                        )}
                                      </div>
                                      
                                      <span className="text-2xl text-slate-300">=</span>
                                      
                                      {/* Trabajo Box */}
                                      <div 
                                        onClick={() => {
                                          if (selectedDiadaToClassify) {
                                            const stepData = THEORY_STEPS[theoryStep - 1];
                                            const correctData = part === 'ENUNCIADO' ? stepData.enunciado! : stepData.pregunta!;
                                            if (correctData.trabajo.includes(selectedDiadaToClassify)) {
                                              setEqualityState(prev => ({
                                                ...prev,
                                                [part.toLowerCase()]: {
                                                  ...prev[part.toLowerCase() as 'enunciado' | 'pregunta'],
                                                  trabajo: [...prev[part.toLowerCase() as 'enunciado' | 'pregunta'].trabajo, selectedDiadaToClassify]
                                                }
                                              }));
                                              setSelectedDiadaToClassify(null);
                                              setClassificationError(null);
                                            } else {
                                              setClassificationError(`Esta díada no es el trabajo del ${part.toLowerCase()}.`);
                                            }
                                          }
                                        }}
                                        className={`flex flex-wrap gap-2 p-3 ${theme.mutedBg} rounded-xl border-2 border-dashed min-w-[100px] justify-center transition-all ${selectedDiadaToClassify ? 'border-green-400 cursor-pointer hover:bg-green-500/10' : 'border-slate-200'}`}
                                      >
                                        {equalityState[part.toLowerCase() as 'enunciado' | 'pregunta'].trabajo.length > 0 ? (
                                          equalityState[part.toLowerCase() as 'enunciado' | 'pregunta'].trabajo.map((d, i) => (
                                            <span key={`${d}-${i}`} className="flex items-center">
                                              {i > 0 && <span className="mx-2 text-slate-300"> * </span>}
                                              <span className="text-purple-600">({d})</span>
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-slate-300 text-base italic font-normal">Haz clic aquí para colocar Trabajo</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {classificationError && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
                              >
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-red-700 text-sm">{classificationError}</p>
                              </motion.div>
                            )}

                            {(() => {
                              const stepData = THEORY_STEPS[theoryStep - 1];
                              const isEnunciadoDone = equalityState.enunciado.recursos.length === stepData.enunciado!.recursos.length && 
                                                     equalityState.enunciado.trabajo.length === stepData.enunciado!.trabajo.length;
                              const isPreguntaDone = equalityState.pregunta.recursos.length === stepData.pregunta!.recursos.length && 
                                                    equalityState.pregunta.trabajo.length === stepData.pregunta!.trabajo.length;
                              
                              if (isEnunciadoDone && isPreguntaDone && !showSuccess) {
                                setShowSuccess(true);
                                setTimeout(() => {
                                  loadTheory('Introducción teórica', theoryStep);
                                }, 3000);
                              }
                              
                              return null;
                            })()}

                            {showSuccess && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-green-50 border border-green-200 rounded-3xl flex flex-col items-center gap-2 text-green-700"
                              >
                                <CheckCircle2 size={32} />
                                <p className="text-xl font-bold">{isKids ? '¡Las frases mágicas son perfectas!' : '¡Igualdades planteadas correctamente!'}</p>
                              </motion.div>
                            )}
                          </div>
                         ) : THEORY_STEPS[theoryStep - 1].type === 'CANCELLATION' ? (
                          <div className="space-y-6 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-12 w-full mt-8">
                              {/* Left Fraction */}
                              <div className="flex flex-col items-center gap-2">
                                {/* Numerator */}
                                <div className="text-2xl font-bold flex items-center gap-1">
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-4" transition={{ duration: 3 }} className="font-bold text-2xl">4</motion.span>
                                    <Magnitude text="obreros" step={cancellationState} />
                                  </div>
                                  <Operator step={cancellationState} id="op-1" />
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-7" transition={{ duration: 3 }} className="font-bold text-2xl">7</motion.span>
                                    <Magnitude text="horas diarias" step={cancellationState} />
                                  </div>
                                  <Operator step={cancellationState} id="op-2" />
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-x" transition={{ duration: 3 }} className="font-bold text-2xl">x</motion.span>
                                    <Magnitude text="días" step={cancellationState} />
                                  </div>
                                </div>

                                {/* Fraction Bar */}
                                <div className="flex flex-col gap-1 w-full">
                                  <motion.div 
                                    layoutId="fraction-bar-left"
                                    className="h-[1px] bg-slate-800 w-full rounded-full"
                                  />
                                  {cancellationState < 5 && (
                                    <motion.div 
                                      layoutId="fraction-bar-left-2"
                                      className="h-[1px] bg-slate-800 w-full rounded-full" 
                                    />
                                  )}
                                </div>

                                {/* Denominator */}
                                <div className="text-2xl font-bold flex items-center gap-1">
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-5" transition={{ duration: 3 }} className="font-bold text-2xl">5</motion.span>
                                    <Magnitude text="obreros" step={cancellationState} />
                                  </div>
                                  <Operator step={cancellationState} id="op-3" />
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-6" transition={{ duration: 3 }} className="font-bold text-2xl">6</motion.span>
                                    <Magnitude text="horas diarias" step={cancellationState} />
                                  </div>
                                  <Operator step={cancellationState} id="op-4" />
                                  <div className="inline-flex items-baseline whitespace-nowrap">
                                    <motion.span layoutId="num-2" transition={{ duration: 3 }} className="font-bold text-2xl">2</motion.span>
                                    <Magnitude text="días" step={cancellationState} />
                                  </div>
                                </div>
                              </div>

                              {/* Equals Sign */}
                              <motion.div layoutId="equals-sign" className="text-4xl font-bold">=</motion.div>

                              {/* Right Fraction */}
                              <div className="flex flex-col items-center gap-2">
                                {/* Numerator */}
                                <div className="text-2xl font-bold flex items-center gap-1">
                                  <motion.span layoutId="num-right-top" transition={{ duration: 3 }} className="font-bold text-2xl">1</motion.span>
                                  <Magnitude text="muro" step={cancellationState} />
                                </div>

                                {/* Fraction Bar */}
                                <div className="flex flex-col gap-1 w-full">
                                  <motion.div 
                                    layoutId="fraction-bar-right"
                                    className="h-[1px] bg-slate-800 w-full rounded-full"
                                  />
                                  {cancellationState < 5 && (
                                    <motion.div 
                                      layoutId="fraction-bar-right-2"
                                      className="h-[1px] bg-slate-800 w-full rounded-full" 
                                    />
                                  )}
                                </div>

                                {/* Denominator */}
                                <div className="text-2xl font-bold flex items-center gap-1">
                                  <motion.span layoutId="num-right-bottom" transition={{ duration: 3 }} className="font-bold text-2xl">1</motion.span>
                                  <Magnitude text="muro" step={cancellationState} />
                                </div>
                              </div>
                            </div>

                            <div className="mt-12">
                              {cancellationState === 0 && (
                                <button
                                  onClick={() => {
                                    setCancellationState(1);
                                    setTimeout(() => setCancellationState(2), 1000);
                                    setTimeout(() => setCancellationState(3), 2000);
                                    setTimeout(() => setCancellationState(4), 3000);
                                  }}
                                  className={`px-12 py-6 ${theme.primary} text-white font-bold rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-xl`}
                                >
                                  {THEORY_STEPS[theoryStep - 1].buttonText}
                                  <ChevronRight size={28} />
                                </button>
                              )}

                              {cancellationState === 4 && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() => setCancellationState(5)}
                                  className={`px-12 py-6 ${theme.primary} text-white font-bold rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-xl`}
                                >
                                  ¿Cómo queda?
                                  <ChevronRight size={28} />
                                </motion.button>
                              )}

                              {cancellationState === 5 && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() => {
                                    setShowSuccess(true);
                                    handleNextTheoryStep();
                                  }}
                                  className={`px-12 py-6 ${theme.primary} text-white font-bold rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-xl`}
                                >
                                  ¿Cuánto da?
                                  <ChevronRight size={28} />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        ) : THEORY_STEPS[theoryStep - 1].type === 'RESOLUTION' ? (
                          <div className="space-y-8 flex flex-col items-center py-8 w-full max-w-4xl">
                            <div className="w-full space-y-12">
                              {/* Step 1: Initial Equality */}
                              <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm"
                              >
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Igualdad Inicial</span>
                                <div className="flex items-center justify-center gap-8 scale-110">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="text-xl font-bold flex items-center gap-1">
                                      <span>4</span><span>·</span><span>7</span><span>·</span><span className="text-blue-600">x</span>
                                    </div>
                                    <div className="h-[1.5px] bg-slate-800 w-full" />
                                    <div className="text-xl font-bold flex items-center gap-1">
                                      <span>5</span><span>·</span><span>6</span><span>·</span><span>2</span>
                                    </div>
                                  </div>
                                  <div className="text-3xl font-bold">=</div>
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-xl font-bold">1</span>
                                    <div className="h-[1.5px] bg-slate-800 w-full" />
                                    <span className="text-xl font-bold">1</span>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Step 2: Denominator moves */}
                              {(resolutionPhase === 'STEP1' || resolutionPhase === 'STEP2' || resolutionPhase === 'RESULT' || resolutionPhase === 'TEXT') && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex flex-col items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100 shadow-sm"
                                >
                                  <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Paso 1: El denominador pasa multiplicando</span>
                                  <div className="flex items-center justify-center gap-8 scale-110">
                                    <div className="text-xl font-bold flex items-center gap-1">
                                      <span>4</span><span>·</span><span>7</span><span>·</span><span className="text-blue-600">x</span>
                                    </div>
                                    <div className="text-3xl font-bold">=</div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-xl font-bold">1</span>
                                        <div className="h-[1.5px] bg-slate-800 w-full" />
                                        <span className="text-xl font-bold">1</span>
                                      </div>
                                      <span className="text-2xl font-bold text-emerald-600">·</span>
                                      <div className="px-3 py-1 bg-emerald-100 rounded-lg border border-emerald-200 text-emerald-700 font-bold text-xl">
                                        5 · 6 · 2
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Step 3: Factors move */}
                              {(resolutionPhase === 'STEP2' || resolutionPhase === 'RESULT' || resolutionPhase === 'TEXT') && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex flex-col items-center gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm"
                                >
                                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Paso 2: Los factores de x pasan dividiendo</span>
                                  <div className="flex items-center justify-center gap-8 scale-110">
                                    <div className="text-4xl font-black text-blue-600">x</div>
                                    <div className="text-3xl font-bold">=</div>
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="text-xl font-bold flex items-center gap-1">
                                        <span className="text-slate-400">1 ·</span> <span className="text-emerald-600">5 · 6 · 2</span>
                                      </div>
                                      <div className="h-[2px] bg-slate-800 w-full" />
                                      <div className="text-xl font-bold flex items-center gap-1">
                                        <span className="text-slate-400">1 ·</span> <span className="text-blue-600">4 · 7</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Step 4: Result */}
                              {(resolutionPhase === 'RESULT' || resolutionPhase === 'TEXT') && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex flex-col items-center gap-6 p-8 bg-emerald-50 rounded-[3rem] border-4 border-emerald-500 shadow-xl"
                                >
                                  <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Resultado Final</span>
                                  <div className="flex items-center gap-8 text-7xl font-black text-emerald-700">
                                    <span>x</span>
                                    <span>=</span>
                                    <span className="bg-white px-10 py-4 rounded-3xl shadow-inner border-2 border-emerald-200">2,14</span>
                                  </div>
                                </motion.div>
                              )}

                              {resolutionPhase === 'TEXT' && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex flex-col items-center gap-8 pt-8 border-t border-slate-200"
                                >
                                  <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
                                    {(typeof THEORY_STEPS[theoryStep - 1].content === 'string' 
                                      ? (THEORY_STEPS[theoryStep - 1].content as string).split('\n\n') 
                                      : (THEORY_STEPS[theoryStep - 1].content as string[])
                                    ).map((text, idx) => (
                                      <motion.p 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 1.5 }}
                                        className={`${idx === 0 ? 'text-slate-600 font-medium text-xl' : 'text-emerald-700 font-bold text-2xl'} leading-relaxed`}
                                      >
                                        {text}
                                      </motion.p>
                                    ))}
                                  </div>
                                  <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 4 }}
                                    onClick={() => {
                                      setShowSuccess(true);
                                      handleNextTheoryStep();
                                    }}
                                    className={`px-16 py-8 ${theme.primary} text-white font-bold rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-2xl`}
                                  >
                                    {THEORY_STEPS[theoryStep - 1].buttonText}
                                    <ChevronRight size={32} />
                                  </motion.button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        ) : THEORY_STEPS[theoryStep - 1].type === 'DIVISION' ? (
                          <div className="space-y-6 flex flex-col items-center">
                            <div className="flex flex-col w-full max-w-5xl gap-0">
                              {/* Top Row */}
                              <div className="flex items-center justify-center gap-12">
                                <div className={`flex-1 text-xl leading-relaxed ${theme.textColor} py-1 text-center`}>
                                  <span className="font-bold text-2xl">4</span> obreros * <span className="font-bold text-2xl">7</span> horas diarias * <span className="font-bold text-2xl">x</span> días
                                </div>
                                {!isDivided ? (
                                  <div className="min-w-[40px] flex justify-center">
                                    <span className={`text-xl font-bold ${theme.textColor}`}>=</span>
                                  </div>
                                ) : (
                                  <div className="min-w-[40px]" />
                                )}
                                <div className={`flex-1 text-xl leading-relaxed ${theme.textColor} py-1 text-center`}>
                                  <span className="font-bold text-2xl">1</span> muro
                                </div>
                              </div>

                              {/* Middle Row (Fractions and Main Equals) */}
                              <div className="flex items-center justify-center gap-12 h-8">
                                <div className="flex-1 px-4">
                                  {isDivided && (
                                    <div className="flex flex-col gap-1">
                                      <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 5 }}
                                        className="h-[1px] bg-slate-800 w-full rounded-full"
                                      />
                                      <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 5 }}
                                        className="h-[1px] bg-slate-800 w-full rounded-full"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-[40px] flex justify-center">
                                  {isDivided && (
                                    <motion.span 
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 5 }}
                                      className={`text-xl font-bold ${theme.textColor}`}
                                    >
                                      =
                                    </motion.span>
                                  )}
                                </div>
                                <div className="flex-1 px-4">
                                  {isDivided && (
                                    <div className="flex flex-col gap-1">
                                      <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 5 }}
                                        className="h-[1px] bg-slate-800 w-full rounded-full"
                                      />
                                      <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 5 }}
                                        className="h-[1px] bg-slate-800 w-full rounded-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Bottom Row */}
                              <div className="flex items-center justify-center gap-12">
                                <div className={`flex-1 text-xl leading-relaxed ${theme.textColor} py-1 text-center`}>
                                  <span className="font-bold text-2xl">5</span> obreros * <span className="font-bold text-2xl">6</span> horas diarias * <span className="font-bold text-2xl">2</span> días
                                </div>
                                {!isDivided ? (
                                  <div className="min-w-[40px] flex justify-center">
                                    <span className={`text-xl font-bold ${theme.textColor}`}>=</span>
                                  </div>
                                ) : (
                                  <div className="min-w-[40px]" />
                                )}
                                <div className={`flex-1 text-xl leading-relaxed ${theme.textColor} py-1 text-center`}>
                                  <span className="font-bold text-2xl">1</span> muro
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-8">
                              <button
                                onClick={() => setShowSymbolExplanation(!showSymbolExplanation)}
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                ¿por qué * y //?
                              </button>

                              <AnimatePresence>
                                {showSymbolExplanation && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="max-w-md p-6 bg-white border-2 border-red-200 rounded-3xl text-left shadow-xl overflow-hidden"
                                  >
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                      Respetando la {renderTextWithLinks("Primera álgebra de magnitudes")} no podemos utilizar la misma simbología cuando operamos con magnitudes que con la aritmética tradicional, pues al operar con las dimensiones físicas lo estamos realizando de forma geométrica, como se ha explicado anteriormente. Por ello, la multiplicación de magnitudes se representa con un * y la división con doble línea //.
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {isDivided ? (
                               <motion.div 
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="text-center p-8 bg-green-50 border-2 border-green-200 rounded-[2.5rem] flex flex-col items-center gap-6 w-full"
                               >
                                 <div className="space-y-4">
                                   <p className="text-2xl font-bold text-green-700">¡La proporción está lista para resolverse!</p>
                                   <p className="text-lg text-green-600">Has unificado el problema en una única proporción de magnitudes.</p>
                                 </div>
                                 
                                 {animationComplete && (
                                   <motion.div 
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     className="flex flex-col items-center gap-8 w-full"
                                   >
                                     <button
                                       onClick={() => {
                                         setShowSuccess(true);
                                         handleNextTheoryStep();
                                       }}
                                       className={`px-12 py-6 ${theme.primary} text-white font-bold rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl flex items-center gap-4`}
                                     >
                                       Siguiente paso
                                       <ChevronRight size={28} />
                                     </button>
                                   </motion.div>
                                 )}
                               </motion.div>
                            ) : (
                              <button
                                onClick={() => {
                                  setIsDivided(true);
                                  setTimeout(() => setAnimationComplete(true), 5000);
                                }}
                                className={`px-12 py-6 ${theme.primary} text-white font-bold rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-xl mt-4`}
                              >
                                {THEORY_STEPS[theoryStep - 1].buttonText}
                                <ChevronRight size={28} />
                              </button>
                            )}
                          </div>
                        ) : null}

                        <div className="flex flex-col items-center gap-6 pt-8 border-t border-slate-100 w-full mt-auto">
                          <div className="flex justify-between items-center w-full">
                            <button
                              onClick={handlePreviousTheoryStep}
                              disabled={theoryStep === 1}
                              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${theoryStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                              <ArrowLeft size={20} />
                              Anterior
                            </button>

                            <div className="text-slate-400 font-medium">
                              Página {theoryStep} de {THEORY_STEPS.length}
                            </div>

                            <button
                              onClick={handleNextTheoryStep}
                              disabled={!showSuccess && [4, 5, 6, 7, 8, 9, 10, 11].includes(theoryStep)}
                              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${(!showSuccess && [4, 5, 6, 7, 8, 9, 10, 11].includes(theoryStep)) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                              Siguiente
                              <ChevronRight size={20} />
                            </button>
                          </div>

                          {showSuccess && ![9, 10, 11].includes(theoryStep) && (
                            <button
                              onClick={handleNextTheoryStep}
                              className={`px-10 py-5 ${theme.primary} text-white font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg`}
                            >
                              {THEORY_STEPS[theoryStep - 1].buttonText}
                              <ChevronRight size={24} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {solutionSteps.length > 0 && (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentSolutionStep + 1) / solutionSteps.length) * 100}%` }}
                          className={`h-full ${theme.primary}`}
                        />
                      </div>
                    )}
                    <div className={`whitespace-pre-wrap ${isKids ? 'text-xl' : 'text-2xl'} leading-relaxed ${theme.textColor}`}>
                      <Typewriter 
                        key={currentSolutionStep}
                        text={solutionSteps.length > 0 ? solutionSteps[currentSolutionStep] : (typeof content === 'string' ? content : '')} 
                        onComplete={() => setShowSuccess(true)}
                      />
                    </div>
                    
                    {solutionSteps.length > 0 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
                        <button
                          onClick={() => {
                            if (currentSolutionStep > 0) {
                              setCurrentSolutionStep(prev => prev - 1);
                              setShowSuccess(true);
                            }
                          }}
                          disabled={currentSolutionStep === 0}
                          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${currentSolutionStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          <ArrowLeft size={20} />
                          Anterior
                        </button>
                        
                        <div className="text-slate-400 font-medium order-first sm:order-none">
                          Página {currentSolutionStep + 1} de {solutionSteps.length}
                        </div>

                        {currentSolutionStep < solutionSteps.length - 1 ? (
                          <button
                            onClick={() => {
                              setCurrentSolutionStep(prev => prev + 1);
                              setShowSuccess(false);
                            }}
                            className={`px-8 py-3 ${theme.primary} text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center`}
                          >
                            Siguiente
                            <ChevronRight size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setView('DASHBOARD')}
                            className={`px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center`}
                          >
                            Finalizar
                            <CheckCircle2 size={20} />
                          </button>
                        )}
                      </div>
                    )}
                    
                    {view === 'THEORY' && theoryStep > THEORY_STEPS.length && !isLoading && (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleTheorySubmit}
                        className={`mt-10 pt-10 border-t ${theme.borderColor}`}
                      >
                        <p className={`text-base font-bold ${theme.primaryText} mb-3 uppercase tracking-widest`}>
                          {isKids ? '¡Tu turno! Escribe aquí:' : 'Tu respuesta:'}
                        </p>
                        <div className="relative">
                          <input
                            type="text"
                            value={theoryInput}
                            onChange={(e) => setTheoryInput(e.target.value)}
                            placeholder={isKids ? "Escribe tu respuesta mágica..." : "Responde a la IA..."}
                            className={`w-full ${theme.mutedBg} border ${theme.borderColor} rounded-2xl py-4 pl-6 pr-14 focus:ring-2 ${isKids ? 'focus:ring-orange-400' : 'focus:ring-[#D1D1C7]'} transition-all ${theme.textColor}`}
                          />
                          <button
                            type="submit"
                            className={`absolute right-2 top-2 bottom-2 w-10 ${theme.primary} text-white rounded-xl flex items-center justify-center`}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </div>
                )}
              </div>
            )}

            {view === 'SOLUTION' && !isLoading && (solutionSteps.length === 0 || (currentSolutionStep === solutionSteps.length - 1 && showSuccess)) && (
                  <div className={`mt-12 p-8 ${isKids ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'} rounded-[2rem] border flex items-start gap-4`}>
                    <CheckCircle2 className={`${isKids ? 'text-orange-500' : 'text-emerald-600'} mt-1 flex-shrink-0`} size={24} />
                    <div>
                      <h4 className={`font-bold ${isKids ? 'text-orange-700' : 'text-emerald-800'} mb-1`}>
                        {isKids ? '¡Genial! ¡Lo lograste! 🎈' : '¡Objetivo Cumplido!'}
                      </h4>
                      <p className={`${isKids ? 'text-orange-600/70' : 'text-emerald-700/70'} text-base`}>
                        <Typewriter 
                          text={isKids 
                            ? 'Has usado la magia de las magnitudes perfectamente.' 
                            : 'Has completado el análisis mediante el Método de la Primera álgebra de magnitudes.'} 
                        />
                      </p>
                      <button 
                        onClick={loadExercise}
                        className={`mt-4 px-6 py-2 ${isKids ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl font-bold transition-colors`}
                      >
                        {isKids ? '¡Otro Reto!' : 'Siguiente Ejercicio'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          <AnimatePresence>
            {view === 'HELP_ME' && (
              <ExerciseChat 
                onClose={() => setView('DASHBOARD')}
                isKids={isKids}
                theme={theme}
                initialMode={practiceView === 'PRACTICE' ? 'PRACTICE' : 'HELP'}
              />
            )}
            {view === 'RESOURCES_WORK_EXPLANATION' && (
              <ResourcesWorkExplanation 
                onBack={() => setView('DASHBOARD')}
                isKids={isKids}
              />
            )}
          </AnimatePresence>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Castle size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Desafío diario</p>
              <p className="text-sm text-slate-400">En desarrollo. ¡Próximamente disponible!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-8 text-center text-slate-400 text-base">
        <p>© 2026 IA de Daniel Arnaiz Boluda • {renderTextWithLinks("Método basado en la Primera álgebra de magnitudes")}</p>
        <p className="mt-1 uppercase tracking-[0.2em] text-sm font-bold text-slate-300">Recursos = Trabajo</p>
      </footer>
    </div>
  );
}
