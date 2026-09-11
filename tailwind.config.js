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
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7dbfe',
          300: '#a4c3fe',
          400: '#7ba2fd',
          500: '#4361ee',
          600: '#3a0ca3',
          700: '#2b237c',
          800: '#1e1b4b',
          900: '#0f172a',
        },
        pastel: {
          blue: '#f0f7ff',
          purple: '#f5f3ff',
          yellow: '#fefce8',
          green: '#f0fdf4',
          rose: '#fff1f2',
          amber: '#fffbeb',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
