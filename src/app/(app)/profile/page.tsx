"use client";

import { NotificationCard } from "@/components/profile/NotificationCard";

// Mock data — será substituído pelo FCM + API na Fase 4
const mockNotifications = [
  {
    id: 1,
    icon: "📅",
    iconBg: "bg-blue-100",
    title: "Upcoming Class",
    description: "Guitar lesson with Sarah Johnson starts in 30 minutes",
    timeAgo: "30 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: "🏆",
    iconBg: "bg-amber-100",
    title: "Goal Achieved!",
    description: "Alex Martinez completed the 'Drum Rudiments' goal",
    timeAgo: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    icon: "✅",
    iconBg: "bg-green-100",
    title: "Result Registered",
    description: "Emma Wilson's piano lesson result has been saved",
    timeAgo: "5 hours ago",
    unread: true,
  },
  {
    id: 4,
    icon: "🕐",
    iconBg: "bg-pink-100",
    title: "Class Tomorrow",
    description: "Don't forget: Violin lesson with Olivia Brown at 1:00 PM",
    timeAgo: "1 day ago",
    unread: false,
  },
  {
    id: 5,
    icon: "🎵",
    iconBg: "bg-purple-100",
    title: "Lesson Completed",
    description: "James Chen passed his vocal lesson with great performance",
    timeAgo: "2 days ago",
    unread: false,
  },
];

const unreadCount = mockNotifications.filter((n) => n.unread).length;

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header azul */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-5 pt-12 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <button className="text-sm font-semibold text-white/80 hover:text-white transition-colors">
            Mark all read
          </button>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🔔
          </div>
          <div>
            <p className="text-text-secondary text-sm">You have</p>
            <p className="text-text-primary font-bold text-lg leading-tight">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de notificações */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        {mockNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            icon={notification.icon}
            iconBg={notification.iconBg}
            title={notification.title}
            description={notification.description}
            timeAgo={notification.timeAgo}
            unread={notification.unread}
          />
        ))}
      </div>
    </div>
  );
}
