/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic gradient classes from About.vue getSkillLevelColor()
    'from-blue-500', 'to-blue-600', 'border-blue-500/30',
    'from-purple-500', 'to-blue-500', 'border-purple-500/30',
    'from-pink-500', 'to-purple-500', 'border-pink-500/30',
    'from-pink-400', 'to-pink-500', 'border-pink-400/30',
    'from-gray-500', 'to-gray-600', 'border-gray-500/30',
    'bg-gradient-to-r',

    // Technology badge colors - dynamically generated
    'bg-blue-500/20', 'text-blue-300', 'border-blue-500/40',
    'bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40',
    'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/40',
    'bg-green-500/20', 'text-green-300', 'border-green-500/40',
    'bg-sky-500/20', 'text-sky-300', 'border-sky-500/40',
    'bg-indigo-500/20', 'text-indigo-300', 'border-indigo-500/40',
    'bg-red-500/20', 'text-red-300', 'border-red-500/40',
    'bg-orange-500/20', 'text-orange-300', 'border-orange-500/40',
    'bg-purple-500/20', 'text-purple-300', 'border-purple-500/40',
    'bg-rose-500/20', 'text-rose-300', 'border-rose-500/40',
    'bg-amber-600/20', 'text-amber-400', 'border-amber-600/40',
    'bg-slate-500/20', 'text-slate-300', 'border-slate-500/40',
    'bg-red-600/20', 'text-red-400', 'border-red-600/40',
    'bg-orange-600/20', 'text-orange-400', 'border-orange-600/40',
    'bg-violet-500/20', 'text-violet-300', 'border-violet-500/40',
    'bg-teal-500/20', 'text-teal-300', 'border-teal-500/40',
    'bg-gray-500/20', 'text-gray-300', 'border-gray-500/40',

    // Status indicator colors
    'bg-green-400', 'text-green-400',
    'bg-blue-400', 'text-blue-400',
    'bg-yellow-400', 'text-yellow-400',
    'bg-gray-400', 'text-gray-400',
    'bg-orange-400', 'text-orange-400',

    // Essential background size for animations
    'bg-[size:200%_200%]',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        '2xs': '360px',
      },
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
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'typing': 'typing 2s steps(40, end)',
        'blink': 'blink 1s infinite',
        'spin': 'spin 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'dots': 'dots 1.5s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float-badge': 'floatBadge 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        typing: {
          from: {
            width: '0',
          },
          to: {
            width: '100%',
          },
        },
        blink: {
          '0%, 49%': {
            opacity: '1',
          },
          '50%, 100%': {
            opacity: '0',
          },
        },
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        dots: {
          '0%, 20%': {
            content: '"."',
          },
          '40%': {
            content: '".."',
          },
          '60%, 100%': {
            content: '"..."',
          },
        },
        gradientShift: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'translateX(0)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'translateX(10px)',
          },
        },
        floatBadge: {
          to: {
            transform: 'translateY(-2px)',
          },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}