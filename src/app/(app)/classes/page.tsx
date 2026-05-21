"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClassCard } from "@/components/classes/ClassCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { ClassItem } from "@/types";
import { classesService } from "@/services/classesService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

type Filter = "all" | "today" | "upcoming" | "past";

function applyFilter(classes: ClassItem[], filter: Filter): ClassItem[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  switch (filter) {
    case "today":
      return classes.filter((c) => {
        const d = new Date(c.date);
        return d >= todayStart && d < todayEnd;
      });
    case "upcoming":
      return classes.filter((c) => new Date(c.date) > now);
    case "past":
      return classes.filter((c) => new Date(c.date) < now);
    default:
      return classes;
  }
}

export default function ClassesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { data: classes, loading, error } = useFetch(() => classesService.findAll());

  const filterOptions: { label: string; value: Filter }[] = [
    { label: t("classes_filter_all"), value: "all" },
    { label: t("classes_filter_today"), value: "today" },
    { label: t("classes_filter_upcoming"), value: "upcoming" },
    { label: t("classes_filter_past"), value: "past" },
  ];

  const filtered = applyFilter(classes ?? [], filter).filter((c) =>
    c.student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "56px", paddingBottom: "20px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
            {t("classes_title")}
          </p>
          {!loading && !error && (
            <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              {filtered.length} aulas
            </h1>
          )}
        </div>
        <div className="flex flex-col" style={{ gap: "12px" }}>
          <SearchBar
            placeholder={t("classes_search")}
            value={search}
            onChange={setSearch}
          />
          <FilterChips
            options={filterOptions}
            selected={filter}
            onChange={setFilter}
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "20px", gap: "12px" }}>
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3 animate-spin">⏳</span>
            <p className="font-medium">{t("classes_loading")}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="font-medium text-red-400">{t("classes_error")}</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3">🎵</span>
            <p className="font-medium">{t("classes_empty")}</p>
          </div>
        )}
        {!loading && !error && filtered.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onClick={() => router.push(`/classes/${classItem.id}`)}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push("/classes/new")}
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
