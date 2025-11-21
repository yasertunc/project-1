import React from "react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import "../styles/a11y.css";

import FeatureCard from "./homepage/FeatureCard";
import HomeHero, { type HomeHeroCta } from "./homepage/HomeHero";
import { ErrorBoundary } from "./ErrorBoundary";

const HowItWorks = React.lazy(() => import("./homepage/HowItWorks"));
const Footer = React.lazy(() => import("./homepage/Footer"));

declare global {
  interface Window {
    __FELLOWUS_FORCE_SECTION_ERROR?: string[];
  }
}

function shouldForceSectionError(sectionId: string) {
  if (typeof window === "undefined") return false;
  return window.__FELLOWUS_FORCE_SECTION_ERROR?.includes(sectionId) ?? false;
}

function SectionGuard({
  sectionId,
  children,
}: {
  sectionId: string;
  children: React.ReactNode;
}) {
  if (shouldForceSectionError(sectionId)) {
    throw new Error(`Forced failure for ${sectionId}`);
  }
  return <>{children}</>;
}

export default function Homepage() {
  const { t } = useTranslation();
  const howItWorksSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const featuresSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [shouldRenderHowItWorks, setShouldRenderHowItWorks] =
    React.useState(false);
  const [shouldRenderFeatures, setShouldRenderFeatures] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      setShouldRenderHowItWorks(true);
      setShouldRenderFeatures(true);
      return;
    }

    const observerSupported = "IntersectionObserver" in window;
    if (!observerSupported) {
      setShouldRenderHowItWorks(true);
      setShouldRenderFeatures(true);
      return;
    }

    const createObserver = (
      ref: React.MutableRefObject<Element | null>,
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!ref.current) return undefined;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(ref.current);
      return observer;
    };

    const howItWorksObserver = createObserver(
      howItWorksSentinelRef as React.MutableRefObject<Element | null>,
      setShouldRenderHowItWorks
    );
    const featuresObserver = createObserver(
      featuresSentinelRef as React.MutableRefObject<Element | null>,
      setShouldRenderFeatures
    );

    return () => {
      howItWorksObserver?.disconnect();
      featuresObserver?.disconnect();
    };
  }, []);

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
    <div className="min-h-screen bg-background-light text-text-primary">
      <header className="sticky top-0 z-10 border-b border-border-light bg-white/80 backdrop-blur">
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
            <ul className="flex items-center gap-6 text-sm text-text-secondary">
              <li>
                <a
                  className="hover:text-text-primary"
                  href="/"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-text-primary" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:text-text-primary" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-text-primary" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        <HomeHero onAction={handleHeroAction} />

        <div ref={howItWorksSentinelRef}>
          {shouldRenderHowItWorks ? (
            <ErrorBoundary
              fallback={
                <SectionError
                  message={t(
                    "homepage.error.howItWorks",
                    "This section is unavailable. Please retry."
                  )}
                />
              }
            >
              <Suspense
                fallback={
                  <SectionSkeleton
                    message={t("homepage.loading.howItWorks", "Loading steps…")}
                  />
                }
              >
                <SectionGuard sectionId="how-it-works">
                  <HowItWorks />
                </SectionGuard>
              </Suspense>
            </ErrorBoundary>
          ) : (
            <SectionSkeleton
              message={t(
                "homepage.loading.preparingSection",
                "Preparing section…"
              )}
            />
          )}
        </div>

        <div ref={featuresSentinelRef}>
          {shouldRenderFeatures ? (
            <ErrorBoundary
              fallback={
                <SectionError
                  message={t(
                    "homepage.error.features",
                    "Highlights are unavailable right now. Please refresh."
                  )}
                />
              }
            >
              <Suspense
                fallback={
                  <SectionSkeleton
                    message={t(
                      "homepage.loading.features",
                      "Loading highlights…"
                    )}
                  />
                }
              >
                <SectionGuard sectionId="features">
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
                </SectionGuard>
              </Suspense>
            </ErrorBoundary>
          ) : (
            <SectionSkeleton
              message={t("homepage.loading.features", "Loading highlights…")}
            />
          )}
        </div>

        <section
          aria-labelledby="cta-title"
          id="get-started"
          className="mx-auto max-w-6xl px-6 pb-20"
        >
          <h2 id="cta-title" className="sr-only">
            {t("homepage.ctaPanel.lead")}
          </h2>
          <div className="rounded-2xl border border-border-light bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-medium">{t("homepage.ctaPanel.lead")}</p>
            <button
              type="button"
              className="focus-ring mt-4 rounded-full px-6 py-3 text-white shadow-md focus:outline-none focus:ring bg-primary-main"
              aria-label={t("homepage.ctaPanel.cta")}
            >
              {t("homepage.ctaPanel.cta")}
            </button>
          </div>
        </section>
      </main>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}

function SectionSkeleton({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl px-6 py-12 text-center text-sm text-text-secondary"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-background-light px-3 py-1 font-medium">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary"
          aria-hidden="true"
        />
        {message}
      </span>
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-6xl px-6 py-12 text-center text-sm text-red-500"
      data-testid="section-error"
    >
      {message}
    </div>
  );
}

function FooterSkeleton() {
  return (
    <footer
      role="contentinfo"
      aria-live="polite"
      className="mx-auto max-w-6xl px-6 py-12 text-center text-sm text-text-tertiary"
    >
      Loading footer…
    </footer>
  );
}
