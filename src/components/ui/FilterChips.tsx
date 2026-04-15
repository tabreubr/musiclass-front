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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {options.map((option) => {
        const isActive = option.value === selected;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold
              transition-all duration-200
              ${isActive
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-text-secondary border border-border hover:border-primary hover:text-primary"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
