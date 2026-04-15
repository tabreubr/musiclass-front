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
  iconBg,
  title,
  description,
  timeAgo,
  unread = false,
  onClick,
}: NotificationCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-card flex items-start gap-3 cursor-pointer active:scale-98 transition-transform"
    >
      {/* Ícone */}
      <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
        {icon}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className={`text-sm font-semibold text-text-primary ${unread ? "font-bold" : ""}`}>
            {title}
          </p>
          {unread && (
            <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">{description}</p>
        <p className="text-text-secondary text-xs mt-1.5">{timeAgo}</p>
      </div>
    </div>
  );
}
