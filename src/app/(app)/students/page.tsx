"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentCard } from "@/components/students/StudentCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: students, loading, error } = useFetch(() => studentsService.findAll());

  const filtered = (students ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.instrument.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <button className="w-9 h-9 bg-surface-secondary rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <SearchBar
          placeholder="Search students..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Contador + Lista */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        {!loading && !error && (
          <p className="text-sm text-text-secondary font-medium">
            {filtered.length} active student{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3 animate-spin">⏳</span>
            <p className="font-medium">Loading students...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-500">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="font-medium">Failed to load students</p>
            <p className="text-sm text-text-secondary mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3">🎓</span>
            <p className="font-medium">No students found</p>
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
