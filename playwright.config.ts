import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  use: {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    timezoneId: "UTC",
    locale: "en-US",
  },
});
