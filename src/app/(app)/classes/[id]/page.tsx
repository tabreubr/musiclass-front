"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { classesService } from "@/services/classesService";
import { lessonsService } from "@/services/lessonsService";
import { ClassItem, Lesson } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

type Result = "passed" | "failed" | null;

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }) + " · " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function lessonLabel(lesson: Lesson): string {
  const method = lesson.methodName?.name ?? "—";
  const parts = [];
  if (lesson.lessonNumber != null) parts.push(`Lição ${lesson.lessonNumber}`);
  if (lesson.page != null) parts.push(`p. ${lesson.page}`);
  return parts.length > 0 ? `${method} — ${parts.join(", ")}` : method;
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const id = Number(params.id);

  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<Result>(null);
  const [observations, setObservations] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newMethodName, setNewMethodName] = useState("");
  const [newPage, setNewPage] = useState("");
  const [newLessonNumber, setNewLessonNumber] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    classesService.findById(id)
      .then((data) => {
        setClassItem(data);
        setResult(data.passed === true ? "passed" : data.passed === false ? "failed" : null);
        setObservations(data.observations ?? "");
        setLessons(data.lessons ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggle(lesson: Lesson) {
    const updated = !lesson.completed;
    setLessons((prev) =>
      prev.map((l) => l.id === lesson.id ? { ...l, completed: updated } : l)
    );
    try {
      await lessonsService.toggleCompleted(id, lesson.id, updated);
    } catch {
      setLessons((prev) =>
        prev.map((l) => l.id === lesson.id ? { ...l, completed: !updated } : l)
      );
    }
  }

  async function handleDeleteLesson(lessonId: number) {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    try {
      await lessonsService.deleteFromClass(id, lessonId);
    } catch { /* silently ignore */ }
  }

  async function handleAddLesson() {
    if (!newMethodName.trim()) return;
    setAddingLesson(true);
    try {
      const created = await lessonsService.addToClass(id, {
        methodName: newMethodName.trim(),
        page: newPage ? Number(newPage) : undefined,
        lessonNumber: newLessonNumber ? Number(newLessonNumber) : undefined,
      });
      setLessons((prev) => [...prev, created]);
      setNewMethodName(""); setNewPage(""); setNewLessonNumber("");
      setShowAddLesson(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t("classes_err_add_lesson"));
    } finally {
      setAddingLesson(false);
    }
  }

  async function handleSave() {
    if (!classItem) return;
    setSaving(true); setSaved(false);
    try {
      await classesService.updateById(id, {
        passed: result === "passed" ? true : result === "failed" ? false : classItem.passed,
        observations,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t("classes_err_save"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-secondary gap-3">
        <span className="text-4xl animate-spin">⏳</span>
        <p className="font-medium">{t("classes_loading_detail")}</p>
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="font-medium text-red-400">{error ?? t("classes_not_found")}</p>
        <button onClick={() => router.back()} className="text-primary-light text-sm mt-2">{t("classes_go_back")}</button>
      </div>
    );
  }

  const instrumentName = classItem.student?.instrument?.name ?? "—";
  const doneCount = lessons.filter((l) => l.completed).length;
  const initials = classItem.student?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "16px" }}
      >
        <button onClick={() => router.back()} className="flex items-center gap-1.5" style={{ color: "#A78BFA", fontSize: "14px", marginBottom: "12px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nav_classes")}
        </button>

        <div className="flex items-center" style={{ gap: "14px" }}>
          <div
            className="flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: "48px", height: "48px", borderRadius: "14px", fontSize: "18px", background: "linear-gradient(135deg, #7C3AED, #A855F7)", boxShadow: "0 6px 18px rgba(124,58,237,0.4)" }}
          >
            {initials}
          </div>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700 }}>{classItem.student?.name ?? "—"}</h1>
            <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "1px" }}>{instrumentName}</p>
            <p style={{ color: "#64748B", fontSize: "12px", marginTop: "1px" }}>{formatDateTime(classItem.date)}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "14px", paddingBottom: "8px", gap: "10px" }}>

        {/* Instrutor */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 18px" }}>
          <div className="flex justify-between items-center">
            <span style={{ color: "#64748B", fontSize: "14px" }}>{t("classes_instructor")}</span>
            <span style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 600 }}>{classItem.instructor?.name ?? "—"}</span>
          </div>
        </div>

        {/* Lições */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 18px" }}>
          <div className="flex justify-between items-center" style={{ marginBottom: "10px" }}>
            <div>
              <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t("classes_lessons")}</p>
              {lessons.length > 0 && (
                <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>
                  {doneCount}/{lessons.length} {t("classes_completed")}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddLesson((v) => !v)}
              className="flex items-center justify-center font-bold transition-colors"
              style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(124,58,237,0.15)", color: "#A78BFA", fontSize: "20px" }}
            >
              {showAddLesson ? "−" : "+"}
            </button>
          </div>

          {showAddLesson && (
            <div
              className="flex flex-col"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "14px", gap: "10px", marginBottom: "16px" }}
            >
              <input
                value={newMethodName}
                onChange={(e) => setNewMethodName(e.target.value)}
                placeholder={t("classes_method")}
                className="w-full outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#F1F5F9" }}
              />
              <div className="flex" style={{ gap: "10px" }}>
                <input
                  value={newLessonNumber}
                  onChange={(e) => setNewLessonNumber(e.target.value)}
                  placeholder={t("classes_lesson_number")}
                  type="number"
                  className="flex-1 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#F1F5F9", minWidth: "0" }}
                />
                <input
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  placeholder={t("classes_page")}
                  type="number"
                  className="flex-1 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#F1F5F9", minWidth: "0" }}
                />
              </div>
              <button
                onClick={handleAddLesson}
                disabled={addingLesson || !newMethodName.trim()}
                className="w-full font-semibold disabled:opacity-50 transition-all"
                style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "12px", padding: "12px", fontSize: "14px" }}
              >
                {addingLesson ? t("classes_adding") : t("classes_add_lesson")}
              </button>
            </div>
          )}

          {lessons.length === 0 ? (
            <p style={{ color: "#64748B", fontSize: "14px", textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>{t("classes_no_lessons_hint")}</p>
          ) : (
            <div className="flex flex-col" style={{ gap: "14px" }}>
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center" style={{ gap: "14px" }}>
                  <button
                    onClick={() => handleToggle(lesson)}
                    className="flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      width: "26px", height: "26px", borderRadius: "50%", border: "2px solid",
                      ...(lesson.completed
                        ? { background: "#34D399", borderColor: "#34D399" }
                        : { borderColor: "rgba(255,255,255,0.2)", background: "transparent" })
                    }}
                  >
                    {lesson.completed && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <p className="flex-1" style={{ fontSize: "14px", color: lesson.completed ? "#64748B" : "#F1F5F9", textDecoration: lesson.completed ? "line-through" : "none" }}>
                    {lessonLabel(lesson)}
                  </p>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="transition-colors"
                    style={{ color: "#64748B", fontSize: "20px", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 18px" }}>
          <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>{t("classes_result")}</p>
          <div className="flex" style={{ gap: "8px" }}>
            {(["passed", "pending", "failed"] as const).map((r) => (
              <ResultButton
                key={r}
                label={t(r === "passed" ? "classes_passed" : r === "failed" ? "classes_failed" : "classes_pending")}
                color={r === "passed" ? "green" : r === "failed" ? "red" : "amber"}
                active={result === (r === "pending" ? null : r)}
                onClick={() => setResult(r === "pending" ? null : result === r ? null : r)}
              />
            ))}
          </div>
        </div>

        {/* Observações */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 18px" }}>
          <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            {t("classes_observations").replace("...", "")}
          </p>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={t("classes_obs_detail_placeholder")}
            rows={3}
            className="w-full resize-none outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "14px", lineHeight: "1.5" }}
          />
        </div>

        {/* Salvar */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-semibold active:scale-95 transition-transform disabled:opacity-60"
          style={{
            borderRadius: "16px",
            padding: "15px",
            fontSize: "15px",
            ...(saved
              ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399" }
              : { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }
            )
          }}
        >
          {saving ? t("classes_saving") : saved ? t("classes_saved") : t("classes_save_changes")}
        </button>
      </div>
    </div>
  );
}

const resultStyles = {
  green: {
    active: { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399" },
    inactive: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748B" },
  },
  amber: {
    active: { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" },
    inactive: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748B" },
  },
  red: {
    active: { background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171" },
    inactive: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748B" },
  },
};

function ResultButton({ label, color, active, onClick }: {
  label: string; color: "green" | "amber" | "red"; active: boolean; onClick: () => void;
}) {
  const styles = resultStyles[color];
  return (
    <button
      onClick={onClick}
      className="flex-1 font-semibold transition-all active:scale-95"
      style={{
        borderRadius: "10px",
        paddingTop: "11px",
        paddingBottom: "11px",
        fontSize: "13px",
        ...(active ? styles.active : styles.inactive),
      }}
    >
      {label}
    </button>
  );
}
