interface Stat {
  icon: string;
  value: number;
  label: string;
}

interface QuickStatsProps {
  students: number;
  classesThisMonth: number;
  goalsDone: number;
}

export function QuickStats({ students, classesThisMonth, goalsDone }: QuickStatsProps) {
  const stats: Stat[] = [
    { icon: "👥", value: students, label: "Students" },
    { icon: "📅", value: classesThisMonth, label: "This Month" },
    { icon: "🎯", value: goalsDone, label: "Goals Done" },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-3">Quick Stats</h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1"
          >
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xl font-bold text-text-primary">{stat.value}</span>
            <span className="text-xs text-text-secondary text-center">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
