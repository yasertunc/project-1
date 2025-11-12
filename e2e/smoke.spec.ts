import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { gotoStory } from "../tests/visual/utils/gotoStory";

const HOMEPAGE_STORY_ID = "pages-homepage--default";
const EXPECTED_DOWNLOAD_URL =
  process.env.VITE_DOWNLOAD_URL ??
  "https://yasertunc.github.io/project-1/download";

const IGNORABLE_CONSOLE_PATTERNS = [/logo\.svg/i];

function captureConsole(page: Page) {
  const messages: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      const text = `${message.type()}: ${message.text()}`;
      const shouldIgnore =
        IGNORABLE_CONSOLE_PATTERNS.some((pattern) => pattern.test(text)) ||
        /Failed to load resource: the server responded with a status of 404/i.test(
          text,
        );
      if (!shouldIgnore) {
        messages.push(text);
      }
    }
  });
  return messages;
}

test.describe("Homepage smoke matrix", () => {
  test("@smoke home to how-it-works anchor preserves hash and scroll", async ({
    page,
  }) => {
    const messages = captureConsole(page);

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    const howItWorks = page.getByRole("button", { name: /How It Works/i });
    await howItWorks.click();

    await expect(page).toHaveURL(/#how-it-works/);
    await page.waitForFunction(() => {
      const anchor = document.getElementById("how-it-works");
      if (!anchor) return false;
      const rect = anchor.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });

    expect(messages).toEqual([]);
  });

  test("@smoke download CTA triggers safeOpen", async ({ page }) => {
    const messages = captureConsole(page);

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    await page.evaluate(() => {
      const calls: Array<{
        url: string;
        target: string | undefined;
        features: string | undefined;
      }> = [];
      // @ts-expect-error augment window for test assertions
      window.__openCalls = calls;
      window.open = ((url: string, target?: string, features?: string) => {
        calls.push({ url, target, features });
        return null;
      }) as typeof window.open;
    });

    const downloadButton = page.getByRole("button", { name: /Download App/i });
    await downloadButton.click();

    const openCalls = await page.evaluate<
      Array<{ url: string; target?: string; features?: string }>
    >(() => {
      // @ts-expect-error read assertion data
      return window.__openCalls ?? [];
    });

    expect(openCalls).toHaveLength(1);
    expect(openCalls[0]).toMatchObject({
      url: EXPECTED_DOWNLOAD_URL,
      target: "_blank",
      features: "noopener",
    });

    expect(messages).toEqual([]);
  });

  test("@smoke unknown route yields 404", async ({ page, baseURL }) => {
    const messages = captureConsole(page);

    const url = `${baseURL ?? "http://localhost:5080"}/iframe.html?id=pages-homepage--missing`;
    const response = await page.goto(url);

    const status = response?.status() ?? 0;
    const bodyText = await page.locator("body").innerText();
    const previewText = await page
      .locator("#storybook-root")
      .innerText()
      .catch(() => "");
    const hasStorybookError =
      /Story not found/i.test(bodyText) ||
      /We couldn't find the story/i.test(bodyText) ||
      /We can’t find the story/i.test(bodyText) ||
      /missing/i.test(bodyText) ||
      /We couldn't find the story/i.test(previewText) ||
      /Story not found/i.test(previewText);
    const hasCanvasContent = await page.evaluate(() => {
      const root = document.querySelector("#storybook-root");
      return !!root && root.children.length > 0;
    });

    expect(
      status === 404 || hasStorybookError || !hasCanvasContent,
      `Expected HTTP 404, Storybook error, or empty canvas for "${url}", got status ${status} with body snippet:\n${bodyText.slice(
        0,
        200,
      )}`,
    ).toBeTruthy();
    expect(messages).toEqual([]);
  });
});
