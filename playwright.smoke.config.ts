import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.STORYBOOK_BASE_URL ?? "http://localhost:5080",
    viewport: { width: 1280, height: 720 },
    colorScheme: "light",
    locale: "en-US",
  },
  expect: {
    timeout: 5000,
  },
});
