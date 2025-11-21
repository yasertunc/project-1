import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "secondary" | "accent";
  "aria-label"?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  "aria-label": ariaLabelProp,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-pill px-4 py-2 text-sm transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 " +
    "ring-offset-[var(--color-background-light)]";

  const variants: Record<string, string> = {
    primary: "bg-primary-main text-white hover:bg-primary-light",
    outline: "border border-text-secondary/20 text-text-primary hover:bg-background-light",
    ghost: "text-text-secondary hover:bg-background-light",
    secondary: "bg-background-light text-text-primary hover:bg-surface-gray",
    accent: "bg-vip-main text-white hover:opacity-90",
  };

  const hasText =
    typeof children === "string"
      ? children.trim().length > 0
      : React.Children.count(children) > 0;

  const finalAriaLabel =
    !hasText && !ariaLabelProp ? "Button" : ariaLabelProp;

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={finalAriaLabel}
      {...rest}
    >
      {children}
    </button>
  );
};
