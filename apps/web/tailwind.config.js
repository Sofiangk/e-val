module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkOil: '#0D2D2D',
        mainOil: '#0D3A2D',
        lightOil: '#0D502D',
        brightGreen: '#A1E8AF',
        mainPurple: '#7F7EFF',
        darkPurple: '#6464FF',
        lightPurple: '#8C9BFF',
        mainBlack: '#1B0826',
        mainWhite: '#EBF3FF',
        offWhite: '#D7E1FF',
        darkGray: '#2D2D2D',
        darkGreen: '#82C396',
        mainRed: '#CC4343',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar')({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
  ],
};
