import { afterEach, describe, expect, it, vi } from "vitest";

const DEFAULT_URL = "https://yasertunc.github.io/project-1/download";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("env helpers", () => {
  it("uses default download url when no overrides provided", async () => {
    delete process.env.VITE_DOWNLOAD_URL;
    vi.resetModules();
    const { DOWNLOAD_URL } = await import("./env");
    expect(DOWNLOAD_URL).toBe(DEFAULT_URL);
  });

  it("uses VITE_DOWNLOAD_URL override from environment", async () => {
    process.env.VITE_DOWNLOAD_URL = "https://example.com/app";
    vi.resetModules();
    const { DOWNLOAD_URL } = await import("./env");
    expect(DOWNLOAD_URL).toBe("https://example.com/app");
  });

  it("safeOpen is a no-op when window is undefined", async () => {
    vi.stubGlobal("window", undefined);
    const { safeOpen } = await import("./env");
    expect(() => safeOpen("https://example.com")).not.toThrow();
  });

  it("safeOpen opens a new window with noopener target when available", async () => {
    const open = vi.fn();
    vi.stubGlobal("window", { open } as unknown as Window);
    const { safeOpen } = await import("./env");
    safeOpen("https://example.com");
    expect(open).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener",
    );
  });
});
