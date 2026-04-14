import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-4 shadow-card
        ${onClick ? "cursor-pointer active:scale-98 transition-transform duration-150" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
