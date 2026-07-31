/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f6",
          100: "#d4ece9",
          200: "#a9d9d3",
          300: "#7ec5bc",
          400: "#4bab9e",
          500: "#0f766e",
          600: "#0c5f59",
          700: "#0a4d48",
          800: "#083c38",
          900: "#062b28",
        },
        accent: {
          500: "#d97706",
          600: "#b45309",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(15, 118, 110, 0.08)",
        cardHover: "0 12px 30px rgba(15, 118, 110, 0.18)",
      },
    },
  },
  plugins: [],
};
