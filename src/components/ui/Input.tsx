import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-surface-secondary border border-border rounded-2xl py-3.5 px-4
          text-text-primary placeholder-text-secondary text-sm
          focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10
          transition-all duration-200
          ${error ? "border-status-failed/50" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-status-failed">{error}</span>}
    </div>
  );
}
