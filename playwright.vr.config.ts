import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"]],
  expect: {
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.002,
    },
  },
  use: {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "UTC",
    hasTouch: false,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
});
