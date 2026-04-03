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
          DEFAULT: '#ff6666',
          light: '#ff8888',
          dark: '#cc4444',
        },
        surface: {
          DEFAULT: '#333333',
          light: '#444444',
          dark: '#222222',
        },
        bg: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
}
