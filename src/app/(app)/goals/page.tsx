"use client";

import { useState } from "react";
import { developmentGoalsService } from "@/services/developmentGoalsService";
import { progressGoalsService } from "@/services/progressGoalsService";
import { studentsService } from "@/services/studentsService";
import { useFetch } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { DevelopmentGoal, ProgressGoal } from "@/types";

type Tab = "development" | "progress";

function formatDeadline(dateStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysLeftRaw(dateStr?: string): number | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

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

  const totalGoals = (devGoals?.length ?? 0) + (progGoals?.length ?? 0);
  const activeGoals = totalGoals;
  const overallProgress = totalGoals > 0 ? Math.round((activeGoals / totalGoals) * 100) : 0;

  async function handleAddDev() {
    if (!devDescription.trim() || !devStudentId) return;
    setSavingDev(true);
    try {
      await developmentGoalsService.save({
        description: devDescription.trim(),
        deadline: devDeadline || undefined,
        student: { id: Number(devStudentId) } as never,
      });
      setDevDescription(""); setDevDeadline(""); setDevStudentId("");
      setShowDevForm(false);
      refetchDev();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
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

  async function handleDeleteDev(id: number) { await developmentGoalsService.deleteById(id); refetchDev(); }
  async function handleDeleteProg(id: number) { await progressGoalsService.deleteById(id); refetchProg(); }

  function daysLabel(dateStr?: string): string {
    const diff = daysLeftRaw(dateStr);
    if (diff === null) return t("goals_no_deadline");
    if (diff < 0) return t("goals_overdue");
    if (diff === 0) return t("goals_due_today");
    return `${diff} ${t("goals_days_left")}`;
  }

  return (
    <div className="bg-[#F8FAFC]">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <h1 className="text-lg font-bold text-text-primary">{t("goals_title")}</h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm text-text-secondary">{t("goals_active_goals")}: <strong className="text-text-primary">{totalGoals}</strong></span>
          <span className="text-sm text-text-secondary">{t("goals_completed")}: <strong className="text-green-600">0</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 pt-4 pb-0 shadow-sm">
        <div className="flex gap-6 border-b border-[#E2E8F0]">
          {(["development", "progress"] as Tab[]).map((tTab) => (
            <button
              key={tTab}
              onClick={() => setTab(tTab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                tab === tTab ? "text-primary border-b-2 border-primary" : "text-text-secondary"
              }`}
            >
              {tTab === "development" ? t("goals_tab_dev") : t("goals_tab_prog")}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-3.5" style={{ paddingLeft: '24px', paddingRight: '24px' }}>

        {tab === "development" && (
          <>
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-text-primary text-[15px]">{t("goals_dev")}</p>
              <button
                onClick={() => setShowDevForm(true)}
                className="text-primary text-[13px] font-semibold"
              >
                {t("goals_add_goal")}
              </button>
            </div>

            {showDevForm && (
              <div className="bg-white rounded-2xl p-4 border border-border flex flex-col gap-3">
                <select value={devStudentId} onChange={(e) => setDevStudentId(e.target.value)}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5 bg-transparent">
                  <option value="">{t("goals_select_student")}</option>
                  {(students ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <textarea value={devDescription} onChange={(e) => setDevDescription(e.target.value)}
                  placeholder={t("goals_description")} rows={2}
                  className="w-full text-[13px] text-text-primary placeholder-text-secondary resize-none outline-none border border-slate-200 rounded-xl px-3 py-2.5" />
                <input type="date" value={devDeadline} onChange={(e) => setDevDeadline(e.target.value)}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5" />
                <div className="flex gap-2.5">
                  <button onClick={() => setShowDevForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-text-secondary text-[13px] font-medium">{t("goals_cancel")}</button>
                  <button onClick={handleAddDev} disabled={savingDev || !devDescription.trim() || !devStudentId}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold disabled:opacity-50">
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
                  icon="🎵" iconBg="bg-blue-50"
                  title={goal.description}
                  subtitle={goal.student?.name ?? "—"}
                  daysLabel={daysLabel(goal.deadline)}
                  deadline={formatDeadline(goal.deadline)}
                  onDelete={() => handleDeleteDev(goal.id)}
                />
              ))}
          </>
        )}

        {tab === "progress" && (
          <>
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-text-primary text-[15px]">{t("goals_prog")}</p>
              <button onClick={() => setShowProgForm(true)} className="text-primary text-[13px] font-semibold">{t("goals_add_goal")}</button>
            </div>

            {showProgForm && (
              <div className="bg-white rounded-2xl p-4 border border-border flex flex-col gap-3">
                <select value={progStudentId} onChange={(e) => setProgStudentId(e.target.value)}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5 bg-transparent">
                  <option value="">{t("goals_select_student")}</option>
                  {(students ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input value={progMethodName} onChange={(e) => setProgMethodName(e.target.value)}
                  placeholder={t("goals_method")}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5" />
                <input type="number" value={progTarget} onChange={(e) => setProgTarget(e.target.value)}
                  placeholder={t("goals_target_lesson")}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5" />
                <input type="date" value={progDeadline} onChange={(e) => setProgDeadline(e.target.value)}
                  className="w-full text-[13px] text-text-primary outline-none border border-slate-200 rounded-xl px-3 py-2.5" />
                <div className="flex gap-2.5">
                  <button onClick={() => setShowProgForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-text-secondary text-[13px] font-medium">{t("goals_cancel")}</button>
                  <button onClick={handleAddProg} disabled={savingProg || !progMethodName.trim() || !progTarget || !progStudentId}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold disabled:opacity-50">
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
                  icon="📈" iconBg="bg-green-50"
                  title={`${goal.method?.name ?? "—"} — ${t("goals_reach_lesson")} ${goal.targetLessonNumber}`}
                  subtitle={goal.student?.name ?? "—"}
                  daysLabel={daysLabel(goal.deadline)}
                  deadline={formatDeadline(goal.deadline)}
                  onDelete={() => handleDeleteProg(goal.id)}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

function GoalCard({ icon, iconBg, title, subtitle, daysLabel, deadline, onDelete }: {
  icon: string; iconBg: string; title: string; subtitle: string;
  daysLabel: string; deadline: string; onDelete: () => void;
}) {
  const isOverdue = daysLabel.includes("Overdue") || daysLabel.includes("Atrasada");
  return (
    <div className="bg-white rounded-2xl p-4 border border-border">
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#1E293B] text-sm leading-snug">{title}</p>
          <p className="text-[#64748B] text-xs mt-1">{subtitle}</p>
          {deadline && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[#64748B]">{deadline}</span>
              <span className={`text-xs font-medium ${isOverdue ? "text-[#EF4444]" : "text-[#F59E0B]"}`}>
                {daysLabel}
              </span>
            </div>
          )}
        </div>
        <button onClick={onDelete} className="text-[#94A3B8] hover:text-[#EF4444] transition-colors text-lg leading-none flex-shrink-0 mt-0.5">×</button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
      <span className="text-4xl mb-3">🎯</span>
      <p className="font-medium text-[14px]">{label}</p>
    </div>
  );
}
