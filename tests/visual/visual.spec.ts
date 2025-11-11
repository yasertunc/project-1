import { test, expect, Page } from "@playwright/test";

import { gotoStory } from "./utils/gotoStory";

async function snap(
  page: Page,
  storyId: string,
  name: string,
  options?: { theme?: "light" | "dark"; locale?: "en" | "tr" | "ar" },
) {
  await gotoStory(page, storyId, options);
  const root = page.locator("#storybook-root");
  await expect(root).toHaveScreenshot(`${name}.png`);
}

test.describe("Visual regressions", () => {
  test("ChatBubble RTL (Arabic)", async ({ page }) => {
    await snap(
      page,
      "fellowus-chatbubble-rtl--arabic",
      "chatbubble-rtl-arabic",
      { locale: "ar" },
    );
  });

  test("Report Flow (modal open)", async ({ page }) => {
    await gotoStory(page, "fellowus-report-flow--bubble-to-modal", {
      locale: "en",
    });
    await page.getByRole("button", { name: /report/i }).click();
    const root = page.locator("#storybook-root");
    await expect(root).toHaveScreenshot("report-flow-modal-open.png");
  });

  test("Buttons (primary)", async ({ page }) => {
    await snap(page, "fellowus-button--primary", "button-primary", {
      locale: "en",
    });
  });

  test("Buttons (outline)", async ({ page }) => {
    await snap(page, "fellowus-button--outline", "button-outline", {
      locale: "en",
    });
  });

  test("Tokens Contrast Grid", async ({ page }) => {
    await snap(
      page,
      "fellowus-tokens-contrastgrid--grid",
      "tokens-contrast-grid",
      { locale: "en" },
    );
  });

  test("Brand Logo (default)", async ({ page }) => {
    await gotoStory(page, "fellowus-brand-logo--default", { locale: "en" });
    const logo = page.locator('#storybook-root [data-testid="brand-logo"]');
    await logo.first().waitFor({ state: "visible", timeout: 30_000 });

    await expect(logo.first()).toHaveScreenshot(
      "brand-logo-default@1280x720.png",
      {
        maxDiffPixelRatio: 0.002,
      },
    );
  });
});
