const DEFAULT_DOWNLOAD_URL = "https://www.fellowus.com/download";

type MetaEnv = Record<string, string | undefined> | undefined;
type ImportMetaShim = { env?: MetaEnv };

// Access Vite-style import.meta.env when available (both in browser and tests)
const metaEnv: MetaEnv =
  typeof import.meta !== "undefined"
    ? ((import.meta as unknown as ImportMetaShim).env ?? undefined)
    : undefined;

// Fall back to process.env for Node-based tooling/tests.
const processEnv: MetaEnv =
  typeof process !== "undefined" && typeof process.env !== "undefined"
    ? (process.env as unknown as MetaEnv)
    : undefined;

// Prefer process.env so tests and server tools can override import.meta.env defaults
const resolvedDownloadUrl =
  processEnv?.VITE_DOWNLOAD_URL ??
  metaEnv?.VITE_DOWNLOAD_URL ??
  DEFAULT_DOWNLOAD_URL;

export const DOWNLOAD_URL = resolvedDownloadUrl;

// Google Maps API Key
const resolvedGoogleMapsApiKey =
  processEnv?.VITE_GOOGLE_MAPS_API_KEY ??
  metaEnv?.VITE_GOOGLE_MAPS_API_KEY ??
  undefined;

export const GOOGLE_MAPS_API_KEY = resolvedGoogleMapsApiKey;

export function safeOpen(url: string) {
  if (typeof window !== "undefined" && typeof window.open === "function") {
    window.open(url, "_blank", "noopener");
  }
}
