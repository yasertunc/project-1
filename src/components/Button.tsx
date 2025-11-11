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
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-pill px-4 py-2 text-sm transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 " +
    "ring-offset-[var(--muted-50)]";

  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-400",
    outline: "border border-ink-700/20 text-ink-900 hover:bg-muted-100",
    ghost: "text-ink-700 hover:bg-muted-100",
    secondary: "bg-muted-100 text-ink-900 hover:bg-muted-50",
    accent: "bg-[var(--color-accent-amber-500)] text-white hover:opacity-90",
  };

  const hasText =
    typeof children === "string"
      ? children.trim().length > 0
      : React.Children.count(children) > 0;

  const ariaLabel = props["aria-label"];
  const safeProps = !hasText && !ariaLabel ? { "aria-label": "Button" } : {};

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...safeProps}
      {...props}
    >
      {children}
    </button>
  );
};
