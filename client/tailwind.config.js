/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff9f6",
          100: "#d7f0e7",
          500: "#0f9d7c",
          600: "#0c8267",
          700: "#0a6853",
        },
      },
    },
  },
  plugins: [],
};
