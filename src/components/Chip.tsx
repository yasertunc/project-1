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
    "focus-visible:ring-2 focus-visible:ring-primary-light";

  const style = selected
    ? "bg-primary-light/20 text-primary-main"
    : "bg-background-light text-text-secondary hover:bg-surface-gray";

  return <button className={`${base} ${style} ${className}`} {...props} />;
};
