import { DevelopmentGoal } from "@/types";

interface DevelopmentGoalCardProps {
  goal: DevelopmentGoal;
  onClick?: () => void;
}

export function DevelopmentGoalCard({ goal, onClick }: DevelopmentGoalCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-border cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          🎯
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary text-sm leading-snug">{goal.description}</p>
          <p className="text-text-secondary text-xs mt-1">{goal.student?.name ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
