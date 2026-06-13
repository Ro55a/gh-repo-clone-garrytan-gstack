/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        sidebar: '#0D0D14',
        border: '#1E1E2E',
        primary: '#4F46E5',
        violet: '#7C3AED',
        accent: '#06B6D4',
        coral: '#FF6B6B',
        gold: '#FFD93D',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-1': 'radial-gradient(at 40% 20%, rgba(79,70,229,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124,58,237,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6,182,212,0.15) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(79,70,229,0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(124,58,237,0.2) 0px, transparent 50%)',
        'mesh-2': 'radial-gradient(at 20% 80%, rgba(6,182,212,0.2) 0px, transparent 50%), radial-gradient(at 60% 20%, rgba(79,70,229,0.25) 0px, transparent 50%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 8px rgba(79,70,229,0.6)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 24px rgba(79,70,229,0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'mesh-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'mesh-shift': 'mesh-shift 8s ease infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
}
