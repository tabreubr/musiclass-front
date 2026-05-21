"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentCard } from "@/components/students/StudentCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StudentsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const { data: students, loading, error } = useFetch(() => studentsService.findAll());

  const filtered = (students ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.instrument?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "56px", paddingBottom: "20px" }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: "20px" }}>
          <div>
            <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
              {t("students_title")}
            </p>
            {!loading && !error && (
              <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                {filtered.length} {filtered.length !== 1 ? t("students_active_plural") : t("students_active")}
              </h1>
            )}
          </div>
        </div>
        <SearchBar
          placeholder={t("students_search")}
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Lista */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "20px", gap: "12px" }}>
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3 animate-spin">⏳</span>
            <p className="font-medium">{t("students_loading")}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="font-medium text-red-400">{t("students_error")}</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3">🎓</span>
            <p className="font-medium">{t("students_empty")}</p>
          </div>
        )}
        {!loading && !error && filtered.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            progress={0}
            onClick={() => router.push(`/students/${student.id}`)}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push("/students/new")}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl active:scale-95 transition-transform z-40"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
        }}
      >
        +
      </button>
    </div>
  );
}
