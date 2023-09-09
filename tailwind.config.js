import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-dark': '#000930',
        'main-red': '#E43A48',
      },
      fontFamily: {
        sans: ['Familjen Grotesk', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

