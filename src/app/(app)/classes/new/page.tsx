"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { instructorsService } from "@/services/instructorsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewClassPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { data: students } = useFetch(() => studentsService.findAll());
  const { data: instructors } = useFetch(() => instructorsService.findAll());

  const [studentId, setStudentId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [date, setDate] = useState("");
  const [observations, setObservations] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!studentId) newErrors.student = t("classes_err_student");
    if (!instructorId) newErrors.instructor = t("classes_err_instructor");
    if (!date) newErrors.date = t("classes_err_date");
    else if (new Date(date) <= new Date()) newErrors.date = t("classes_err_date_future");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await classesService.save({
        date,
        observations,
        student: { id: Number(studentId) } as never,
        instructor: { id: Number(instructorId) } as never,
      });
      router.push(`/classes/${created.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating class");
    } finally {
      setSaving(false);
    }
  }

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
        <h1 className="text-lg font-bold text-text-primary">{t("classes_new_title")}</h1>
      </div>

      {/* Formulário */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Aluno */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("classes_student")}
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">{t("classes_select_student")}</option>
            {(students ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.instrument?.name ?? ""}
              </option>
            ))}
          </select>
          {errors.student && <p className="text-status-failed text-xs mt-2">{errors.student}</p>}
        </div>

        {/* Instrutor */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("classes_instructor")}
          </label>
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">{t("classes_select_instructor")}</option>
            {(instructors ?? []).map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          {errors.instructor && <p className="text-status-failed text-xs mt-2">{errors.instructor}</p>}
        </div>

        {/* Data e hora */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("classes_date")}
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          />
          {errors.date && <p className="text-status-failed text-xs mt-2">{errors.date}</p>}
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("classes_observations").replace("...", "")} <span className="normal-case font-normal">{t("classes_obs_optional")}</span>
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={t("classes_obs_placeholder")}
            rows={3}
            className="w-full text-sm text-text-primary placeholder-text-secondary resize-none outline-none"
          />
        </div>

        {/* Aviso */}
        <div className="bg-amber-50 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <p className="text-amber-700 text-xs leading-relaxed">
            {t("classes_result_tip")}
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 bg-primary text-white font-semibold rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
        >
          {saving ? t("classes_creating") : t("classes_create")}
        </button>
      </div>
    </div>
  );
}
