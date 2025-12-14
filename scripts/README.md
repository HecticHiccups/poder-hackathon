# Audio Generation Scripts

## Quick Start

### 1. Install Dependencies

```bash
npm install elevenlabs
```

### 2. Get Your Voice IDs

1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/app/voice-library)
2. Find your English voice → Click "Use" → Copy the Voice ID
3. Find your Spanish voice → Click "Use" → Copy the Voice ID

**Voice IDs look like:** `21m00Tcm4TlvDq8ikWAM` (example)

### 3. Configure the Script

Edit `scripts/generate-audio.js` and update:

```javascript
const VOICE_IDS = {
  en: "your_english_voice_id_here",
  es: "your_spanish_voice_id_here",
};
```

### 4. Set API Key

Get your API key from: https://elevenlabs.io/app/settings/api-keys

```bash
export ELEVENLABS_API_KEY=your_api_key_here
```

### 5. Run the Script

```bash
node scripts/generate-audio.js
```

The script will:
- Generate all 20 audio files (10 EN + 10 ES)
- Save them to `/public/audio/en/` and `/public/audio/es/`
- Show progress and credit estimates
- Take ~2-5 minutes total

---

## Manual Generation (Alternative)

If you prefer using the ElevenLabs web UI:

### For Each Question:

1. Go to [ElevenLabs Speech Synthesis](https://elevenlabs.io/speech-synthesis)
2. Select your voice (English or Spanish)
3. Copy the `voiceScript` text from the JSON file
4. Paste into ElevenLabs
5. Click "Generate"
6. Download the MP3
7. Rename to match the `audioFile` name
8. Move to `/public/audio/en/` or `/public/audio/es/`

**Repeat 20 times (10 EN + 10 ES)**

---

## Testing Generated Audio

After generation, test one file:

```bash
# Open in browser
open public/audio/en/ice_door_001.mp3
```

Or create a quick test HTML:

```html
<!DOCTYPE html>
<html>
<head><title>Audio Test</title></head>
<body>
  <h1>Poder Audio Test</h1>
  <audio controls src="/audio/en/ice_door_001.mp3"></audio>
</body>
</html>
```

---

## Troubleshooting

### "ELEVENLABS_API_KEY not set"
```bash
export ELEVENLABS_API_KEY=your_key_here
```

### "Voice ID not found"
- Double-check your voice IDs in the ElevenLabs dashboard
- Make sure you're using the correct voice ID, not the voice name

### Rate limit errors
- Script includes 500ms delays between requests
- If still hitting limits, increase delay in script:
  ```javascript
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
  ```

### Audio quality issues
- Adjust voice settings in ElevenLabs dashboard
- Stability: 60-70%
- Clarity: 70-80%
- Regenerate specific files as needed

---

## Estimated Costs

- **Per file:** ~150-300 credits
- **Total for 20 files:** ~3,000-6,000 credits
- **Remaining credits:** 104,000+ for future use

---

## What's Next?

After all audio files are generated:

1. ✅ Commit audio files to Git
2. ✅ Test playback in dev server (`npm run dev`)
3. ✅ Move to Phase 3: Build the UI component
