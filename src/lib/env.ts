const DEFAULT_DOWNLOAD_URL = "https://yasertunc.github.io/project-1/download";

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

const resolvedDownloadUrl =
  metaEnv?.VITE_DOWNLOAD_URL ??
  processEnv?.VITE_DOWNLOAD_URL ??
  DEFAULT_DOWNLOAD_URL;

export const DOWNLOAD_URL = resolvedDownloadUrl;

export function safeOpen(url: string) {
  if (typeof window !== "undefined" && typeof window.open === "function") {
    window.open(url, "_blank", "noopener");
  }
}
