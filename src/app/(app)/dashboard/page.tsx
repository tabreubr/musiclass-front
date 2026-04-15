"use client";

import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ClassItem } from "@/types";

// Mock data — será substituído pela API do Spring Boot na Fase 2
const mockNextClass: ClassItem = {
  id: 1,
  date: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  passed: null,
  observations: "",
  student: { id: 1, name: "Sarah Johnson", instrument: "Guitar", level: "Intermediate" },
  lesson: { id: 1, name: "Suzuki Book 2 - Lesson 5" },
  instructor: { id: 1, name: "Michael Anderson", email: "michael@musiclass.com" },
};

const mockActivity = [
  { id: 1, studentName: "Emma Wilson", instrument: "Piano", action: "Piano lesson completed", status: "passed" as const, timeAgo: "2h ago" },
  { id: 2, studentName: "James Chen", instrument: "Vocals", action: "Vocal lesson scheduled", status: "pending" as const, timeAgo: "5h ago" },
  { id: 3, studentName: "Olivia Brown", instrument: "Violin", action: "Violin lesson completed", status: "failed" as const, timeAgo: "1d ago" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col">

      {/* Header azul */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-5 pt-12 pb-8 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                Hello, Michael! 👋
              </h1>
              <p className="text-white/70 text-sm">Ready to teach today</p>
            </div>
          </div>

          <button className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                fill="white"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-failed rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>

        <NextClassCard classItem={mockNextClass} minutesUntil={30} />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-6 p-5">
        <QuickStats students={24} classesThisMonth={38} goalsDone={12} />
        <RecentActivity items={mockActivity} />
      </div>
    </div>
  );
}
