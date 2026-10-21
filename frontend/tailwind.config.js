/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B131E', // Sidebar & dark panel background
          sidebar: '#0D1721',
          teal: '#0D9488', // Primary action teal
          tealHover: '#0F766E',
          tealLight: '#CCFBF1',
          tealMuted: '#14B8A6',
          offwhite: '#F8F9FA', // Warm off-white page background
          card: '#FFFFFF',
          border: '#E2E8F0',
          charcoal: '#0F172A',
          muted: '#64748B',
          amber: '#D97706',
          amberBg: '#FEF3C7',
          green: '#059669',
          greenBg: '#DCFCE7',
          red: '#DC2626',
          redBg: '#FEE2E2',
          blue: '#2563EB',
          blueBg: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
