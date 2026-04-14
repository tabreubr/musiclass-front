import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <input
        className={`
          w-full bg-white border border-border rounded-2xl py-3 px-4
          text-text-primary placeholder-text-secondary
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-all duration-200
          ${error ? "border-status-failed" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-status-failed">{error}</span>}
    </div>
  );
}
