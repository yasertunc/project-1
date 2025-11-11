import { expect, test } from "@playwright/test";

import { gotoStory } from "./utils/gotoStory";

test.describe("Homepage", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "pages-homepage--default", { locale: "en" });

    const hero = page.locator("#storybook-root [data-testid='homepage-hero']");
    await hero.waitFor({ state: "visible", timeout: 30_000 });

    await expect(hero).toHaveScreenshot("homepage-default.png", {
      maxDiffPixelRatio: 0.002,
    });
  });

  test("rtl", async ({ page }) => {
    await gotoStory(page, "pages-homepage--rtl", { locale: "ar" });

    const hero = page.locator("#storybook-root [data-testid='homepage-hero']");
    await hero.waitFor({ state: "visible", timeout: 30_000 });

    await expect(hero).toHaveScreenshot("homepage-rtl.png", {
      maxDiffPixelRatio: 0.002,
    });
  });
});
