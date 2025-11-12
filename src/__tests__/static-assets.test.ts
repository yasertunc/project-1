import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..", "..");

describe("static SEO assets", () => {
  it("includes robots.txt in the public directory", () => {
    const robotsPath = resolve(ROOT_DIR, "public", "robots.txt");
    expect(existsSync(robotsPath)).toBe(true);
    expect(statSync(robotsPath).isFile()).toBe(true);
  });

  it("includes sitemap.xml in the public directory", () => {
    const sitemapPath = resolve(ROOT_DIR, "public", "sitemap.xml");
    expect(existsSync(sitemapPath)).toBe(true);
    expect(statSync(sitemapPath).isFile()).toBe(true);
  });
});
