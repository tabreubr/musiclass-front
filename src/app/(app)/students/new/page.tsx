"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentsService } from "@/services/studentsService";
import { instrumentsService } from "@/services/instrumentsService";
import { instructorsService } from "@/services/instructorsService";
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
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "56px", paddingBottom: "20px" }}
      >
        <button onClick={() => router.back()} className="flex items-center gap-1.5" style={{ color: "#A78BFA", fontSize: "14px", marginBottom: "16px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nav_students")}
        </button>
        <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>{t("students_new_title")}</h1>
      </div>

      {/* Formulário */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "20px", gap: "16px" }}>

        <div style={{ ...cardStyle, borderRadius: "20px", padding: "20px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>
            {t("students_name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("students_name_placeholder")}
            className="w-full outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "16px" }}
          />
          {errors.name && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "8px" }}>{errors.name}</p>}
        </div>

        <div style={{ ...cardStyle, borderRadius: "20px", padding: "20px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>
            {t("students_instrument")}
          </label>
          <select
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className="w-full outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "16px" }}
          >
            <option value="" style={{ background: "#141728" }}>{t("students_select_instrument")}</option>
            {(instruments ?? []).map((i) => (
              <option key={i.id} value={i.id} style={{ background: "#141728" }}>{i.name}</option>
            ))}
          </select>
          {errors.instrument && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "8px" }}>{errors.instrument}</p>}
        </div>

        <div style={{ ...cardStyle, borderRadius: "20px", padding: "20px" }}>
          <label style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>
            {t("students_instructor")}
          </label>
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full outline-none"
            style={{ background: "transparent", color: "#F1F5F9", fontSize: "16px" }}
          >
            <option value="" style={{ background: "#141728" }}>{t("students_select_instructor")}</option>
            {(instructors ?? []).map((i) => (
              <option key={i.id} value={i.id} style={{ background: "#141728" }}>{i.name}</option>
            ))}
          </select>
          {errors.instructor && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "8px" }}>{errors.instructor}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full font-semibold active:scale-95 transition-transform disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "18px", padding: "18px", fontSize: "16px", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}
        >
          {saving ? t("students_creating") : t("students_create")}
        </button>
      </div>
    </div>
  );
}
