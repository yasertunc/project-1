import React from "react";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  className = "",
  ...props
}) => {
  const base =
    "px-3 py-1.5 rounded-pill text-sm transition focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-primary-400";

  const style = selected
    ? "bg-primary-400/20 text-primary-600"
    : "bg-muted-100 text-ink-700 hover:bg-muted-50";

  return <button className={`${base} ${style} ${className}`} {...props} />;
};
