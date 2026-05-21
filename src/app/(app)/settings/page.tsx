"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/translations";
import { instrumentsService } from "@/services/instrumentsService";
import { useFetch } from "@/hooks/useFetch";

export default function SettingsPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const { data: instruments, refetch } = useFetch(() => instrumentsService.findAll());
  const [newInstrument, setNewInstrument] = useState("");
  const [saving, setSaving] = useState(false);

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: "en", label: t("settings_english"), flag: "🇺🇸" },
    { value: "pt", label: t("settings_portuguese"), flag: "🇧🇷" },
  ];

  async function handleAddInstrument() {
    if (!newInstrument.trim()) return;
    setSaving(true);
    try {
      await instrumentsService.save(newInstrument.trim());
      setNewInstrument("");
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await instrumentsService.deleteById(id);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? "Cannot delete instrument in use by a student.");
    }
  }

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "20px" }}>
        <button
          onClick={() => router.back()}
          className="flex items-center"
          style={{ color: "#A78BFA", fontSize: "14px", gap: "6px", marginBottom: "14px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("settings_back") ?? "Voltar"}
        </button>
        <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800 }}>{t("settings_title")}</h1>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "16px", gap: "14px" }}>

        {/* Idioma */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px 14px" }}>
            <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{t("settings_language")}</p>
            <p style={{ color: "#475569", fontSize: "13px" }}>{t("settings_language_desc")}</p>
          </div>

          {languages.map(({ value, label, flag }, index) => (
            <button
              key={value}
              onClick={() => setLang(value)}
              className="w-full flex items-center justify-between transition-colors"
              style={{
                padding: "14px 18px",
                background: lang === value ? "rgba(124,58,237,0.08)" : "transparent",
                ...(index < languages.length - 1 ? { borderTop: "1px solid rgba(255,255,255,0.05)" } : { borderTop: "1px solid rgba(255,255,255,0.05)" }),
              }}
            >
              <div className="flex items-center" style={{ gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{flag}</span>
                <span style={{ fontSize: "15px", fontWeight: lang === value ? 600 : 500, color: lang === value ? "#A78BFA" : "#F1F5F9" }}>
                  {label}
                </span>
              </div>
              {lang === value && (
                <div className="flex items-center justify-center" style={{ width: "22px", height: "22px", borderRadius: "9999px", background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}>
                  <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Instrumentos */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px 14px" }}>
            <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{t("settings_instruments")}</p>
            <p style={{ color: "#475569", fontSize: "13px" }}>{t("settings_instruments_desc")}</p>
          </div>

          {/* Campo de adição */}
          <div className="flex" style={{ padding: "0 18px 14px", gap: "10px" }}>
            <input
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInstrument()}
              placeholder={t("settings_instrument_placeholder")}
              className="flex-1 outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "12px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#F1F5F9",
                minWidth: "0",
              }}
            />
            <button
              onClick={handleAddInstrument}
              disabled={saving || !newInstrument.trim()}
              className="font-semibold disabled:opacity-50 active:scale-95 transition-transform flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                color: "white",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              }}
            >
              {t("settings_instrument_add")}
            </button>
          </div>

          {/* Lista */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {(instruments ?? []).length === 0 ? (
              <div className="flex flex-col items-center" style={{ padding: "28px 0", gap: "8px" }}>
                <span style={{ fontSize: "28px" }}>🎸</span>
                <p style={{ color: "#64748B", fontSize: "14px" }}>{t("settings_instrument_empty")}</p>
              </div>
            ) : (
              (instruments ?? []).map((inst, index) => (
                <div
                  key={inst.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: "14px 18px",
                    ...(index < (instruments ?? []).length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}),
                  }}
                >
                  <div className="flex items-center" style={{ gap: "12px" }}>
                    <span style={{ fontSize: "18px" }}>🎵</span>
                    <span style={{ color: "#F1F5F9", fontSize: "15px", fontWeight: 500 }}>{inst.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="flex items-center justify-center transition-colors flex-shrink-0"
                    style={{ width: "30px", height: "30px", borderRadius: "9999px", background: "rgba(248,113,113,0.1)", color: "#F87171", fontSize: "20px", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
