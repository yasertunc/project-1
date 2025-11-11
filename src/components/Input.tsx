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
      {label && <div className="mb-1 text-sm text-ink-700">{label}</div>}
      <div
        className={`flex items-center gap-2 rounded-pill bg-muted-100 px-3 py-2 focus-within:ring-2 ring-primary-400 ${error ? "ring-danger-500" : ""}`}
      >
        {leftIcon && <span aria-hidden>{leftIcon}</span>}
        <input
          className={`bg-transparent outline-none flex-1 text-ink-900 placeholder:text-ink-500 ${className}`}
          {...props}
        />
      </div>
      {error && <div className="mt-1 text-[11px] text-danger-500">{error}</div>}
    </label>
  );
};
