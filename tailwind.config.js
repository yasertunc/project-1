/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tokens = require("./src/tokens/tokens_fellowus_v1.json");

const designSystem = tokens.designSystem || {};

// Extract colors
const colors = designSystem.colors || {};
const spacing = designSystem.spacing || {};
const borderRadius = designSystem.borderRadius || {};
const shadows = designSystem.shadows || {};
const typography = designSystem.typography || {};

module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.stories.{ts,tsx}",
    "./src/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary?.main || "#667eea",
          main: colors.primary?.main || "#667eea",
          dark: colors.primary?.dark || "#764ba2",
          light: colors.primary?.light || "#8b9ef8",
        },
        vip: {
          DEFAULT: colors.vip?.main || "#FFD700",
          main: colors.vip?.main || "#FFD700",
          dark: colors.vip?.dark || "#FFA500",
          light: colors.vip?.light || "#FFE44D",
        },
        semantic: colors.semantic || {},
        background: colors.background || {},
        surface: colors.surface || {},
        text: colors.text || {},
        border: colors.border || {},
      },
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([key, value]) => [
          key,
          typeof value === "string" && value.endsWith("px")
            ? value
            : `${value}px`,
        ])
      ),
      borderRadius: {
        ...Object.fromEntries(
          Object.entries(borderRadius).map(([key, value]) => [
            key,
            typeof value === "string" && value.endsWith("%")
              ? value
              : typeof value === "string" && value.endsWith("px")
                ? value
                : `${value}px`,
          ])
        ),
        pill:
          borderRadius.round === "50%"
            ? "999px"
            : borderRadius.round || "999px",
      },
      boxShadow: {
        ...Object.fromEntries(
          Object.entries(shadows.elevation || {}).map(([key, value]) => [
            `elevation-${key}`,
            value,
          ])
        ),
        "colored-primary": shadows.colored?.primary || shadows.colored,
        "colored-vip": shadows.colored?.vip || shadows.coloredVip,
        "colored-success": shadows.colored?.success || shadows.coloredSuccess,
      },
      fontFamily: {
        sans: typography.fontFamily
          ? typography.fontFamily.split(",").map((f) => f.trim())
          : [
              "-apple-system",
              "BlinkMacSystemFont",
              "Segoe UI",
              "Roboto",
              "Oxygen",
              "Ubuntu",
              "sans-serif",
            ],
        mono: typography.fontStack?.monospace
          ? typography.fontStack.monospace.split(",").map((f) => f.trim())
          : ["Roboto Mono", "SF Mono", "Monaco", "monospace"],
      },
      fontSize: Object.fromEntries(
        Object.entries(typography.sizes || {}).map(([key, value]) => [
          key,
          [
            typeof value === "object" ? value.size : value,
            typeof value === "object" ? value.lineHeight : "1.5",
          ],
        ])
      ),
      fontWeight: typography.weights || {},
    },
  },
  plugins: [],
};
