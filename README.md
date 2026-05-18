# Cursor Prompt Architect

Transform raw English/Hindi notes into precision Cursor prompts for Swift/iOS and Kotlin/Android development.

## Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
# Create the env file
cp .env.example .env.local

# Open .env.local and replace "your_api_key_here" with your real key
# Get key from: https://console.anthropic.com
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel (share with your team)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/cursor-prompt-architect.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Under **"Environment Variables"**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your actual key)
5. Click **Deploy**

Your app is live at something like `cursor-prompt-architect.vercel.app`

### Step 3 — Share
Send the URL to your colleague. Works on Mac, Windows, mobile — any browser.

---

## Project Structure

```
cursor-prompt-architect/
├── pages/
│   ├── index.js          ← Main UI
│   ├── _app.js           ← App wrapper
│   └── api/
│       └── generate.js   ← Server-side API route (API key stays here)
├── styles/
│   └── globals.css
├── .env.example          ← Template for your API key
├── .gitignore            ← Keeps .env.local out of Git
└── package.json
```

## Security

- The Anthropic API key lives only in Vercel's environment variables
- The browser never sees the key — all API calls go through `/api/generate`
- `.env.local` is gitignored so it's never committed

## Features

- Swift/iOS tab: Swift 6.3, iOS 26, SwiftUI/UIKit, MVVM/TCA/VIPER
- Kotlin/Android tab: Kotlin 2.3, API 35, Jetpack Compose, KMP support
- Understands English, Hindi, and Hinglish input
- Focus area chips for quick context
- Copy to clipboard
- Works on any browser, any OS
