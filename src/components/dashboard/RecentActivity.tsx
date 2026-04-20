"use client";

import { ClassStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations";

interface ActivityItem {
  id: number;
  studentName: string;
  instrument: string;
  action: string;
  status: ClassStatus;
  timeAgo: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

const statusConfig: Record<ClassStatus, { labelKey: TranslationKey; className: string }> = {
  passed:  { labelKey: "badge_passed",  className: "text-green-600" },
  pending: { labelKey: "badge_pending", className: "text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full" },
  failed:  { labelKey: "badge_failed",  className: "text-red-500 bg-red-50 px-2 py-0.5 rounded-full" },
};

export function RecentActivity({ items }: RecentActivityProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-text-primary">{t("dash_recent_activity")}</p>
        <button className="text-xs text-primary font-medium">{t("dash_view_all")}</button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-text-secondary">
          <p className="text-sm font-medium">{t("dash_empty_activity")}</p>
          <p className="text-xs mt-1">{t("dash_empty_activity_hint")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const badge = statusConfig[item.status];
            return (
              <div key={item.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-secondary rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{item.studentName}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.action}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-semibold ${badge.className}`}>{t(badge.labelKey)}</span>
                  <span className="text-[11px] text-text-secondary">{item.timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
