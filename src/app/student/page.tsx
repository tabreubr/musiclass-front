"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClassItem } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { studentAreaService } from "@/services/studentAreaService";
import { Badge } from "@/components/ui/Badge";
import { ClassStatus } from "@/types";

// Converte o campo passed (boolean | null) para o tipo ClassStatus do Badge
function getStatus(passed: boolean | null): ClassStatus {
  if (passed === true) return "passed";
  if (passed === false) return "failed";
  return "pending";
}

// Formata a data de forma legível
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

// Card de aula clicável — navega para o detalhe
function ClassCard({ c, onClick }: { c: ClassItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left w-full hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-800">{formatDate(c.date)}</p>
        <div className="flex items-center gap-2">
          <Badge status={getStatus(c.passed)} />
          <span className="text-gray-300 text-sm">›</span>
        </div>
      </div>
      {c.instructor && (
        <p className="text-xs text-gray-400">Instrutor: {c.instructor.name}</p>
      )}
      {c.observations && (
        <p className="text-xs text-gray-500 mt-1 italic">{c.observations}</p>
      )}
      {c.lessons.length > 0 && (
        <p className="text-xs text-primary mt-2 font-medium">
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

  // Redireciona para login se não autenticado ou não for aluno
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    );
  }

  // Separa aulas futuras de passadas
  const now = new Date();
  const upcoming = (classes ?? []).filter((c) => new Date(c.date) >= now);
  const past = (classes ?? []).filter((c) => new Date(c.date) < now);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-10">

      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-primary-dark px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-light text-sm">Bem-vindo de volta</p>
            <h1 className="text-2xl font-bold text-white">{user.name} 🎵</h1>
          </div>
          <button
            onClick={logout}
            className="text-primary-light text-sm hover:text-white transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{classes?.length ?? 0}</p>
            <p className="text-primary-light text-xs mt-1">Total</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{upcoming.length}</p>
            <p className="text-primary-light text-xs mt-1">Próximas</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {(classes ?? []).filter((c) => c.passed === true).length}
            </p>
            <p className="text-primary-light text-xs mt-1">Aprovadas</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 flex flex-col gap-6">

        {/* Próximas aulas */}
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Próximas Aulas</h2>
          {loadingClasses ? (
            <p className="text-sm text-gray-400">Carregando...</p>
          ) : upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-center border border-gray-100">
              <p className="text-gray-400 text-sm">Nenhuma aula agendada</p>
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
            <h2 className="text-base font-bold text-gray-800 mb-3">Histórico</h2>
            <div className="flex flex-col gap-3">
              {past.map((c) => (
                <div key={c.id} className="opacity-80">
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
