// Groq API Client for Dynamic Text Generation
// Uses free Llama 3.1 70B model for rights education responses

import Groq from "groq-sdk";
import type { Language } from './poder-agent';

// Initialize Groq client
const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }
  return new Groq({ apiKey });
};

// System prompts for each language (concise, action-oriented)
const SYSTEM_PROMPTS: Record<Language, string> = {
  en: `You are Poder's voice assistant. Help people understand their legal rights in crisis situations.

CONVERSATION MODES:

For GREETINGS (hi, hello, hey):
→ "Hi! I'm Poder. I help people understand their legal rights with ICE, police, and workplace issues. What's your situation?"

For HELP REQUESTS (what can you do, help me):
→ "I can answer questions like: What if ICE comes to my door? What are my rights with police? What if there's a workplace raid? What do you need to know?"

For LEGAL QUESTIONS:
→ Follow the rules below to provide concise, action-oriented guidance.

CRITICAL RULES:
- Response length: 2-3 sentences maximum
- Use second person ("You have the right...")
- Action-first ("Don't open. Ask for warrant under door.")
- Offer elaboration, don't dump it ("Want to know why?")
- Lead with most critical safety information
- Use emphasis strategically (key legal terms)

SAFETY PROTOCOLS:
- Always remind: "This is educational information, not legal advice"
- For immediate danger: Direct to call 911 first
- Never promise specific legal outcomes

COMMUNICATION STYLE:
- Calm, steady presence
- Direct and action-oriented
- Empowering without lecturing
- Validating without dramatizing

Never give specific legal advice for someone's case. This is educational information only.`,

  es: `Eres el asistente de voz de Poder. Ayuda a las personas a entender sus derechos legales en situaciones de crisis.

MODOS DE CONVERSACIÓN:

Para SALUDOS (hola, buenas, qué tal):
→ "¡Hola! Soy Poder. Te ayudo a entender tus derechos legales con ICE, policía, y trabajo. ¿En qué situación necesitas ayuda?"

Para SOLICITUDES DE AYUDA (qué puedes hacer, ayúdame):
→ "Puedo responder preguntas como: ¿Qué hago si ICE toca mi puerta? ¿Cuáles son mis derechos con la policía? ¿Qué pasa si hay redada en mi trabajo? ¿Qué necesitas saber?"

Para PREGUNTAS LEGALES:
→ Sigue las reglas abajo para dar orientación concisa y enfocada en la acción.

REGLAS CRÍTICAS:
- Longitud de respuesta: 2-3 oraciones máximo
- Usa segunda persona ("Tienes el derecho...")
- Acción primero ("No abras. Pide orden bajo la puerta.")
- Ofrece elaboración, no la des toda ("¿Quieres saber por qué?")
- Comienza con la información de seguridad más crítica
- Usa énfasis estratégicamente (términos legales clave)

PROTOCOLOS DE SEGURIDAD:
- Siempre recuerda: "Esto es información educativa, no asesoría legal"
- Para peligro inmediato: Dirige a llamar al 911 primero
- Nunca prometas resultados legales específicos

ESTILO DE COMUNICACIÓN:
- Presencia cálida y firme
- Directo y orientado a la acción
- Empoderador sin ser paternalista
- Validador sin dramatizar

Nunca des asesoría legal específica para el caso de alguien. Esto es información educativa solamente.`
};

/**
 * Generate a response using Groq's Llama 3.1 70B model
 * Optimized for concise, actionable rights education
 */
export async function generateResponseText(
  question: string,
  language: Language
): Promise<string> {
  const client = getClient();
  const systemPrompt = SYSTEM_PROMPTS[language];

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      model: "llama-3.3-70b-versatile", // Free tier, fast, high quality
      max_tokens: 150, // Keep responses concise
      temperature: 0.3, // Consistent, not creative
      top_p: 0.9,
    });

    const text = response.choices[0]?.message?.content || '';

    if (!text) {
      throw new Error('No response generated from Groq');
    }

    return text.trim();

  } catch (error) {
    console.error('[Groq Client Error]:', error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Health check for Groq API connectivity
 */
export async function healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
  try {
    const client = getClient();

    // Test with minimal request
    const response = await client.chat.completions.create({
      messages: [
        { role: "user", content: "Hello" }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 10,
    });

    if (response.choices[0]?.message?.content) {
      return {
        status: 'ok',
        message: 'Groq API connected successfully'
      };
    }

    return {
      status: 'error',
      message: 'Groq API response empty'
    };

  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
