"use client";

import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

function timeAgoLabel(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return `${diff}min ago`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / (60 * 24))}d ago`;
}

const MOCK_UNREAD = 3;

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: classes } = useFetch(() => classesService.findAll());
  const { data: students } = useFetch(() => studentsService.findAll());

  const now = new Date();

  const upcoming = (classes ?? [])
    .filter((c) => new Date(c.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextClass = upcoming[0] ?? null;

  const classesThisMonth = (classes ?? []).filter((c) => {
    const d = new Date(c.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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
        action: `${instrumentName} lesson ${c.passed === true ? "completed" : c.passed === false ? "completed" : "scheduled"}`,
        status: (c.passed === true ? "passed" : c.passed === false ? "failed" : "pending") as "passed" | "failed" | "pending",
        timeAgo: timeAgoLabel(c.date),
      };
    });

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{t("dash_greeting")}, {user?.name ?? "—"}! 👋</h2>
            <p className="text-sm text-text-secondary mt-0.5">{t("dash_subtitle")}</p>
          </div>
          <button className="relative w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#64748B" />
            </svg>
            {MOCK_UNREAD > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {MOCK_UNREAD}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-4" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Next Class */}
        {nextClass ? (
          <NextClassCard classItem={nextClass} />
        ) : (
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">{t("dash_next_class")}</p>
            <p className="text-sm font-semibold text-text-primary">{t("dash_no_upcoming")}</p>
            <p className="text-xs text-text-secondary mt-0.5">{t("dash_no_upcoming_hint")}</p>
          </div>
        )}

        {/* Quick Stats */}
        <QuickStats
          students={students?.length ?? 0}
          classesThisMonth={classesThisMonth}
          goalsDone={0}
        />

        {/* Recent Activity */}
        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}
