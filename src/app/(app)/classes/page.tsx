"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClassCard } from "@/components/classes/ClassCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { ClassItem } from "@/types";

type Filter = "all" | "today" | "upcoming" | "past";

const filterOptions: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

// Mock data — será substituído pela API do Spring Boot na Fase 2
const mockClasses: ClassItem[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    passed: null,
    observations: "",
    student: { id: 1, name: "Sarah Johnson", instrument: "Guitar", level: "Intermediate" },
    lesson: { id: 1, name: "Suzuki Book 2 - Lesson 5" },
    instructor: { id: 1, name: "Michael Anderson", email: "" },
  },
  {
    id: 2,
    date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    passed: null,
    observations: "",
    student: { id: 2, name: "Emma Wilson", instrument: "Piano", level: "Beginner" },
    lesson: { id: 2, name: "Scales Practice" },
    instructor: { id: 1, name: "Michael Anderson", email: "" },
  },
  {
    id: 3,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    observations: "Great progress!",
    student: { id: 3, name: "James Chen", instrument: "Vocals", level: "Intermediate" },
    lesson: { id: 3, name: "Breathing Techniques" },
    instructor: { id: 1, name: "Michael Anderson", email: "" },
  },
  {
    id: 4,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    observations: "",
    student: { id: 4, name: "Alex Martinez", instrument: "Drums", level: "Advanced" },
    lesson: { id: 4, name: "Rudiments" },
    instructor: { id: 1, name: "Michael Anderson", email: "" },
  },
  {
    id: 5,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    passed: false,
    observations: "Needs more practice",
    student: { id: 5, name: "Olivia Brown", instrument: "Violin", level: "Beginner" },
    lesson: { id: 5, name: "Bow Technique" },
    instructor: { id: 1, name: "Michael Anderson", email: "" },
  },
];

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = applyFilter(mockClasses, filter).filter((c) =>
    c.student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Classes</h1>
        <div className="flex flex-col gap-3">
          <SearchBar
            placeholder="Search classes..."
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
      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-4xl mb-3">🎵</span>
            <p className="font-medium">No classes found</p>
          </div>
        ) : (
          filtered.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onClick={() => router.push(`/classes/${classItem.id}`)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push("/classes/new")}
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white text-3xl active:scale-95 transition-transform z-40"
      >
        +
      </button>
    </div>
  );
}
