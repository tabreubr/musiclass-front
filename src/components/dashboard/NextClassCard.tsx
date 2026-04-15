import { ClassItem } from "@/types";

interface NextClassCardProps {
  classItem: ClassItem;
  daysUntil: number;
}

function formatClassDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    + " · "
    + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function NextClassCard({ classItem, daysUntil }: NextClassCardProps) {
  const daysLabel = daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`;

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-white/80 bg-white/20 px-3 py-1 rounded-full">
          Next Class
        </span>
        <span className="text-xs text-white/80">{daysLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          🎵
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-base">
            {classItem.student?.name ?? "—"}
          </h3>
          <p className="text-white/70 text-sm">
            {classItem.student?.instrument?.name ?? "—"}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            {formatClassDate(classItem.date)}
          </p>
        </div>
        <div className="text-white/60">›</div>
      </div>
    </div>
  );
}
