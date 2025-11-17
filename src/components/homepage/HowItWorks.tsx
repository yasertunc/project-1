import React from "react";
import { useTranslation } from "react-i18next";

type Step = {
  key: string;
  icon?: React.ReactNode;
};

const STEPS: Step[] = [{ key: "step1" }, { key: "step2" }, { key: "step3" }];

export function HowItWorks() {
  const { t } = useTranslation("common");

  return (
    <section
      id="how-it-works"
      role="region"
      aria-labelledby="how-it-works-title"
      className="mx-auto max-w-6xl px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[color:var(--color-primary-main)]">
          {t("homeHowItWorks.pretitle", "How it works")}
        </p>
        <h2
          id="how-it-works-title"
          className="mt-2 text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl"
        >
          {t("homeHowItWorks.title", "Three easy steps to start talking")}
        </h2>
        <p className="mt-4 text-base text-[color:var(--color-text-secondary)] md:text-lg">
          {t(
            "homeHowItWorks.subtitle",
            "Fellowus helps you decide who you want to meet, keeps the match anonymous, and protects the room once you’re in."
          )}
        </p>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.key}
            className="group flex flex-col gap-4 rounded-[25px] border border-[rgba(102,126,234,0.15)] bg-white/90 p-6 text-left shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(118,75,162,0.2)] backdrop-blur-sm"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(102,126,234,0.25)]">
              {index + 1}
            </span>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                {t(
                  `homeHowItWorks.${step.key}.title`,
                  ["Pick your filters", "Match anonymously", "Chat safely"][
                    index
                  ]
                )}
              </h3>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                {t(
                  `homeHowItWorks.${step.key}.description`,
                  [
                    "Choose intents, topics, and guardrails so we know the kind of chat you’re ready for.",
                    "We connect you with compatible people using temporary IDs—no personal details needed.",
                    "Use built-in tools, quick actions, and moderation flows to keep the conversation positive.",
                  ][index]
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;
