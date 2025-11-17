import React from "react";

type FeatureCardProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  ["data-testid"]?: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  ...rest
}: FeatureCardProps) {
  return (
    <div
      className="rounded-2xl border border-border-light bg-white p-5 text-left shadow-sm"
      {...rest}
    >
      {icon ? <div className="mb-3">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
}
