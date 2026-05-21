"use client";

import { ClassStatus } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/translations";

interface BadgeProps {
  status: ClassStatus;
}

const config: Record<ClassStatus, { labelKey: TranslationKey; style: React.CSSProperties }> = {
  passed: {
    labelKey: "badge_passed",
    style: { color: "#34D399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" },
  },
  pending: {
    labelKey: "badge_pending",
    style: { color: "#F59E0B", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" },
  },
  failed: {
    labelKey: "badge_failed",
    style: { color: "#F87171", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.2)" },
  },
};

export function Badge({ status }: BadgeProps) {
  const { t } = useLanguage();
  const { labelKey, style } = config[status];

  return (
    <span
      style={{
        ...style,
        fontSize: "12px",
        fontWeight: 600,
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "5px",
        paddingBottom: "5px",
        borderRadius: "8px",
        whiteSpace: "nowrap",
      }}
    >
      {t(labelKey)}
    </span>
  );
}
