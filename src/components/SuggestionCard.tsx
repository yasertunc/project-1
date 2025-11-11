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
    info: "bg-[color:var(--muted-50)]",
    warning: "bg-[color:var(--muted-50)] border border-danger-500/30",
  }[tone];
  return (
    <div
      className={`rounded-xl p-4 ${toneStyles}`}
      role="group"
      aria-label={title}
    >
      <div className="text-ink-900 font-semibold">{title}</div>
      {meta && <div className="text-xs text-ink-500 mt-0.5">{meta}</div>}
      {children && <div className="mt-2 text-sm text-ink-700">{children}</div>}
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
