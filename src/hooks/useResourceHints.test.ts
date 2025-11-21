import { renderHook } from "@testing-library/react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";

import { useResourceHints, type ResourceHint } from "./useResourceHints";

describe("useResourceHints", () => {
  beforeEach(() => {
    // Clear all existing link elements
    document.head.querySelectorAll("link[rel='preconnect'], link[rel='dns-prefetch'], link[rel='prefetch']").forEach((link) => {
      link.remove();
    });
  });

  afterEach(() => {
    // Cleanup
    document.head.querySelectorAll("link[rel='preconnect'], link[rel='dns-prefetch'], link[rel='prefetch']").forEach((link) => {
      link.remove();
    });
    vi.clearAllMocks();
  });

  test("adds preconnect link to document head", () => {
    const hints: ResourceHint[] = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
    ];

    renderHook(() => useResourceHints(hints));

    const link = document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("crossOrigin", "anonymous");
  });

  test("adds dns-prefetch link to document head", () => {
    const hints: ResourceHint[] = [
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
    ];

    renderHook(() => useResourceHints(hints));

    const link = document.head.querySelector('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]');
    expect(link).toBeInTheDocument();
  });

  test("adds prefetch link with as attribute", () => {
    const hints: ResourceHint[] = [
      { rel: "prefetch", href: "https://example.com/script.js", as: "script" },
    ];

    renderHook(() => useResourceHints(hints));

    const link = document.head.querySelector('link[rel="prefetch"][href="https://example.com/script.js"]') as HTMLLinkElement;
    expect(link).toBeInTheDocument();
    expect(link.as).toBe("script");
  });

  test("adds multiple hints", () => {
    const hints: ResourceHint[] = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "prefetch", href: "https://example.com/style.css", as: "style" },
    ];

    renderHook(() => useResourceHints(hints));

    expect(document.head.querySelectorAll('link[rel="preconnect"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="dns-prefetch"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="prefetch"]')).toHaveLength(1);
  });

  test("does not add duplicate hints", () => {
    const hints: ResourceHint[] = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
    ];

    // Add hint manually first
    const existingLink = document.createElement("link");
    existingLink.rel = "preconnect";
    existingLink.href = "https://api.example.com";
    document.head.appendChild(existingLink);

    renderHook(() => useResourceHints(hints));

    // Should still be only one
    const links = document.head.querySelectorAll('link[rel="preconnect"][href="https://api.example.com"]');
    expect(links).toHaveLength(1);
  });

  test("removes hints on unmount", () => {
    const hints: ResourceHint[] = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
    ];

    const { unmount } = renderHook(() => useResourceHints(hints));

    expect(document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]')).toBeInTheDocument();

    unmount();

    expect(document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]')).not.toBeInTheDocument();
  });

  test("skips hints with empty href", () => {
    const hints: ResourceHint[] = [
      { rel: "preconnect", href: "" },
      { rel: "dns-prefetch", href: "https://example.com" },
    ];

    renderHook(() => useResourceHints(hints));

    expect(document.head.querySelector('link[rel="preconnect"][href=""]')).not.toBeInTheDocument();
    expect(document.head.querySelector('link[rel="dns-prefetch"][href="https://example.com"]')).toBeInTheDocument();
  });

  test("handles readonly array", () => {
    const hints: ReadonlyArray<ResourceHint> = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
    ] as const;

    renderHook(() => useResourceHints(hints));

    expect(document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]')).toBeInTheDocument();
  });

  test("updates when hints change", () => {
    const initialHints: ResourceHint[] = [
      { rel: "preconnect", href: "https://api.example.com", crossOrigin: "anonymous" },
    ];

    const { rerender } = renderHook(({ hints }) => useResourceHints(hints), {
      initialProps: { hints: initialHints },
    });

    expect(document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]')).toBeInTheDocument();

    const newHints: ResourceHint[] = [
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
    ];

    rerender({ hints: newHints });

    // Old hint should be removed
    expect(document.head.querySelector('link[rel="preconnect"][href="https://api.example.com"]')).not.toBeInTheDocument();
    // New hint should be added
    expect(document.head.querySelector('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')).toBeInTheDocument();
  });
});

