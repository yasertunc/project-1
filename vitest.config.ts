import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const setupFile = fileURLToPath(new URL("./vitest.setup.ts", import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [setupFile],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    exclude: ["tests/visual/**", "storybook-static/**"],
    coverage: {
      reporter: ["text", "lcov", "html", "json-summary"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.*", "src/styles/**"],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
      reportOnFailure: true,
    },
  },
});
