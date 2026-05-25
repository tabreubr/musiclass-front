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
        <span style={{ fontSize: "36px" }} className="animate-spin">⏳</span>
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ background: "#0A0D1A", minHeight: "100dvh", gap: "12px" }}>
        <span style={{ fontSize: "40px" }}>⚠️</span>
        <p style={{ color: "#F87171", fontSize: "14px" }}>Aula não encontrada</p>
        <button
          onClick={() => router.back()}
          style={{ color: "#A78BFA", fontSize: "14px" }}
        >
          ← Voltar
        </button>
      </div>
    );
  }

  const completedLessons = classItem.lessons.filter((l) => l.completed).length;

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh", paddingBottom: "40px" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1A0F3C 0%, #120A2E 55%, #0A0D1A 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "52px",
        paddingBottom: "20px",
      }}>
        {/* Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center"
          style={{ color: "#A78BFA", fontSize: "14px", gap: "6px", marginBottom: "20px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Minhas Aulas
        </button>

        {/* Data + instrutor + badge */}
        <div className="flex items-start justify-between" style={{ gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700, lineHeight: "1.35", textTransform: "capitalize" }}>
              {formatDate(classItem.date)}
            </p>
            {classItem.instructor && (
              <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "6px" }}>
                Instrutor: {classItem.instructor.name}
              </p>
            )}
          </div>
          <Badge status={getStatus(classItem.passed)} />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", gap: "14px" }}>

        {/* Observações */}
        {classItem.observations && (
          <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "16px" }}>
            <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
              Observações
            </p>
            <p style={{ color: "#F1F5F9", fontSize: "14px", lineHeight: "1.6", fontStyle: "italic" }}>
              {classItem.observations}
            </p>
          </div>
        )}

        {/* Lições */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "16px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
            <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Lições
            </p>
            {classItem.lessons.length > 0 && (
              <p style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 600 }}>
                {completedLessons}/{classItem.lessons.length} concluídas
              </p>
            )}
          </div>

          {classItem.lessons.length === 0 ? (
            <div className="flex flex-col items-center" style={{ paddingTop: "24px", paddingBottom: "24px", gap: "8px" }}>
              <span style={{ fontSize: "32px" }}>🎵</span>
              <p style={{ color: "#64748B", fontSize: "14px" }}>Nenhuma lição registrada</p>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {classItem.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center" style={{ gap: "12px" }}>
                  {/* Ícone de status */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      ...(lesson.completed
                        ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }
                      ),
                    }}
                  >
                    {lesson.completed ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#475569" }} />
                    )}
                  </div>

                  {/* Nome + detalhes */}
                  <div className="flex-1 min-w-0">
                    <p style={{
                      color: lesson.completed ? "#64748B" : "#F1F5F9",
                      fontSize: "14px",
                      fontWeight: 500,
                      textDecoration: lesson.completed ? "line-through" : "none",
                    }}>
                      {lesson.methodName?.name ?? "—"}
                    </p>
                    {(lesson.lessonNumber || lesson.page) && (
                      <p style={{ color: "#475569", fontSize: "12px", marginTop: "2px" }}>
                        {lesson.lessonNumber ? `Lição ${lesson.lessonNumber}` : ""}
                        {lesson.lessonNumber && lesson.page ? " · " : ""}
                        {lesson.page ? `Pág. ${lesson.page}` : ""}
                      </p>
                    )}
                  </div>

                  {/* Badge */}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      flexShrink: 0,
                      ...(lesson.completed
                        ? { color: "#34D399", background: "rgba(52,211,153,0.1)" }
                        : { color: "#64748B", background: "rgba(255,255,255,0.05)" }
                      ),
                    }}
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
