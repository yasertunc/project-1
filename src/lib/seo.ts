export type MetaInput = {
  title: string;
  desc?: string;
  ogImage?: string;
  url?: string;
  siteName?: string;
  twitterHandle?: string;
};

export type MetaResult = {
  title: string;
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
};

const DEFAULT_SITE_NAME = "Fellowus";
const DEFAULT_URL = "https://yasertunc.github.io/project-1/";

export function getMeta({
  title,
  desc,
  ogImage,
  url = DEFAULT_URL,
  siteName = DEFAULT_SITE_NAME,
  twitterHandle,
}: MetaInput): MetaResult {
  const description =
    desc ??
    "Fellowus helps you match anonymously, speak freely, and stay safe with built-in guardrails.";
  const image =
    ogImage ??
    "https://yasertunc.github.io/project-1/brand/fellowus-logo-amber.png";

  const meta: MetaResult["meta"] = [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteName },
    { property: "og:image", content: image },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (twitterHandle) {
    meta.push({ name: "twitter:site", content: twitterHandle });
    meta.push({ name: "twitter:creator", content: twitterHandle });
  }

  const links: MetaResult["links"] = [{ rel: "canonical", href: url }];

  return { title, meta, links };
}
