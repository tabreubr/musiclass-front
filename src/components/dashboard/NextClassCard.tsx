import { ClassItem } from "@/types";

interface NextClassCardProps {
  classItem: ClassItem;
  minutesUntil: number;
}

export function NextClassCard({ classItem, minutesUntil }: NextClassCardProps) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-white/80 bg-white/20 px-3 py-1 rounded-full">
          Next Class
        </span>
        <span className="text-xs text-white/80">
          In {minutesUntil} minutes
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          🎸
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-base">
            {classItem.student.name}
          </h3>
          <p className="text-white/70 text-sm">
            {classItem.student.instrument} • {classItem.student.level}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            {new Date(classItem.date).toLocaleDateString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-white/60">›</div>
      </div>
    </div>
  );
}
