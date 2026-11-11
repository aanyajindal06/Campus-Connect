/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f0',
          200: '#bccfe3',
          700: '#1a3a6b',
          800: '#122b52',
          900: '#0B1E3B',
          950: '#07152A',
        },
        gold: {
          50: '#faf6f0',
          100: '#f4ecdf',
          200: '#ebd8c0',
          300: '#debe98',
          400: '#d1a473',
          500: '#C69C6D',
          600: '#B88752',
          700: '#9a6b3e',
          800: '#7c5434',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EFE6D5',
          300: '#E4D5BE',
        },
        brand: {
          50: '#f0f4f9',
          100: '#dce5f0',
          200: '#bccfe3',
          300: '#8baacb',
          400: '#5580af',
          500: '#345e8f',
          600: '#0B1E3B',
          700: '#07152A',
          800: '#050f1f',
          900: '#030a14',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

