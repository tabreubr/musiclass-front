"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ClassItem } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { studentAreaService } from "@/services/studentAreaService";
import { Badge } from "@/components/ui/Badge";
import { ClassStatus } from "@/types";

function getStatus(passed: boolean | null): ClassStatus {
  if (passed === true) return "passed";
  if (passed === false) return "failed";
  return "pending";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ClassCard({ c, onClick }: { c: ClassItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left active:scale-[0.98] transition-transform"
      style={{
        background: "#141728",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "14px 16px",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
        <p style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 600 }}>{formatDate(c.date)}</p>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <Badge status={getStatus(c.passed)} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {c.instructor && (
        <p style={{ color: "#64748B", fontSize: "12px" }}>Instrutor: {c.instructor.name}</p>
      )}
      {c.lessons.length > 0 && (
        <p style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
          {c.lessons.filter((l) => l.completed).length}/{c.lessons.length} lições concluídas
        </p>
      )}
    </button>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: classes, loading } = useFetch(() => studentAreaService.getMyClasses());

  const now = new Date();
  const upcoming = (classes ?? [])
    .filter((c) => new Date(c.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = (classes ?? []).filter((c) => new Date(c.date) < now);
  const passedCount = past.filter((c) => c.passed === true).length;
  const nextClass = upcoming[0] ?? null;
  const firstName = user?.name?.split(" ")[0] ?? "—";

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1A0F3C 0%, #120A2E 55%, #0A0D1A 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "44px",
        paddingBottom: "16px",
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <div>
            <p style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 600 }}>Bem-vindo de volta 👋</p>
            <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, marginTop: "2px", letterSpacing: "-0.5px" }}>
              {firstName}
            </h1>
          </div>
        </div>

        {/* Próxima aula em destaque */}
        {loading ? null : nextClass ? (
          <button
            onClick={() => router.push(`/student/classes/${nextClass.id}`)}
            className="w-full text-left active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 45%, #9333EA 80%, #A855F7 100%)",
              boxShadow: "0 12px 40px rgba(109,40,217,0.45)",
              borderRadius: "20px",
              padding: "16px 18px",
            }}
          >
            <p style={{ color: "rgba(221,214,254,0.8)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              Próxima Aula
            </p>
            <p style={{ color: "#ffffff", fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>
              {nextClass.instructor?.name ?? "—"}
            </p>
            <p style={{ color: "rgba(221,214,254,0.7)", fontSize: "13px" }}>
              {new Date(nextClass.date).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
            <div className="flex items-center justify-between" style={{ marginTop: "14px" }}>
              <div className="flex" style={{ gap: "6px" }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
                ))}
              </div>
              <div className="flex items-center justify-center" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div className="text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "20px" }}>
            <p style={{ color: "#64748B", fontSize: "14px" }}>Nenhuma aula agendada</p>
            <p style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>Seu instrutor ainda não marcou novas aulas</p>
          </div>
        )}
      </div>

      {/* Stats + atividade recente */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", gap: "16px" }}>

        {/* Stats */}
        <div>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            Resumo
          </p>
          <div className="grid grid-cols-3" style={{ gap: "10px" }}>
            {[
              { value: classes?.length ?? 0, label: "Total", color: "#A78BFA", accent: "rgba(124,58,237,0.15)", icon: "📚" },
              { value: upcoming.length, label: "Próximas", color: "#34D399", accent: "rgba(52,211,153,0.12)", icon: "📅" },
              { value: passedCount, label: "Aprovadas", color: "#FBBF24", accent: "rgba(251,191,36,0.12)", icon: "🏆" },
            ].map(({ value, label, color, accent, icon }) => (
              <div key={label} className="flex flex-col" style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "12px", gap: "6px" }}>
                <div className="flex items-center justify-center" style={{ width: "30px", height: "30px", borderRadius: "9px", background: accent, fontSize: "14px" }}>{icon}</div>
                <p style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</p>
                <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade recente */}
        {past.length > 0 && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
              <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Últimas Aulas
              </p>
              <button onClick={() => router.push("/student/classes")} style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 700 }}>
                Ver todas
              </button>
            </div>
            <div className="flex flex-col" style={{ gap: "10px" }}>
              {past.slice(0, 2).map((c) => (
                <ClassCard key={c.id} c={c} onClick={() => router.push(`/student/classes/${c.id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
