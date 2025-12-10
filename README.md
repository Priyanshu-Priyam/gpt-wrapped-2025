# ChatGPT Wrapped 2025

A viral, Gen Z-optimized "Spotify Wrapped" style experience for analyzing ChatGPT conversations or personal data dashboards.

## Features

- 🔥 **Digital Brutalism Aesthetic** - High contrast, neon green/pink on black, kinetic typography
- 🎯 **Gen Z Personality Analysis** - Internet slang archetypes (Terminal Rot, Academic Victim, etc.)
- 💀 **Spicy Roasts** - Controversial, shareable observations from your data
- 📊 **Toxicity Meter** - Chaotic energy score (0-100%)
- 🎴 **Story-like Interface** - 9:16 vertical cards with auto-advance
- 📸 **Shareable Cards** - Download any card as PNG

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Analysis**: Anthropic Claude (Sonnet 4.5)
- **Backend**: Express.js (for Custom GPT integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the frontend dev server:
```bash
npm run dev
```

Start the backend server (for Custom GPT integration):
```bash
node server.js
```

The app will be available at `http://localhost:5173`

## Usage

### Option 1: Direct Upload

1. Upload your `conversations.json` file (ChatGPT export)
2. Enter your Claude API key (optional, for AI analysis)
3. View your wrapped!

### Option 2: Custom GPT Integration

Your Custom GPT can POST analysis data to `/api/wrapped` and receive a viewer URL.

See `server.js` for the API schema.

## Project Structure

```
chatgpt-wrapped/
├── src/
│   ├── components/      # React components (cards, landing, etc.)
│   ├── utils/           # Analysis logic & Claude integration
│   └── App.tsx          # Main app orchestrator
├── server.js            # Express backend for Custom GPT
└── package.json
```

## License

MIT
