"use client";

interface NotificationCardProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  timeAgo: string;
  unread?: boolean;
  onClick?: () => void;
}

export function NotificationCard({
  icon,
  title,
  description,
  timeAgo,
  unread = false,
  onClick,
}: NotificationCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 flex items-start gap-3 cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="w-9 h-9 bg-surface-secondary rounded-lg flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={`text-sm text-text-primary leading-tight ${unread ? "font-semibold" : "font-medium"}`}>
            {title}
          </p>
          {unread && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
        </div>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{description}</p>
        <p className="text-xs text-text-secondary mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}
