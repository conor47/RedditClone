/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.tsx'],
  content: [
    './src/pages/**/*.{tsx,js,ts,jsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      body: ['IBM Plex Sans,'],
    },
    extend: {
      spacing: {
        70: '17.5rem',
      },
      colors: {
        blue: {
          100: '#cce4f6',
          200: '#99c9ed',
          300: '#66afe5',
          400: '#3394dc',
          500: '#0079d3',
          600: '#0061a9',
          700: '#00497f',
          800: '#003054',
          900: '#00182a',
        },
      },
    },
  },
  plugins: [],
};
