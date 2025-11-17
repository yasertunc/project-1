import React from "react";

type HeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ["data-testid"]?: string;
};

export default function Hero({
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  ...rest
}: HeroProps) {
  return (
    <section
      className="flex w-full flex-col items-center px-6 py-16 text-center md:py-24"
      aria-labelledby="homepage-hero-title"
      {...rest}
    >
      <h1
        id="homepage-hero-title"
        className="text-3xl font-bold text-text-primary md:text-5xl"
      >
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
          {subtitle}
        </p>
      ) : null}

      {ctaLabel ? (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-8 rounded-full px-6 py-3 text-white shadow-md focus:outline-none focus:ring bg-primary-main"
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </button>
      ) : null}
    </section>
  );
}
