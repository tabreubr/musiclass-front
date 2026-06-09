"use client";

import { useRouter } from "next/navigation";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { developmentGoalsService } from "@/services/developmentGoalsService";
import { progressGoalsService } from "@/services/progressGoalsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ClassItem, ClassStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

function timeAgoLabel(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return `${diff}min atrás`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h atrás`;
  return `${Math.round(diff / (60 * 24))}d atrás`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dayLabel(dateStr: string, t: (k: any) => string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return t("dash_today");
  if (diff === 1) return t("dash_tomorrow");
  return t("dash_in_days").replace("{n}", String(diff + 1));
}

function getStatus(passed: boolean | null): ClassStatus {
  if (passed === true) return "passed";
  if (passed === false) return "failed";
  return "pending";
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { data: classes } = useFetch(() => classesService.findAll());
  const { data: students } = useFetch(() => studentsService.findAll());
  const { data: devGoals } = useFetch(() => developmentGoalsService.findAll());
  const { data: progGoals } = useFetch(() => progressGoalsService.findAll());

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
    .slice(0, 2);

  const completedGoals =
    (devGoals ?? []).filter((g) => g.completed).length +
    (progGoals ?? []).filter((g) => g.completed).length;

  const firstName = user?.name?.split(" ")[0] ?? "—";

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header com gradiente estendido */}
      <div
        style={{
          background: "linear-gradient(160deg, #1A0F3C 0%, #120A2E 55%, #0A0D1A 100%)",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "44px",
          paddingBottom: "16px",
        }}
      >
        {/* Saudação */}
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <div>
            <p style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 600 }}>
              {t("dash_greeting")} 👋
            </p>
            <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, marginTop: "2px", letterSpacing: "-0.5px" }}>
              {firstName}
            </h1>
          </div>
          <button
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#A78BFA" />
            </svg>
          </button>
        </div>

        {/* Card próxima aula */}
        {nextClass ? (
          <button
            onClick={() => router.push(`/classes/${nextClass.id}`)}
            className="w-full text-left active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 45%, #9333EA 80%, #A855F7 100%)",
              boxShadow: "0 12px 40px rgba(109,40,217,0.45)",
              borderRadius: "20px",
              padding: "16px 18px",
            }}
          >
            <p style={{ color: "rgba(221,214,254,0.8)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              {t("dash_next_class")} · {dayLabel(nextClass.date, t)}
            </p>
            <p style={{ color: "#ffffff", fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>
              {nextClass.student?.name ?? "—"}
            </p>
            <p style={{ color: "rgba(221,214,254,0.7)", fontSize: "13px" }}>
              {new Date(nextClass.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              {nextClass.student?.instrument?.name ? ` · ${nextClass.student.instrument.name}` : ""}
            </p>
            <div className="flex items-center justify-between" style={{ marginTop: "14px" }}>
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
                ))}
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div
            className="w-full text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "20px" }}
          >
            <p style={{ color: "#64748B", fontSize: "14px" }}>{t("dash_no_upcoming")}</p>
            <p style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>{t("dash_no_upcoming_hint")}</p>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "16px",
          paddingBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Stats */}
        <div>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            {t("dash_quick_stats")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={students?.length ?? 0} label={t("dash_students")} color="#A78BFA" icon="👥" accent="rgba(124,58,237,0.15)" />
            <StatCard value={classesThisMonth} label={t("dash_this_month")} color="#34D399" icon="📅" accent="rgba(52,211,153,0.12)" />
            <StatCard value={completedGoals} label={t("dash_goals_done")} color="#FBBF24" icon="🎯" accent="rgba(251,191,36,0.12)" />
          </div>
        </div>

        {/* Atividade Recente */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
            <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t("dash_recent_activity")}
            </p>
            <button
              onClick={() => router.push("/classes")}
              style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 700 }}
            >
              {t("dash_view_all")}
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div
              className="text-center"
              style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}
            >
              <p style={{ color: "#64748B", fontSize: "14px" }}>{t("dash_empty_activity")}</p>
              <p style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>{t("dash_empty_activity_hint")}</p>
            </div>
          ) : (
            <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
              {recentActivity.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => router.push(`/classes/${c.id}`)}
                  className="flex items-center w-full text-left hover:bg-white/5 active:bg-white/10 transition-colors"
                  style={{
                    gap: "12px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "11px",
                    paddingBottom: "11px",
                    ...(i < recentActivity.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}),
                  }}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
                  >
                    <span style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>
                      {c.student?.name?.[0] ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 600 }}>{c.student?.name ?? "—"}</p>
                    <p style={{ color: "#475569", fontSize: "12px" }}>
                      {c.lessons?.length > 0 ? `${c.lessons.length} lição(ões)` : "Sem lições"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge status={getStatus(c.passed)} />
                    <p style={{ color: "#475569", fontSize: "10px" }}>{timeAgoLabel(c.date)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Atalhos Rápidos */}
        <div>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            Atalhos
          </p>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              icon="+"
              label="Nova Aula"
              onClick={() => router.push("/classes/new")}
              gradient="linear-gradient(135deg, #7C3AED, #A855F7)"
            />
            <QuickAction
              icon="👤"
              label="Novo Aluno"
              onClick={() => router.push("/students/new")}
              gradient="linear-gradient(135deg, #0369A1, #0EA5E9)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon, accent }: {
  value: number; label: string; color: string; icon: string; accent: string;
}) {
  return (
    <div
      className="flex flex-col"
      style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "12px", gap: "6px" }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: "30px", height: "30px", borderRadius: "9px", background: accent, fontSize: "15px" }}
      >
        {icon}
      </div>
      <p style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</p>
      <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 500, lineHeight: "1.3" }}>{label}</p>
    </div>
  );
}

function QuickAction({ icon, label, onClick, gradient }: {
  icon: string; label: string; onClick: () => void; gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center active:scale-[0.97] transition-transform text-left w-full"
      style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "13px 14px", gap: "12px" }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 font-bold text-white"
        style={{ width: "36px", height: "36px", borderRadius: "10px", background: gradient, fontSize: "18px" }}
      >
        {icon}
      </div>
      <span style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 600 }}>{label}</span>
    </button>
  );
}
