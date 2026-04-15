"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentCard } from "@/components/students/StudentCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { Student } from "@/types";

// Mock data — será substituído pela API do Spring Boot na Fase 2
interface StudentWithMeta extends Student {
  progress: number;
  nextClass?: string;
}

const mockStudents: StudentWithMeta[] = [
  { id: 1, name: "Sarah Johnson",  instrument: "Guitar", level: "Intermediate", progress: 75, nextClass: "Today, 2:30 PM" },
  { id: 2, name: "Emma Wilson",    instrument: "Piano",  level: "Beginner",     progress: 90, nextClass: "Today, 4:00 PM" },
  { id: 3, name: "James Chen",     instrument: "Vocals", level: "Intermediate", progress: 60, nextClass: "Tomorrow, 3:00 PM" },
  { id: 4, name: "Alex Martinez",  instrument: "Drums",  level: "Advanced",     progress: 85, nextClass: "Apr 16, 5:00 PM" },
  { id: 5, name: "Olivia Brown",   instrument: "Violin", level: "Beginner",     progress: 40, nextClass: "Apr 17, 1:00 PM" },
  { id: 6, name: "Lucas Pereira",  instrument: "Guitar", level: "Beginner",     progress: 30, nextClass: "Apr 18, 10:00 AM" },
];

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter((s) =>
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
        <p className="text-sm text-text-secondary font-medium">
          {filtered.length} active student{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3">🎓</span>
            <p className="font-medium">No students found</p>
          </div>
        ) : (
          filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              progress={student.progress}
              nextClass={student.nextClass}
              onClick={() => router.push(`/students/${student.id}`)}
            />
          ))
        )}
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
