/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      margin: {
        '29': '7.25rem',
        '28px': '28px',
        '74px': '74px'
      },
      padding: {
        '22': '5.625rem',
        '2px': '2px'
      },
      width: {
        '50': '50rem',
        '30': '30%',
        '70': '70%',
        '550': '550px',
        '100%': '100%',
        '300px': '300px',
        '450px': '450px',
        '1200px': '1200px',
        '410px': '410px',
        '360px': '360px'
      },
      zIndex: {
        '1': '1'
      },
      height: {
        '685px': '685px',
        '650px': '650px',
        '636': '636px'
      },
      borderWidth: {
        '1px': '1px'
      },
      colors: {
        'black-rgba': 'rgba(0,0,0,0.3)'
      }
    },
  },
  plugins: [function ({ addUtilities }) {
    const newUtilities = {
      '.text-17': {
        'font-size': '17px',
      },
      '.text-13': {
        'font-size': '13px',
        'line-height': '14px'
      },
      '.leading-28': {
        'line-height': '28px',
      },
    };
    addUtilities(newUtilities, ['responsive']);
  },],
}

