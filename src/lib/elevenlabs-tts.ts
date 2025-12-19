// ElevenLabs Text-to-Speech Client
// Converts generated text to audio using configured voices

import { ElevenLabsClient } from 'elevenlabs';
import type { Language } from './poder-agent';

// Initialize ElevenLabs client
const getClient = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }
  return new ElevenLabsClient({ apiKey });
};

// Get voice ID based on language
const getVoiceId = (language: Language): string => {
  const voiceId = language === 'en'
    ? process.env.ELEVENLABS_VOICE_ID_EN
    : process.env.ELEVENLABS_VOICE_ID_ES;

  if (!voiceId) {
    throw new Error(`Voice ID not configured for language: ${language}`);
  }

  return voiceId;
};

/**
 * Convert text to speech using ElevenLabs TTS API
 * Returns audio as Buffer for data URL conversion
 */
export async function textToSpeechBuffer(
  text: string,
  language: Language
): Promise<Buffer> {
  const client = getClient();
  const voiceId = getVoiceId(language);

  try {
    console.log(`[ElevenLabs TTS] Generating audio for ${language}:`, text.substring(0, 50) + '...');

    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.8,
      }
    });

    // Convert Node.js Readable stream to Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);

  } catch (error) {
    console.error('[ElevenLabs TTS Error]:', error);
    throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert audio buffer to base64 data URL for immediate playback
 * This allows audio to be embedded directly in the response
 */
export function bufferToDataUrl(buffer: Buffer): string {
  const audioBase64 = buffer.toString('base64');
  return `data:audio/mpeg;base64,${audioBase64}`;
}

/**
 * Combined helper: text → audio buffer → data URL
 * One-shot function for simplicity
 */
export async function textToSpeechDataUrl(
  text: string,
  language: Language
): Promise<string> {
  const buffer = await textToSpeechBuffer(text, language);
  return bufferToDataUrl(buffer);
}

/**
 * Health check for ElevenLabs TTS API
 */
export async function healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
  try {
    const client = getClient();
    const enVoiceId = getVoiceId('en');
    const esVoiceId = getVoiceId('es');

    // Verify client and voice IDs are configured
    if (!client || !enVoiceId || !esVoiceId) {
      return {
        status: 'error',
        message: 'ElevenLabs client or voice IDs not configured'
      };
    }

    return {
      status: 'ok',
      message: 'ElevenLabs TTS configured correctly'
    };

  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
