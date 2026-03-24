import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Lightbulb, ArrowLeft, Loader2, Pin, RefreshCcw, Layout } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ExerciseChatProps {
  onClose: () => void;
  isKids: boolean;
  theme: any;
  initialMode?: 'HELP' | 'PRACTICE';
}

export const ExerciseChat: React.FC<ExerciseChatProps> = ({ 
  onClose, 
  isKids, 
  theme, 
  initialMode = 'HELP'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinnedProblem, setPinnedProblem] = useState<string | null>(null);
  const [pinnedEquation, setPinnedEquation] = useState<{ 
    num1: string, den1: string, divType1: 'none' | 'arithmetic' | 'geometric',
    num2: string, den2: string, divType2: 'none' | 'arithmetic' | 'geometric'
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isInteractiveBoxOpen, setIsInteractiveBoxOpen] = useState(false);
  const [equationInput, setEquationInput] = useState({
    left: { num: '', den: '', divType: 'none' as 'none' | 'arithmetic' | 'geometric' },
    right: { num: '', den: '', divType: 'none' as 'none' | 'arithmetic' | 'geometric' }
  });
  const [activeInput, setActiveInput] = useState<'left-num' | 'left-den' | 'right-num' | 'right-den'>('left-num');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    if (initialMode === 'PRACTICE') {
      setMessages([
        {
          role: 'model',
          text: '¡Hola! Vamos a practicar. Voy a proponerte un problema para que lo resolvamos juntos usando el método de Daniel Arnaiz Boluda.\n\nGenerando un ejercicio para ti...'
        }
      ]);
      
      // Trigger AI to generate a problem
      const generateProblem = async () => {
        setIsLoading(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          
          const systemInstruction = `Eres un guía experto en el método de resolución de problemas desarrollado por Daniel Arnaiz Boluda, el cual está basado en la Primera álgebra de magnitudes de J. M. Arnaiz. Tu objetivo es guiar al usuario paso a paso para resolver su problema de física usando este método.

IMPORTANTE: Debes seguir estrictamente este procedimiento SOCRÁTICO. NUNCA des la solución directamente. Guía al usuario con preguntas y razonamientos lógicos.

REGLAS DE ESTILO Y CONTENIDO:
- NO uses ** para negrita en el texto.
- NO uses el carácter \` para citar o indicar símbolos (por ejemplo, no escribas \`*\`).
- RECUERDA: El signo '*' se usa ÚNICAMENTE para la multiplicación entre dos o más díadas (ejemplo: 8 obreros * 30 días). NUNCA lo uses para unir un número con su magnitud (ejemplo correcto: 8 obreros).
- RECUERDA: En este método, RECURSOS = TRABAJO. Las igualdades relacionan directamente magnitudes diferentes (ejemplo: 120 litros = 10 minutos).
- PROHIBIDO: NO corrijas al usuario con fórmulas de física convencional. NO introduzcas constantes, ritmos, caudales o coeficientes (como 'c') para hacer la igualdad "físicamente correcta" según la física tradicional. En el álgebra de magnitudes, la igualdad directa entre magnitudes es la base.
- RECUERDA: En el paso 6.º (igualdad aritmética), los signos tradicionales de multiplicación son el punto (·) o la 'x'. NUNCA uses '*' en este paso.
- RECUERDA: La incógnita NUNCA es la magnitud, sino el elemento numérico de la díada. Las magnitudes siempre las conocemos.
- SÉ CONCISO: No des explicaciones innecesarias en cada paso. Limítate a pedir el siguiente paso del procedimiento. Solo da explicaciones si el usuario se equivoca o tiene dudas.
- IMPORTANTE: En los pasos 5.º (dividir miembro a miembro) y 6.º (igualdad aritmética), NUNCA des la solución ni escribas la ecuación tú mismo. Debes pedir al usuario que utilice el CUADRO INTERACTIVO. Dile explícitamente que haga clic en el botón "Cuadro interactivo" o en las palabras "Cuadro interactivo" de tu mensaje para abrirlo. Detente ahí y espera su respuesta.
- En el paso 5.º, una vez el usuario haya enviado su respuesta a través del cuadro, esta se fijará en la parte superior de la pantalla.
- CUANDO PROPONGAS UN NUEVO PROBLEMA (segundo, tercero, etc.): Debes empezar SIEMPRE con el enunciado en una sola línea, seguido del paso 2.º. Esto es vital para que el sistema pueda fijar el nuevo enunciado.

PASOS A SEGUIR (Debes mencionar siempre el número del paso al inicio de tu respuesta, ej: "5.º paso: ..."):
1.º El usuario plantea el problema. (En este caso, tú como IA propondrás el problema primero).
2.º El usuario debe indicar las díadas que observe en el problema planteado.
3.º El usuario debe indicar la igualdad correspondiente al enunciado. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
4.º El usuario debe indicar la igualdad correspondiente a la pregunta. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
5.º Recordar las dos igualdades y pedir al usuario que las divida miembro a miembro utilizando el CUADRO INTERACTIVO. No escribas tú el resultado.
6.º Recordar que la división de una magnitud entre sí misma es la unidad (número abstracto). Pedir la igualdad puramente aritmética resultante utilizando el CUADRO INTERACTIVO. El usuario debe usar signos tradicionales de aritmética (· o x para multiplicar, / para dividir).
7.º Preguntar el resultado de la incógnita (el valor numérico). Si no sabe, guiarlo.

Mantén un tono profesional pero alentador. Si el usuario se equivoca, no lo corrijas directamente, hazle una pregunta para que se dé cuenta de su error.`;

          chatRef.current = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
              systemInstruction,
            },
          });

          const prompt = isKids 
                ? "Genera UN ÚNICO problema divertido de regla de tres para un niño. IMPORTANTE: Tu respuesta debe tener este formato exacto:\nLínea 1: El enunciado del problema.\nLínea 2: El paso 2.º (preguntar por las díadas).\nNO propongas más de un problema bajo ninguna circunstancia."
                : "Genera UN ÚNICO problema de regla de tres. IMPORTANTE: Tu respuesta debe tener este formato exacto:\nLínea 1: El enunciado del problema.\nLínea 2: El paso 2.º (preguntar por las díadas).\nNO propongas más de un problema bajo ninguna circunstancia.";
          
          const response = await chatRef.current.sendMessage({ message: prompt });
          const text = response.text;
          
          // Extract the problem statement
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            setPinnedProblem(lines[0]);
          }
          
          setMessages(prev => [...prev, { role: 'model', text }]);
          setCurrentStep(2);
        } catch (error) {
          console.error("Error generating problem:", error);
          setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, no he podido generar un problema ahora mismo. Por favor, inténtalo de nuevo.' }]);
        } finally {
          setIsLoading(false);
        }
      };
      
      generateProblem();
    } else {
      // Initial message from AI for HELP mode
      setMessages([
        {
          role: 'model',
          text: '¡Hola! Soy tu guía para resolver problemas de física usando el método de resolución de problemas desarrollado por Daniel Arnaiz Boluda, basado en la Primera álgebra de magnitudes de J. M. Arnaiz. \n\nPara empezar, por favor, plantea el problema que quieres resolver.'
        }
      ]);
    }
  }, []);

  const handleSend = async (overrideMessage?: string) => {
    const userMessage = overrideMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!overrideMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemInstruction = `Eres un guía experto en el método de resolución de problemas desarrollado por Daniel Arnaiz Boluda, el cual está basado en la Primera álgebra de magnitudes de J. M. Arnaiz. Tu objetivo es guiar al usuario paso a paso para resolver su problema de física usando este método.

IMPORTANTE: Debes seguir estrictamente este procedimiento SOCRÁTICO. NUNCA des la solución directamente. Guía al usuario con preguntas y razonamientos lógicos.

REGLAS DE ESTILO Y CONTENIDO:
- NO uses ** para negrita en el texto.
- NO uses el carácter \` para citar o indicar símbolos (por ejemplo, no escribas \`*\`).
- RECUERDA: El signo '*' se usa ÚNICAMENTE para la multiplicación entre dos o más díadas (ejemplo: 8 obreros * 30 días). NUNCA lo uses para unir un número con su magnitud (ejemplo correcto: 8 obreros).
- RECUERDA: En este método, RECURSOS = TRABAJO. Las igualdades relacionan directamente magnitudes diferentes (ejemplo: 120 litros = 10 minutos).
- PROHIBIDO: NO corrijas al usuario con fórmulas de física convencional. NO introduzcas constantes, ritmos, caudales o coeficientes (como 'c') para hacer la igualdad "físicamente correcta" según la física tradicional. En el álgebra de magnitudes, la igualdad directa entre magnitudes es la base.
- RECUERDA: En el paso 6.º (igualdad aritmética), los signos tradicionales de multiplicación son el punto (·) o la 'x'. NUNCA uses '*' en este paso.
- RECUERDA: La incógnita NUNCA es la magnitud, sino el elemento numérico de la díada. Las magnitudes siempre las conocemos.
- SÉ CONCISO: No des explicaciones innecesarias en cada paso. Limítate a pedir el siguiente paso del procedimiento. Solo da explicaciones si el usuario se equivoca o tiene dudas.
- IMPORTANTE: En los pasos 5.º (dividir miembro a miembro) y 6.º (igualdad aritmética), NUNCA des la solución ni escribas la ecuación tú mismo. Debes pedir al usuario que utilice el CUADRO INTERACTIVO. Dile explícitamente que haga clic en el botón "Cuadro interactivo" o en las palabras "Cuadro interactivo" de tu mensaje para abrirlo. Detente ahí y espera su respuesta.
- En el paso 5.º, una vez el usuario haya enviado su respuesta a través del cuadro, esta se fijará en la parte superior de la pantalla.
- CUANDO PROPONGAS UN NUEVO PROBLEMA (segundo, tercero, etc.): Debes empezar SIEMPRE con el enunciado en una sola línea, seguido del paso 2.º. Esto es vital para que el sistema pueda fijar el nuevo enunciado.

PASOS A SEGUIR (Debes mencionar siempre el número del paso al inicio de tu respuesta, ej: "5.º paso: ..."):
1.º El usuario plantea el problema. (Ya lo ha hecho si estás respondiendo a su primer mensaje).
2.º El usuario debe indicar las díadas que observe en el problema planteado.
3.º El usuario debe indicar la igualdad correspondiente al enunciado. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
4.º El usuario debe indicar la igualdad correspondiente a la pregunta. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
5.º Recordar las dos igualdades y pedir al usuario que las divida miembro a miembro utilizando el CUADRO INTERACTIVO. No escribas tú el resultado.
6.º Recordar que la división de una magnitud entre sí misma es la unidad (número abstracto). Pedir la igualdad puramente aritmética resultante utilizando el CUADRO INTERACTIVO. El usuario debe usar signos tradicionales de aritmética (· o x para multiplicar, / para dividir).
7.º Preguntar el resultado de la incógnita (el valor numérico). Si no sabe, guiarlo.

Mantén un tono profesional pero alentador. Si el usuario se equivoca, no lo corrijas directamente, hazle una pregunta para que se dé cuenta de su error.`;

        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction,
          },
        });
      }

      // If it's the first message, pin it as the problem
      if (!pinnedProblem) {
        setPinnedProblem(userMessage);
        setCurrentStep(2);
      }

      const response = await chatRef.current.sendMessage({ message: userMessage });
      const text = response.text;

      // Detect if AI is proposing a new problem (Standard Mode)
      const isNewProblemInResponse = text.includes('1.º') || text.includes('1º') || 
                                    (currentStep === 7 && (text.includes('2.º') || text.includes('2º')));

      if (isNewProblemInResponse) {
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        setPinnedProblem(lines[0]);
        setPinnedEquation(null);
        setCurrentStep(2);
      } else {
        // Simple heuristic to update step based on AI response or user progress
        const combinedText = (userMessage + ' ' + text).toLowerCase();
        
        if (combinedText.includes('paso 2') || combinedText.includes('2.º') || combinedText.includes('2º') || combinedText.includes('díadas')) setCurrentStep(2);
        if (combinedText.includes('paso 3') || combinedText.includes('3.º') || combinedText.includes('3º') || combinedText.includes('igualdad correspondiente al enunciado')) setCurrentStep(3);
        if (combinedText.includes('paso 4') || combinedText.includes('4.º') || combinedText.includes('4º') || combinedText.includes('igualdad correspondiente a la pregunta')) setCurrentStep(4);
        if (combinedText.includes('paso 5') || combinedText.includes('5.º') || combinedText.includes('5º') || combinedText.includes('divida miembro a miembro') || combinedText.includes('cuadro interactivo')) setCurrentStep(5);
        if (combinedText.includes('paso 6') || combinedText.includes('6.º') || combinedText.includes('6º') || combinedText.includes('aritmética')) setCurrentStep(6);
        if (combinedText.includes('paso 7') || combinedText.includes('7.º') || combinedText.includes('7º') || combinedText.includes('resultado')) setCurrentStep(7);
      }

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const insertSymbol = (symbol: string) => {
    if (symbol === '/' || symbol === '//') {
      const side = activeInput.startsWith('left') ? 'left' : 'right';
      setEquationInput(prev => ({
        ...prev,
        [side]: {
          ...prev[side as 'left' | 'right'],
          divType: symbol === '/' ? 'arithmetic' : 'geometric'
        }
      }));
      setActiveInput(`${side}-den` as any);
      return;
    }

    const [side, part] = activeInput.split('-');
    setEquationInput(prev => ({
      ...prev,
      [side]: {
        ...prev[side as 'left' | 'right'],
        [part]: prev[side as 'left' | 'right'][part as 'num' | 'den'] + symbol
      }
    }));
  };

  const handleEquationSend = () => {
    const { left, right } = equationInput;
    if (!left.num || !right.num) return;
    
    const formatSide = (side: typeof left) => {
      if (side.divType === 'none') return side.num;
      const sep = side.divType === 'arithmetic' ? ' / ' : ' // ';
      return `(${side.num})${sep}(${side.den})`;
    };

    const formattedMessage = `Igualdad planteada:\n${formatSide(left)} = ${formatSide(right)}`;
    handleSend(formattedMessage);
    
    // Pin the equation
    setPinnedEquation({ 
      num1: left.num, 
      den1: left.den, 
      divType1: left.divType,
      num2: right.num, 
      den2: right.den,
      divType2: right.divType
    });
    
    setEquationInput({
      left: { num: '', den: '', divType: 'none' },
      right: { num: '', den: '', divType: 'none' }
    });
    setIsInteractiveBoxOpen(false);
  };

  const resetChat = () => {
    if (initialMode === 'PRACTICE') {
      setMessages([
        {
          role: 'model',
          text: '¡Hola! Vamos a practicar de nuevo. Generando un nuevo ejercicio para ti...'
        }
      ]);
      setPinnedProblem(null);
      setPinnedEquation(null);
      setCurrentStep(1);
      chatRef.current = null;
      
      // Re-trigger generation
      const generateProblem = async () => {
        setIsLoading(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          chatRef.current = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
              systemInstruction: `Eres un guía experto en el método de resolución de problemas desarrollado por Daniel Arnaiz Boluda, el cual está basado en la Primera álgebra de magnitudes de J. M. Arnaiz. Tu objetivo es guiar al usuario paso a paso para resolver su problema de física usando este método.

IMPORTANTE: Debes seguir estrictamente este procedimiento SOCRÁTICO. NUNCA des la solución directamente. Guía al usuario con preguntas y razonamientos lógicos.

REGLAS DE ESTILO Y CONTENIDO:
- NO uses ** para negrita en el texto.
- NO uses el carácter \` para citar o indicar símbolos (por ejemplo, no escribas \`*\`).
- RECUERDA: El signo '*' se usa ÚNICAMENTE para la multiplicación entre dos o más díadas (ejemplo: 8 obreros * 30 días). NUNCA lo uses para unir un número con su magnitud (ejemplo correcto: 8 obreros).
- RECUERDA: En este método, RECURSOS = TRABAJO. Las igualdades relacionan directamente magnitudes diferentes (ejemplo: 120 litros = 10 minutos).
- PROHIBIDO: NO corrijas al usuario con fórmulas de física convencional. NO introduzcas constantes, ritmos, caudales o coeficientes (como 'c') para hacer la igualdad "físicamente correcta" según la física tradicional. En el álgebra de magnitudes, la igualdad directa entre magnitudes es la base.
- RECUERDA: En el paso 6.º (igualdad aritmética), los signos tradicionales de multiplicación son el punto (·) o la 'x'. NUNCA uses '*' en este paso.
- RECUERDA: La incógnita NUNCA es la magnitud, sino el elemento numérico de la díada. Las magnitudes siempre las conocemos.
- SÉ CONCISO: No des explicaciones innecesarias en cada paso. Limítate a pedir el siguiente paso del procedimiento. Solo da explicaciones si el usuario se equivoca o tiene dudas.
- IMPORTANTE: En los pasos 5.º (dividir miembro a miembro) y 6.º (igualdad aritmética), NUNCA des la solución ni escribas la ecuación tú mismo. Debes pedir al usuario que utilice el CUADRO INTERACTIVO. Dile explícitamente que haga clic en el botón "Cuadro interactivo" o en las palabras "Cuadro interactivo" de tu mensaje para abrirlo. Detente ahí y espera su respuesta.
- En el paso 5.º, una vez el usuario haya enviado su respuesta a través del cuadro, esta se fijará en la parte superior de la pantalla.
- CUANDO PROPONGAS UN NUEVO PROBLEMA (segundo, tercero, etc.): Debes empezar SIEMPRE con el enunciado en una sola línea, seguido del paso 2.º. Esto es vital para que el sistema pueda fijar el nuevo enunciado.

PASOS A SEGUIR (Debes mencionar siempre el número del paso al inicio de tu respuesta, ej: "5.º paso: ..."):
1.º El usuario plantea el problema. (En este caso, tú como IA propondrás el problema primero).
2.º El usuario debe indicar las díadas que observe en el problema planteado.
3.º El usuario debe indicar la igualdad correspondiente al enunciado. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
4.º El usuario debe indicar la igualdad correspondiente a la pregunta. Es muy importante que respete el signo * para la multiplicación de las díadas si hay más de una.
5.º Recordar las dos igualdades y pedir al usuario que las divida miembro a miembro utilizando el CUADRO INTERACTIVO. No escribas tú el resultado.
6.º Recordar que la división de una magnitud entre sí misma es la unidad (número abstracto). Pedir la igualdad puramente aritmética resultante utilizando el CUADRO INTERACTIVO. El usuario debe usar signos tradicionales de aritmética (· o x para multiplicar, / para dividir).
7.º Preguntar el resultado de la incógnita (el valor numérico). Si no sabe, guiarlo.

Mantén un tono profesional pero alentador. Si el usuario se equivoca, no lo corrijas directamente, hazle una pregunta para que se dé cuenta de su error.`,
            },
          });

          const prompt = isKids 
            ? "Genera UN ÚNICO problema divertido de regla de tres para un niño. IMPORTANTE: Tu respuesta debe tener este formato exacto:\nLínea 1: El enunciado del problema.\nLínea 2: El paso 2.º (preguntar por las díadas).\nNO propongas más de un problema bajo ninguna circunstancia."
            : "Genera UN ÚNICO problema de regla de tres. IMPORTANTE: Tu respuesta debe tener este formato exacto:\nLínea 1: El enunciado del problema.\nLínea 2: El paso 2.º (preguntar por las díadas).\nNO propongas más de un problema bajo ninguna circunstancia.";
          
          const response = await chatRef.current.sendMessage({ message: prompt });
          const text = response.text;
          
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            setPinnedProblem(lines[0]);
          }
          
          setMessages(prev => [...prev, { role: 'model', text }]);
          setCurrentStep(2);
        } catch (error) {
          console.error("Error generating problem:", error);
          setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, no he podido generar un problema ahora mismo. Por favor, inténtalo de nuevo.' }]);
        } finally {
          setIsLoading(false);
        }
      };
      generateProblem();
    } else {
      setMessages([
        {
          role: 'model',
          text: '¡Hola! Soy tu guía para resolver problemas de física usando el método de resolución de problemas desarrollado por Daniel Arnaiz Boluda, basado en la Primera álgebra de magnitudes de J. M. Arnaiz. \n\nPara empezar, por favor, plantea el problema que quieres resolver.'
        }
      ]);
      setPinnedProblem(null);
      setPinnedEquation(null);
      setCurrentStep(1);
      chatRef.current = null;
    }
  };

  const renderMessageText = (text: string) => {
    if (!text.includes('Cuadro interactivo')) return text;
    
    const parts = text.split(/(Cuadro interactivo)/g);
    return parts.map((part, i) => {
      if (part === 'Cuadro interactivo') {
        return (
          <button 
            key={i}
            onClick={() => setIsInteractiveBoxOpen(true)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              isKids 
                ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                : 'bg-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/20'
            }`}
          >
            Cuadro interactivo
          </button>
        );
      }
      return part;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] ${isKids ? 'bg-slate-900' : 'bg-[#F8F9FA]'} flex flex-col ${theme.font}`}
    >
      <div className="sticky top-0 z-50">
        {/* Pinned Problem */}
        <AnimatePresence>
          {pinnedProblem && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`${isKids ? 'bg-orange-500/10 border-orange-500/20' : 'bg-[#5A5A40]/5 border-[#5A5A40]/10'} border-b p-3 backdrop-blur-md`}
            >
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                <div className="flex gap-3 flex-1">
                  <div className="mt-1">
                    <Pin size={16} className={`${isKids ? 'text-orange-400' : 'text-[#5A5A40]'} rotate-45`} />
                  </div>
                  <div>
                    <span className={`${isKids ? 'text-orange-400' : 'text-[#5A5A40]'} text-sm font-bold uppercase tracking-widest block mb-0.5`}>Problema en curso</span>
                    <p className={`${isKids ? 'text-white' : 'text-slate-800'} font-medium leading-relaxed text-base md:text-lg`}>{pinnedProblem}</p>
                  </div>
                </div>

                {pinnedEquation && (
                  <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                    <span className={`${isKids ? 'text-orange-400' : 'text-[#5A5A40]'} text-sm font-bold uppercase tracking-widest block mb-1`}>Igualdad fijada</span>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <div className="flex flex-col items-center">
                        <div className="px-2">{pinnedEquation.num1}</div>
                        {pinnedEquation.divType1 !== 'none' && (
                          <>
                            <div className={`w-full h-0.5 my-0.5 ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                            {pinnedEquation.divType1 === 'geometric' && (
                              <div className={`w-full h-0.5 my-0.5 ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                            )}
                            <div className="px-2">{pinnedEquation.den1}</div>
                          </>
                        )}
                      </div>
                      <div className="text-xl font-bold">=</div>
                      <div className="flex flex-col items-center">
                        <div className="px-2">{pinnedEquation.num2}</div>
                        {pinnedEquation.divType2 !== 'none' && (
                          <>
                            <div className={`w-full h-0.5 my-0.5 ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                            {pinnedEquation.divType2 === 'geometric' && (
                              <div className={`w-full h-0.5 my-0.5 ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                            )}
                            <div className="px-2">{pinnedEquation.den2}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className={`p-2 md:p-3 border-b ${isKids ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/80'} flex items-center justify-between backdrop-blur-md`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${isKids ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className={`text-base md:text-lg font-bold flex items-center gap-2 ${isKids ? 'text-white' : theme.primaryText}`}>
                <MessageSquare size={20} />
                Guía Paso a Paso
              </h2>
              <p className={`${isKids ? 'text-slate-400' : 'text-slate-500'} text-sm hidden sm:block`}>Método de la Primera álgebra de magnitudes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetChat}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-2 text-sm font-medium px-3 ${isKids ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
            >
              <RefreshCcw size={14} />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${isKids ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Column */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth ${isKids ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(30,41,59,1)_0%,rgba(15,23,42,1)_100%)]' : 'bg-[#F8F9FA]'}`}
          >
            <div className="max-w-4xl mx-auto pb-20 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[75%] p-4 md:p-6 rounded-3xl shadow-lg ${
                msg.role === 'user' 
                  ? `${theme.primary} text-white rounded-tr-none` 
                  : `${isKids ? 'bg-slate-800/80 text-slate-100 border-white/10' : 'bg-white text-slate-800 border-slate-100'} border rounded-tl-none backdrop-blur-md`
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                  {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`${isKids ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-100'} border p-4 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-sm`}>
                <Loader2 className={`animate-spin ${isKids ? 'text-orange-400' : 'text-[#5A5A40]'}`} size={20} />
                <span className="text-slate-400 text-sm">El guía está pensando...</span>
              </div>
            </div>
          )}
        </div>
      </div>

          {/* Input Area */}
          <div className="p-4 md:p-8 border-t ${isKids ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                <button 
                  onClick={() => setIsInteractiveBoxOpen(!isInteractiveBoxOpen)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    isKids ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30' : 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20 hover:bg-[#5A5A40]/20'
                  }`}
                >
                  <Layout size={14} />
                  Cuadro interactivo
                </button>

                {/* Step Suggestion if stuck */}
                {currentStep < 7 && messages.length > 1 && messages[messages.length - 1].role === 'model' && (
                  (messages[messages.length - 1].text.toLowerCase().includes('paso ' + (currentStep + 1)) || 
                   messages[messages.length - 1].text.toLowerCase().includes((currentStep + 1) + '.º') ||
                   messages[messages.length - 1].text.toLowerCase().includes((currentStep + 1) + 'º') ||
                   (currentStep === 4 && (messages[messages.length - 1].text.toLowerCase().includes('dividir') || messages[messages.length - 1].text.toLowerCase().includes('miembro a miembro')))) && (
                    <button 
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                        isKids ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30' : 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20 hover:bg-[#5A5A40]/20'
                      }`}
                    >
                      Ir al Paso {currentStep + 1}
                    </button>
                  )
                )}
              </div>

          {/* Interactive Box UI */}
          {isInteractiveBoxOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${isKids ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-4`}
            >
              <div className="flex justify-between items-center">
                <p className={`text-sm font-bold uppercase tracking-widest ${isKids ? 'text-orange-400' : 'text-[#5A5A40]'}`}>
                  Cuadro interactivo
                </p>
                <button onClick={() => setIsInteractiveBoxOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  {/* Left Side */}
                  <div className="flex-1 flex flex-col items-center gap-1.5 w-full">
                    <input 
                      type="text"
                      value={equationInput.left.num}
                      onFocus={() => setActiveInput('left-num')}
                      onChange={(e) => setEquationInput(prev => ({ ...prev, left: { ...prev.left, num: e.target.value } }))}
                      placeholder={equationInput.left.divType === 'none' ? "Miembro izquierdo" : "Numerador"}
                      className={`w-full p-2.5 text-center rounded-lg border focus:outline-none transition-all text-base font-mono ${
                        activeInput === 'left-num' 
                          ? (isKids ? 'bg-white/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-[#5A5A40] ring-2 ring-[#5A5A40]/10')
                          : (isKids ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900')
                      }`}
                    />
                    {equationInput.left.divType !== 'none' && (
                      <>
                        <div className="flex flex-col gap-0.5 w-full py-0.5">
                          <div className={`w-full h-0.5 rounded-full ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                          {equationInput.left.divType === 'geometric' && (
                            <div className={`w-full h-0.5 rounded-full ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                          )}
                        </div>
                        <input 
                          type="text"
                          value={equationInput.left.den}
                          onFocus={() => setActiveInput('left-den')}
                          onChange={(e) => setEquationInput(prev => ({ ...prev, left: { ...prev.left, den: e.target.value } }))}
                          placeholder="Denominador"
                          className={`w-full p-2.5 text-center rounded-lg border focus:outline-none transition-all text-base font-mono ${
                            activeInput === 'left-den' 
                              ? (isKids ? 'bg-white/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-[#5A5A40] ring-2 ring-[#5A5A40]/10')
                              : (isKids ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900')
                          }`}
                        />
                      </>
                    )}
                  </div>

                  <div className={`text-2xl font-bold ${isKids ? 'text-white' : 'text-slate-400'}`}>=</div>

                  {/* Right Side */}
                  <div className="flex-1 flex flex-col items-center gap-1.5 w-full">
                    <input 
                      type="text"
                      value={equationInput.right.num}
                      onFocus={() => setActiveInput('right-num')}
                      onChange={(e) => setEquationInput(prev => ({ ...prev, right: { ...prev.right, num: e.target.value } }))}
                      placeholder={equationInput.right.divType === 'none' ? "Miembro derecho" : "Numerador"}
                      className={`w-full p-2.5 text-center rounded-lg border focus:outline-none transition-all text-base font-mono ${
                        activeInput === 'right-num' 
                          ? (isKids ? 'bg-white/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-[#5A5A40] ring-2 ring-[#5A5A40]/10')
                          : (isKids ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900')
                      }`}
                    />
                    {equationInput.right.divType !== 'none' && (
                      <>
                        <div className="flex flex-col gap-0.5 w-full py-0.5">
                          <div className={`w-full h-0.5 rounded-full ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                          {equationInput.right.divType === 'geometric' && (
                            <div className={`w-full h-0.5 rounded-full ${isKids ? 'bg-white/20' : 'bg-slate-300'}`} />
                          )}
                        </div>
                        <input 
                          type="text"
                          value={equationInput.right.den}
                          onFocus={() => setActiveInput('right-den')}
                          onChange={(e) => setEquationInput(prev => ({ ...prev, right: { ...prev.right, den: e.target.value } }))}
                          placeholder="Denominador"
                          className={`w-full p-2.5 text-center rounded-lg border focus:outline-none transition-all text-base font-mono ${
                            activeInput === 'right-den' 
                              ? (isKids ? 'bg-white/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-[#5A5A40] ring-2 ring-[#5A5A40]/10')
                              : (isKids ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900')
                          }`}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex gap-1 p-1 rounded-lg bg-slate-200/50">
                    <span className="text-sm font-bold uppercase text-slate-500 self-center px-1.5">Arit:</span>
                    {['·', 'x', '/'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => insertSymbol(s)}
                        className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all text-sm ${isKids ? 'bg-white/10 text-white hover:bg-orange-500' : 'bg-white text-slate-700 hover:bg-[#5A5A40] hover:text-white shadow-sm'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1 p-1 rounded-lg bg-slate-200/50">
                    <span className="text-sm font-bold uppercase text-slate-500 self-center px-1.5">Geom:</span>
                    {['*', '//'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => insertSymbol(s)}
                        className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all text-sm ${isKids ? 'bg-white/10 text-white hover:bg-orange-500' : 'bg-white text-slate-700 hover:bg-[#5A5A40] hover:text-white shadow-sm'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setEquationInput({
                      left: { num: '', den: '', divType: 'none' },
                      right: { num: '', den: '', divType: 'none' }
                    })}
                    className="px-3 h-8 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleEquationSend}
                  disabled={!equationInput.left.num || !equationInput.right.num || isLoading}
                  className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm ${
                    equationInput.left.num && equationInput.right.num && !isLoading
                      ? `${theme.primary} text-white shadow-lg hover:scale-105 active:scale-95`
                      : `${isKids ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'} cursor-not-allowed`
                  }`}
                >
                  <Send size={16} />
                  Enviar Igualdad
                </button>
              </div>
            </motion.div>
          )}

              {!isInteractiveBoxOpen && (
                <div className="relative">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Escribe aquí tu respuesta..."
                    className={`w-full border rounded-2xl p-4 pr-16 focus:outline-none transition-all resize-none min-h-[80px] max-h-[200px] text-lg ${isKids ? 'bg-white/5 border-white/10 text-white focus:border-orange-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#5A5A40]/50'}`}
                    rows={1}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className={`absolute right-3 bottom-3 p-3 rounded-xl transition-all ${
                      input.trim() && !isLoading 
                        ? `${theme.primary} text-white shadow-lg hover:scale-105 active:scale-95` 
                        : `${isKids ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'} cursor-not-allowed`
                    }`}
                  >
                    <Send size={24} />
                  </button>
                </div>
              )}
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
                Procedimiento Socrático • Paso {currentStep} de 7
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(step => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-6 h-6 rounded-full text-sm flex items-center justify-center transition-all ${
                      currentStep === step 
                        ? (isKids ? 'bg-orange-500 text-white' : 'bg-[#5A5A40] text-white') 
                        : (isKids ? 'bg-white/10 text-slate-500 hover:bg-white/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-slate-500 text-sm hidden sm:block">
              Presiona Enter para enviar
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
