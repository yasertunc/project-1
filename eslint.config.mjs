import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2023,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      "jsx-a11y": a11y,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["**/*.stories.{ts,tsx,mdx}"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: [
      "**/*.mjs",
      "**/*.cjs",
      "**/*.config.{js,cjs,mjs}",
      "scripts/**/*.{js,mjs}",
      ".storybook/test-runner.js",
      "postcss.config.cjs",
      "apps/mobile/**/*.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ["storybook-static/**", "dist/**", "coverage/**"],
  }
);
