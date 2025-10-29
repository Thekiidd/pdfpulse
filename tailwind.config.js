// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#ff0033',
        'neon-light': '#ff3366',
        'bg-overlay': 'rgba(0, 0, 0, 0.6)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 51, 0.4)',
        'neon-lg': '0 0 40px rgba(255, 0, 51, 0.6)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 0, 51, 0.5)' },
          '50%': { textShadow: '0 0 30px rgba(255, 0, 51, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [],
};