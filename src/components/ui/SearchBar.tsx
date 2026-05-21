"use client";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder = "Search...", value, onChange }: SearchBarProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
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
        className="w-full focus:outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "16px",
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "48px",
          paddingRight: "16px",
          fontSize: "14px",
          color: "#F1F5F9",
        }}
      />
    </div>
  );
}
