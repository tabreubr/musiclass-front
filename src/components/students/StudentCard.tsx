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
  const initials = student.name?.[0]?.toUpperCase() ?? "?";

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center active:scale-[0.98] transition-transform"
      style={{
        background: "#141728",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "16px",
        gap: "12px",
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center font-bold text-white"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          fontSize: "14px",
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 600 }}>{student.name}</p>
        <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>{instrumentName}</p>
        {nextClass && (
          <p style={{ color: "#A78BFA", fontSize: "12px", marginTop: "4px" }}>
            {t("students_next")} {nextClass}
          </p>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
        <path d="M9 6L15 12L9 18" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
