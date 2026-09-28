/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact tokens from irlos.live
        irloText: '#e8e4da',       // Bone white / warm cream
        irloBg: '#08080a',         // Pitch black / obsidian
        irloSurface: '#0e0e10',    // Dark charcoal
        irloRule: '#1e1e20',       // Dark rule
        irloRule2: '#2e2e31',      // Sharp border charcoal
        irloAccent: '#00d4ff',     // Electric Cyan
        irloAccentDim: '#0a6f85',  // Deep Cyan
        irloLive: '#4ade80',       // Phosphor Green
        irloMuted: '#948f86',      // Technical slate
        irloDim: '#6a655d',        // Dim stone
        // Dashboard Canvas (Swapped)
        canvasBg: '#e8e4da',       // Warm bone canvas matching irlos.live text
        cardSurface: '#ffffff',    // Crisp elevated white card
        cardAlt: '#f3efe6',        // Muted white / light stone
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px -2px rgba(0, 212, 255, 0.45)',
        'cyan-glow-sm': '0 0 8px 0px rgba(0, 212, 255, 0.35)',
        'live-glow': '0 0 12px 0px rgba(74, 222, 128, 0.45)',
        'sharp': '3px 3px 0px 0px #08080a',
        'sharp-sm': '2px 2px 0px 0px #08080a',
        'sharp-cyan': '3px 3px 0px 0px #00d4ff',
      }
    },
  },
  plugins: [],
}
