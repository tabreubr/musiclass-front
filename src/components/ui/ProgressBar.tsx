interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({ value, showLabel = true, color = "bg-primary" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-primary w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
