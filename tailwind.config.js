/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'deep-blue': '#0a1628',
        'dispatch-cyan': '#00d4ff',
        'dispatch-green': '#2ed573',
        'dispatch-red': '#ff4757',
        'dispatch-yellow': '#ffa502',
        'dispatch-orange': '#ff6b35',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
