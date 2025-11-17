import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import tr from "../locales/tr/common.json";
import ar from "../locales/ar/common.json";

const STORAGE_KEY = "fellowus.locale";
const SUPPORTED_LOCALES = new Set(["en", "tr", "ar"]);

function normaliseLocale(locale?: string | null): "en" | "tr" | "ar" {
  if (!locale) return "en";
  const lower = locale.toLowerCase();
  if (lower.startsWith("tr")) return "tr";
  if (lower.startsWith("ar")) return "ar";
  return "en";
}

function readStoredLocale(): "en" | "tr" | "ar" | undefined {
  try {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LOCALES.has(stored)) {
        return stored as "en" | "tr" | "ar";
      }
    }
  } catch {
    // ignore storage access errors (private mode, etc.)
  }
  return undefined;
}

function detectNavigatorLocale(): "en" | "tr" | "ar" {
  if (typeof navigator !== "undefined") {
    const fromList = Array.isArray(navigator.languages)
      ? navigator.languages.find(Boolean)
      : undefined;
    return normaliseLocale(fromList ?? navigator.language);
  }

  if (
    typeof Intl !== "undefined" &&
    typeof Intl.DateTimeFormat === "function"
  ) {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    if (resolved) return normaliseLocale(resolved);
  }

  return "en";
}

const initialLocale = readStoredLocale() ?? detectNavigatorLocale();

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: en },
        tr: { common: tr },
        ar: { common: ar },
      },
      lng: initialLocale,
      fallbackLng: "en",
      ns: ["common"],
      defaultNS: "common",
      interpolation: { escapeValue: false },
    })
    .then(() => {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", i18n.language);
      }
    })
    .catch(() => {});

  i18n.on("languageChanged", (lng) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lng);
    }
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, lng);
      }
    } catch {
      // ignore storage failures
    }
  });
}

export default i18n;
