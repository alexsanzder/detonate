const { boxShadow } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.jsx'],
  theme: {
    boxShadow: {
      ...boxShadow,
      focus: '0 0 0 3px rgba(225, 0, 117, 0.5)',
    },
    extend: {
      spacing: {
        '36': '9rem',
        '80': '20rem',
        '84': '21rem',
        '96': '24rem',
      },
      colors: {
        magenta: {
          '100': '#FCE6F1',
          '200': '#F8BFDD',
          '300': '#F399C8',
          '400': '#EA4D9E',
          '500': '#E10075',
          '600': '#CB0069',
          '700': '#870046',
          '800': '#650035',
          '900': '#440023',
        },
      },
      green: {
        '100': '#E9F6F0',
        '200': '#C8E9D9',
        '300': '#A7DBC1',
        '400': '#64C093',
        '500': '#22A565',
        '600': '#1F955B',
        '700': '#14633D',
        '800': '#0F4A2D',
        '900': '#0A321E',
      },
      gray: {
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
      },
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    borderWidth: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
