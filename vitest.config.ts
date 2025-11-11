import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    exclude: ["tests/visual/**", "storybook-static/**"],
    coverage: {
      reporter: ["text", "lcov"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.*", "src/styles/**"],
    },
  },
});
