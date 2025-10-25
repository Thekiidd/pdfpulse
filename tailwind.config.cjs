/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulse: {
          dark: '#1a1a1a',
          red: '#ff0000',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'pulse-red': '0 0 20px rgba(255, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}