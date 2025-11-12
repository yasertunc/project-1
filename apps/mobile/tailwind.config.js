/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7ff",
          100: "#e6edff",
          200: "#cdd9ff",
          300: "#a5baff",
          400: "#7d9cff",
          500: "#567eff",
          600: "#3b61db",
          700: "#2f4bb0",
          800: "#263d8b",
          900: "#1f326f"
        }
      },
      borderRadius: { "2xl": "1rem" }
    },
  },
  plugins: [],
};
