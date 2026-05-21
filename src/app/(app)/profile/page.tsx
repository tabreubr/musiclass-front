"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationCard } from "@/components/profile/NotificationCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const initialNotifications = [
  { id: 1, icon: "📅", iconBg: "", title: "Aula Próxima",     description: "Aula de violão com Carla Silva começa em 30 minutos",     timeAgo: "30 min atrás", unread: true  },
  { id: 2, icon: "🏆", iconBg: "", title: "Meta Concluída!",  description: "Pedro completou a meta 'Rudimentos de Bateria'",            timeAgo: "2h atrás",     unread: true  },
  { id: 3, icon: "✅", iconBg: "", title: "Resultado Salvo",  description: "Resultado da aula de piano de Ana foi registrado",         timeAgo: "5h atrás",     unread: true  },
  { id: 4, icon: "🕐", iconBg: "", title: "Aula Amanhã",      description: "Lembre-se: violino com Luisa às 13:00",                   timeAgo: "1 dia atrás",  unread: false },
  { id: 5, icon: "🎵", iconBg: "", title: "Lição Concluída",  description: "João foi aprovado na aula de canto com ótimo desempenho",  timeAgo: "2 dias atrás", unread: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markOneRead(id: number) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  }

  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)", paddingLeft: "24px", paddingRight: "24px", paddingTop: "44px", paddingBottom: "16px" }}>

        {/* Perfil do instrutor */}
        <div className="flex items-center" style={{ gap: "14px", marginBottom: "16px" }}>
          <div
            className="flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: "52px", height: "52px", borderRadius: "14px", fontSize: "20px", background: "linear-gradient(135deg, #7C3AED, #A855F7)", boxShadow: "0 6px 18px rgba(124,58,237,0.4)" }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: "#F1F5F9", fontSize: "17px", fontWeight: 700 }} className="truncate">{user?.name ?? "—"}</p>
            <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "2px" }} className="truncate">{user?.email ?? "—"}</p>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#A78BFA" strokeWidth="2"/>
              <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91437 19.4149 3.70337 18.9058 3.70337 18.375C3.70337 17.8442 3.91437 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95231 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87231 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83437 6.74486 3.62337 6.23582 3.62337 5.705C3.62337 5.17418 3.83437 4.66514 4.21 4.29C4.58514 3.91437 5.09418 3.70337 5.625 3.70337C6.15582 3.70337 6.66486 3.91437 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95231 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87231 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83437 17.7642 3.62337 18.295 3.62337C18.8258 3.62337 19.3349 3.83437 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="#A78BFA" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Notificações header */}
        <div className="flex justify-between items-center">
          <div>
            <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t("profile_notifications")}</p>
            {unreadCount > 0 && (
              <p style={{ color: "#A78BFA", fontSize: "12px", marginTop: "2px" }}>
                {unreadCount} {unreadCount !== 1 ? t("profile_unread_notifications") : t("profile_unread_notification")}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 600 }}>
              {t("profile_mark_read")}
            </button>
          )}
        </div>
      </div>

      {/* Lista de notificações */}
      <div className="flex flex-col" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "14px", paddingBottom: "8px", gap: "8px" }}>
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            icon={n.icon}
            iconBg={n.iconBg}
            title={n.title}
            description={n.description}
            timeAgo={n.timeAgo}
            unread={n.unread}
            onClick={() => markOneRead(n.id)}
          />
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full font-semibold active:scale-95 transition-transform"
          style={{ border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.05)", color: "#F87171", borderRadius: "16px", padding: "14px", fontSize: "14px", marginTop: "4px" }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
