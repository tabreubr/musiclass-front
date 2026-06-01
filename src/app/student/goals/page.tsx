"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { studentAreaService } from "@/services/studentAreaService";
import { DevelopmentGoal, ProgressGoal } from "@/types";

type Tab = "development" | "progress";

function formatDeadline(dateStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(dateStr?: string): number | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function daysLabel(dateStr?: string): string {
  const diff = daysLeft(dateStr);
  if (diff === null) return "Sem prazo";
  if (diff < 0) return "Atrasada";
  if (diff === 0) return "Vence hoje";
  return `${diff} dias restantes`;
}

function GoalCard({ icon, accentColor, title, subtitle, deadline, dateStr, completed }: {
  icon: string;
  accentColor: string;
  title: string;
  subtitle: string;
  deadline: string;
  dateStr?: string;
  completed: boolean;
}) {
  const diff = daysLeft(dateStr);
  const isOverdue = !completed && diff !== null && diff < 0;

  return (
    <div style={{
      background: completed ? "rgba(52,211,153,0.05)" : "#141728",
      border: completed ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: "18px",
      padding: "16px",
    }}>
      <div className="flex items-start" style={{ gap: "14px" }}>
        {/* Ícone */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            fontSize: "20px",
            background: completed ? "rgba(52,211,153,0.15)" : `${accentColor}1A`,
            border: completed ? "1px solid rgba(52,211,153,0.3)" : `1px solid ${accentColor}33`,
          }}
        >
          {completed ? "✅" : icon}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p style={{
            color: completed ? "#64748B" : "#F1F5F9",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "1.4",
            textDecoration: completed ? "line-through" : "none",
          }}>
            {title}
          </p>
          <p style={{ color: "#64748B", fontSize: "12px", marginTop: "3px" }}>{subtitle}</p>

          {completed ? (
            <p style={{ color: "#34D399", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
              Meta concluída ✓
            </p>
          ) : deadline ? (
            <div className="flex items-center" style={{ gap: "6px", marginTop: "7px" }}>
              <span style={{ color: "#64748B", fontSize: "12px" }}>{deadline}</span>
              <span style={{
                color: isOverdue ? "#F87171" : "#F59E0B",
                fontSize: "12px",
                fontWeight: 600,
              }}>
                · {daysLabel(dateStr)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ paddingTop: "48px", paddingBottom: "48px", gap: "12px" }}>
      <span style={{ fontSize: "40px" }}>🎯</span>
      <p style={{ color: "#64748B", fontSize: "14px", fontWeight: 500 }}>{label}</p>
    </div>
  );
}

export default function StudentGoalsPage() {
  const [tab, setTab] = useState<Tab>("development");
  const { data, loading } = useFetch(() => studentAreaService.getMyGoals());

  const devGoals: DevelopmentGoal[] = data?.developmentGoals ?? [];
  const progGoals: ProgressGoal[] = data?.progressGoals ?? [];
  const totalGoals = devGoals.length + progGoals.length;
  const completedGoals =
    devGoals.filter((g) => g.completed).length +
    progGoals.filter((g) => g.completed).length;

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
          Metas
        </p>
        <div className="flex items-baseline" style={{ gap: "8px", marginBottom: "4px" }}>
          <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800 }}>{loading ? "—" : totalGoals}</h1>
          <span style={{ color: "#64748B", fontSize: "14px" }}>metas no total</span>
        </div>
        {!loading && totalGoals > 0 && (
          <p style={{ color: "#34D399", fontSize: "12px", fontWeight: 600, marginBottom: "16px" }}>
            {completedGoals} concluída{completedGoals !== 1 ? "s" : ""}
          </p>
        )}
        {loading && <div style={{ marginBottom: "16px" }} />}

        {/* Tabs */}
        <div
          className="flex"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "4px",
            gap: "4px",
          }}
        >
          {(["development", "progress"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: "10px",
                borderRadius: "12px",
                fontSize: "14px",
                ...(tab === t
                  ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" }
                  : { color: "#64748B" })
              }}
            >
              {t === "development" ? "🎵 Desenvolvimento" : "📈 Progresso"}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "16px", gap: "12px" }}>

        {loading ? (
          <div className="flex items-center justify-center" style={{ paddingTop: "64px" }}>
            <span style={{ fontSize: "32px" }} className="animate-spin">⏳</span>
          </div>
        ) : tab === "development" ? (
          devGoals.length === 0
            ? <EmptyState label="Nenhuma meta de desenvolvimento ainda" />
            : devGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                icon="🎵"
                accentColor="#7C3AED"
                title={goal.description}
                subtitle={goal.student?.name ?? "—"}
                deadline={formatDeadline(goal.deadline)}
                dateStr={goal.deadline}
                completed={goal.completed}
              />
            ))
        ) : (
          progGoals.length === 0
            ? <EmptyState label="Nenhuma meta de progresso ainda" />
            : progGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                icon="📈"
                accentColor="#34D399"
                title={`${goal.method?.name ?? "—"} — Lição ${goal.targetLessonNumber}`}
                subtitle={goal.student?.name ?? "—"}
                deadline={formatDeadline(goal.deadline)}
                dateStr={goal.deadline}
                completed={goal.completed}
              />
            ))
        )}
      </div>
    </div>
  );
}
