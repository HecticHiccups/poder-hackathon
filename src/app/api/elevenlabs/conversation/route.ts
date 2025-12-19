// API Route: ElevenLabs Conversational Agent Integration
// Handles communication between client and ElevenLabs agents

import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToAgent } from '@/lib/elevenlabs-client';
import type { Language } from '@/lib/poder-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  text: string;
  language: Language;
  sessionId?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json() as RequestBody;
    const { text, language, sessionId } = body;

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

    console.log(`[Agent API] Question (${language}):`, text.substring(0, 100));

    // Send message to appropriate agent
    const agentResponse = await sendMessageToAgent({
      text,
      language,
      sessionId,
    });

    console.log(`[Agent API] Response received, audio URL:`, agentResponse.audioUrl ? 'Yes' : 'No');

    // Return agent response
    return NextResponse.json({
      type: 'agent',
      answer: agentResponse.text,
      audioUrl: agentResponse.audioUrl,
      transcript: agentResponse.text,
      sessionId: agentResponse.sessionId,
      language: agentResponse.language,
      source: 'agent',
    });

  } catch (error) {
    console.error('[Agent API] Error:', error);

    // Return error response with graceful fallback suggestion
    return NextResponse.json(
      {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Lo siento, estoy teniendo problemas técnicos. / Sorry, I\'m having technical issues.',
        fallback: 'faq', // Suggest client should try FAQ matching as fallback
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasApiKey = !!process.env.ELEVENLABS_API_KEY;
    const hasEnAgent = !!process.env.ELEVENLABS_AGENT_ID_EN;
    const hasEsAgent = !!process.env.ELEVENLABS_AGENT_ID_ES;

    return NextResponse.json({
      status: hasApiKey && hasEnAgent && hasEsAgent ? 'ok' : 'misconfigured',
      config: {
        apiKey: hasApiKey ? 'configured' : 'missing',
        enAgent: hasEnAgent ? 'configured' : 'missing',
        esAgent: hasEsAgent ? 'configured' : 'missing',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: String(error) },
      { status: 500 }
    );
  }
}
