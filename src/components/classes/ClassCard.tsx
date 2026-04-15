import { Badge } from "@/components/ui/Badge";
import { ClassItem, ClassStatus } from "@/types";

const instrumentIcons: Record<string, { emoji: string; bg: string }> = {
  Guitar:   { emoji: "🎸", bg: "bg-pink-100" },
  Piano:    { emoji: "🎹", bg: "bg-blue-100" },
  Vocals:   { emoji: "🎤", bg: "bg-purple-100" },
  Drums:    { emoji: "🥁", bg: "bg-orange-100" },
  Violin:   { emoji: "🎻", bg: "bg-yellow-100" },
  default:  { emoji: "🎵", bg: "bg-surface-secondary" },
};

function getStatus(passed: boolean | null): ClassStatus {
  if (passed === null) return "pending";
  return passed ? "passed" : "failed";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
}

interface ClassCardProps {
  classItem: ClassItem;
  onClick?: () => void;
}

export function ClassCard({ classItem, onClick }: ClassCardProps) {
  const instrumentName = classItem.student?.instrument?.name ?? "default";
  const { emoji, bg } = instrumentIcons[instrumentName] ?? instrumentIcons.default;
  const status = getStatus(classItem.passed);
  const lessonCount = classItem.lessons?.length ?? 0;
  const doneCount = classItem.lessons?.filter((l) => l.completed).length ?? 0;
  const lessonSummary = lessonCount > 0 ? `${doneCount}/${lessonCount} lessons` : "No lessons";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
    >
      {/* Ícone */}
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
        {emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm">{classItem.student?.name ?? "—"}</p>
        <p className="text-text-secondary text-xs">{instrumentName !== "default" ? instrumentName : "—"} · {lessonSummary}</p>
        <p className="text-text-secondary text-xs mt-0.5">{formatDate(classItem.date)}</p>
      </div>

      {/* Badge + seta */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge status={status} />
        <span className="text-text-secondary text-lg">›</span>
      </div>
    </div>
  );
}
