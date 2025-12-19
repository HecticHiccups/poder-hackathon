# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Poder** (Spanish for "Power") is a mobile-first educational platform that archives, simplifies, translates, and gamifies rights information to empower vulnerable communities. The platform helps immigrants, tenants, workers, and activists learn and practice asserting their legal rights through interactive simulations and swipeable educational content.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router with React Server Components)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **Animations**: Framer Motion (with reduced motion support)
- **State Management**: Zustand (lightweight, no boilerplate)
- **Voice/Audio**: ElevenLabs TTS + Web Speech API for voice recognition
- **Fonts**: Bebas Neue (display), Bitter (body), JetBrains Mono (code/stats)

## Architecture

### Core App Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts, PoderAgent global component
│   ├── page.tsx           # Landing page with hero + stats
│   ├── learn/page.tsx     # Swipeable rights cards
│   ├── play/page.tsx      # Game scenario selection
│   └── profile/page.tsx   # User stats, badges, gamification
├── components/
│   ├── poder-agent.tsx    # Global voice assistant FAB + modal
│   ├── rights-card.tsx    # Swipeable card component for /learn
│   └── game-engine.tsx    # Scenario simulator for /play
├── data/
│   ├── rights-content.ts  # 14 educational cards (5 categories)
│   ├── scenarios.ts       # 3 interactive game scenarios
│   ├── user-data.ts       # Gamification system (badges, XP, levels)
│   └── knowledge-base/    # Voice assistant Q&A JSON files
│       ├── en/immigration-faq.json
│       └── es/preguntas-inmigracion.json
└── lib/
    └── poder-agent.ts     # Keyword-based FAQ matching utility
```

### Design System

Custom CSS variables defined in `src/app/globals.css`:

- `--poder-fire`: #FF6B00 (primary brand color, CTAs)
- `--poder-neon`: #00F0FF (accents, highlights)
- `--poder-gold`: #FFD700 (badges, rewards)
- `--poder-midnight`: #1A1A1D (dark background)
- `--poder-charcoal`: #272727 (secondary background)
- `--poder-paper`: #F5F5F5 (text on dark)

Font variables:
- `--font-bebas`: Display font for headlines/titles
- `--font-bitter`: Body text (legal content readability)
- `--font-jetbrains`: Monospace for stats/code elements

### Key Features

#### 1. Voice Assistant (`poder-agent.tsx`)

- **FAB**: Floating action button (bottom-right) with gradient + pulse animation
- **Modal**: Bottom sheet on mobile, centered modal on desktop
- **Speech Recognition**: Uses Web Speech API (webkit prefixed for Safari)
- **Bilingual Support**: Toggle between English/Spanish (EN 🇺🇸 / ES 🇲🇽)
- **Audio Playback**: Pre-generated ElevenLabs TTS audio files in `/public/audio/{lang}/`
- **Keyword Matching**: Simple scoring system in `lib/poder-agent.ts` (no AI required for MVP)

The agent is always mounted in `app/layout.tsx` but hidden on scenario pages via `pathname` check.

#### 2. Learn Section (`learn/page.tsx`)

- **Swipeable Cards**: Right = learned, Left = skip
- **14 Total Cards**: Immigration (3), Housing (3), Labor (3), Criminal Justice (3), Healthcare (2)
- **XP System**: 15 points per card learned
- **Category Filtering**: Filter by rights category
- **Progress Tracking**: Visual progress bar

Card data structure in `data/rights-content.ts`:
```typescript
{
  id: string;           // e.g., "imm-001"
  category: RightsCategory;
  title: string;        // Card headline
  summary: string;      // One-liner for preview
  fullContent: string;  // Full educational content
  source: string;       // Citation
  powerPoints: number;  // XP reward
  tags: string[];       // Searchable keywords
}
```

#### 3. Play Section (`play/page.tsx`)

- **3 Interactive Scenarios**:
  1. The Traffic Stop (Police encounter)
  2. The Knock at the Door (ICE home visit)
  3. The Illegal Eviction (Landlord confrontation)

- **Timed Choices**: Pressure simulation (10-15 seconds per decision)
- **Score System**: Track correct/incorrect choices
- **Performance Grades**: A/B/C/D/F based on score
- **XP Rewards**: 50 XP per completion, bonus for 80%+
- **Feedback**: Instant explanation of why choices are right/wrong

Scenario data structure in `data/scenarios.ts`:
```typescript
{
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: RightsCategory;
  estimatedTime: number;  // minutes
  stages: Stage[];        // Branching decision tree
}
```

#### 4. Gamification System (`user-data.ts`)

- **Power Points**: Main XP currency
- **Levels**: 1-10+ with title progression (Newcomer → Poder Master)
- **Badges**: 15 total across 4 categories:
  - Learning (complete cards by category)
  - Gameplay (scenario achievements)
  - Streak (daily engagement)
  - Special (early adopter, supporter)
- **Streak System**: Daily engagement tracking

### Audio Generation Workflow

Pre-generated audio files are required for the voice assistant. Located in `/public/audio/`:

```
public/audio/
├── en/
│   ├── ice_door_001.mp3
│   ├── ice_warrant_001.mp3
│   └── ...
└── es/
    ├── ice_puerta_001.mp3
    └── ...
```

**Generation Script**: `scripts/generate-audio.js`

To generate audio files:

1. Install ElevenLabs SDK: `npm install elevenlabs`
2. Get voice IDs from [ElevenLabs Voice Library](https://elevenlabs.io/app/voice-library)
3. Update `VOICE_IDS` in `scripts/generate-audio.js` (lines 20-23)
4. Set API key: `export ELEVENLABS_API_KEY=your_key_here`
5. Run: `node scripts/generate-audio.js`

Expected output: 20 audio files (10 EN + 10 ES), ~30-70KB each, ~2-5 minutes total generation time.

See `AUDIO_QUICKSTART.md` for detailed instructions.

### Knowledge Base Structure

Voice assistant Q&A pairs stored as JSON in `src/data/knowledge-base/`:

```typescript
{
  category: string;
  language: "en" | "es";
  version: string;
  lastUpdated: string;
  questions: Array<{
    id: string;               // e.g., "ice-door-001"
    question: string;         // User-facing question
    keywords: string[];       // For matching algorithm
    answer: string;           // Concise text response
    voiceScript: string;      // Conversational TTS version
    audioFile: string;        // Filename in /public/audio/
    relatedScenarios: string[]; // Links to /play scenarios
    relatedCards: string[];   // Links to /learn cards
    category: string;
  }>
}
```

**Matching Algorithm** (`lib/poder-agent.ts`):
- Scores questions based on keyword matches (2 pts per keyword)
- Bonus for overlapping question words (0.5 pts each)
- Requires minimum score of 2 (at least 1 keyword match)
- Returns null if no match found

### Performance Optimizations

The app is heavily optimized for mobile performance:

1. **Framer Motion**: Memoized sub-components to prevent unnecessary re-renders
   - `PulseRing`, `ModalHeader`, `SuggestionsList` in `poder-agent.tsx`
   - Reduced motion support via `useReducedMotion` hook

2. **Animation Settings**:
   - Faster stagger timings (0.08s vs 0.15s)
   - Reduced movement distance (y: 20 vs y: 30)
   - Snappier spring physics (damping: 25, stiffness: 120)

3. **Lazy Loading**: Audio files loaded only when needed (`preload="none"`)

4. **Hydration Warnings**: Suppressed with `suppressHydrationWarning` on `<html>` and `<body>` (dark theme + font loading)

### Styling Conventions

- **Buttons**: `.btn-fire` (primary orange gradient), `.btn-neon` (cyan outline), `.btn-power` (gold accent)
- **Badges**: `.badge-neon`, `.badge-power` (small chips with glow effects)
- **Cards**: `.card-resistance` (dark cards with ring borders)
- **Responsive Design**: Mobile-first with `sm:` breakpoints
- **Dark Theme Only**: No light mode (enforced in `layout.tsx`)

### Important Implementation Notes

1. **Route Handling**: Use Next.js App Router patterns (Server Components by default)
2. **Client Components**: Mark with `"use client"` when using hooks, Framer Motion, or browser APIs
3. **Path Aliases**: Use `@/` for imports (maps to `src/`)
4. **Accessibility**: Always include `aria-label` on icon-only buttons, `role="img"` on decorative emojis
5. **Bilingual Support**: All user-facing strings should have EN/ES versions

### Common Patterns

**Adding a New Rights Card:**
1. Add to `RIGHTS_CARDS` array in `data/rights-content.ts`
2. Follow existing structure (id, category, title, summary, fullContent, source, powerPoints, tags)
3. Increment Power Points based on complexity (15 for standard cards)

**Adding a New Scenario:**
1. Add to `SCENARIOS` array in `data/scenarios.ts`
2. Design branching logic with `stages` array
3. Each stage has: `id`, `type` (intro/choice/result/conclusion), `content`, `choices`, `feedback`
4. Link to related rights cards via IDs

**Adding a New Voice FAQ:**
1. Add question to appropriate JSON in `data/knowledge-base/{lang}/`
2. Write conversational `voiceScript` (friendly tone, 30-60 seconds spoken)
3. Generate audio with ElevenLabs, save to `/public/audio/{lang}/{id}.mp3`
4. Link to related scenarios/cards via IDs

### Git Workflow

Recent commit messages follow conventional commit style:
- `feat:` for new features
- `perf:` for performance improvements
- `deploy:` for deployment triggers
- `trigger:` for forced rebuilds

The project deploys automatically to Vercel on push to main branch.

### Browser Support

- **Speech Recognition**: WebKit-prefixed API (Safari/Chrome)
- **Audio Playback**: Standard HTML5 `<audio>` element
- **Animations**: Framer Motion with fallbacks for `prefers-reduced-motion`
- **Mobile**: Optimized for iOS Safari and Android Chrome

---

## Current Implementation: Layer 2.5 (Dynamic Q&A)

**Architecture Decision (Dec 2024):**
- ✅ Layer 2 (existing): 10 FAQ MP3s with keyword matching
- ✅ Layer 2.5 (new): Groq (free LLM) + ElevenLabs TTS for unlimited Q&A
- ⏸️ Layer 1 (deferred): Crisis visual cards
- ⏸️ Layer 3 (deferred): WebSocket conversational agents

**Tech Stack:**
- **Text Generation**: Groq API (free tier, Llama 3.1 70B)
- **Audio Generation**: ElevenLabs TTS API (2M credits available)
- **Routing**: FAQ match (≥70% confidence) → MP3, else → Groq + TTS

**Implementation Guide:** See `IMPLEMENTATION_LAYER_2.5.md`

**Cost per Response:**
- FAQ hit: 0 credits (cached MP3)
- Dynamic: 200 ElevenLabs credits
- Average: 140 credits/user → 2M credits serves ~14,000 users

**Environment Variables Required:**
```bash
GROQ_API_KEY=<from console.groq.com>
ELEVENLABS_VOICE_ID_EN=<voice ID for TTS, not agent ID>
ELEVENLABS_VOICE_ID_ES=<voice ID for TTS, not agent ID>
```
