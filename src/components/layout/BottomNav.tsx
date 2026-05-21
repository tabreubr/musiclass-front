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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? "rgba(167,139,250,0.15)" : "none"}
          />
        </svg>
      ),
    },
    {
      href: "/classes",
      label: t("nav_classes"),
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect
            x="3" y="4" width="18" height="18" rx="3"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            fill={active ? "rgba(167,139,250,0.15)" : "none"}
          />
          <path
            d="M16 2V6M8 2V6M3 10H21"
            stroke={active ? "#A78BFA" : "#475569"}
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="8" r="4"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            fill={active ? "rgba(167,139,250,0.15)" : "none"}
          />
          <path
            d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20"
            stroke={active ? "#A78BFA" : "#475569"}
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="12" r="9"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            fill={active ? "rgba(167,139,250,0.15)" : "none"}
          />
          <circle cx="12" cy="12" r="4" stroke={active ? "#A78BFA" : "#475569"} strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill={active ? "#A78BFA" : "#475569"} />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: t("nav_profile"),
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="8" r="4"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            fill={active ? "rgba(167,139,250,0.15)" : "none"}
          />
          <path
            d="M4 20C4 17 7.582 15 12 15C16.418 15 20 17 20 20"
            stroke={active ? "#A78BFA" : "#475569"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        background: "#141728",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <ul className="flex justify-around items-center h-[64px] px-2">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 transition-all"
              >
                {icon(active)}
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    active ? "text-primary-light" : "text-[#475569]"
                  }`}
                >
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
