import React from "react";
import { useTranslation } from "react-i18next";

import "../styles/a11y.css";

import FeatureCard from "./homepage/FeatureCard";
import Footer from "./homepage/Footer";
import HomeHero, { type HomeHeroCta } from "./homepage/HomeHero";
import HowItWorks from "./homepage/HowItWorks";

export default function Homepage() {
  const { t } = useTranslation();
  const handleHeroAction = React.useCallback((action: HomeHeroCta) => {
    const targetId =
      action === "how-it-works"
        ? "how-it-works"
        : action === "get-started"
          ? "get-started"
          : undefined;
    if (targetId) {
      window.location.hash = `#${targetId}`;
      const el = document.getElementById(targetId);
      el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
            />
            <span className="text-lg font-semibold">Fellowus</span>
          </a>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 text-sm text-gray-600">
              <li>
                <a className="hover:text-gray-900" href="/" aria-current="page">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        <HomeHero onAction={handleHeroAction} />

        <HowItWorks />

        <section
          id="features"
          className="mx-auto max-w-6xl px-6 py-12 md:py-16"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className="sr-only">
            {t("homepage.features.title")}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              data-testid="feature-1"
              title={t("homepage.features.eventDiscovery.title")}
              description={t("homepage.features.eventDiscovery.desc")}
            />
            <FeatureCard
              data-testid="feature-2"
              title={t("homepage.features.communityFirst.title")}
              description={t("homepage.features.communityFirst.desc")}
            />
            <FeatureCard
              data-testid="feature-3"
              title={t("homepage.features.safety.title")}
              description={t("homepage.features.safety.desc")}
            />
          </div>
        </section>

        <section
          aria-labelledby="cta-title"
          id="get-started"
          className="mx-auto max-w-6xl px-6 pb-20"
        >
          <h2 id="cta-title" className="sr-only">
            {t("homepage.ctaPanel.lead")}
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-medium">{t("homepage.ctaPanel.lead")}</p>
            <button
              type="button"
              className="focus-ring mt-4 rounded-full px-6 py-3 text-white shadow-md focus:outline-none focus:ring bg-[color:var(--color-primary-700,#1d4ed8)]"
              aria-label={t("homepage.ctaPanel.cta")}
            >
              {t("homepage.ctaPanel.cta")}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
