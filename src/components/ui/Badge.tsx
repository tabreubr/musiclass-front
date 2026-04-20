"use client";

import { ClassStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations";

interface BadgeProps {
  status: ClassStatus;
}

const config: Record<ClassStatus, { labelKey: TranslationKey; className: string }> = {
  passed: {
    labelKey: "badge_passed",
    className: "text-[#22C55E] bg-[#F0FDF4]",
  },
  pending: {
    labelKey: "badge_pending",
    className: "text-[#F59E0B] bg-[#FEF3C7]",
  },
  failed: {
    labelKey: "badge_failed",
    className: "text-[#EF4444] bg-[#FEF2F2]",
  },
};

export function Badge({ status }: BadgeProps) {
  const { t } = useLanguage();
  const { labelKey, className } = config[status];

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${className}`}>
      {t(labelKey)}
    </span>
  );
}
