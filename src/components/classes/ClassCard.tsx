"use client";

import { Badge } from "@/components/ui/Badge";
import { ClassItem, ClassStatus } from "@/types";

function getStatus(passed: boolean | null): ClassStatus {
  if (passed === null) return "pending";
  return passed ? "passed" : "failed";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
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
  const instrumentName = classItem.student?.instrument?.name ?? "—";
  const status = getStatus(classItem.passed);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center text-xl flex-shrink-0">
        🎵
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-text-primary">{classItem.student?.name ?? "—"}</p>
        <p className="text-xs text-text-secondary mt-0.5">{instrumentName} · {formatDate(classItem.date)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge status={status} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 6L15 12L9 18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
