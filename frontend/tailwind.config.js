/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        sidebar: '#1C1C27',
        border: '#2A2A3A',
        primary: '#4F46E5',
        violet: '#7C3AED',
        accent: '#06B6D4',
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
