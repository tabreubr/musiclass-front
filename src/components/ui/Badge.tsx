import React from "react";
import { ClassStatus } from "@/types";

interface BadgeProps {
  status: ClassStatus;
}

const config: Record<ClassStatus, { label: string; className: string }> = {
  passed: {
    label: "Passed",
    className: "bg-green-100 text-status-passed border border-green-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-status-pending border border-amber-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-status-failed border border-red-200",
  },
};

export function Badge({ status }: BadgeProps) {
  const { label, className } = config[status];

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${className}`}
    >
      {label}
    </span>
  );
}
