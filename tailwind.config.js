/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
      },
      colors: {
        primary: "#353c49",
        title: "#1A1E27",
        subTitle: "#8D94A0",
        secondary: "#6D7582",
        palettePrimary: "#4880EE",
        paletteRed: "#E84118",
        paletteGray: "#DADADA",
        paletteLG: "#F2F4F6",
        black: "#222",
        white: "#fff",
      },
    },
  },
  plugins: [],
};
