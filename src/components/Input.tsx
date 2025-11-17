import React from "react";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  className = "",
  ...props
}) => {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm text-text-secondary">{label}</div>}
      <div
        className={`flex items-center gap-2 rounded-pill bg-background-light px-3 py-2 focus-within:ring-2 ring-primary-light ${error ? "ring-semantic-error" : ""}`}
      >
        {leftIcon && <span aria-hidden>{leftIcon}</span>}
        <input
          className={`bg-transparent outline-none flex-1 text-text-primary placeholder:text-text-tertiary ${className}`}
          {...props}
        />
      </div>
      {error && <div className="mt-1 text-[11px] text-semantic-error">{error}</div>}
    </label>
  );
};
