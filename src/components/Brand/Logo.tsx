import React from "react";

export type LogoVariant = "blue" | "amber";

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  variant?: LogoVariant;
  shadow?: boolean;
  ["data-testid"]?: string;
}

const SRC_BY_VARIANT: Record<LogoVariant, string> = {
  blue: "/brand/fellowus-logo-blue.png",
  amber: "/brand/fellowus-logo-amber.png",
};

export const Logo: React.FC<LogoProps> = ({
  size = 64,
  variant = "blue",
  shadow = true,
  className = "",
  "aria-label": ariaLabelProp,
  "data-testid": dataTestIdProp,
  loading = "lazy",
  decoding = "async",
  ...rest
}) => {
  const src = SRC_BY_VARIANT[variant] ?? SRC_BY_VARIANT.blue;
  const ariaLabel = ariaLabelProp ?? "Fellowus logo";
  const dataTestId = dataTestIdProp ?? "brand-logo";

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={ariaLabel}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      loading={loading}
      decoding={decoding}
      className={`${shadow ? "drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]" : ""} ${className}`.trim()}
      {...rest}
    />
  );
};
