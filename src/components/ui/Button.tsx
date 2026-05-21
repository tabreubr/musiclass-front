import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "flex items-center justify-center gap-2 font-semibold rounded-2xl py-3.5 px-6 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed text-sm";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
    secondary:
      "bg-surface-secondary border border-border text-text-primary hover:bg-surface",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary",
    danger:
      "bg-status-failed/10 border border-status-failed/30 text-status-failed hover:bg-status-failed/20",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
