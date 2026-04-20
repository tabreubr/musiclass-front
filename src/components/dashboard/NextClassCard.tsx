"use client";

import { ClassItem } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface NextClassCardProps {
  classItem: ClassItem;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const time = formatTime(dateStr);
  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
}

function timeUntilLabel(dateStr: string): string {
  const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 60000);
  if (diff <= 0) return "Now";
  if (diff < 60) return `In ${diff}min`;
  if (diff < 60 * 24) return `In ${Math.round(diff / 60)}h`;
  const days = Math.round(diff / (60 * 24));
  return `In ${days}d`;
}

export function NextClassCard({ classItem }: NextClassCardProps) {
  const { t } = useLanguage();
  const timeLabel = timeUntilLabel(classItem.date);
  const instrumentName = classItem.student?.instrument?.name ?? "—";

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("dash_next_class")}</span>
        <span className="text-xs text-text-secondary">{timeLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          🎵
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-text-primary">{classItem.student?.name ?? "—"}</p>
          <p className="text-xs text-text-secondary mt-0.5">{instrumentName} · {formatFullDate(classItem.date)}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M9 6L15 12L9 18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
