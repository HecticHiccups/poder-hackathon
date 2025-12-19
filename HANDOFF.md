# Poder Project Handoff Guide

> Last updated: December 2024
> Purpose: Context and debugging insights for continuity between AI sessions

---

## Project Overview

**Poder** is a bilingual (EN/ES) legal rights education app built with Next.js 14. It features:
- Swipeable rights cards (Tinder-style learning)
- Interactive scenario simulations (choose-your-adventure)
- Voice FAQ agent (speech-to-text → answer → text-to-speech)
- Full bilingual support with language toggle

---

## Architecture Layers

### Layer 1: Static Content
- Rights cards in `/src/data/rights-content.ts`
- Scenarios in `/src/data/scenarios.ts`
- User data/badges in `/src/data/user-data.ts`

### Layer 2: Pre-recorded FAQ (FREE, instant)
- FAQ questions in `/src/data/knowledge-base/{en,es}/*.json`
- Pre-recorded MP3s in `/public/audio/{en,es}/*.mp3`
- Matching logic in `/src/lib/poder-agent.ts`
- Works offline, no API keys needed

### Layer 2.5: Dynamic Q&A (requires API keys)
- Groq (FREE LLM) → ElevenLabs (TTS) pipeline
- API route: `/src/app/api/conversation/dynamic/route.ts`
- Groq client: `/src/lib/groq-client.ts`
- ElevenLabs client: `/src/lib/elevenlabs-tts.ts`

---

## Key Debugging Techniques

### 1. Health Check Endpoints

**Check if API keys are configured:**
```bash
curl https://poder-hackathon.vercel.app/api/conversation/dynamic
```

Expected response when configured:
```json
{"status":"ok","layer":"2.5","config":{"groqApiKey":"configured",...}}
```

If misconfigured:
```json
{"status":"misconfigured","config":{"groqApiKey":"missing",...}}
```

### 2. Audio File Verification

**Check if audio files are accessible:**
```bash
curl -I https://poder-hackathon.vercel.app/audio/en/ice_door_001.mp3
```

Should return `HTTP/2 200`. If 404, check `/public/audio/` directory.

### 3. TypeScript Verification

Always run before pushing:
```bash
npx tsc --noEmit
```

### 4. Console Logging Pattern

The codebase uses prefixed logging for tracing:
- `[Poder Agent]` - Voice agent routing decisions
- `[Audio]` - Audio playback events
- `[Dynamic Q&A]` - API route processing
- `[Groq Client]` - LLM generation
- `[ElevenLabs TTS]` - Speech synthesis

---

## Environment Variables (Vercel)

Required for Layer 2.5 (dynamic voice):
```
GROQ_API_KEY=gsk_...          # From console.groq.com (FREE)
ELEVENLABS_API_KEY=...        # From elevenlabs.io
ELEVENLABS_VOICE_ID_EN=...    # English voice ID
ELEVENLABS_VOICE_ID_ES=...    # Spanish voice ID
```

Layer 2 (pre-recorded FAQ) works without any API keys.

---

## Common Issues & Solutions

### Issue: Mic shows "Access Denied"
**Cause:** Permission check was too strict (required 'granted', but mobile returns 'prompt')
**Solution:** Changed to `state !== 'denied'` in `/src/components/poder-agent.tsx:134-150`

### Issue: FAB button unclickable on mobile
**Cause:** Positioned within bottom nav touch area
**Solution:** Changed from `bottom-4` to `bottom-20` for mobile

### Issue: Audio doesn't play on mobile
**Cause:** Mobile browsers block autoplay; need `load()` before `play()`
**Solution:** Added `audio.load()`, `playsInline`, `preload="auto"` attributes

### Issue: Language toggle too large on mobile
**Cause:** Fixed size didn't adapt to mobile
**Solution:** Made it flag-only (36x36px) on mobile, expands on desktop

### Issue: Voice agent returns error for "hello"
**Cause:** API keys not set in Vercel environment
**Solution:** Add env vars OR use fallback text response (implemented)

---

## Translation System

### Static Translations (LanguageContext)
Location: `/src/context/LanguageContext.tsx`

Pattern:
```typescript
const { t, language } = useLanguage();
// t('profile.badges') → "Badges" or "Insignias"
```

### Data Translations (bilingual fields)
Content files use `_es` suffix pattern:
```typescript
{
  title: "English Title",
  title_es: "Título en Español",
}
```

Helper functions extract localized content:
- `getLocalizedCard(card, language)`
- `getLocalizedScenario(scenario, language)`
- `getLocalizedStep(step, language)`
- `getLocalizedChoice(choice, language)`
- `getTitle(level, language)` - for user titles

---

## File Structure Quick Reference

```
src/
├── app/
│   ├── page.tsx           # Home
│   ├── learn/page.tsx     # Card swiper
│   ├── play/page.tsx      # Scenario selector
│   ├── profile/page.tsx   # User profile
│   └── api/
│       └── conversation/dynamic/route.ts  # Voice API
├── components/
│   ├── poder-agent.tsx    # Voice FAB + modal
│   ├── rights-card.tsx    # Swipeable cards
│   ├── game-engine.tsx    # Scenario player
│   └── language-toggle.tsx
├── context/
│   └── LanguageContext.tsx  # i18n system
├── data/
│   ├── rights-content.ts  # Card data
│   ├── scenarios.ts       # Scenario data
│   ├── user-data.ts       # Badges, titles
│   └── knowledge-base/    # FAQ JSONs
├── lib/
│   ├── poder-agent.ts     # FAQ matching logic
│   ├── groq-client.ts     # LLM client
│   └── elevenlabs-tts.ts  # TTS client
public/
└── audio/{en,es}/*.mp3    # Pre-recorded FAQ audio
```

---

## Testing Checklist

Before deploying, verify:

- [ ] `npx tsc --noEmit` passes
- [ ] Language toggle switches all content (cards, scenarios, profile)
- [ ] FAQ questions play audio when tapped
- [ ] Mic permission prompt appears (not auto-denied)
- [ ] FAB is clickable and draggable on mobile
- [ ] Health endpoint shows correct config status

---

## Git Workflow

Commits use conventional format:
```
feat: new feature
fix: bug fix
perf: performance improvement
```

Always include co-author:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Performance Notes

- Cards use `willChange: 'transform'` only on active card
- Framer Motion animations have reduced durations for mobile
- Audio preload changed from "none" to "auto" for faster playback
- Language context uses `useCallback` to prevent re-renders

---

## Known Limitations

1. **Speech Recognition:** Uses Web Speech API (Chrome/Safari only, not Firefox)
2. **iOS Safari:** Requires user gesture before audio playback
3. **Dynamic Voice:** Requires paid ElevenLabs credits after free tier
4. **Offline:** Only Layer 2 (pre-recorded FAQ) works offline

---

## Next Steps (Suggested)

1. Add more FAQ questions to knowledge base
2. Implement scenario completion tracking in profile
3. Add push notifications for streak reminders
4. Consider WebSocket for real-time voice conversation
5. Add offline detection and graceful degradation
