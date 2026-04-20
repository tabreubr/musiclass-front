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
    <div className="bg-[#F8FAFC]">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-5 shadow-sm" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-[#1E3A5F]">{t("students_title")}</h1>
          <button className="w-9 h-9 bg-surface-secondary rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <SearchBar
          placeholder={t("students_search")}
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Contador + Lista */}
      <div className="px-6 py-4 flex flex-col gap-3.5" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        {!loading && !error && (
          <p className="text-sm text-text-secondary font-medium">
            {filtered.length} {filtered.length !== 1 ? t("students_active_plural") : t("students_active")}
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3 animate-spin">⏳</span>
            <p className="font-medium">{t("students_loading")}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-500">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="font-medium">{t("students_error")}</p>
            <p className="text-sm text-text-secondary mt-1">{error}</p>
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
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white text-3xl active:scale-95 transition-transform z-40"
      >
        +
      </button>
    </div>
  );
}
