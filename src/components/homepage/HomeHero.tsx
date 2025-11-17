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
      className="relative isolate overflow-hidden rounded-[30px] bg-[color:var(--color-surface-white)] shadow-[0_25px_50px_rgba(0,0,0,0.08)]"
      aria-labelledby="home-hero-title"
      data-testid="homepage-hero"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(102,126,234,0.18),transparent),radial-gradient(120%_120%_at_100%_0%,rgba(118,75,162,0.16),transparent),radial-gradient(120%_120%_at_50%_100%,rgba(255,215,0,0.12),transparent)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-16 sm:py-20 md:flex-row md:items-center md:justify-between md:gap-16 md:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center rounded-full bg-[rgba(102,126,234,0.12)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary-main)] shadow-[0_2px_8px_rgba(102,126,234,0.15)]">
            Fellowus
          </p>
          <h1
            id="home-hero-title"
            className="mt-6 text-3xl font-bold leading-tight text-[color:var(--color-text-primary)] sm:text-4xl md:text-5xl"
          >
            {t("homeHero.title", "Connect Anonymously, Speak Freely")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            {t(
              "homeHero.body",
              "Match with real people in seconds, stay in control with anonymous filters, and rely on built‑in guardrails that keep every conversation safe."
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
                  ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_10px_25px_rgba(118,75,162,0.3)] hover:brightness-105 focus-visible:outline-[#667eea]"
                  : "border border-[rgba(102,126,234,0.3)] text-[color:var(--color-primary-main)] hover:border-[rgba(102,126,234,0.5)] hover:text-[color:var(--color-primary-dark)] focus-visible:outline-[#667eea]";
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
        <div className="relative w-full max-w-md rounded-[25px] border border-[rgba(102,126,234,0.15)] bg-white/80 p-6 text-[color:var(--color-text-secondary)] shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-8">
          <div className="absolute inset-x-6 -top-3 h-1 rounded-full bg-gradient-to-r from-[#ffd700] via-[#ffa500] to-[#ffd700]" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-primary-main)]">
            {t("homeHero.panel.title", "Why people choose Fellowus")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 text-[color:var(--color-primary-main)]"
              >
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item1",
                  "Anonymous IDs and intent filters keep matches relevant."
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 text-[color:var(--color-primary-main)]"
              >
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item2",
                  "Guided safety flows and quick report tools protect every chat."
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 text-[color:var(--color-primary-main)]"
              >
                ●
              </span>
              <span>
                {t(
                  "homeHero.panel.item3",
                  "Instant language & theme toggles make the interface inclusive."
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
