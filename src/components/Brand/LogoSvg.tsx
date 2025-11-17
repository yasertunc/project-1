import * as React from "react";

type LogoSvgProps = {
  size?: number;
  title?: string;
  className?: string;
};

export function LogoSvg({
  size = 32,
  title = "Fellowus",
  className,
}: LogoSvgProps) {
  const ariaLabel = title ?? "Fellowus";
  const dimension = `${size}`;
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-main)" />
          <stop offset="100%" stopColor="var(--color-primary-dark)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" />
      <path
        d="M20 42c4 4 12 4 16 0l8-8c4-4 4-10 0-14s-10-4-14 0l-2 2-2-2c-4-4-10-4-14 0s-4 10 0 14l8 8Z"
        fill="white"
        opacity={0.92}
      />
    </svg>
  );
}
