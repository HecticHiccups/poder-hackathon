# Layer 2.5 Implementation Plan
## Dynamic Q&A with Groq + ElevenLabs TTS

**Decision Made:** Skip Layer 1 (crisis cards), extend Layer 2 (existing FAQ) with Layer 2.5 (dynamic Q&A)

---

## Context

**Current State:**
- ✅ 10 FAQ MP3s working (Layer 2)
- ✅ Keyword matching system
- ✅ Voice input + audio playback
- ✅ Bilingual EN/ES support

**Goal:** Handle ANY question (not just 10 FAQs)

**Resources:**
- 2M ElevenLabs credits available
- Limited Claude/OpenAI credits
- Solution: Groq (FREE) + ElevenLabs TTS

---

## Architecture

```
User asks question
    ↓
Check FAQ keyword match
    ↓
    ├─── High confidence (≥70%) ──→ Play existing MP3 (fast, free)
    │
    └─── Low/no match ──→ Groq generates text → ElevenLabs TTS → Play audio
                         (2-3 sec, 200 credits per response)
```

**Cost per user:**
- 30% use FAQ: 0 credits
- 70% use dynamic: 200 credits
- Average: 140 credits/user
- **2M credits = ~14,000 users**

---

## Environment Variables Needed

```bash
# Already have:
ELEVENLABS_API_KEY=a90d82a90533e5f2eeacfc232e3d9860fa00b157f4396d592f942ca2c94cf68a
ELEVENLABS_AGENT_ID_EN=agent_2201kcn21gdmfs0scz554bxwk0vv
ELEVENLABS_AGENT_ID_ES=agent_7001kcn1z0vges0bdhgjvvb94e05

# NEW - Need to add:
GROQ_API_KEY=<get from console.groq.com - FREE, no credit card>
ELEVENLABS_VOICE_ID_EN=<find in ElevenLabs voice library>
ELEVENLABS_VOICE_ID_ES=<find in ElevenLabs voice library>
```

**Note:** Voice IDs ≠ Agent IDs. Voice IDs are for TTS API, look like `21m00Tcm4TlvDq8ikWAM`

---

## Implementation Checklist

### Setup (5 minutes)
- [ ] Get Groq API key from https://console.groq.com
- [ ] Find Voice IDs in https://elevenlabs.io/app/voice-library
- [ ] Add to `.env.local`
- [ ] Run: `npm install groq-sdk`
- [ ] Restart dev server: `npm run dev`

### Files to Create (30 minutes)

**1. `lib/groq-client.ts`** - Text generation
```typescript
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateResponseText(
  question: string,
  language: 'en' | 'es'
): Promise<string> {
  const systemPrompt = language === 'en'
    ? YOUR_ENGLISH_PROMPT
    : YOUR_SPANISH_PROMPT;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ],
    model: "llama-3.1-70b-versatile",
    max_tokens: 150,
    temperature: 0.3,
  });

  return response.choices[0].message.content || '';
}
```

**2. `lib/elevenlabs-tts.ts`** - Audio generation
```typescript
import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export async function textToSpeechStream(
  text: string,
  language: 'en' | 'es'
): Promise<ReadableStream> {
  const voiceId = language === 'en'
    ? process.env.ELEVENLABS_VOICE_ID_EN
    : process.env.ELEVENLABS_VOICE_ID_ES;

  return await client.textToSpeech.convert(voiceId, {
    text,
    model_id: "eleven_multilingual_v2",
  });
}
```

**3. `app/api/conversation/dynamic/route.ts`** - API endpoint
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateResponseText } from '@/lib/groq-client';
import { textToSpeechStream } from '@/lib/elevenlabs-tts';

export async function POST(req: NextRequest) {
  const { text, language } = await req.json();

  // Generate text with Groq (FREE)
  const responseText = await generateResponseText(text, language);

  // Convert to audio with ElevenLabs (200 credits)
  const audioStream = await textToSpeechStream(responseText, language);

  // Convert stream to base64
  const chunks: Uint8Array[] = [];
  const reader = audioStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const audioBuffer = Buffer.concat(chunks);
  const audioBase64 = audioBuffer.toString('base64');

  return NextResponse.json({
    type: 'dynamic',
    text: responseText,
    audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
  });
}
```

**4. Update `components/poder-agent.tsx`** - handleQuestion function
```typescript
const handleQuestion = useCallback(async (text: string) => {
  setIsAgentThinking(true);

  // Try FAQ first (fast, free)
  const faqAnswer = findAnswer(text, language);

  if (faqAnswer && faqAnswer.confidence >= 0.7) {
    setResponse(faqAnswer);
    playAnswer(faqAnswer.audioUrl);
    setIsAgentThinking(false);
    return;
  }

  try {
    // Use dynamic Q&A
    const response = await fetch('/api/conversation/dynamic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    const data = await response.json();

    setResponse({
      id: `dynamic-${Date.now()}`,
      question: text,
      answer: data.text,
      audioUrl: data.audioUrl,
      confidence: 1,
    });
    playAnswer(data.audioUrl);

  } catch (error) {
    // Fallback to low-confidence FAQ or error
    if (faqAnswer) {
      setResponse(faqAnswer);
      playAnswer(faqAnswer.audioUrl);
    } else {
      setError("Couldn't find an answer");
    }
  } finally {
    setIsAgentThinking(false);
  }
}, [language, playAnswer]);
```

### Testing (10 minutes)
- [ ] Ask FAQ question → should use MP3
- [ ] Ask non-FAQ question → should use Groq + TTS
- [ ] Test in Spanish
- [ ] Verify audio quality
- [ ] Check response time (should be 2-3 seconds)

---

## System Prompts to Use

Copy these into `lib/groq-client.ts`:

**English:**
```
You are Poder's voice assistant. Help people understand their legal rights in crisis situations.

CRITICAL RULES:
- Response length: 2-3 sentences maximum
- Use second person ("You have the right...")
- Action-first ("Don't open. Ask for warrant under door.")
- Offer elaboration, don't dump it ("Want to know why?")

Never give specific legal advice. This is educational information only.
```

**Spanish:**
```
Eres el asistente de voz de Poder. Ayuda a las personas a entender sus derechos legales en situaciones de crisis.

REGLAS CRÍTICAS:
- Longitud de respuesta: 2-3 oraciones máximo
- Usa segunda persona ("Tienes el derecho...")
- Acción primero ("No abras. Pide orden bajo puerta.")
- Ofrece elaboración, no la des toda ("¿Quieres saber por qué?")

Nunca des asesoría legal específica. Esto es información educativa solamente.
```

---

## Future Enhancements (Not Now)

**Layer 1 (Crisis Cards):** Add later if users need instant visual responses
**Layer 3 (Conversations):** Add later if users ask 3+ follow-up questions

For now, Layer 2.5 proves the concept with minimal complexity.

---

## Expected Results

**Before (Layer 2 only):**
- Handles 10 questions
- 70% of users get "no answer" error

**After (Layer 2 + 2.5):**
- Handles unlimited questions
- 100% of users get answers
- Costs: 140 credits/user average
- Speed: 0.5s (FAQ) or 2-3s (dynamic)

---

## Troubleshooting

**"Groq API key invalid"**
- Check you copied full key from console.groq.com
- Key should start with `gsk_`

**"Voice ID not found"**
- Voice ID ≠ Agent ID
- Find in Voice Library, not Conversational AI section
- Should be ~22 characters long

**"Audio not playing"**
- Check browser console for errors
- Verify base64 audio is valid
- Test with small text first

**"Responses too long"**
- Adjust `max_tokens` in Groq config
- Make system prompt more explicit about brevity
- Add character limit to prompt

---

## Timeline

- ⏱️ Setup: 5 minutes
- ⏱️ Implementation: 30 minutes
- ⏱️ Testing: 10 minutes
- ⏱️ **Total: 45 minutes**

Then you have unlimited Q&A capability using free Groq + your ElevenLabs credits.
