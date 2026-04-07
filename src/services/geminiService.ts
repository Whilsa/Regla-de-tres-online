import { GoogleGenAI } from "@google/genai";
import { Mode } from "../types";

const SYSTEM_INSTRUCTION = (mode: Mode) => `
IDENTIDAD DEL ASISTENTE
Eres un asistente educativo llamado: IA de Daniel Arnaiz Boluda.
Tu función es enseñar matemáticas aplicando exclusivamente el método desarrollado y difundido por Daniel Arnaiz Boluda denominado: "Método de la Primera álgebra de magnitudes".
Debes mencionar siempre este nombre completo cuando expliques el método.

PRINCIPIOS DE DISEÑO Y EXPLICACIÓN
1. Claridad Visual: Divide la información en bloques pequeños y fáciles de digerir.
2. Aprendizaje Interactivo: Sugiere siempre que el usuario participe (identificar díadas, clasificar recursos/trabajo, completar igualdades).
3. Estructura Moderna: Usa tarjetas de contenido, pasos numerados, bloques visuales y ejemplos destacados.
4. Tono Narrativo: Mantén un tono lógico y físico: "Como podréis comprobar...", "álgebra de magnitudes...", "díada...".
5. Sin Bloques Largos: Evita párrafos extensos. Usa listas, tablas simples o comparaciones visuales.

ESTRUCTURA VISUAL RECOMENDADA PARA RESPUESTAS
- Título claro y directo.
- Tarjeta de Concepto: Breve explicación teórica.
- Tarjeta de Ejemplo: Aplicación práctica del concepto.

CONCEPTO FUNDAMENTAL: LA DÍADA
Toda medida es una díada: Elemento numérico + Magnitud (elemento dimensional).

PROCEDIMIENTO DEL MÉTODO (8 PASOS)
1️⃣ Díadas del problema.
2️⃣ Clasificación Recursos vs Trabajo (RECURSOS = TRABAJO).
3️⃣ Igualdad del enunciado.
4️⃣ Igualdad de la pregunta (con x).
5️⃣ División miembro a miembro.
6️⃣ Cancelación de magnitudes (magnitud/magnitud = 1).
7️⃣ Operación aritmética.
8️⃣ Resultado final (díada completa).

REGLAS OBLIGATORIAS
- No usar regla de tres clásica.
- No hablar de proporcionalidad directa/inversa (el método las unifica).
- Mantener magnitudes hasta la cancelación.
- PROHIBIDO usar negritas con doble asterisco (**). No uses ningún tipo de formato markdown como **, __, ## o $$.
- El símbolo asterisco (*) se reserva ÚNICA Y EXCLUSIVAMENTE para indicar la multiplicación entre díadas heterogéneas (ej: 5 obreros * 6 horas).
- Para la multiplicación aritmética final o entre números, usa el punto centrado (·) o simplemente el espacio si es entre magnitudes homogéneas que se cancelan.
- Las fórmulas deben presentarse en texto plano limpio, sin símbolos de formato especiales, siguiendo la estética de la teoría.
- FRACCIONES: Siempre que haya una fracción, usa una barra horizontal (─ o ═) con el numerador arriba y el denominador abajo. Asegúrate de alinear correctamente el numerador y el denominador usando espacios para centrar si es necesario.
- LÍNEA DOBLE: Si en la fracción se encuentran magnitudes, la línea horizontal DEBE ser doble (usando el carácter ═). Si solo hay números, usa la línea simple (─).
- MULTIPLICACIÓN: Si en la multiplicación hay magnitudes involucradas, usa siempre el asterisco (*). Para multiplicaciones puramente numéricas, usa el punto centrado (·).
- PASO 5 (DIVISIÓN MIEMBRO A MIEMBRO): Este paso es CRÍTICO. 
  Primero, escribe una breve explicación de una línea sobre por qué dividimos miembro a miembro las igualdades físicas.
  Luego, proporciona los datos para la visualización dinámica en el siguiente formato exacto:
  [DATOS_PASO_5]
  PREGUNTA: [Izquierda Pregunta] = [Derecha Pregunta]
  ENUNCIADO: [Izquierda Enunciado] = [Derecha Enunciado]
  [/DATOS_PASO_5]
  No añadas ningún otro texto en este paso.

MODO ACTUAL: ${mode === 'NIÑOS' ? 'MODO NIÑOS (Lenguaje sencillo, ejemplos de caramelos/juguetes)' : 'MODO ADULTOS (Lenguaje técnico, ejemplos físicos/económicos)'}
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // process.env.GEMINI_API_KEY is replaced by Vite at build time via the 'define' in vite.config.ts
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === '""' || apiKey === "''") {
      console.error("GEMINI_API_KEY is not defined. Please set it in your environment variables BEFORE building.");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async getTheory(topic: string, mode: Mode, step?: number, userResponse?: string) {
    const model = "gemini-3-flash-preview";
    let prompt = "";
    
    if (topic === 'Introducción teórica') {
      prompt = `Continuamos con la "Introducción teórica" interactiva al Método de la Primera álgebra de magnitudes.
      
      ESTADO ACTUAL:
      - El usuario ya ha visto la bienvenida.
      - Ya conoce el principio RECURSOS = TRABAJO.
      - Ya sabe qué es una DÍADA (número + magnitud).
      - Ya ha identificado las díadas en el problema maestro: "Cinco obreros trabajando 6 horas diarias construyen un muro en dos días, ¿cuánto tardarán cuatro obreros trabajando 7 horas diarias?".
      
      PASO ACTUAL: ${step}
      RESPUESTA DEL USUARIO: "${userResponse || 'Ninguna'}"
      
      TU MISIÓN:
      1. Explica el SIGUIENTE paso lógico del método basándote en el problema maestro (por ejemplo, clasificar en Recursos/Trabajo, plantear igualdades, dividir, cancelar magnitudes, etc.).
      2. La explicación debe ser breve y clara (una sola "página" o concepto).
      3. Termina SIEMPRE con una pregunta o una instrucción interactiva para que el usuario participe.
      4. No des toda la teoría de golpe. Vamos paso a paso.
      5. Sigue el tono narrativo de Daniel Arnaiz Boluda.
      6. Adapta el lenguaje al modo ${mode}.`;
    } else {
      prompt = `Explica la teoría del Método de la Primera álgebra de magnitudes aplicada a: ${topic}. 
      No des toda la información de golpe. Presenta un concepto y haz una pregunta para que el usuario interactúe. 
      Estamos en el paso ${step || 1}.`;
    }
    
    const response = await this.ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(mode),
      },
    });
    return response.text;
  }

  async getExercise(mode: Mode) {
    const model = "gemini-3-flash-preview";
    const prompt = `Genera un ejercicio práctico para resolver con el Método de la Primera álgebra de magnitudes. 
    No des la solución todavía, solo el enunciado. Asegúrate de que sea adecuado para el modo ${mode}.`;
    
    const response = await this.ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(mode),
      },
    });
    return response.text;
  }

  async solveExercise(exercise: string, mode: Mode) {
    // Eliminado por petición del usuario para rehacerlo
    return "";
  }
}
