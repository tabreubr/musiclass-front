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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-gray-400">Carregando aula...</p>
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="text-red-500 text-sm">Aula não encontrada</p>
        <button onClick={() => router.back()} className="text-primary text-sm">← Voltar</button>
      </div>
    );
  }

  const completedLessons = classItem.lessons.filter((l) => l.completed).length;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-10">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-5 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-400 text-sm mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Minhas Aulas
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">{formatDate(classItem.date)}</p>
            {classItem.instructor && (
              <p className="text-sm text-gray-500">Instrutor: {classItem.instructor.name}</p>
            )}
          </div>
          <Badge status={getStatus(classItem.passed)} />
        </div>
      </div>

      <div className="px-6 mt-5 flex flex-col gap-4">

        {/* Observações */}
        {classItem.observations && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Observações</p>
            <p className="text-sm text-gray-700 italic">{classItem.observations}</p>
          </div>
        )}

        {/* Lições */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lições</p>
            {classItem.lessons.length > 0 && (
              <p className="text-xs text-primary font-medium">
                {completedLessons}/{classItem.lessons.length} concluídas
              </p>
            )}
          </div>

          {classItem.lessons.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <span className="text-3xl">🎵</span>
              <p className="text-sm text-gray-400">Nenhuma lição registrada</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {classItem.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3">
                  {/* Ícone de status da lição */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.completed ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <span className="text-xs">{lesson.completed ? "✓" : "○"}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {lesson.methodName?.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {lesson.lessonNumber ? `Lição ${lesson.lessonNumber}` : ""}
                      {lesson.lessonNumber && lesson.page ? " · " : ""}
                      {lesson.page ? `Pág. ${lesson.page}` : ""}
                    </p>
                  </div>

                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    lesson.completed
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-400"
                  }`}>
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
