"use client";

import { Student } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentCardProps {
  student: Student;
  progress: number;
  nextClass?: string;
  onClick?: () => void;
}

export function StudentCard({ student, progress, nextClass, onClick }: StudentCardProps) {
  const { t } = useLanguage();
  const instrumentName = student.instrument?.name ?? "—";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center text-xl flex-shrink-0">
        🎓
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-text-primary">{student.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">{instrumentName}</p>
        {nextClass && (
          <p className="text-xs text-text-secondary mt-1">{t("students_next")} {nextClass}</p>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
        <path d="M9 6L15 12L9 18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
