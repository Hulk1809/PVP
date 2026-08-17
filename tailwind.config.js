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
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.5), 0 0 15px -2px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.5), 0 0 15px -2px rgba(6, 182, 212, 0.3)',
        'glow-crimson': '0 0 30px -5px rgba(239, 68, 68, 0.5), 0 0 15px -2px rgba(239, 68, 68, 0.3)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.5), 0 0 15px -2px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.5), 0 0 15px -2px rgba(168, 85, 247, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'border-beam': 'border-beam 6s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin-reverse 16s linear infinite',
        'vine-flow': 'vine-flow 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'spin-reverse': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        'vine-flow': {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
