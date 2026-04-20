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
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-text-secondary text-sm mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-bold text-text-primary">{t("settings_title")}</h1>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Idioma */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-text-primary font-bold text-sm">{t("settings_language")}</p>
            <p className="text-text-secondary text-xs mt-0.5">{t("settings_language_desc")}</p>
          </div>

          {languages.map(({ value, label, flag }, index) => (
            <button
              key={value}
              onClick={() => setLang(value)}
              className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${
                index < languages.length - 1 ? "border-b border-border" : ""
              } ${lang === value ? "bg-primary/5" : "hover:bg-surface-secondary"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{flag}</span>
                <span className={`text-sm font-medium ${lang === value ? "text-primary" : "text-text-primary"}`}>
                  {label}
                </span>
              </div>
              {lang === value && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Instrumentos */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-text-primary font-bold text-sm">{t("settings_instruments")}</p>
            <p className="text-text-secondary text-xs mt-0.5">{t("settings_instruments_desc")}</p>
          </div>

          {/* Campo de adição */}
          <div className="px-4 pb-3 flex gap-2">
            <input
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInstrument()}
              placeholder={t("settings_instrument_placeholder")}
              className="flex-1 text-sm text-text-primary outline-none border border-border rounded-xl px-3 py-2"
            />
            <button
              onClick={handleAddInstrument}
              disabled={saving || !newInstrument.trim()}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
            >
              {t("settings_instrument_add")}
            </button>
          </div>

          {/* Lista */}
          <div className="border-t border-border">
            {(instruments ?? []).length === 0 ? (
              <p className="text-text-secondary text-sm text-center py-6">
                {t("settings_instrument_empty")}
              </p>
            ) : (
              (instruments ?? []).map((inst, index) => (
                <div
                  key={inst.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    index < (instruments ?? []).length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-sm text-text-primary">{inst.name}</span>
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="text-text-secondary hover:text-status-failed transition-colors text-xl leading-none"
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
