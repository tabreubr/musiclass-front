"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationCard } from "@/components/profile/NotificationCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const initialNotifications = [
  { id: 1, icon: "📅", iconBg: "bg-blue-50",    title: "Upcoming Class",    description: "Guitar lesson with Sarah Johnson starts in 30 minutes",           timeAgo: "30 min ago", unread: true  },
  { id: 2, icon: "🏆", iconBg: "bg-amber-50",   title: "Goal Achieved!",    description: "Alex Martinez completed the 'Drum Rudiments' goal",               timeAgo: "2 hours ago", unread: true  },
  { id: 3, icon: "✅", iconBg: "bg-green-50",   title: "Result Registered", description: "Emma Wilson's piano lesson result has been saved",                 timeAgo: "5 hours ago", unread: true  },
  { id: 4, icon: "🕐", iconBg: "bg-pink-50",    title: "Class Tomorrow",    description: "Don't forget: Violin lesson with Olivia Brown at 1:00 PM",         timeAgo: "1 day ago",   unread: false },
  { id: 5, icon: "🎵", iconBg: "bg-purple-50",  title: "Lesson Completed",  description: "James Chen passed his vocal lesson with great performance",         timeAgo: "2 days ago",  unread: false },
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
    <div className="bg-[#F8FAFC]">

      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-4 border-b border-border" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-text-primary">{t("profile_notifications")}</h1>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-primary font-medium">
                {t("profile_mark_read")}
              </button>
            )}
            <button onClick={() => router.push("/settings")} className="p-2 rounded-lg bg-surface-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#64748B" strokeWidth="2"/>
                <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91437 19.4149 3.70337 18.9058 3.70337 18.375C3.70337 17.8442 3.91437 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95231 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87231 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83437 6.74486 3.62337 6.23582 3.62337 5.705C3.62337 5.17418 3.83437 4.66514 4.21 4.29C4.58514 3.91437 5.09418 3.70337 5.625 3.70337C6.15582 3.70337 6.66486 3.91437 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95231 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87231 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83437 17.7642 3.62337 18.295 3.62337C18.8258 3.62337 19.3349 3.83437 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="#64748B" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <p className="text-xs text-text-secondary mt-2">
            {unreadCount} {unreadCount !== 1 ? t("profile_unread_notifications") : t("profile_unread_notification")}
          </p>
        )}
      </div>

      {/* Lista de notificações */}
      <div className="px-6 mt-4 flex flex-col gap-3" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
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
      </div>

      {/* Perfil do instrutor + Logout */}
      <div className="px-6 mt-4 mb-4 flex flex-col gap-3" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="bg-white rounded-2xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">🎵</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name ?? "—"}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email ?? "—"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-semibold active:scale-95 transition-transform"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
