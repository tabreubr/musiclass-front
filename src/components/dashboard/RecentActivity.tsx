import { Badge } from "@/components/ui/Badge";
import { ClassStatus } from "@/types";

interface ActivityItem {
  id: number;
  studentName: string;
  instrument: string;
  action: string;
  status: ClassStatus;
  timeAgo: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
        <button className="text-sm font-semibold text-primary">View All</button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-surface-secondary rounded-xl flex items-center justify-center text-lg flex-shrink-0">
              🎵
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">
                {item.studentName}
              </p>
              <p className="text-text-secondary text-xs">{item.action}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge status={item.status} />
              <span className="text-xs text-text-secondary">{item.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
