# Poder Voice Agent - Knowledge Base

This directory contains the Q&A knowledge base for the Poder voice assistant feature.

## Structure

```
knowledge-base/
├── en/                           # English content
│   └── immigration-faq.json     # Immigration Q&A pairs
└── es/                           # Spanish content
    └── preguntas-inmigracion.json  # Spanish Q&A pairs
```

## JSON Schema

Each JSON file contains:

```typescript
{
  category: string;           // Category identifier
  language: "en" | "es";      // Language code
  version: string;            // Version number
  lastUpdated: string;        // ISO date string
  questions: Array<{
    id: string;               // Unique identifier (e.g., "ice-door-001")
    question: string;         // User-facing question
    keywords: string[];       // For keyword matching
    answer: string;           // Concise text answer
    voiceScript: string;      // Conversational version for TTS
    audioFile: string;        // Filename for pre-generated audio
    relatedScenarios: string[]; // Links to /play scenarios
    relatedCards: string[];   // Links to /learn cards
    category: string;         // Sub-category
  }>
}
```

## Categories

- **ICE Encounters** (`ice-encounters` / `encuentros-ice`)
- **Police Interactions** (`police-interactions` / `interacciones-policiales`)
- **Housing Rights** (`housing-rights` / `derechos-vivienda`)
- **Legal Resources** (`legal-resources` / `recursos-legales`)

## Audio Files

Pre-generated audio files should be stored in:
```
/public/audio/
├── en/
│   ├── ice_door_001.mp3
│   ├── ice_warrant_001.mp3
│   └── ...
└── es/
    ├── ice_puerta_001.mp3
    ├── ice_orden_001.mp3
    └── ...
```

## Usage

```typescript
import enFAQ from '@/data/knowledge-base/en/immigration-faq.json';
import esFAQ from '@/data/knowledge-base/es/preguntas-inmigracion.json';

// Simple keyword matching
function findAnswer(query: string, lang: 'en' | 'es') {
  const kb = lang === 'en' ? enFAQ : esFAQ;
  // ... matching logic
}
```

## Adding New Questions

1. Add to appropriate JSON file
2. Generate voice script (conversational tone)
3. Generate audio with ElevenLabs TTS
4. Save audio to `/public/audio/{lang}/{id}.mp3`
5. Update version number and lastUpdated date

## Voice Script Guidelines

- **Tone:** Friendly, supportive, knowledgeable friend
- **Length:** 30-60 seconds when spoken
- **Style:** Conversational, not formal legal language
- **Persona:** Community organizer with legal knowledge
- Use contractions ("don't" not "do not" in voice)
- Add reassuring phrases ("You got this", "Stay calm")
- Emphasize KEY information with phrasing
