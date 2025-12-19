// ElevenLabs Conversational AI Client Wrapper
// Server-side only - handles agent communication

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

// Get correct agent ID based on language
const getAgentId = (language: Language): string => {
  const agentId = language === 'en'
    ? process.env.ELEVENLABS_AGENT_ID_EN
    : process.env.ELEVENLABS_AGENT_ID_ES;

  if (!agentId) {
    throw new Error(`Agent ID not configured for language: ${language}`);
  }

  return agentId;
};

export interface AgentMessage {
  text: string;
  language: Language;
  sessionId?: string;
}

export interface AgentResponse {
  text: string;
  audioUrl: string;
  sessionId: string;
  language: Language;
  source: 'agent';
}

/**
 * Send a message to the appropriate ElevenLabs conversational agent
 * and get back text + audio response
 *
 * Note: This uses the signed URL approach for conversational AI
 */
export async function sendMessageToAgent(
  message: AgentMessage
): Promise<AgentResponse> {
  const client = getClient();
  const agentId = getAgentId(message.language);

  try {
    // Get signed URL for starting conversation with the agent
    const signedUrlResponse = await client.conversationalAi.getSignedUrl({
      agent_id: agentId,
    });

    if (!signedUrlResponse?.signed_url) {
      throw new Error('Failed to get signed URL from ElevenLabs');
    }

    // For now, return a mock response with the signed URL
    // In a production implementation, you would use WebSocket/WebRTC with this URL
    // to have a real-time conversation

    // TODO: Implement WebSocket connection to signed_url for real-time conversation
    // For MVP, we'll use text-to-speech API as a fallback

    const audioResponse = await client.textToSpeech.convert(agentId, {
      text: `Response to: ${message.text}`,
      model_id: "eleven_multilingual_v2",
    });

    // Convert audio stream to URL (simplified - would need proper handling)
    const audioUrl = ''; // Would need to upload or stream this properly

    return {
      text: `This is a placeholder response. The agent received: "${message.text}"`,
      audioUrl,
      sessionId: message.sessionId || `session-${Date.now()}`,
      language: message.language,
      source: 'agent',
    };
  } catch (error) {
    console.error('ElevenLabs agent error:', error);
    throw new Error(`Failed to get agent response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Health check - verify API key and agent configuration
 */
export async function healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
  try {
    const client = getClient();
    getAgentId('en');
    getAgentId('es');

    // Try to fetch agent info to verify access
    const enAgentId = process.env.ELEVENLABS_AGENT_ID_EN!;
    await client.conversationalAi.getSignedUrl({
      agent_id: enAgentId,
    });

    return {
      status: 'ok',
      message: 'ElevenLabs agents configured correctly'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
