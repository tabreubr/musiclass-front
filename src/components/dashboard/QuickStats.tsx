"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface QuickStatsProps {
  students: number;
  classesThisMonth: number;
  goalsDone: number;
}

export function QuickStats({ students, classesThisMonth, goalsDone }: QuickStatsProps) {
  const { t } = useLanguage();

  const stats = [
    { value: students,         label: t("dash_students"),    color: "text-primary" },
    { value: classesThisMonth, label: t("dash_this_month"),  color: "text-green-600" },
    { value: goalsDone,        label: t("dash_goals_done"),  color: "text-amber-500" },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-text-primary mb-3">{t("dash_quick_stats")}</p>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-3 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-text-secondary mt-1 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
