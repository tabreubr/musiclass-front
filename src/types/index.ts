export interface Student {
  id: number;
  name: string;
  instrument: string;
  level: string;
  progress?: number;
  nextClass?: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
}

export interface Lesson {
  id: number;
  name: string;
  description?: string;
}

export interface Method {
  id: number;
  name: string;
}

export interface ClassItem {
  id: number;
  date: string;
  observations?: string;
  passed: boolean | null;
  student: Student;
  lesson: Lesson;
  instructor: Instructor;
}

export interface DevelopmentGoal {
  id: number;
  name: string;
  description?: string;
  progress: number;
}

export interface ProgressGoal {
  id: number;
  name: string;
  progress: number;
  student: Student;
}

export type ClassStatus = "passed" | "pending" | "failed";

export type UserRole = "INSTRUCTOR" | "STUDENT";
