/**
 * Audio Generation Script for Poder Voice Agent
 * 
 * This script generates all 20 audio files (10 EN + 10 ES) using ElevenLabs API
 * 
 * Setup:
 * 1. Install elevenlabs SDK: npm install elevenlabs
 * 2. Set your API key: export ELEVENLABS_API_KEY=your_key_here
 * 3. Update VOICE_IDS below with your voice IDs
 * 4. Run: node scripts/generate-audio.js
 */

// Polyfill for older Node versions
if (typeof global.AbortController === 'undefined') {
    global.AbortController = class AbortController {
        constructor() {
            this.signal = { aborted: false };
        }
        abort() {
            this.signal.aborted = true;
        }
    };
}

const { ElevenLabsClient } = require("elevenlabs");
const fs = require("fs");
const path = require("path");

// Import your knowledge base
const enFAQ = require("../src/data/knowledge-base/en/immigration-faq.json");
const esFAQ = require("../src/data/knowledge-base/es/preguntas-inmigracion.json");

// ========================================
// CONFIGURATION - UPDATE THESE
// ========================================

const VOICE_IDS = {
    en: "V12Xei7RDWSEq1q5UpCd",  // Get from ElevenLabs dashboard
    es: "JgmJ33RuT4tPQOENamHR",  // Get from ElevenLabs dashboard
};

const MODEL_ID = "eleven_turbo_v2_5"; // Fast + cheap (0.5 credits/char)

// ========================================
// MAIN GENERATION LOGIC
// ========================================

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

async function generateAudioFile(text, voiceId, outputPath, languageCode = null) {
    console.log(`🎙️  Generating: ${path.basename(outputPath)}...`);

    try {
        const audioStream = await elevenlabs.generate({
            voice: voiceId,
            text: text,
            model_id: MODEL_ID,
        });

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write ReadableStream to file
        const writeStream = fs.createWriteStream(outputPath);

        // Read from Web ReadableStream and write to Node stream
        const reader = audioStream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            writeStream.write(Buffer.from(value));
        }
        // Close the write stream
        await new Promise((resolve, reject) => {
            writeStream.end(() => resolve());
            writeStream.on("error", reject);
        });

        const stats = fs.statSync(outputPath);
        console.log(`   ✅ Saved: ${path.basename(outputPath)} (${Math.round(stats.size / 1024)}KB)`);

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error(`   ❌ Error generating ${path.basename(outputPath)}:`, error.message);
        throw error;
    }
}

async function generateAllAudio() {
    console.log("\n🚀 Starting Poder Audio Generation\n");
    console.log("=".repeat(60));

    let totalCreditsEstimate = 0;
    let successCount = 0;
    let errorCount = 0;

    // Generate English audio
    console.log("\n📝 ENGLISH (10 files)\n");
    for (const q of enFAQ.questions) {
        const outputPath = path.join(__dirname, `../public/audio/en/${q.audioFile}`);

        try {
            await generateAudioFile(
                q.voiceScript,
                VOICE_IDS.en,
                outputPath
            );

            // Estimate credits used (Turbo model = ~0.5-1 credit/char)
            const estimatedCredits = Math.ceil(q.voiceScript.length * 0.75);
            totalCreditsEstimate += estimatedCredits;
            successCount++;

        } catch (error) {
            errorCount++;
            console.error(`   Skipping ${q.id} due to error\n`);
        }
    }

    // Generate Spanish audio
    console.log("\n📝 ESPAÑOL (10 files)\n");
    for (const q of esFAQ.questions) {
        const outputPath = path.join(__dirname, `../public/audio/es/${q.audioFile}`);

        try {
            await generateAudioFile(
                q.voiceScript,
                VOICE_IDS.es,
                outputPath,
                "es" // Language code for Spanish
            );

            // Estimate credits used
            const estimatedCredits = Math.ceil(q.voiceScript.length * 0.75);
            totalCreditsEstimate += estimatedCredits;
            successCount++;

        } catch (error) {
            errorCount++;
            console.error(`   Skipping ${q.id} due to error\n`);
        }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("\n🎉 GENERATION COMPLETE!\n");
    console.log(`✅ Successful: ${successCount}/20 files`);
    console.log(`❌ Errors: ${errorCount}/20 files`);
    console.log(`💰 Estimated credits used: ~${totalCreditsEstimate} credits`);
    console.log(`\n📂 Audio files saved to: /public/audio/`);
    console.log(`   - English: /public/audio/en/`);
    console.log(`   - Spanish: /public/audio/es/`);
    console.log("\n" + "=".repeat(60) + "\n");
}

// ========================================
// RUN
// ========================================

// Check for API key
if (!process.env.ELEVENLABS_API_KEY) {
    console.error("\n❌ Error: ELEVENLABS_API_KEY environment variable not set\n");
    console.log("Set it with: export ELEVENLABS_API_KEY=your_key_here\n");
    process.exit(1);
}

// Check voice IDs are configured
if (VOICE_IDS.en.includes("YOUR_") || VOICE_IDS.es.includes("YOUR_")) {
    console.error("\n❌ Error: Please update VOICE_IDS in this script with your ElevenLabs voice IDs\n");
    console.log("Find your voice IDs at: https://elevenlabs.io/app/voice-library\n");
    process.exit(1);
}

// Run generation
generateAllAudio()
    .then(() => {
        console.log("✨ Next step: Test the audio files in your browser!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Fatal error:", error);
        process.exit(1);
    });
