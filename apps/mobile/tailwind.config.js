/* eslint-disable @typescript-eslint/no-require-imports */

const {
  palette,
  spacing: spacingTokens,
  radius: radiusTokens,
} = require("./src/theme/tokens.js");

const toPx = (value) => (typeof value === "number" ? `${value}px` : value);

const spacingScale = Object.fromEntries(
  Object.entries(spacingTokens).map(([key, value]) => [key, toPx(value)])
);

const radiusScale = {
  none: radiusTokens.none ?? "0",
  xs: toPx(radiusTokens.xs),
  sm: toPx(radiusTokens.sm),
  md: toPx(radiusTokens.md),
  lg: toPx(radiusTokens.lg),
  xl: toPx(radiusTokens.xl),
  xxl: toPx(radiusTokens.xxl),
  pill:
    radiusTokens.round === "50%" ? "999px" : toPx(radiusTokens.round ?? 999),
  phone: toPx(radiusTokens.phone),
  screen: toPx(radiusTokens.screen),
  card: toPx(radiusTokens.card),
  button: toPx(radiusTokens.button),
  input: toPx(radiusTokens.input),
};

const brandColors = {
  50: "#f4f7ff",
  100: "#e6edff",
  200: "#cdd9ff",
  300: "#a5baff",
  400: "#7d9cff",
  500: palette.primary?.main ?? "#567eff",
  600: "#3b61db",
  700: "#2f4bb0",
  800: "#263d8b",
  900: "#1f326f",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: brandColors,
        primary: {
          DEFAULT: palette.primary?.main,
          dark: palette.primary?.dark,
          light: palette.primary?.light,
        },
        vip: {
          DEFAULT: palette.vip?.main,
          dark: palette.vip?.dark,
          light: palette.vip?.light,
        },
        semantic: palette.semantic,
        background: {
          light: palette.background?.light,
          medium: palette.background?.medium,
          dark: palette.background?.dark,
        },
        surface: {
          DEFAULT: palette.surface?.white,
          gray: palette.surface?.gray,
        },
        text: {
          DEFAULT: palette.text?.primary,
          secondary: palette.text?.secondary,
          tertiary: palette.text?.tertiary,
          disabled: palette.text?.disabled,
        },
        border: palette.border,
        status: palette.semantic,
      },
      spacing: spacingScale,
      borderRadius: {
        ...radiusScale,
        "2xl": radiusScale.xl ?? "1rem",
      },
    },
  },
  plugins: [],
};
