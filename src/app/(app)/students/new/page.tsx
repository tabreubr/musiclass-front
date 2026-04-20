"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentsService } from "@/services/studentsService";
import { instrumentsService } from "@/services/instrumentsService";
import { instructorsService } from "@/services/instructorsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewStudentPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { data: instruments } = useFetch(() => instrumentsService.findAll());
  const { data: instructors } = useFetch(() => instructorsService.findAll());

  const [name, setName] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("students_err_name");
    if (!instrumentId) newErrors.instrument = t("students_err_instrument");
    if (!instructorId) newErrors.instructor = t("students_err_instructor");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await studentsService.save({
        name: name.trim(),
        instrument: { id: Number(instrumentId) } as never,
        instructor: { id: Number(instructorId) } as never,
      });
      router.push(`/students/${created.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating student");
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
          {t("nav_students")}
        </button>
        <h1 className="text-lg font-bold text-text-primary">{t("students_new_title")}</h1>
      </div>

      {/* Formulário */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Nome */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("students_name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("students_name_placeholder")}
            className="w-full text-sm text-text-primary placeholder-text-secondary outline-none"
          />
          {errors.name && <p className="text-status-failed text-xs mt-2">{errors.name}</p>}
        </div>

        {/* Instrumento */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("students_instrument")}
          </label>
          <select
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">{t("students_select_instrument")}</option>
            {(instruments ?? []).map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          {errors.instrument && <p className="text-status-failed text-xs mt-2">{errors.instrument}</p>}
        </div>

        {/* Instrutor */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            {t("students_instructor")}
          </label>
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">{t("students_select_instructor")}</option>
            {(instructors ?? []).map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          {errors.instructor && <p className="text-status-failed text-xs mt-2">{errors.instructor}</p>}
        </div>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 bg-primary text-white font-semibold rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
        >
          {saving ? t("students_creating") : t("students_create")}
        </button>
      </div>
    </div>
  );
}
