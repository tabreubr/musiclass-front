"use client";

import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function timeAgoLabel(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return `${diff}min ago`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / (60 * 24))}d ago`;
}

export default function DashboardPage() {
  const { data: classes } = useFetch(() => classesService.findAll());
  const { data: students } = useFetch(() => studentsService.findAll());

  const now = new Date();

  // Próxima aula: primeira aula futura
  const upcoming = (classes ?? [])
    .filter((c) => new Date(c.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextClass = upcoming[0] ?? null;

  // Aulas no mês atual
  const classesThisMonth = (classes ?? []).filter((c) => {
    const d = new Date(c.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Atividade recente: últimas 5 aulas passadas
  const recentActivity = (classes ?? [])
    .filter((c) => new Date(c.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((c) => {
      const instrumentName = c.student?.instrument?.name ?? c.lessons?.[0]?.methodName?.name ?? "Music";
      return {
        id: c.id,
        studentName: c.student?.name ?? "—",
        instrument: instrumentName,
        action: `${instrumentName} lesson ${c.passed === true ? "passed" : c.passed === false ? "failed" : "completed"}`,
        status: (c.passed === true ? "passed" : c.passed === false ? "failed" : "pending") as "passed" | "failed" | "pending",
        timeAgo: timeAgoLabel(c.date),
      };
    });

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
          </button>
        </div>

        {nextClass ? (
          <NextClassCard classItem={nextClass} daysUntil={daysUntil(nextClass.date)} />
        ) : (
          <div className="bg-white/10 rounded-2xl px-4 py-4">
            <p className="text-white/80 text-sm text-center">No upcoming classes</p>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-6 p-5">
        <QuickStats
          students={students?.length ?? 0}
          classesThisMonth={classesThisMonth}
          goalsDone={0}
        />
        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}
