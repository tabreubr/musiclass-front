"use client";

import { useState } from "react";
import axios from "axios";
import { developmentGoalsService } from "@/services/developmentGoalsService";
import { progressGoalsService } from "@/services/progressGoalsService";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { DevelopmentGoal, ProgressGoal } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Tab = "development" | "progress";

function formatDeadline(dateStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
}

function daysLeftRaw(dateStr?: string): number | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#F1F5F9",
};

export default function GoalsPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("development");

  const { data: devGoals, refetch: refetchDev } = useFetch(() => developmentGoalsService.findAll());
  const { data: progGoals, refetch: refetchProg } = useFetch(() => progressGoalsService.findAll());
  const { data: students } = useFetch(() => studentsService.findAll());

  const [showDevForm, setShowDevForm] = useState(false);
  const [devDescription, setDevDescription] = useState("");
  const [devDeadline, setDevDeadline] = useState("");
  const [devStudentId, setDevStudentId] = useState("");
  const [savingDev, setSavingDev] = useState(false);

  const [showProgForm, setShowProgForm] = useState(false);
  const [progMethodName, setProgMethodName] = useState("");
  const [progTarget, setProgTarget] = useState("");
  const [progDeadline, setProgDeadline] = useState("");
  const [progStudentId, setProgStudentId] = useState("");
  const [savingProg, setSavingProg] = useState(false);

  const [confirm, setConfirm] = useState<{ type: "dev" | "prog"; id: number } | null>(null);

  const totalGoals = (devGoals?.length ?? 0) + (progGoals?.length ?? 0);

  async function handleAddDev() {
    if (!devDescription.trim() || !devStudentId) return;
    setSavingDev(true);
    try {
      await developmentGoalsService.save({
        description: devDescription.trim(),
        deadline: devDeadline || undefined,
        student: { id: Number(devStudentId) },
        completed: false,
      } as never);
      setDevDescription(""); setDevDeadline(""); setDevStudentId("");
      setShowDevForm(false);
      refetchDev();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        const msg = Array.isArray(data)
          ? data.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join("\n")
          : JSON.stringify(data);
        alert("Erro do backend:\n" + msg);
      } else {
        alert(err instanceof Error ? err.message : "Error");
      }
    } finally { setSavingDev(false); }
  }

  async function handleAddProg() {
    if (!progMethodName.trim() || !progTarget || !progStudentId) return;
    setSavingProg(true);
    try {
      await progressGoalsService.save({
        targetLessonNumber: Number(progTarget),
        deadline: progDeadline || undefined,
        studentId: Number(progStudentId),
        methodName: progMethodName.trim(),
      } as never);
      setProgMethodName(""); setProgTarget(""); setProgDeadline(""); setProgStudentId("");
      setShowProgForm(false);
      refetchProg();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    } finally { setSavingProg(false); }
  }

  async function handleToggleDev(id: number) {
    const updated = await developmentGoalsService.toggleCompleted(id);
    refetchDev();
    return updated;
  }

  async function handleToggleProg(id: number) {
    const updated = await progressGoalsService.toggleCompleted(id);
    refetchProg();
    return updated;
  }

  async function handleConfirmDelete() {
    if (!confirm) return;
    if (confirm.type === "dev") {
      await developmentGoalsService.deleteById(confirm.id);
      refetchDev();
    } else {
      await progressGoalsService.deleteById(confirm.id);
      refetchProg();
    }
    setConfirm(null);
  }

  function daysLabel(dateStr?: string): string {
    const diff = daysLeftRaw(dateStr);
    if (diff === null) return t("goals_no_deadline");
    if (diff < 0) return t("goals_overdue");
    if (diff === 0) return t("goals_due_today");
    return `${diff} ${t("goals_days_left")}`;
  }

  function handleFab() {
    if (tab === "development") setShowDevForm((v) => !v);
    else setShowProgForm((v) => !v);
  }

  const fieldStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "12px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#F1F5F9",
    width: "100%",
    outline: "none",
  };

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "16px" }}>
        <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{t("goals_title")}</p>
        <div className="flex items-baseline" style={{ gap: "8px", marginBottom: "16px" }}>
          <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800 }}>{totalGoals}</h1>
          <span style={{ color: "#64748B", fontSize: "14px" }}>{t("goals_active_goals").toLowerCase()}</span>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "4px", gap: "4px" }}
        >
          {(["development", "progress"] as Tab[]).map((tTab) => (
            <button
              key={tTab}
              onClick={() => setTab(tTab)}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: "10px",
                borderRadius: "12px",
                fontSize: "14px",
                ...(tab === tTab
                  ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" }
                  : { color: "#64748B" })
              }}
            >
              {tTab === "development" ? t("goals_tab_dev") : t("goals_tab_prog")}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "16px", gap: "12px" }}>

        {tab === "development" && (
          <>
            {showDevForm && (
              <div className="flex flex-col" style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "16px", gap: "10px" }}>
                <p style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{t("goals_dev")}</p>
                <select value={devStudentId} onChange={(e) => setDevStudentId(e.target.value)} style={fieldStyle}>
                  <option value="" style={{ background: "#141728" }}>{t("goals_select_student")}</option>
                  {(students ?? []).map((s) => (
                    <option key={s.id} value={s.id} style={{ background: "#141728" }}>{s.name}</option>
                  ))}
                </select>
                <textarea value={devDescription} onChange={(e) => setDevDescription(e.target.value)}
                  placeholder={t("goals_description")} rows={2}
                  className="resize-none"
                  style={fieldStyle}
                />
                <input type="date" value={devDeadline} onChange={(e) => setDevDeadline(e.target.value)} style={{ ...fieldStyle, colorScheme: "dark" }} />
                <div className="flex" style={{ gap: "8px" }}>
                  <button onClick={() => setShowDevForm(false)}
                    className="flex-1 font-medium"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#64748B", borderRadius: "12px", padding: "11px", fontSize: "14px" }}
                  >
                    {t("goals_cancel")}
                  </button>
                  <button onClick={handleAddDev} disabled={savingDev || !devDescription.trim() || !devStudentId}
                    className="flex-1 font-semibold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "12px", padding: "11px", fontSize: "14px" }}
                  >
                    {savingDev ? t("goals_saving") : t("goals_save")}
                  </button>
                </div>
              </div>
            )}

            {(devGoals ?? []).length === 0 && !showDevForm
              ? <EmptyState label={t("goals_empty_dev")} />
              : (devGoals ?? []).map((goal: DevelopmentGoal) => (
                <GoalCard
                  key={goal.id}
                  icon="🎵"
                  accentColor="#7C3AED"
                  title={goal.description}
                  subtitle={goal.student?.name ?? "—"}
                  daysLabel={daysLabel(goal.deadline)}
                  deadline={formatDeadline(goal.deadline)}
                  completed={goal.completed}
                  onToggle={() => handleToggleDev(goal.id)}
                  onDelete={() => setConfirm({ type: "dev", id: goal.id })}
                />
              ))}
          </>
        )}

        {tab === "progress" && (
          <>
            {showProgForm && (
              <div className="flex flex-col" style={{ background: "#141728", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "16px", gap: "10px" }}>
                <p style={{ color: "#34D399", fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{t("goals_prog")}</p>
                <select value={progStudentId} onChange={(e) => setProgStudentId(e.target.value)} style={fieldStyle}>
                  <option value="" style={{ background: "#141728" }}>{t("goals_select_student")}</option>
                  {(students ?? []).map((s) => (
                    <option key={s.id} value={s.id} style={{ background: "#141728" }}>{s.name}</option>
                  ))}
                </select>
                <input value={progMethodName} onChange={(e) => setProgMethodName(e.target.value)}
                  placeholder={t("goals_method")} style={fieldStyle} />
                <input type="number" value={progTarget} onChange={(e) => setProgTarget(e.target.value)}
                  placeholder={t("goals_target_lesson")} style={fieldStyle} />
                <input type="date" value={progDeadline} onChange={(e) => setProgDeadline(e.target.value)}
                  style={{ ...fieldStyle, colorScheme: "dark" }} />
                <div className="flex" style={{ gap: "8px" }}>
                  <button onClick={() => setShowProgForm(false)}
                    className="flex-1 font-medium"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#64748B", borderRadius: "12px", padding: "11px", fontSize: "14px" }}
                  >
                    {t("goals_cancel")}
                  </button>
                  <button onClick={handleAddProg} disabled={savingProg || !progMethodName.trim() || !progTarget || !progStudentId}
                    className="flex-1 font-semibold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white", borderRadius: "12px", padding: "11px", fontSize: "14px" }}
                  >
                    {savingProg ? t("goals_saving") : t("goals_save")}
                  </button>
                </div>
              </div>
            )}

            {(progGoals ?? []).length === 0 && !showProgForm
              ? <EmptyState label={t("goals_empty_prog")} />
              : (progGoals ?? []).map((goal: ProgressGoal) => (
                <GoalCard
                  key={goal.id}
                  icon="📈"
                  accentColor="#34D399"
                  title={`${goal.method?.name ?? "—"} — ${t("goals_reach_lesson")} ${goal.targetLessonNumber}`}
                  subtitle={goal.student?.name ?? "—"}
                  daysLabel={daysLabel(goal.deadline)}
                  deadline={formatDeadline(goal.deadline)}
                  completed={goal.completed}
                  onToggle={() => handleToggleProg(goal.id)}
                  onDelete={() => setConfirm({ type: "prog", id: goal.id })}
                />
              ))}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={handleFab}
        className="fixed flex items-center justify-center text-white active:scale-95 transition-transform z-40"
        style={{
          bottom: "96px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          fontSize: "28px",
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
        }}
      >
        {(tab === "development" ? showDevForm : showProgForm) ? "×" : "+"}
      </button>

      <ConfirmDialog
        open={confirm !== null}
        title="Excluir meta"
        message="Tem certeza que deseja excluir esta meta? Essa ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function GoalCard({ icon, accentColor, title, subtitle, daysLabel, deadline, completed, onToggle, onDelete }: {
  icon: string; accentColor: string; title: string; subtitle: string;
  daysLabel: string; deadline: string; completed: boolean;
  onToggle: () => void; onDelete: () => void;
}) {
  const isOverdue = !completed && (daysLabel.includes("Overdue") || daysLabel.includes("Atrasada"));
  return (
    <div style={{
      background: completed ? "rgba(52,211,153,0.05)" : "#141728",
      border: completed ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: "18px",
      padding: "16px",
    }}>
      <div className="flex items-start" style={{ gap: "14px" }}>
        {/* Botão de toggle completo */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            width: "44px", height: "44px", borderRadius: "12px", fontSize: "20px",
            background: completed ? "rgba(52,211,153,0.15)" : `${accentColor}1A`,
            border: completed ? "1px solid rgba(52,211,153,0.3)" : `1px solid ${accentColor}33`,
          }}
        >
          {completed ? "✅" : icon}
        </button>
        <div className="flex-1 min-w-0">
          <p style={{ color: completed ? "#64748B" : "#F1F5F9", fontSize: "14px", fontWeight: 500, lineHeight: "1.4", textDecoration: completed ? "line-through" : "none" }}>
            {title}
          </p>
          <p style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>{subtitle}</p>
          {completed ? (
            <p style={{ color: "#34D399", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>Meta concluída ✓</p>
          ) : deadline ? (
            <div className="flex items-center" style={{ gap: "6px", marginTop: "8px" }}>
              <span style={{ color: "#64748B", fontSize: "12px" }}>{deadline}</span>
              <span style={{ color: isOverdue ? "#F87171" : "#F59E0B", fontSize: "12px", fontWeight: 600 }}>
                · {daysLabel}
              </span>
            </div>
          ) : null}
        </div>
        <button
          onClick={onDelete}
          className="transition-colors flex-shrink-0"
          style={{ color: "#64748B", fontSize: "22px", lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ paddingTop: "48px", paddingBottom: "48px", gap: "12px" }}>
      <span style={{ fontSize: "40px" }}>🎯</span>
      <p style={{ color: "#64748B", fontSize: "14px", fontWeight: 500 }}>{label}</p>
    </div>
  );
}
