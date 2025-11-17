import React, { useEffect, useState } from "react";

import i18n from "../i18n/setup";

type Locale = "en" | "tr" | "ar";

const STORAGE_KEY = "fellowus.locale";

export const LanguageSwitcher: React.FC<{
  value?: Locale;
  onChange?: (locale: Locale) => void;
}> = ({ value, onChange }) => {
  const [current, setCurrent] = useState<Locale>(() => {
    if (value) return value;
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "en" || stored === "tr" || stored === "ar") {
        return stored;
      }
    }
    return (i18n.language as Locale) ?? "en";
  });

  useEffect(() => {
    if (value && value !== current) {
      setCurrent(value);
    }
  }, [value, current]);

  type StorybookChannel = {
    emit: (event: string, payload: unknown) => void;
  };
  type StorybookWindow = Window & {
    __STORYBOOK_ADDONS_CHANNEL__?: StorybookChannel;
  };

  const emitLocale = (locale: Locale) => {
    try {
      const channel = (window as StorybookWindow).__STORYBOOK_ADDONS_CHANNEL__;
      if (channel) {
        channel.emit("globals/update", { globals: { locale } });
      }
    } catch {
      // ignore Storybook communication errors
    }
  };

  const setLocale = (locale: Locale) => {
    setCurrent(locale);
    if (onChange) onChange(locale);
    emitLocale(locale);
    i18n.changeLanguage(locale).catch(() => {});
  };

  const locales: Array<{ value: Locale; label: string }> = [
    { value: "en", label: "English" },
    { value: "tr", label: "Turkish" },
    { value: "ar", label: "Arabic" },
  ];

  return (
    <div className="flex gap-2">
      {locales.map(({ value: localeValue, label }) => {
        const isActive = localeValue === current;
        return (
          <button
            key={localeValue}
            type="button"
            aria-label={`Switch to ${label}`}
            title={`Switch to ${label}`}
            onClick={() => setLocale(localeValue)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-[color:var(--color-primary-main)] text-white shadow-[0_4px_12px_rgba(102,126,234,0.3)]"
                : "bg-[color:var(--color-background-medium)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-background-light)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
