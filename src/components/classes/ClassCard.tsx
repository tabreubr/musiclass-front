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
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (date.toDateString() === today.toDateString()) return `Hoje, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Ontem, ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Amanhã, ${time}`;
  return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" }) + `, ${time}`;
}

interface ClassCardProps {
  classItem: ClassItem;
  onClick?: () => void;
}

export function ClassCard({ classItem, onClick }: ClassCardProps) {
  const instrumentName = classItem.student?.instrument?.name ?? "—";
  const status = getStatus(classItem.passed);
  const initials = classItem.student?.name?.[0]?.toUpperCase() ?? "?";

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
        <p style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 600 }}>
          {classItem.student?.name ?? "—"}
        </p>
        <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>
          {instrumentName} · {formatDate(classItem.date)}
        </p>
      </div>
      <div className="flex-shrink-0 flex items-center" style={{ gap: "8px" }}>
        <Badge status={status} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 6L15 12L9 18" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}
