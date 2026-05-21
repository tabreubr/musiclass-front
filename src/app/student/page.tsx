"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
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
      className="w-full text-left rounded-2xl p-4 active:scale-[0.98] transition-transform"
      style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-text-primary">{formatDate(c.date)}</p>
        <div className="flex items-center gap-2">
          <Badge status={getStatus(c.passed)} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {c.instructor && (
        <p className="text-xs text-text-secondary">Instrutor: {c.instructor.name}</p>
      )}
      {c.observations && (
        <p className="text-xs text-text-secondary mt-1 italic line-clamp-2">{c.observations}</p>
      )}
      {c.lessons.length > 0 && (
        <p className="text-xs text-primary-light mt-2 font-medium">
          {c.lessons.filter((l) => l.completed).length}/{c.lessons.length} lições concluídas
        </p>
      )}
    </button>
  );
}

export default function StudentPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const { data: classes, loading: loadingClasses } = useFetch(
    () => studentAreaService.getMyClasses()
  );

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center" style={{ background: "#0A0D1A", minHeight: "100dvh" }}>
        <span className="text-4xl animate-spin">⏳</span>
      </div>
    );
  }

  const now = new Date();
  const upcoming = (classes ?? []).filter((c) => new Date(c.date) >= now);
  const past = (classes ?? []).filter((c) => new Date(c.date) < now);
  const passedCount = (classes ?? []).filter((c) => c.passed === true).length;

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh", paddingBottom: "40px" }}>

      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "56px", paddingBottom: "24px" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-light text-sm font-medium">Bem-vindo de volta 👋</p>
            <h1 className="text-2xl font-bold text-text-primary mt-0.5">{user.name}</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-light transition-all"
            style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}
          >
            Sair
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: classes?.length ?? 0, label: "Total" },
            { value: upcoming.length, label: "Próximas" },
            { value: passedCount, label: "Aprovadas" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-primary-light text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", marginTop: "24px", gap: "24px" }}>

        {/* Próximas aulas */}
        <section>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Próximas Aulas</p>
          {loadingClasses ? (
            <div className="flex items-center justify-center py-8 text-text-secondary">
              <span className="text-3xl animate-spin">⏳</span>
            </div>
          ) : upcoming.length === 0 ? (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-text-secondary text-sm">Nenhuma aula agendada</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((c) => (
                <ClassCard key={c.id} c={c} onClick={() => router.push(`/student/classes/${c.id}`)} />
              ))}
            </div>
          )}
        </section>

        {/* Histórico */}
        {past.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Histórico</p>
            <div className="flex flex-col gap-3">
              {past.map((c) => (
                <div key={c.id} className="opacity-75">
                  <ClassCard c={c} onClick={() => router.push(`/student/classes/${c.id}`)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
