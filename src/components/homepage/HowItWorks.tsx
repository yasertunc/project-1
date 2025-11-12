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
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {t("homeHowItWorks.pretitle", "How it works")}
        </p>
        <h2
          id="how-it-works-title"
          className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
        >
          {t("homeHowItWorks.title", "Three easy steps to start talking")}
        </h2>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          {t(
            "homeHowItWorks.subtitle",
            "Fellowus helps you decide who you want to meet, keeps the match anonymous, and protects the room once you’re in.",
          )}
        </p>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.key}
            className="group flex flex-col gap-4 rounded-3xl border border-blue-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {t(
                  `homeHowItWorks.${step.key}.title`,
                  [
                    "Pick your filters",
                    "Match anonymously",
                    "Chat safely",
                  ][index],
                )}
              </h3>
              <p className="text-sm text-slate-600">
                {t(
                  `homeHowItWorks.${step.key}.description`,
                  [
                    "Choose intents, topics, and guardrails so we know the kind of chat you’re ready for.",
                    "We connect you with compatible people using temporary IDs—no personal details needed.",
                    "Use built-in tools, quick actions, and moderation flows to keep the conversation positive.",
                  ][index],
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
