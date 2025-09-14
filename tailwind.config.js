/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Skill level badge colors
    'from-blue-500',
    'to-blue-600',
    'border-blue-500/30',
    'shadow-blue-500/20',
    'from-purple-500',
    'to-purple-500',
    'to-blue-500',
    'border-purple-500/30',
    'shadow-purple-500/20',
    'from-pink-500',
    'to-pink-500',
    'border-pink-500/30',
    'shadow-pink-500/20',
    'from-pink-400',
    'border-pink-400/30',
    'shadow-pink-400/20',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}