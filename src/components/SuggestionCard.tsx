import React from "react";
import { Button } from "./Button";
export interface SuggestionCardProps {
  title: string;
  meta?: string;
  children?: React.ReactNode;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  tone?: "default" | "info" | "warning";
}
export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  meta,
  children,
  primaryCta,
  secondaryCta,
  tone = "default",
}) => {
  const toneStyles = {
    default: "bg-white",
    info: "bg-[color:var(--color-background-light)]",
    warning: "bg-[color:var(--color-background-light)] border border-semantic-error/30",
  }[tone];
  return (
    <div
      className={`rounded-xl p-4 ${toneStyles}`}
      role="group"
      aria-label={title}
    >
      <div className="text-text-primary font-semibold">{title}</div>
      {meta && <div className="text-xs text-text-tertiary mt-0.5">{meta}</div>}
      {children && <div className="mt-2 text-sm text-text-secondary">{children}</div>}
      <div className="mt-3 flex gap-2">
        {primaryCta && (
          <Button onClick={primaryCta.onClick}>{primaryCta.label}</Button>
        )}
        {secondaryCta && (
          <Button variant="outline" onClick={secondaryCta.onClick}>
            {secondaryCta.label}
          </Button>
        )}
      </div>
    </div>
  );
};
