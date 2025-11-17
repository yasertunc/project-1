import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { gotoStory } from "../tests/visual/utils/gotoStory";

const HOMEPAGE_STORY_ID = "pages-homepage--default";
const TURKISH_FEATURE_TITLE = "Etkinlik keşfi";
const STORAGE_KEY = "fellowus.locale";

const IGNORABLE_CONSOLE_PATTERNS = [
  /logo\.svg/i,
  /NoStoryMatchError/i,
  /SB_PREVIEW_API_0009/i,
];

function captureConsole(page: Page) {
  const messages: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      const text = `${message.type()}: ${message.text()}`;
      const shouldIgnore =
        IGNORABLE_CONSOLE_PATTERNS.some((pattern) => pattern.test(text)) ||
        /Failed to load resource: the server responded with a status of 404/i.test(
          text
        );
      if (!shouldIgnore) {
        messages.push(text);
      }
    }
  });
  return messages;
}

test.describe("Homepage primary flows", () => {
  test("@flow get-started CTA guides users to onboarding panel", async ({
    page,
  }) => {
    const messages = captureConsole(page);

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    await page.locator('[data-cta="get-started"]').click();

    await expect(page).toHaveURL(/#get-started/);
    await page.waitForFunction(() => {
      const el = document.getElementById("get-started");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    await expect(page.locator("#get-started")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Get started/i })
    ).toBeVisible();

    expect(messages).toEqual([]);
  });

  test("@flow language switch updates content & stores locale preference", async ({
    page,
  }) => {
    const messages = captureConsole(page);

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    await page.getByRole("link", { name: /Features/i }).click();
    await page.waitForFunction(
      () => !!document.querySelector('[data-testid="feature-1"] h3')
    );

    await page.getByRole("button", { name: /Switch to Turkish/i }).click();

    const featureTitle = page.locator('[data-testid="feature-1"] h3');
    await expect(featureTitle).toHaveText(TURKISH_FEATURE_TITLE);

    const storedLocale = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY
    );
    expect(storedLocale).toBe("tr");

    expect(messages).toEqual([]);
  });
});
