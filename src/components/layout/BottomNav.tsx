"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      href: "/dashboard",
      label: t("nav_home"),
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? "#DBEAFE" : "none"}
          />
        </svg>
      ),
    },
    {
      href: "/classes",
      label: t("nav_classes"),
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="3" y="4" width="18" height="18" rx="3"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            fill={active ? "#DBEAFE" : "none"}
          />
          <path
            d="M16 2V6M8 2V6M3 10H21"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      href: "/students",
      label: t("nav_students"),
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="8" r="4"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            fill={active ? "#DBEAFE" : "none"}
          />
          <path
            d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      href: "/goals",
      label: t("nav_goals"),
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="12" r="9"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            fill={active ? "#DBEAFE" : "none"}
          />
          <circle cx="12" cy="12" r="4" stroke={active ? "#2563EB" : "#94A3B8"} strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill={active ? "#2563EB" : "#94A3B8"} />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: t("nav_profile"),
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="8" r="4"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            fill={active ? "#DBEAFE" : "none"}
          />
          <path
            d="M4 20C4 17 7.582 15 12 15C16.418 15 20 17 20 20"
            stroke={active ? "#2563EB" : "#94A3B8"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white shadow-[0_-1px_20px_rgba(0,0,0,0.06)] z-50">
      <ul className="flex justify-around items-center h-[68px]">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 transition-colors"
              >
                {icon(active)}
                <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-slate-400"}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
