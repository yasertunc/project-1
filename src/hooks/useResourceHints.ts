import { useEffect } from "react";

export type ResourceHint = {
  href: string;
  rel: "preconnect" | "dns-prefetch" | "prefetch";
  as?: string;
  crossOrigin?: "anonymous" | "use-credentials";
};

function findExistingLink(rel: string, href: string) {
  if (typeof document === "undefined") return undefined;
  return document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"][href="${href}"]`
  );
}

/**
 * React hook to inject resource hints (preconnect, dns-prefetch, etc.) into the document head.
 *
 * Useful for optimizing third-party resource loading (fonts, APIs, CDNs).
 * Automatically cleans up hints when the component unmounts.
 *
 * @param hints - Array of resource hint objects with `rel` and `href` properties
 *
 * @example
 * ```tsx
 * useResourceHints([
 *   { rel: 'preconnect', href: 'https://api.example.com', crossOrigin: 'anonymous' },
 *   { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }
 * ]);
 * ```
 */
export function useResourceHints(
  hints: ResourceHint[] | ReadonlyArray<ResourceHint>
) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const added: HTMLLinkElement[] = [];

    hints.forEach(({ href, rel, as, crossOrigin }) => {
      if (!href || findExistingLink(rel, href)) {
        return;
      }

      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (as) {
        link.as = as;
      }
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [hints]);
}
