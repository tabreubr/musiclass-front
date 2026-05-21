"use client";

interface FilterChipsProps<T extends string> {
  options: { label: string; value: T }[];
  selected: T;
  onChange: (value: T) => void;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onChange,
}: FilterChipsProps<T>) {
  return (
    <div className="flex overflow-x-auto scrollbar-none" style={{ gap: "8px", paddingBottom: "4px" }}>
      {options.map((option) => {
        const isActive = option.value === selected;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex-shrink-0 transition-all duration-200"
            style={{
              paddingLeft: "14px",
              paddingRight: "14px",
              paddingTop: "8px",
              paddingBottom: "8px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              ...(isActive
                ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" }
                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#64748B" }
              ),
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
