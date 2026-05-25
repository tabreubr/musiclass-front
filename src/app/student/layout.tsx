"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

function StudentBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/student",
      label: "Início",
      exact: true,
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
      href: "/student/classes",
      label: "Aulas",
      exact: false,
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
      href: "/student/goals",
      label: "Metas",
      exact: false,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={active ? "#A78BFA" : "#475569"} strokeWidth="2" fill={active ? "rgba(167,139,250,0.15)" : "none"} />
          <circle cx="12" cy="12" r="4" stroke={active ? "#A78BFA" : "#475569"} strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill={active ? "#A78BFA" : "#475569"} />
        </svg>
      ),
    },
    {
      href: "/student/profile",
      label: "Perfil",
      exact: false,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={active ? "#A78BFA" : "#475569"} strokeWidth="2" fill={active ? "rgba(167,139,250,0.15)" : "none"} />
          <path d="M4 20C4 17 7.582 15 12 15C16.418 15 20 17 20 20" stroke={active ? "#A78BFA" : "#475569"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{ background: "#141728", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <ul className="flex justify-around items-center" style={{ height: "64px", paddingLeft: "8px", paddingRight: "8px" }}>
        {items.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center justify-center transition-all"
                style={{ gap: "4px", padding: "6px 12px" }}
              >
                {icon(active)}
                <span style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: active ? "#A78BFA" : "#475569",
                  transition: "color 0.2s",
                }}>
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

function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "STUDENT")) {
      router.replace("/login");
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100dvh", background: "#0A0D1A" }}>
        <span style={{ fontSize: "36px" }} className="animate-spin">⏳</span>
      </div>
    );
  }

  return <>{children}</>;
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <StudentAuthGuard>
        <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>
          <main style={{ minHeight: "100dvh", paddingBottom: "88px" }}>{children}</main>
          <StudentBottomNav />
        </div>
      </StudentAuthGuard>
    </LanguageProvider>
  );
}
