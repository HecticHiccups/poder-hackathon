# 🎙️ Audio Generation - Quick Reference Card

## Your Next Steps (In Order)

### ✅ Step 1: Install ElevenLabs SDK
```bash
npm install elevenlabs
```

### ✅ Step 2: Get Your Voice IDs

1. Open ElevenLabs: https://elevenlabs.io/app/voice-library
2. Find your **English voice** → Click on it → Copy the **Voice ID**
3. Find your **Spanish voice** → Click on it → Copy the **Voice ID**

Voice IDs look like: `21m00Tcm4TlvDq8ikWAM`

### ✅ Step 3: Get Your API Key

1. Go to: https://elevenlabs.io/app/settings/api-keys
2. Click "Create new key" or copy existing key
3. Keep it handy for next step

### ✅ Step 4: Configure the Script

Edit: `scripts/generate-audio.js`

Around **line 20-23**, replace:
```javascript
const VOICE_IDS = {
  en: "YOUR_ENGLISH_VOICE_ID_HERE",  // ← Paste English voice ID
  es: "YOUR_SPANISH_VOICE_ID_HERE",  // ← Paste Spanish voice ID
};
```

### ✅ Step 5: Set API Key & Run

```bash
# Set your API key (replace with your actual key)
export ELEVENLABS_API_KEY=sk_your_api_key_here

# Run the script
node scripts/generate-audio.js
```

### ✅ Step 6: Verify Output

You should see progress like:

```
🚀 Starting Poder Audio Generation
============================================================

📝 ENGLISH (10 files)

🎙️  Generating: ice_door_001.mp3...
   ✅ Saved: ice_door_001.mp3 (52KB)

🎙️  Generating: ice_warrant_001.mp3...
   ✅ Saved: ice_warrant_001.mp3 (48KB)
...
```

### ✅ Step 7: Test an Audio File

```bash
# Open one in your browser
open public/audio/en/ice_door_001.mp3

# Or test in your dev server
npm run dev
# Navigate to: http://localhost:3000/audio/en/ice_door_001.mp3
```

---

## 📊 Expected Results

- **Files created:** 20 total (10 EN + 10 ES)
- **Location:** `/public/audio/en/` and `/public/audio/es/`
- **File size:** ~30-70KB each
- **Total time:** 2-5 minutes
- **Credits used:** ~3,000-6,000 credits

---

## 🚨 Common Issues

**Issue:** `ELEVENLABS_API_KEY not set`  
**Fix:** Run `export ELEVENLABS_API_KEY=your_key_here`

**Issue:** `Voice ID not found`  
**Fix:** Double-check you pasted the Voice ID correctly (not the voice name)

**Issue:** Script fails partway through  
**Fix:** It's okay! Already-generated files are saved. Just re-run the script.

---

## Alternative: Manual Generation

Don't want to use the script? You can generate manually:

1. Go to: https://elevenlabs.io/speech-synthesis
2. Open: `src/data/knowledge-base/en/immigration-faq.json`
3. For each question:
   - Copy the `voiceScript` text
   - Paste in ElevenLabs
   - Select your English voice
   - Click "Generate"
   - Download MP3
   - Rename to the `audioFile` name
   - Save to `/public/audio/en/`
4. Repeat for Spanish using `es/preguntas-inmigracion.json`

**Time:** ~2-3 hours for manual generation

---

## ✨ After Generation is Complete

Come back here and we'll:
1. Test the audio files
2. Build the Poder voice assistant UI component
3. Integrate with your existing app

You're doing great! 🔥
