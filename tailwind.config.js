const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    colors
  },
  variants: {
    extend: {
      translate: ['group-hover'],
    },
  },
  plugins: [],
}
