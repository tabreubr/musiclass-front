"use client";

import { OverallProgressCard } from "@/components/goals/OverallProgressCard";
import { DevelopmentGoalCard } from "@/components/goals/DevelopmentGoalCard";
import { DevelopmentGoal } from "@/types";

// Mock data — será substituído pela API do Spring Boot na Fase 2
interface GoalWithMeta extends DevelopmentGoal {
  studentsCount: number;
  iconKey: string;
}

const mockGoals: GoalWithMeta[] = [
  {
    id: 1,
    name: "Rhythm Accuracy",
    description: "Improve timing and rhythm consistency",
    progress: 75,
    studentsCount: 12,
    iconKey: "rhythm",
  },
  {
    id: 2,
    name: "Sight Reading",
    description: "Read music notation fluently",
    progress: 60,
    studentsCount: 8,
    iconKey: "reading",
  },
  {
    id: 3,
    name: "Music Theory",
    description: "Understand scales, chords and harmony",
    progress: 45,
    studentsCount: 6,
    iconKey: "theory",
  },
  {
    id: 4,
    name: "Technical Exercises",
    description: "Build finger dexterity and control",
    progress: 80,
    studentsCount: 10,
    iconKey: "technique",
  },
];

export default function GoalsPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header azul */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Goals & Progress</h1>
        <OverallProgressCard
          percentage={73}
          activeGoals={24}
          completed={18}
          inProgress={6}
        />
      </div>

      {/* Development Goals */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-primary">Development Goals</h2>
          <button className="text-sm font-semibold text-primary">Add Goal</button>
        </div>

        {mockGoals.map((goal) => (
          <DevelopmentGoalCard
            key={goal.id}
            goal={goal}
            studentsCount={goal.studentsCount}
            iconKey={goal.iconKey}
          />
        ))}
      </div>
    </div>
  );
}
