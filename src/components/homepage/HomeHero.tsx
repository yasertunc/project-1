import React from "react";
import { useTranslation } from "react-i18next";

import "../../styles/a11y.css";
import { DOWNLOAD_URL, safeOpen } from "../../lib/env";

export type HomeHeroCta = "get-started" | "how-it-works" | "download-app";

type HomeHeroProps = {
  onAction?: (cta: HomeHeroCta) => void;
};

const CTA_CONFIG: Array<{
  id: HomeHeroCta;
  variant: "primary" | "outline";
  analyticsName: string;
}> = [
  { id: "get-started", variant: "primary", analyticsName: "Get Started" },
  { id: "how-it-works", variant: "outline", analyticsName: "How It Works" },
  { id: "download-app", variant: "outline", analyticsName: "Download App" },
];

export function HomeHero({ onAction }: HomeHeroProps) {
  const { t } = useTranslation("common");

  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="home-hero-title"
      data-testid="homepage-hero"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-16 sm:py-20 md:flex-row md:items-center md:justify-between md:gap-16 md:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-600">
            Fellowus
          </p>
          <h1
            id="home-hero-title"
            className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl"
          >
            {t("homeHero.title", "Connect Anonymously, Speak Freely")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "homeHero.body",
              "Match with real people in seconds, stay in control with anonymous filters, and rely on built‑in guardrails that keep every conversation safe.",
            )}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {CTA_CONFIG.map(({ id, variant }) => {
              const handleClick = () => {
                if (id === "download-app") {
                  safeOpen(DOWNLOAD_URL);
                }
                onAction?.(id);
              };

              const base =
                "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
              const classes =
                variant === "primary"
                  ? "bg-blue-600 text-white shadow hover:bg-blue-700 focus-visible:outline-blue-500"
                  : "border border-blue-200 text-blue-700 hover:border-blue-300 hover:text-blue-800 focus-visible:outline-blue-500";
              return (
                <button
                  key={id}
                  type="button"
                  data-cta={id}
                  className={`focus-ring ${base} ${classes}`}
                  onClick={handleClick}
                >
                  {t(`homeHero.ctas.${id}`, {
                    defaultValue: defaultLabel(id),
                  })}
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative w-full max-w-md rounded-3xl border border-blue-100 bg-blue-50/70 p-6 text-slate-700 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {t("homeHero.panel.title", "Why people choose Fellowus")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 text-blue-500">
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item1",
                  "Anonymous IDs and intent filters keep matches relevant.",
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 text-blue-500">
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item2",
                  "Guided safety flows and quick report tools protect every chat.",
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 text-blue-500">
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item3",
                  "Instant language & theme toggles make the interface inclusive.",
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function defaultLabel(id: HomeHeroCta) {
  switch (id) {
    case "get-started":
      return "Get Started";
    case "how-it-works":
      return "How It Works";
    case "download-app":
      return "Download App";
    default:
      return "";
  }
}

export default HomeHero;
