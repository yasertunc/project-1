import { expect, test } from "@playwright/test";

import { gotoStory } from "../tests/visual/utils/gotoStory";

const HOMEPAGE_STORY_ID = "pages-homepage--default";

test.describe("Homepage failure scenarios", () => {
  test("@failure how-it-works section surfaces error fallback when module fails", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__FELLOWUS_FORCE_SECTION_ERROR = ["how-it-works"];
    });

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    const errorAlert = page.getByTestId("section-error").filter({
      hasText: /This section is unavailable/i,
    });
    await expect(errorAlert).toBeVisible();
  });

  test("@failure features cards show error fallback when forced failure flag present", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__FELLOWUS_FORCE_SECTION_ERROR = ["features"];
    });

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    const errorAlert = page.getByTestId("section-error").filter({
      hasText: /Highlights are unavailable/i,
    });
    await expect(errorAlert).toBeVisible();
  });
});
