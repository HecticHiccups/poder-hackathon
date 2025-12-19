// API Route: Dynamic Q&A with Groq + ElevenLabs TTS
// Handles unlimited questions by generating text → audio on-demand

import { NextRequest, NextResponse } from 'next/server';
import { generateResponseText } from '@/lib/groq-client';
import { textToSpeechDataUrl } from '@/lib/elevenlabs-tts';
import type { Language } from '@/lib/poder-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  text: string;
  language: Language;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let language: Language = 'en'; // Default for error messages

  try {
    // Parse request
    const body = await req.json() as RequestBody;
    language = body.language;
    const { text } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" field' },
        { status: 400 }
      );
    }

    if (!language || !['en', 'es'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid "language" field. Must be "en" or "es"' },
        { status: 400 }
      );
    }

    console.log(`[Dynamic Q&A] Question (${language}):`, text);

    // Step 1: Generate response text with Groq (FREE, ~1 second)
    const responseText = await generateResponseText(text, language);
    console.log(`[Dynamic Q&A] Generated text:`, responseText.substring(0, 100) + '...');

    // Step 2: Convert to speech with ElevenLabs (~1-2 seconds, 200 credits)
    const audioDataUrl = await textToSpeechDataUrl(responseText, language);
    console.log(`[Dynamic Q&A] Generated audio, size:`, audioDataUrl.length, 'chars');

    const duration = Date.now() - startTime;
    console.log(`[Dynamic Q&A] Total time: ${duration}ms`);

    // Return complete response
    return NextResponse.json({
      type: 'dynamic',
      text: responseText,
      audioUrl: audioDataUrl,
      language,
      source: 'groq_elevenlabs',
      duration_ms: duration,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Dynamic Q&A Error]:', error);

    return NextResponse.json(
      {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: language === 'es'
          ? 'Lo siento, tuve problemas generando la respuesta.'
          : 'Sorry, I had trouble generating a response.',
        duration_ms: duration,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;
    const hasEnVoice = !!process.env.ELEVENLABS_VOICE_ID_EN;
    const hasEsVoice = !!process.env.ELEVENLABS_VOICE_ID_ES;

    const allConfigured = hasGroqKey && hasElevenLabsKey && hasEnVoice && hasEsVoice;

    return NextResponse.json({
      status: allConfigured ? 'ok' : 'misconfigured',
      layer: '2.5',
      config: {
        groqApiKey: hasGroqKey ? 'configured' : 'missing',
        elevenLabsApiKey: hasElevenLabsKey ? 'configured' : 'missing',
        voiceIdEn: hasEnVoice ? 'configured' : 'missing',
        voiceIdEs: hasEsVoice ? 'configured' : 'missing',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: String(error) },
      { status: 500 }
    );
  }
}
