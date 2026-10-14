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
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(61,255,154,0.45))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(61,255,154,0.75))' },
        },
      },
      animation: {
        'petal-fall': 'petal-fall var(--dur) linear var(--delay) infinite',
        flicker: 'flicker 4s steps(1) infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
