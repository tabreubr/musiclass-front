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
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }) + " · " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function lessonLabel(lesson: Lesson): string {
  const method = lesson.methodName?.name ?? "—";
  const parts = [];
  if (lesson.lessonNumber != null) parts.push(`Lesson ${lesson.lessonNumber}`);
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
    } catch {
      // silently ignore
    }
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
      setNewMethodName("");
      setNewPage("");
      setNewLessonNumber("");
      setShowAddLesson(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t("classes_err_add_lesson"));
    } finally {
      setAddingLesson(false);
    }
  }

  async function handleSave() {
    if (!classItem) return;
    setSaving(true);
    setSaved(false);
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
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="font-medium">{error ?? t("classes_not_found")}</p>
        <button onClick={() => router.back()} className="text-primary text-sm mt-2">{t("classes_go_back")}</button>
      </div>
    );
  }

  const instrumentName = classItem.student?.instrument?.name ?? "—";
  const doneCount = lessons.filter((l) => l.completed).length;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-text-secondary text-sm mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nav_classes")}
        </button>
        <h1 className="text-lg font-bold text-text-primary">{classItem.student?.name ?? "—"}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{instrumentName} · {formatDateTime(classItem.date)}</p>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Instrutor */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">{t("classes_instructor")}</span>
            <span className="text-text-primary text-sm font-medium">{classItem.instructor?.name ?? "—"}</span>
          </div>
        </div>

        {/* Lições */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide">{t("classes_lessons")}</p>
              {lessons.length > 0 && (
                <p className="text-text-secondary text-xs mt-0.5">
                  {doneCount}/{lessons.length} {t("classes_completed")}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddLesson((v) => !v)}
              className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg"
            >
              {showAddLesson ? "−" : "+"}
            </button>
          </div>

          {/* Formulário de nova lição */}
          {showAddLesson && (
            <div className="mb-3 p-3 bg-surface-secondary rounded-xl flex flex-col gap-2">
              <input
                value={newMethodName}
                onChange={(e) => setNewMethodName(e.target.value)}
                placeholder={t("classes_method")}
                className="w-full text-sm bg-white rounded-lg px-3 py-2 outline-none border border-border"
              />
              <div className="flex gap-2">
                <input
                  value={newLessonNumber}
                  onChange={(e) => setNewLessonNumber(e.target.value)}
                  placeholder={t("classes_lesson_number")}
                  type="number"
                  className="flex-1 text-sm bg-white rounded-lg px-3 py-2 outline-none border border-border"
                />
                <input
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  placeholder={t("classes_page")}
                  type="number"
                  className="flex-1 text-sm bg-white rounded-lg px-3 py-2 outline-none border border-border"
                />
              </div>
              <button
                onClick={handleAddLesson}
                disabled={addingLesson || !newMethodName.trim()}
                className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {addingLesson ? t("classes_adding") : t("classes_add_lesson")}
              </button>
            </div>
          )}

          {/* Lista de lições */}
          {lessons.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">{t("classes_no_lessons_hint")}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(lesson)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      lesson.completed
                        ? "bg-status-passed border-status-passed"
                        : "border-border bg-white"
                    }`}
                  >
                    {lesson.completed && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <p className={`flex-1 text-sm ${lesson.completed ? "line-through text-text-secondary" : "text-text-primary"}`}>
                    {lessonLabel(lesson)}
                  </p>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="text-text-secondary hover:text-status-failed transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">{t("classes_result")}</p>
          <div className="flex gap-2">
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
        <div className="bg-white rounded-2xl p-4 border border-border">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">
            {t("classes_observations").replace("...", "")}
          </p>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={t("classes_obs_detail_placeholder")}
            rows={4}
            className="w-full text-sm text-text-primary placeholder-text-secondary resize-none outline-none"
          />
        </div>

        {/* Salvar */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-primary text-white font-semibold rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
          style={{ marginBottom: '8px' }}
        >
          {saving ? t("classes_saving") : saved ? t("classes_saved") : t("classes_save_changes")}
        </button>
      </div>
    </div>
  );
}

const colorMap = {
  green: { active: "bg-status-passed text-white", inactive: "bg-green-50 text-status-passed" },
  amber: { active: "bg-status-pending text-white", inactive: "bg-amber-50 text-status-pending" },
  red:   { active: "bg-status-failed text-white",  inactive: "bg-red-50 text-status-failed"  },
};

function ResultButton({ label, color, active, onClick }: {
  label: string; color: "green" | "amber" | "red"; active: boolean; onClick: () => void;
}) {
  const styles = colorMap[color];
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${active ? styles.active : styles.inactive}`}
    >
      {label}
    </button>
  );
}
