import React from "react";

import tokens from "../../tokens/tokens_fellowus_v1.json";

type PrincipleCard = {
  title: string;
  summary: string;
  bullets: string[];
};

const COLOR_SWATCHES = [
  {
    label: "Primary Gradient",
    value: tokens.designSystem.colors.primary.gradient,
    helper: "Hero & CTA backgrounds",
  },
  {
    label: "VIP Gradient",
    value: tokens.designSystem.colors.vip.gradient,
    helper: "Premium upsell, special states",
  },
  {
    label: "Surface / White",
    value: tokens.designSystem.colors.surface.white,
    helper: "Cards & chat bubbles",
  },
  {
    label: "Surface / Gray",
    value: tokens.designSystem.colors.surface.gray,
    helper: "Navigation rails, dividers",
  },
  {
    label: "Background / Light",
    value: tokens.designSystem.colors.background.light,
    helper: "App chrome",
  },
  {
    label: "Background / Medium",
    value: tokens.designSystem.colors.background.medium,
    helper: "Map gradients, section fills",
  },
  {
    label: "Status / Online",
    value: tokens.designSystem.colors.semantic.online,
    helper: "Positive badges",
  },
  {
    label: "Status / Error",
    value: tokens.designSystem.colors.semantic.error,
    helper: "Destructive actions, alerts",
  },
];

const TYPOGRAPHY_SCALE = [
  {
    token: "Title",
    size: tokens.designSystem.typography.sizes.title,
    weight: "700",
    text: "Primary headline",
  },
  {
    token: "Large",
    size: tokens.designSystem.typography.sizes.large,
    weight: "600",
    text: "Section intro",
  },
  {
    token: "Medium",
    size: tokens.designSystem.typography.sizes.medium,
    weight: "400",
    text: "Body copy",
  },
  {
    token: "Small",
    size: tokens.designSystem.typography.sizes.small,
    weight: "400",
    text: "Metadata & captions",
  },
  {
    token: "Tiny",
    size: tokens.designSystem.typography.sizes.tiny,
    weight: "600",
    text: "Label on controls",
  },
  {
    token: "Nav",
    size: tokens.designSystem.typography.sizes.nav,
    weight: "600",
    text: "Navigation tabs",
  },
];

const SPACING = Object.entries(tokens.designSystem.spacing);
const RADII = Object.entries(tokens.designSystem.borderRadius);

const PRINCIPLES: PrincipleCard[] = [
  {
    title: "Safety-first communication",
    summary:
      "Information density stays comfortable, critical actions remain obvious and reversible.",
    bullets: [
      "Cards use medium shadow + large radius to imply softness and approachability.",
      "Destructive or risky flows reserve warm reds/oranges from the status palette.",
      "Iconography reinforces text labels—no icon-only destructive buttons.",
    ],
  },
  {
    title: "Legible motion & feedback",
    summary:
      "All movement follows the shared easing curve (0.4, 0, 0.2, 1) and is capped at 500ms.",
    bullets: [
      "Navigation swipe threshold (187.5px) prevents accidental section jumps.",
      "Buttons scale to 95% on press; VIP button receives a shine animation every 3s.",
      "Floating AI assistant pulses subtly so it stays noticeable without distracting.",
    ],
  },
  {
    title: "Shared spatial rhythm",
    summary:
      "Components snap to the 4/8/12 grid so content can mix & match without visual drift.",
    bullets: [
      "Vertical stacks rely on 15px (lg) spacing, aligning with card padding.",
      "Phone + screen shells respect radius tokens (`--radius-phone`, `--radius-screen`).",
      "Filters & toggles mirror the same corner treatments as buttons for familiarity.",
    ],
  },
];

export default function DesignPrinciples() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-primary-main,#667eea)]">
          Fellowus · Foundations
        </p>
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary,#111)]">
          Temel Tasarım Prensipleri
        </h1>
        <p className="text-base text-[color:var(--color-text-secondary,#4b5563)]">
          Storybook hikâyeleri sadece bileşenleri değil, onları yöneten renk,
          tipografi, boşluk ve hareket kurallarını da yansıtmalı. Bu bölüm
          tasarım sisteminin neden böyle davrandığını belgeliyor.
        </p>
      </header>

      <section className="space-y-4">
        <SectionTitle
          title="Renk Sistemi"
          helper="Gradientler ve yüzeyler tekil kaynaklardan geliyor."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {COLOR_SWATCHES.map((swatch) => (
            <div
              key={swatch.label}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
            >
              <div
                className="h-24 w-full"
                style={{
                  background:
                    swatch.value.startsWith("linear-gradient") ||
                    swatch.value.startsWith("radial-gradient")
                      ? swatch.value
                      : swatch.value,
                }}
              />
              <div className="p-4 text-sm">
                <p className="font-semibold text-text-primary">
                  {swatch.label}
                </p>
                <p className="text-xs text-text-secondary">{swatch.helper}</p>
                {!swatch.value.startsWith("linear-gradient") && (
                  <code className="mt-2 inline-block rounded bg-background-light px-2 py-0.5 text-xs text-text-primary">
                    {swatch.value}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Tipografi Ölçeği"
          helper="Apple/Google sistem fontları ve token boyutları kullanılıyor."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {TYPOGRAPHY_SCALE.map((item) => (
            <div
              key={item.token}
              className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm"
            >
              <div className="flex items-baseline justify-between text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">
                  {item.token}
                </span>
                <span>
                  {item.size} · {item.weight}
                </span>
              </div>
              <p
                className="mt-4 text-text-primary"
                style={{
                  fontSize: item.size,
                  fontWeight: Number(item.weight),
                  fontFamily: tokens.designSystem.typography.fontFamily,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Spacing & Radius"
          helper="4/8/12 ritmi ve geniş radius seti."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-border-medium p-6">
            <h3 className="text-sm font-semibold text-text-primary">
              Spacing Tokens
            </h3>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {SPACING.map(([tokenName, value]) => (
                <span
                  key={tokenName}
                  className="rounded-full bg-background-light px-3 py-1 text-text-primary"
                >
                  {tokenName} · {value}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-border-medium p-6">
            <h3 className="text-sm font-semibold text-text-primary">
              Radius Tokens
            </h3>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {RADII.map(([tokenName, value]) => (
                <span
                  key={tokenName}
                  className="rounded-full bg-background-light px-3 py-1 text-text-primary"
                >
                  {tokenName} · {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Davranışsal Prensipler"
          helper="Hareket, geri bildirim ve içerik güvenliği."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.title}
              className="flex flex-col rounded-2xl border border-black/5 bg-white/90 p-6 shadow"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {principle.summary}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-text-primary">
                {principle.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
      <p className="text-sm text-text-secondary">{helper}</p>
    </div>
  );
}
