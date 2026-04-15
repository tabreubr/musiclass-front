"use client";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder = "Search...", value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="11" cy="11" r="8" stroke="#64748B" strokeWidth="2" />
        <path d="M21 21L16.65 16.65" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-border rounded-2xl py-3 pl-11 pr-4
          text-text-primary placeholder-text-secondary text-sm
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-all duration-200 shadow-card"
      />
    </div>
  );
}
