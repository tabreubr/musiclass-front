"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { studentAreaService } from "@/services/studentAreaService";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ paddingTop: "13px", paddingBottom: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <p style={{ color: "#64748B", fontSize: "13px" }}>{label}</p>
      <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 500 }}>{value}</p>
    </div>
  );
}

export default function StudentProfilePage() {
  const { user, logout } = useAuth();
  const { data: classes } = useFetch(() => studentAreaService.getMyClasses());

  const now = new Date();
  const past = (classes ?? []).filter((c) => new Date(c.date) < now);
  const passedCount = past.filter((c) => c.passed === true).length;
  const completedLessons = (classes ?? []).reduce((acc, c) => acc + c.lessons.filter((l) => l.completed).length, 0);

  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1A0F3C 0%, #120A2E 55%, #0A0D1A 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "44px",
        paddingBottom: "28px",
      }}>
        <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px" }}>
          Perfil
        </p>

        {/* Avatar + nome */}
        <div className="flex flex-col items-center" style={{ gap: "12px" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #7C3AED, #A855F7)",
              fontSize: "26px",
              fontWeight: 800,
              color: "white",
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
          >
            {initials}
          </div>
          <div className="text-center">
            <h1 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 800 }}>{user?.name ?? "—"}</h1>
            <p style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>{user?.email ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", gap: "14px" }}>

        {/* Estatísticas */}
        <div className="grid grid-cols-3" style={{ gap: "10px" }}>
          {[
            { value: classes?.length ?? 0, label: "Aulas", color: "#A78BFA", accent: "rgba(124,58,237,0.15)", icon: "📚" },
            { value: passedCount, label: "Aprovadas", color: "#34D399", accent: "rgba(52,211,153,0.12)", icon: "🏆" },
            { value: completedLessons, label: "Lições", color: "#FBBF24", accent: "rgba(251,191,36,0.12)", icon: "✅" },
          ].map(({ value, label, color, accent, icon }) => (
            <div key={label} className="flex flex-col" style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "12px", gap: "6px" }}>
              <div className="flex items-center justify-center" style={{ width: "30px", height: "30px", borderRadius: "9px", background: accent, fontSize: "14px" }}>{icon}</div>
              <p style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</p>
              <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Informações da conta */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "0 16px" }}>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "14px", paddingBottom: "4px" }}>
            Conta
          </p>
          <InfoRow label="Nome" value={user?.name ?? "—"} />
          <InfoRow label="E-mail" value={user?.email ?? "—"} />
          <div className="flex items-center justify-between" style={{ paddingTop: "13px", paddingBottom: "13px" }}>
            <p style={{ color: "#64748B", fontSize: "13px" }}>Tipo de conta</p>
            <span style={{
              color: "#A78BFA",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "8px",
            }}>
              Aluno
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "16px",
            padding: "15px",
            color: "#F87171",
            fontSize: "14px",
            fontWeight: 600,
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
