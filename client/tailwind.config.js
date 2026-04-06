/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange:  '#FF5C28',
        purple:  '#7B3FE4',
        pink:    '#E4398A',
        dark:    '#08060F',
        dark2:   '#0F0B1C',
      },
      fontFamily: {
        clash:   ['"Clash Display"', 'sans-serif'],
        satoshi: ['"Satoshi"', 'sans-serif'],
      },
      backgroundImage: {
        grad:  'linear-gradient(135deg, #FF5C28, #7B3FE4, #E4398A)',
        grad2: 'linear-gradient(90deg, #FF5C28, #7B3FE4)',
      },
    },
  },
  plugins: [],
};
