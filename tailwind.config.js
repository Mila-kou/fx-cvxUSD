/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        main: '#fff',
        second: '#a6a6ae',
        third: '#d7d3d3',

        blue: '#5488fe',
        red: '#fa2454',
        green: '#44b904',

        blueBg: 'rgba(126, 165, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
