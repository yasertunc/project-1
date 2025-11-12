/** @type {import('tailwindcss').Config} */
export default {
  // Storybook ve MDX içerikleri de taransın
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,mdx}",
    "./src/**/*.stories.@(ts|tsx|mdx)",
  ],
  // Özel gradient util'leri purge edilmesin
  safelist: ["bg-gradient-primary", "bg-gradient-vip"],
  theme: {
    extend: {
      colors: {
        primary: {
          600: "var(--color-primary-600)",
          400: "var(--color-primary-400)",
        },
        ink: {
          900: "var(--ink-900)",
          700: "var(--ink-700)",
          500: "var(--ink-500)",
          50: "var(--ink-50)",
          200: "var(--ink-200)",
        },
        surface: "var(--surface)",
        muted: {
          50: "var(--muted-50)",
          100: "var(--muted-100)",
          600: "var(--muted-600)",
          700: "var(--muted-700)",
          800: "var(--muted-800)",
        },
        accent: { amber: { 500: "var(--color-accent-amber-500)" } },
        success: { 500: "var(--color-success-500)" },
        danger: { 500: "var(--color-danger-500)" },
      },
      borderRadius: {
        xl: "20px",
        pill: "9999px",
        phone: "var(--radius-phone)",
        screen: "var(--radius-screen)",
      },
      boxShadow: {
        colored: "var(--shadow-colored)",
      },
    },
  },
  plugins: [],
};
