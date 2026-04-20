"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { studentsService } from "@/services/studentsService";
import { Student, ClassItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/contexts/LanguageContext";

const instrumentIcons: Record<string, string> = {
  Guitar: "🎸", Piano: "🎹", Vocals: "🎤",
  Drums: "🥁", Violin: "🎻", Trompa: "🎺", Tuba: "🎺",
};

function getStatus(passed: boolean | null) {
  if (passed === null) return "pending" as const;
  return passed ? "passed" as const : "failed" as const;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const id = Number(params.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentsService.findById(id)
      .then(setStudent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return t("date_today");
    if (date.toDateString() === yesterday.toDateString()) return t("date_yesterday");
    if (date.toDateString() === tomorrow.toDateString()) return t("date_tomorrow");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-secondary gap-3">
        <span className="text-4xl animate-spin">⏳</span>
        <p className="font-medium">{t("students_loading_profile")}</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="font-medium">{error ?? t("students_not_found")}</p>
        <button onClick={() => router.back()} className="text-primary text-sm mt-2">{t("students_go_back")}</button>
      </div>
    );
  }

  const instrumentName = student.instrument?.name ?? "—";
  const emoji = instrumentIcons[instrumentName] ?? "🎵";
  const classes = (student.classes ?? []) as ClassItem[];

  const total = classes.length;
  const passed = classes.filter((c) => c.passed === true).length;
  const failed = classes.filter((c) => c.passed === false).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const sorted = [...classes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-text-secondary text-sm mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nav_students")}
        </button>
        <h1 className="text-lg font-bold text-text-primary">{student.name}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{instrumentName} · {student.instructor?.name ?? "—"}</p>
        {total > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${passRate}%` }} />
            </div>
            <span className="text-xs font-semibold text-text-secondary">{passRate}%</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={total} label={t("students_total_classes")} color="text-primary" />
          <StatCard value={passed} label={t("students_passed")} color="text-status-passed" />
          <StatCard value={failed} label={t("students_failed")} color="text-status-failed" />
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">
            {t("students_class_history")}
          </p>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-text-secondary gap-2">
              <span className="text-3xl">🎵</span>
              <p className="text-sm">{t("students_no_classes")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sorted.map((c) => (
                <button
                  key={c.id}
                  onClick={() => router.push(`/classes/${c.id}`)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium">
                      {c.lessons && c.lessons.length > 0
                        ? c.lessons.map((l) => l.methodName?.name ?? "—").join(", ")
                        : t("students_no_lessons")}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">{formatDate(c.date)}</p>
                  </div>
                  <Badge status={getStatus(c.passed)} />
                  <span className="text-text-secondary">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-border text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-text-secondary text-xs mt-0.5">{label}</p>
    </div>
  );
}
