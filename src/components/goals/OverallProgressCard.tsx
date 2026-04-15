import { ProgressBar } from "@/components/ui/ProgressBar";

interface OverallProgressCardProps {
  percentage: number;
  activeGoals: number;
  completed: number;
  inProgress: number;
}

export function OverallProgressCard({
  percentage,
  activeGoals,
  completed,
  inProgress,
}: OverallProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          🎯
        </div>
        <div>
          <h3 className="font-bold text-text-primary">Overall Progress</h3>
          <p className="text-text-secondary text-xs">All students combined</p>
        </div>
      </div>

      <ProgressBar value={percentage} color="bg-status-passed" />

      <div className="flex justify-between mt-4">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{activeGoals}</span>
          <span className="text-xs text-text-secondary">Active Goals</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-status-passed">{completed}</span>
          <span className="text-xs text-text-secondary">Completed</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-status-pending">{inProgress}</span>
          <span className="text-xs text-text-secondary">In Progress</span>
        </div>
      </div>
    </div>
  );
}
