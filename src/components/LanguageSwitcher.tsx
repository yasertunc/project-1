import React, { useEffect, useState } from "react";

type Locale = "en" | "tr" | "ar";

export const LanguageSwitcher: React.FC<{
  value?: Locale;
  onChange?: (locale: Locale) => void;
}> = ({ value, onChange }) => {
  const [current, setCurrent] = useState<Locale>(() => {
    if (value) return value;
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(
        "fellowus.locale",
      ) as Locale | null;
      if (stored === "en" || stored === "tr" || stored === "ar") {
        return stored;
      }
    }
    return "en";
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
      window.localStorage.setItem("fellowus.locale", locale);
    } catch {
      // ignore persistence errors
    }
  };

  const setLocale = (locale: Locale) => {
    setCurrent(locale);
    if (onChange) onChange(locale);
    emitLocale(locale);
  };

  const locales: Array<{ value: Locale; label: string }> = [
    { value: "en", label: "English" },
    { value: "tr", label: "Türkçe" },
    { value: "ar", label: "العربية" },
  ];

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {locales.map(({ value: localeValue, label }) => (
        <button
          key={localeValue}
          type="button"
          aria-label={`Switch to ${label}`}
          title={`Switch to ${label}`}
          className={`px-3 py-1.5 rounded-pill ${
            localeValue === current
              ? "bg-primary-600 text-white"
              : "bg-muted-100 hover:bg-muted-50"
          }`}
          onClick={() => setLocale(localeValue)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
