"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

const cardStyle: React.CSSProperties = {
  background: "#141728",
  border: "1px solid rgba(255,255,255,0.07)",
};

const selectStyle: React.CSSProperties = {
  background: "transparent",
  color: "#F1F5F9",
};

export default function NewClassPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { data: students } = useFetch(() => studentsService.findAll());

  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [observations, setObservations] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!studentId) newErrors.student = t("classes_err_student");
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
        studentId: Number(studentId),
      } as never);
      router.push(`/classes/${created.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating class");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "14px" }}
      >
        <button onClick={() => router.back()} className="flex items-center gap-1.5" style={{ color: "#A78BFA", fontSize: "14px", marginBottom: "10px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nav_classes")}
        </button>
        <h1 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>{t("classes_new_title")}</h1>
      </div>

      {/* Formulário */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "8px", gap: "10px" }}>

        <div style={{ ...cardStyle, borderRadius: "16px", padding: "13px 16px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
            {t("classes_student")}
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "15px" }}
          >
            <option value="" style={{ background: "#141728" }}>{t("classes_select_student")}</option>
            {(students ?? []).map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#141728" }}>
                {s.name} — {s.instrument?.name ?? ""}
              </option>
            ))}
          </select>
          {errors.student && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "6px" }}>{errors.student}</p>}
        </div>

        <div style={{ ...cardStyle, borderRadius: "16px", padding: "13px 16px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
            {t("classes_date")}
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "15px", colorScheme: "dark" }}
          />
          {errors.date && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "6px" }}>{errors.date}</p>}
        </div>

        <div style={{ ...cardStyle, borderRadius: "16px", padding: "13px 16px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
            {t("classes_observations").replace("...", "")} <span style={{ textTransform: "none", fontWeight: 400, color: "#64748B" }}>{t("classes_obs_optional")}</span>
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={t("classes_obs_placeholder")}
            rows={2}
            className="w-full resize-none outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "14px", lineHeight: "1.5" }}
          />
        </div>

        {/* Dica */}
        <div
          className="flex items-start"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "14px", padding: "11px 14px", gap: "10px" }}
        >
          <span style={{ fontSize: "16px" }}>💡</span>
          <p style={{ color: "#FBBF24", fontSize: "12px", lineHeight: "1.4" }}>
            {t("classes_result_tip")}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full font-semibold active:scale-95 transition-transform disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "16px", padding: "15px", fontSize: "15px", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}
        >
          {saving ? t("classes_creating") : t("classes_create")}
        </button>
      </div>
    </div>
  );
}
