import { describe, expect, it } from "vitest";

import { getMeta } from "./seo";

describe("getMeta", () => {
  it("creates default meta tags and canonical link", () => {
    const result = getMeta({ title: "Homepage" });
    expect(result.title).toBe("Homepage");

    const metaByName = new Map(
      result.meta
        .filter((entry) => "name" in entry && entry.name)
        .map((entry) => [entry.name!, entry.content]),
    );
    const metaByProperty = new Map(
      result.meta
        .filter((entry) => "property" in entry && entry.property)
        .map((entry) => [entry.property!, entry.content]),
    );

    expect(metaByName.get("description")).toContain(
      "Fellowus helps you match anonymously",
    );
    expect(metaByProperty.get("og:title")).toBe("Homepage");
    expect(metaByProperty.get("og:image")).toMatch(/fellowus-logo-amber\.png$/);
    expect(metaByName.get("twitter:card")).toBe("summary_large_image");

    expect(result.links).toEqual([
      { rel: "canonical", href: "https://yasertunc.github.io/project-1/" },
    ]);
  });

  it("honours overrides for description, image, url and twitter handle", () => {
    const result = getMeta({
      title: "Custom Title",
      desc: "Custom description",
      ogImage: "https://cdn.example.com/og.png",
      url: "https://example.com/page",
      siteName: "Example Site",
      twitterHandle: "@example",
    });

    const metaByName = new Map(
      result.meta
        .filter((entry) => "name" in entry && entry.name)
        .map((entry) => [entry.name!, entry.content]),
    );
    const metaByProperty = new Map(
      result.meta
        .filter((entry) => "property" in entry && entry.property)
        .map((entry) => [entry.property!, entry.content]),
    );

    expect(metaByName.get("description")).toBe("Custom description");
    expect(metaByProperty.get("og:site_name")).toBe("Example Site");
    expect(metaByProperty.get("og:image")).toBe(
      "https://cdn.example.com/og.png",
    );
    expect(metaByName.get("twitter:site")).toBe("@example");
    expect(metaByName.get("twitter:creator")).toBe("@example");
    expect(result.links).toEqual([
      { rel: "canonical", href: "https://example.com/page" },
    ]);
  });
});
