import type { Page } from "@playwright/test";

const BASE = process.env.STORYBOOK_BASE_URL || "http://localhost:6006";

type CanvasOptions = {
  theme?: "light" | "dark";
  locale?: "en" | "tr" | "ar";
};

async function prepareCanvas(page: Page, options: CanvasOptions = {}) {
  const { theme = "light", locale = "en" } = options;

  await page.addInitScript(
    ({ theme: initTheme, locale: initLocale }) => {
      document.documentElement.setAttribute("data-theme", initTheme);
      document.documentElement.setAttribute("lang", initLocale);
      document.documentElement.setAttribute(
        "dir",
        initLocale === "ar" ? "rtl" : "ltr"
      );
      try {
        localStorage.setItem("fellowus.locale", initLocale);
      } catch {
        // ignore storage errors
      }
    },
    { theme, locale }
  );
}

export async function gotoStory(
  page: Page,
  storyId: string,
  options: CanvasOptions = {}
) {
  const { locale } = options;
  await prepareCanvas(page, options);

  const searchParams = new URLSearchParams({
    id: storyId,
    viewMode: "story",
  });

  if (locale) {
    searchParams.set("globals", `locale:${locale}`);
  }

  const url = `${BASE}/iframe.html?${searchParams.toString()}`;

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await page.addStyleTag({
    content:
      "*{animation:none!important;transition:none!important} html{scroll-behavior:auto!important}",
  });

  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      (img as HTMLImageElement).loading = "eager";
    });
  });

  await page.evaluate(async () => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      await fonts.ready;
    }
  });

  await page
    .locator("#storybook-root")
    .waitFor({ state: "visible", timeout: 30_000 });
}
