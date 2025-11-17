import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E flow tests
 * Tests user journeys and API interactions with mocked responses
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html"], ["json", { outputFile: "playwright-e2e-results.json" }]]
    : [["html"], ["list"]],
  use: {
    baseURL: process.env.STORYBOOK_BASE_URL ?? "http://localhost:5080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run smoke:serve",
        url: "http://localhost:5080",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});

