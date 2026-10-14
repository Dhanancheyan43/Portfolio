/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#03100A',
        moss: '#0A2418',
        neon: '#3DFF9A',
        mint: '#A8F5CF',
        marble: '#F2EDE4',
        rose: '#F6B7C9',
        gold: '#D8C08A',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'Cinzel', 'serif'],
        // Algerian is a licensed font (bundled with Microsoft Office); visitors who have it
        // installed get it, everyone else gets Cinzel Decorative.
        algerian: ['Algerian', '"Algerian Regular"', '"Cinzel Decorative"', 'Cinzel', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'petal-fall': {
          '0%': { transform: 'translate3d(0, -10vh, 0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.9' },
          '100%': { transform: 'translate3d(var(--drift), 110vh, 0) rotate(var(--spin))', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.85' },
          '50%': { opacity: '0.4' },
          '55%': { opacity: '0.9' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.04)' },
        },
        'crack-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '40%': { opacity: '1' },
          '46%': { opacity: '0.55' },
          '52%': { opacity: '0.95' },
        },
        'rain-fall': {
          '0%': { transform: 'translate3d(0, -30vh, 0)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translate3d(0, 115vh, 0)', opacity: '0' },
        },
        'scan-sweep': {
          '0%': { transform: 'translate3d(0, -10vh, 0)', opacity: '0' },
          '8%': { opacity: '1' },
          '92%': { opacity: '1' },
          '100%': { transform: 'translate3d(0, 110vh, 0)', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(61,255,154,0.45))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(61,255,154,0.75))' },
        },
      },
      animation: {
        'petal-fall': 'petal-fall var(--dur) linear var(--delay) infinite',
        flicker: 'flicker 4s steps(1) infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'ken-burns': 'ken-burns 20s ease-in-out infinite alternate',
        'crack-pulse': 'crack-pulse 3.6s ease-in-out infinite',
        'rain-fall': 'rain-fall var(--dur) linear var(--delay) infinite',
        'scan-sweep': 'scan-sweep 7s linear infinite',
      },
    },
  },
  plugins: [],
};
