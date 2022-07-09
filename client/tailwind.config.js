/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.tsx'],
  content: [
    './src/pages/**/*.{tsx,js,ts,jsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        70: '17.5rem',
      },
    },
  },
  plugins: [],
};
