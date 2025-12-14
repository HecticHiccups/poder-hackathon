# Audio Generation Guide for Poder Voice Agent

## Overview

This guide will help you generate the pre-recorded audio files using your 110k ElevenLabs credits efficiently.

---

## Step 1: Set Up ElevenLabs Voice

### Create "Poder" Voice Profile

1. Go to [ElevenLabs Voice Lab](https://elevenlabs.io/voice-lab)
2. Either:
   - **Option A:** Select a pre-made voice that matches Poder's persona
     - Recommended voices: Look for warm, confident, mid-30s tone
     - Try: "Adam" (English), "Diego" (Spanish) as starting points
   - **Option B:** Clone your own voice or a friend's (instant voice cloning included in Creator plan)
3. Name it "Poder" for easy reference

### Voice Settings
- **Stability:** 60-70% (natural variation, not too robotic)
- **Clarity:** 70-80% (clear pronunciation for legal content)
- **Style Exaggeration:** 20-30% (conversational but not overdone)

---

## Step 2: Generate Audio Files

### Batch Generation Script

You can use the ElevenLabs API or their web interface. Here's a simple Node.js script:

```bash
# Install ElevenLabs SDK
npm install elevenlabs
```

Create `scripts/generate-audio.ts`:

```typescript
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";
import enFAQ from "../src/data/knowledge-base/en/immigration-faq.json";
import esFAQ from "../src/data/knowledge-base/es/preguntas-inmigracion.json";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function generateAudio() {
  // English audio
  for (const q of enFAQ.questions) {
    console.log(`Generating: ${q.id}...`);
    
    const audio = await client.generate({
      voice: "Poder", // Your voice name
      text: q.voiceScript,
      model_id: "eleven_turbo_v2_5", // Faster + cheaper (0.5 credits/char)
    });
    
    const outputPath = path.join(
      __dirname,
      `../public/audio/en/${q.audioFile}`
    );
    
    const writeStream = fs.createWriteStream(outputPath);
    audio.pipe(writeStream);
    
    await new Promise((resolve) => writeStream.on("finish", resolve));
    console.log(`✓ Saved: ${q.audioFile}`);
  }
  
  // Spanish audio (repeat for esFAQ)
  for (const q of esFAQ.questions) {
    console.log(`Generando: ${q.id}...`);
    
    const audio = await client.generate({
      voice: "Poder_ES", // Spanish voice variant
      text: q.voiceScript,
      model_id: "eleven_turbo_v2_5",
      language_code: "es", // Important for Spanish
    });
    
    const outputPath = path.join(
      __dirname,
      `../public/audio/es/${q.audioFile}`
    );
    
    const writeStream = fs.createWriteStream(outputPath);
    audio.pipe(writeStream);
    
    await new Promise((resolve) => writeStream.on("finish", resolve));
    console.log(`✓ Guardado: ${q.audioFile}`);
  }
}

generateAudio().then(() => {
  console.log("🎉 All audio files generated!");
  console.log("Check /public/audio/ folder");
});
```

Run it:
```bash
ELEVENLABS_API_KEY=your_key_here npx tsx scripts/generate-audio.ts
```

---

## Step 3: Manual Generation (Web UI)

If you prefer the web interface:

### For Each Question:

1. Go to [ElevenLabs Speech Synthesis](https://elevenlabs.io/speech-synthesis)
2. Select "Poder" voice
3. Paste the `voiceScript` text
4. Click "Generate"
5. Download MP3
6. Rename to match `audioFile` name (e.g., `ice_door_001.mp3`)
7. Move to appropriate folder:
   - English: `/public/audio/en/`
   - Spanish: `/public/audio/es/`

**Repeat for all 10 questions × 2 languages = 20 files**

---

## Credit Usage Estimate

### Per File Calculation

| Language | Avg Script Length | Credits per File | Model |
|----------|------------------|------------------|-------|
| English  | ~300 characters  | 150-300 credits  | Turbo v2.5 (0.5-1 credit/char) |
| Spanish  | ~350 characters  | 175-350 credits  | Turbo v2.5 |

### Total for 20 Files
- **Optimistic:** 20 files × 150 credits = **3,000 credits**
- **Realistic:** 20 files × 250 credits = **5,000 credits**
- **Conservative:** 20 files × 300 credits = **6,000 credits**

**Budget remaining:** 110,000 - 6,000 = **104,000 credits** for future dynamic TTS! 🎉

---

## Step 4: Verify Audio Quality

After generation, test each file:

```bash
# Create test HTML (optional)
# Open in browser to preview all audio
```

Or manually:
1. Open `/public/audio/en/ice_door_001.mp3` in your browser
2. Listen for:
   - Clear pronunciation
   - Natural pacing
   - Appropriate tone (warm, supportive)
   - No robotic artifacts
3. If quality is poor, regenerate with adjusted voice settings

---

## Step 5: Optimize File Sizes (Optional)

Audio files can be compressed to reduce app bundle size:

```bash
# Install ffmpeg (if not already installed)
brew install ffmpeg

# Compress all MP3 files
find public/audio -name "*.mp3" -exec ffmpeg -i {} -b:a 64k {}.compressed.mp3 \;

# 64kbps is good quality for voice
# Will reduce ~50KB files to ~20KB
```

---

## Directory Structure After Generation

```
/public/audio/
├── en/
│   ├── ice_door_001.mp3           (✓ Generated)
│   ├── ice_warrant_001.mp3        (✓ Generated)
│   ├── ice_workplace_001.mp3      (✓ Generated)
│   ├── police_questions_001.mp3   (✓ Generated)
│   ├── police_record_001.mp3      (✓ Generated)
│   ├── police_search_001.mp3      (✓ Generated)
│   ├── housing_lockout_001.mp3    (✓ Generated)
│   ├── housing_documentation_001.mp3 (✓ Generated)
│   ├── resources_legal_001.mp3    (✓ Generated)
│   └── resources_daca_001.mp3     (✓ Generated)
└── es/
    ├── ice_puerta_001.mp3         (✓ Generated)
    ├── ice_orden_001.mp3          (✓ Generated)
    ├── ice_trabajo_001.mp3        (✓ Generated)
    ├── policia_preguntas_001.mp3  (✓ Generated)
    ├── policia_grabar_001.mp3     (✓ Generated)
    ├── policia_registro_001.mp3   (✓ Generated)
    ├── vivienda_desalojo_001.mp3  (✓ Generated)
    ├── vivienda_documentacion_001.mp3 (✓ Generated)
    ├── recursos_legal_001.mp3     (✓ Generated)
    └── recursos_daca_001.mp3      (✓ Generated)
```

---

## Troubleshooting

### Issue: Voice sounds robotic
**Solution:** Lower stability to 50-60%, increase style exaggeration to 30-40%

### Issue: Mispronouncing legal terms
**Solution:** Use phonetic spelling in script (e.g., "I-C-E" instead of "ICE" for acronyms)

### Issue: Too fast/slow pacing
**Solution:** Add periods or commas in script to control pausing

### Issue: API rate limits
**Solution:** Add delays between requests:
```typescript
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay
```

---

## Next Steps

Once all audio files are generated:

1. ✓ Commit audio files to Git (they're small, ~50KB each)
2. ✓ Test playback in browser: `open public/audio/en/ice_door_001.mp3`
3. ✓ Move to Phase 4-5: Build the UI component

---

## Quick Test

Test one file before generating all:

```typescript
// Test with first question only
const testQ = enFAQ.questions[0];
// ... generate audio ...
// Listen and verify quality before batch processing
```

This ensures you're happy with voice settings before using credits on all 20 files!

---

**Estimated Time:** 30-60 minutes (API) or 2-3 hours (manual)  
**Credit Cost:** ~5,000 credits  
**Output:** 20 high-quality audio files ready for your app
