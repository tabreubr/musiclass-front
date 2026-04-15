import { ProgressBar } from "@/components/ui/ProgressBar";
import { Student } from "@/types";

const instrumentIcons: Record<string, { emoji: string; bg: string }> = {
  Guitar:  { emoji: "🎸", bg: "bg-pink-100" },
  Piano:   { emoji: "🎹", bg: "bg-blue-100" },
  Vocals:  { emoji: "🎤", bg: "bg-purple-100" },
  Drums:   { emoji: "🥁", bg: "bg-orange-100" },
  Violin:  { emoji: "🎻", bg: "bg-yellow-100" },
  default: { emoji: "🎵", bg: "bg-surface-secondary" },
};

interface StudentCardProps {
  student: Student;
  progress: number;
  nextClass?: string;
  onClick?: () => void;
}

export function StudentCard({ student, progress, nextClass, onClick }: StudentCardProps) {
  const instrumentName = student.instrument?.name ?? "default";
  const { emoji, bg } = instrumentIcons[instrumentName] ?? instrumentIcons.default;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl px-4 py-4 shadow-card flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
    >
      {/* Ícone */}
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
        {emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm">{student.name}</p>
        <p className="text-text-secondary text-xs mb-2">
          {instrumentName !== "default" ? instrumentName : "Music Student"}
        </p>

        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-text-secondary">Progress</span>
        </div>
        <ProgressBar value={progress} />

        {nextClass && (
          <p className="text-text-secondary text-xs mt-1.5">Next: {nextClass}</p>
        )}
      </div>

      {/* Seta */}
      <span className="text-text-secondary text-lg flex-shrink-0">›</span>
    </div>
  );
}
