# Development Environment Setup

## ✅ Verified Modern Versions (2024-12-14)

### Node.js & Package Manager
- **Node.js:** v23.9.0 (Latest stable)
- **npm:** v11.6.2
- **Managed via:** nvm

### Project Dependencies
- **Next.js:** 16.0.7 (React 19 compatible)
- **React:** 19.2.0 (Latest)
- **TypeScript:** ^5
- **Tailwind CSS:** ^4
- **Framer Motion:** ^12.23.25
- **Zustand:** ^5.0.9
- **ElevenLabs:** ^1.59.0

---

## 🔧 Setup Instructions

### 1. Use Correct Node Version

We've locked the project to Node v23.9.0 via `.nvmrc`:

```bash
# Automatically switch to correct Node version
nvm use

# If you don't have v23.9.0 installed:
nvm install 23.9.0
nvm use 23.9.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
# Check Node version
node --version
# Should output: v23.9.0

# Check npm version  
npm --version
# Should output: 11.6.2+

# Run dev server to verify Next.js works
npm run dev
```

---

## 🎙️ ElevenLabs Audio Generation

### Requirements
- Node v23.9.0+ (for Web ReadableStream support)
- ElevenLabs API key

### Usage

```bash
# Audio files are pre-generated and committed to /public/audio/
# To regenerate (if needed):
export ELEVENLABS_API_KEY=your_key_here
node scripts/generate-audio.js
```

---

## 🐛 Troubleshooting

### "AbortController is not defined"
→ You're using an old Node version. Run `nvm use` to switch to v23.9.0

### "audioStream.pipe is not a function"
→ Old ElevenLabs SDK or Node version. Ensure you're on Node v23+ which has Web ReadableStream

### npm warnings about deprecated packages
→ `elevenlabs@1.59.0` shows deprecation warning but works perfectly for our use case

---

## 📦 Key Files

- **`.nvmrc`** - Locks Node version to v23.9.0
- **`package.json`** - Project dependencies
- **`scripts/generate-audio.js`** - Audio generation script
- **`src/data/knowledge-base/`** - Q&A content for Poder agent

---

**Last verified:** 2024-12-14  
**Environment:** macOS with nvm
