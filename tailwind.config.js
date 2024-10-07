/** @type {import('tailwindcss').Config} */
module.exports = {
  content:[
"./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 1.5s infinite', 
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  variants: {},
  plugins: [],
}