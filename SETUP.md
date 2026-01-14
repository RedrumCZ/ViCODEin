# Vibe Coding CZ/SK Dashboard - Setup Guide

## Quick Start

Your modern community dashboard is ready to go! It's currently running with mock data.

## Configuration

To connect your real data, update these two values in `src/config/constants.ts`:

```typescript
export const API_URL = "YOUR_API_URL_HERE";
export const SUBMIT_FORM_URL = "YOUR_FORM_URL_HERE";
```

### API Setup

Replace `YOUR_API_URL_HERE` with your JSON API endpoint. The API should return an array of objects with these exact keys:

```json
[
  {
    "project name 🚀": "My Awesome Project",
    "live demo url 🌐": "https://demo.example.com",
    "github repo or shared chat link 💾": "https://github.com/user/repo",
    "tech stack used 🛠️": "React, TypeScript, Tailwind",
    "time to mvp ⏱️": "4 hours",
    "vibe score": 95,
    "biggest 'wtf' moment & fix 🤯": "The AI suggested...",
    "author name / linkedin / x handle 👤": "John Doe @johndoe"
  }
]
```

### Form Link Setup

Replace `YOUR_FORM_URL_HERE` with your Google Form or submission form URL.

## Features

- **Animated Background**: Starfield effect with moving particles
- **Glassmorphism Cards**: Modern, frosted glass effect on project cards
- **Vibe Score Badge**: Glowing badges showing project scores
- **WTF Moment Reveal**: Expandable section for lessons learned
- **Search & Filter**: Real-time search by project name, tech stack, or author
- **Responsive Design**: Fully mobile-friendly grid layout
- **Smooth Animations**: Framer Motion powered entrance and hover effects
- **Neon Accents**: Cyan and blue gradient theme with glow effects

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React (icons)
- Vite

## Mock Data

The dashboard includes 3 sample projects to demonstrate the layout. Once you configure your API URL, it will automatically fetch and display your real data.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Customization

- **Colors**: Adjust the gradient colors in `src/components/AnimatedBackground.tsx` and throughout the components
- **Fonts**: Currently using Inter and JetBrains Mono from Google Fonts (configured in `index.html`)
- **Animation Speed**: Modify transition durations in component motion configs
- **Card Layout**: Change grid columns in `src/App.tsx` (currently 1/2/3 for mobile/tablet/desktop)

Enjoy your new dashboard! 🚀
