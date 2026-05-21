"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { studentAreaService } from "@/services/studentAreaService";
import { ClassItem, ClassStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

function getStatus(passed: boolean | null): ClassStatus {
  if (passed === true) return "passed";
  if (passed === false) return "failed";
  return "pending";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentAreaService.getClassById(id)
      .then(setClassItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ background: "#0A0D1A", minHeight: "100dvh" }}>
        <span className="text-4xl animate-spin">⏳</span>
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="flex flex-col items-center justify-center gap-3" style={{ background: "#0A0D1A", minHeight: "100dvh" }}>
        <span className="text-4xl">⚠️</span>
        <p className="text-red-400 text-sm">Aula não encontrada</p>
        <button onClick={() => router.back()} className="text-primary-light text-sm">← Voltar</button>
      </div>
    );
  }

  const completedLessons = classItem.lessons.filter((l) => l.completed).length;

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh", paddingBottom: "40px" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "56px", paddingBottom: "24px" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-primary-light text-sm mb-5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Minhas Aulas
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-text-primary capitalize">{formatDate(classItem.date)}</p>
            {classItem.instructor && (
              <p className="text-sm text-primary-light mt-1">Instrutor: {classItem.instructor.name}</p>
            )}
          </div>
          <Badge status={getStatus(classItem.passed)} />
        </div>
      </div>

      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", marginTop: "20px", gap: "16px" }}>

        {/* Observações */}
        {classItem.observations && (
          <div
            className="rounded-2xl p-4"
            style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-2">Observações</p>
            <p className="text-sm text-text-primary italic">{classItem.observations}</p>
          </div>
        )}

        {/* Lições */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest">Lições</p>
            {classItem.lessons.length > 0 && (
              <p className="text-xs text-primary-light font-semibold">
                {completedLessons}/{classItem.lessons.length} concluídas
              </p>
            )}
          </div>

          {classItem.lessons.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2 text-text-secondary">
              <span className="text-3xl">🎵</span>
              <p className="text-sm">Nenhuma lição registrada</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {classItem.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={lesson.completed
                      ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }
                    }
                  >
                    {lesson.completed
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      : <span className="w-1.5 h-1.5 rounded-full bg-text-secondary inline-block" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${lesson.completed ? "text-text-secondary line-through" : "text-text-primary"}`}>
                      {lesson.methodName?.name ?? "—"}
                    </p>
                    {(lesson.lessonNumber || lesson.page) && (
                      <p className="text-xs text-text-secondary">
                        {lesson.lessonNumber ? `Lição ${lesson.lessonNumber}` : ""}
                        {lesson.lessonNumber && lesson.page ? " · " : ""}
                        {lesson.page ? `Pág. ${lesson.page}` : ""}
                      </p>
                    )}
                  </div>

                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={lesson.completed
                      ? { color: "#34D399", background: "rgba(52,211,153,0.1)" }
                      : { color: "#64748B", background: "rgba(255,255,255,0.05)" }
                    }
                  >
                    {lesson.completed ? "Feito" : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
