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
      className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm"
      {...rest}
    >
      {icon ? <div className="mb-3">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
