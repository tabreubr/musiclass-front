"use client";

import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { studentAreaService } from "@/services/studentAreaService";
import { ClassItem, ClassStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

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
      {c.observations && (
        <p style={{ color: "#64748B", fontSize: "12px", marginTop: "4px", fontStyle: "italic" }} className="line-clamp-1">
          {c.observations}
        </p>
      )}
      {c.lessons.length > 0 && (
        <p style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
          {c.lessons.filter((l) => l.completed).length}/{c.lessons.length} lições concluídas
        </p>
      )}
    </button>
  );
}

export default function StudentClassesPage() {
  const router = useRouter();
  const { data: classes, loading } = useFetch(() => studentAreaService.getMyClasses());

  const now = new Date();
  const upcoming = (classes ?? [])
    .filter((c) => new Date(c.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = (classes ?? [])
    .filter((c) => new Date(c.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "44px",
        paddingBottom: "16px",
      }}>
        <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
          Minhas Aulas
        </p>
        <div className="flex items-baseline" style={{ gap: "8px" }}>
          <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800 }}>
            {loading ? "—" : classes?.length ?? 0}
          </h1>
          <span style={{ color: "#64748B", fontSize: "14px" }}>aulas no total</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", gap: "24px" }}>

        {loading ? (
          <div className="flex items-center justify-center" style={{ paddingTop: "64px" }}>
            <span style={{ fontSize: "32px" }} className="animate-spin">⏳</span>
          </div>
        ) : classes?.length === 0 ? (
          <div className="flex flex-col items-center text-center" style={{ paddingTop: "64px", gap: "12px" }}>
            <span style={{ fontSize: "48px" }}>📅</span>
            <p style={{ color: "#64748B", fontSize: "14px", fontWeight: 500 }}>Nenhuma aula ainda</p>
            <p style={{ color: "#475569", fontSize: "12px" }}>Seu instrutor ainda não agendou aulas</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                  Próximas ({upcoming.length})
                </p>
                <div className="flex flex-col" style={{ gap: "10px" }}>
                  {upcoming.map((c) => (
                    <ClassCard key={c.id} c={c} onClick={() => router.push(`/student/classes/${c.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <p style={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                  Histórico ({past.length})
                </p>
                <div className="flex flex-col" style={{ gap: "10px" }}>
                  {past.map((c) => (
                    <div key={c.id} style={{ opacity: 0.75 }}>
                      <ClassCard c={c} onClick={() => router.push(`/student/classes/${c.id}`)} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
