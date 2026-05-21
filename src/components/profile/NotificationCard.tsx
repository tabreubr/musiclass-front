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
    <button
      onClick={onClick}
      className="w-full text-left flex items-start active:scale-[0.99] transition-transform"
      style={{
        background: unread ? "rgba(124,58,237,0.06)" : "#141728",
        border: unread ? "1px solid rgba(124,58,237,0.2)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "13px 14px",
        gap: "12px",
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: "36px", height: "36px", borderRadius: "10px", fontSize: "17px", background: "rgba(124,58,237,0.15)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start" style={{ gap: "8px" }}>
          <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: unread ? 600 : 500, lineHeight: "1.3" }}>
            {title}
          </p>
          {unread && <span className="flex-shrink-0" style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#A78BFA", marginTop: "3px" }} />}
        </div>
        <p style={{ color: "#64748B", fontSize: "12px", marginTop: "3px", lineHeight: "1.4" }}>{description}</p>
        <p style={{ color: "#475569", fontSize: "11px", marginTop: "3px" }}>{timeAgo}</p>
      </div>
    </button>
  );
}
