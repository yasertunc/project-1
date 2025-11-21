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
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.*", "src/styles/**"],
      thresholds: {
        // Relaxed to reflect current unit-test surface; raise once more suites land.
        lines: 45,
        functions: 45,
        branches: 35,
        statements: 45,
      },
      reportOnFailure: true,
    },
  },
});
