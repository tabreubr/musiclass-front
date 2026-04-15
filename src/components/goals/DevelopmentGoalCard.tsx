import { ProgressBar } from "@/components/ui/ProgressBar";
import { DevelopmentGoal } from "@/types";

const goalIcons: Record<string, { emoji: string; bg: string }> = {
  rhythm:   { emoji: "🎵", bg: "bg-blue-100" },
  reading:  { emoji: "📖", bg: "bg-pink-100" },
  theory:   { emoji: "📝", bg: "bg-purple-100" },
  technique:{ emoji: "🎸", bg: "bg-green-100" },
  default:  { emoji: "⭐", bg: "bg-surface-secondary" },
};

interface DevelopmentGoalCardProps {
  goal: DevelopmentGoal;
  studentsCount: number;
  iconKey?: string;
  onClick?: () => void;
}

export function DevelopmentGoalCard({
  goal,
  studentsCount,
  iconKey = "default",
  onClick,
}: DevelopmentGoalCardProps) {
  const { emoji, bg } = goalIcons[iconKey] ?? goalIcons.default;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-card cursor-pointer active:scale-98 transition-transform"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm">{goal.name}</h3>
          {goal.description && (
            <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
              {goal.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">
          {studentsCount} students working on this
        </span>
      </div>
      <ProgressBar value={goal.progress} />
    </div>
  );
}
