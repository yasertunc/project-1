import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import tr from "../locales/tr/common.json";
import ar from "../locales/ar/common.json";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: en },
        tr: { common: tr },
        ar: { common: ar },
      },
      lng: "en",
      fallbackLng: "en",
      ns: ["common"],
      defaultNS: "common",
      interpolation: { escapeValue: false },
    })
    .catch(() => {});
}

export default i18n;
