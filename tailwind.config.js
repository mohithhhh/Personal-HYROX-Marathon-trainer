/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#09090f',
          secondary: '#111118',
          card: '#1a1a24',
          elevated: '#21212e',
        },
        border: {
          subtle: '#2a2a3d',
          DEFAULT: '#333348',
        },
        accent: {
          DEFAULT: '#f97316',
          hover: '#ea6c0a',
          muted: 'rgba(249,115,22,0.15)',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
