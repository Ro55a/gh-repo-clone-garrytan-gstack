/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#080809',
        surface: '#0E0E12',
        sidebar: '#0B0B0E',
        border:  '#1C1C26',
        dim:     '#26262F',
        primary: '#4F46E5',
        violet:  '#7C3AED',
        accent:  '#B4FF45',
        'accent-dim': 'rgba(180,255,69,0.12)',
        coral:   '#FF6B6B',
        gold:    '#FFD93D',
        muted:   '#4D4B58',
        ink:     '#EEEAE2',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.03em',
        widest:   '0.25em',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(calc(-100% - var(--gap)))' },
          '100%': { transform: 'translateX(0)' },
        },
        'grain': {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-1%,-1%)' },
          '20%':     { transform: 'translate(1%,1%)' },
          '30%':     { transform: 'translate(-2%,1%)' },
          '40%':     { transform: 'translate(2%,-1%)' },
          '50%':     { transform: 'translate(-1%,2%)' },
          '60%':     { transform: 'translate(1%,-2%)' },
          '70%':     { transform: 'translate(-2%,-1%)' },
          '80%':     { transform: 'translate(2%,1%)' },
          '90%':     { transform: 'translate(-1%,2%)' },
        },
        'cursor-blink': {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0 },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.6 },
        },
      },
      animation: {
        marquee:           'marquee var(--duration) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
        grain:             'grain 0.5s steps(1) infinite',
        float:             'float 5s ease-in-out infinite',
        'fade-up':         'fade-up 0.6s ease forwards',
        'cursor-blink':    'cursor-blink 1s step-end infinite',
        'pulse-glow':      'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
