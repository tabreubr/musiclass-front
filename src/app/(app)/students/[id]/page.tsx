"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { studentsService } from "@/services/studentsService";
import { inviteService, InviteResponse } from "@/services/inviteService";
import { Student, ClassItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const instrumentIcons: Record<string, string> = {
  Guitar: "🎸", Piano: "🎹", Vocals: "🎤",
  Drums: "🥁", Violin: "🎻", Trompa: "🎺", Tuba: "🎺",
};

function getStatus(passed: boolean | null) {
  if (passed === null) return "pending" as const;
  return passed ? "passed" as const : "failed" as const;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const id = Number(params.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    studentsService.findById(id)
      .then(setStudent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return t("date_today");
    if (date.toDateString() === yesterday.toDateString()) return t("date_yesterday");
    if (date.toDateString() === tomorrow.toDateString()) return t("date_tomorrow");
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-secondary gap-3">
        <span className="text-4xl animate-spin">⏳</span>
        <p className="font-medium">{t("students_loading_profile")}</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="font-medium text-red-400">{error ?? t("students_not_found")}</p>
        <button onClick={() => router.back()} className="text-primary-light text-sm mt-2">{t("students_go_back")}</button>
      </div>
    );
  }

  async function handleDeleteStudent() {
    try {
      await studentsService.deleteById(id);
      router.replace("/students");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir aluno");
    }
  }

  async function handleGenerateInvite() {
    setGeneratingInvite(true);
    try {
      const result = await inviteService.generate(id);
      setInvite(result);
    } catch {
      alert("Erro ao gerar convite");
    } finally {
      setGeneratingInvite(false);
    }
  }

  async function handleCopyLink() {
    if (!invite) return;
    await navigator.clipboard.writeText(invite.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const instrumentName = student.instrument?.name ?? "—";
  const emoji = instrumentIcons[instrumentName] ?? "🎵";
  const classes = (student.classes ?? []) as ClassItem[];

  const total = classes.length;
  const passed = classes.filter((c) => c.passed === true).length;
  const failed = classes.filter((c) => c.passed === false).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const initials = student.name?.[0]?.toUpperCase() ?? "?";

  const sorted = [...classes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "16px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
          <button onClick={() => router.back()} className="flex items-center gap-1.5" style={{ color: "#A78BFA", fontSize: "14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("nav_students")}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center"
            style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0667 20.6 17.8448 21.0712 17.4786 21.4142C17.1123 21.7572 16.6303 21.9481 16.13 21.95H7.87C7.36974 21.9481 6.88768 21.7572 6.52144 21.4142C6.1552 21.0712 5.93327 20.6 5.9 20.1L5 6H19Z" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center" style={{ gap: "14px" }}>
          <div
            className="flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: "52px", height: "52px", borderRadius: "14px", fontSize: "20px", background: "linear-gradient(135deg, #7C3AED, #A855F7)", boxShadow: "0 6px 18px rgba(124,58,237,0.4)" }}
          >
            {initials}
          </div>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: "20px", fontWeight: 700 }}>{student.name}</h1>
            <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "2px" }}>{emoji} {instrumentName}</p>
          </div>
        </div>

        {total > 0 && (
          <div className="flex items-center" style={{ gap: "10px", marginTop: "14px" }}>
            <div className="flex-1" style={{ height: "6px", borderRadius: "9999px", overflow: "hidden", background: "rgba(255,255,255,0.1)" }}>
              <div style={{ height: "100%", borderRadius: "9999px", width: `${passRate}%`, background: "#34D399" }} />
            </div>
            <span style={{ color: "#64748B", fontSize: "12px", fontWeight: 600 }}>{passRate}% aprovação</span>
          </div>
        )}
      </div>

      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "14px", paddingBottom: "8px", gap: "10px" }}>

        {/* Stats */}
        <div className="grid grid-cols-3" style={{ gap: "8px" }}>
          <StatCard value={total} label={t("students_total_classes")} color="#A78BFA" />
          <StatCard value={passed} label={t("students_passed")} color="#34D399" />
          <StatCard value={failed} label={t("students_failed")} color="#F87171" />
        </div>

        {/* Convite */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 16px" }}>
          <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            Convite de Acesso
          </p>
          {!invite ? (
            <button
              onClick={handleGenerateInvite}
              disabled={generatingInvite}
              className="w-full font-semibold disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "12px", padding: "13px", fontSize: "14px" }}
            >
              {generatingInvite ? "Gerando..." : "🔗 Gerar Link de Convite"}
            </button>
          ) : (
            <div className="flex flex-col" style={{ gap: "8px" }}>
              <p
                className="break-all"
                style={{ color: "#64748B", fontSize: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "8px 12px" }}
              >
                {invite.inviteLink}
              </p>
              <button
                onClick={handleCopyLink}
                className="w-full font-semibold transition-all"
                style={{
                  borderRadius: "12px", padding: "13px", fontSize: "14px",
                  ...(copied
                    ? { background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }
                    : { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" })
                }}
              >
                {copied ? "✓ Copiado!" : "Copiar Link"}
              </button>
              <p style={{ color: "#64748B", fontSize: "12px", textAlign: "center" }}>Expira em 7 dias</p>
            </div>
          )}
        </div>

        {/* Histórico */}
        <div style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px" }}>
            <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t("students_class_history")}
            </p>
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center" style={{ paddingTop: "28px", paddingBottom: "28px", gap: "8px" }}>
              <span style={{ fontSize: "28px" }}>🎵</span>
              <p style={{ color: "#64748B", fontSize: "14px" }}>{t("students_no_classes")}</p>
            </div>
          ) : (
            <div>
              {sorted.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => router.push(`/classes/${c.id}`)}
                  className="flex items-center w-full text-left hover:bg-white/5 active:bg-white/10 transition-colors"
                  style={{
                    gap: "12px", padding: "12px 16px",
                    ...(i < sorted.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {})
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#F1F5F9", fontSize: "14px", fontWeight: 500 }}>
                      {c.lessons && c.lessons.length > 0
                        ? c.lessons.map((l) => l.methodName?.name ?? "—").join(", ")
                        : t("students_no_lessons")}
                    </p>
                    <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>{formatDate(c.date)}</p>
                  </div>
                  <Badge status={getStatus(c.passed)} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir aluno"
        message="Tem certeza que deseja excluir este aluno? Todo o histórico de aulas será mantido, mas o aluno não poderá mais ser acessado."
        onConfirm={handleDeleteStudent}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div
      className="flex flex-col text-center"
      style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "14px 8px", gap: "6px" }}
    >
      <p style={{ fontSize: "26px", fontWeight: 800, color }}>{value}</p>
      <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 500, lineHeight: "1.3" }}>{label}</p>
    </div>
  );
}
