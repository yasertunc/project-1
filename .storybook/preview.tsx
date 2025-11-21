import type { Decorator, Preview } from "@storybook/react";
import React, { useEffect } from "react";

import "../src/styles/globals.css";
import "../src/styles/tokens.css";
import "../src/i18n/setup";

const WithThemeAndLocale: Decorator = (Story, context) => {
  const theme = context.globals.theme || "light";
  const locale =
    context.globals.locale ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("fellowus.locale") || "en"
      : "en");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    import("../src/i18n/setup").then(({ default: i18n }) => {
      i18n.changeLanguage(locale);
    });
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);
    try {
      window.localStorage.setItem("fellowus.locale", locale);
    } catch {
      // noop - localStorage not available
    }
  }, [locale]);

  return (
    <div
      style={{
        background: "var(--color-background-light)",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [WithThemeAndLocale],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
    locale: {
      name: "Locale",
      description: "UI language",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "tr", title: "Türkçe" },
          { value: "ar", title: "العربية" },
        ],
      },
    },
  },
};

export default preview;
