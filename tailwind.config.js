/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soul: {
          dark: '#030712',
          card: '#0B1120',
          border: '#1E293B',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          crimson: '#EF4444',
          purple: '#A855F7',
          emerald: '#10B981',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.45), 0 0 10px -2px rgba(245, 158, 11, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45), 0 0 10px -2px rgba(6, 182, 212, 0.25)',
        'glow-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.45), 0 0 10px -2px rgba(239, 68, 68, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.45), 0 0 10px -2px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45), 0 0 10px -2px rgba(168, 85, 247, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
