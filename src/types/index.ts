export interface Instrument {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  instrument?: Instrument;
  instructor?: Instructor;
  classes?: ClassItem[];
}

export interface Instructor {
  id: number;
  name: string;
  email?: string;
}

export interface Method {
  id: number;
  name: string;
}

export interface Lesson {
  id: number;
  methodName: Method;
  page?: number;
  lessonNumber?: number;
  completed: boolean;
}

export interface ClassItem {
  id: number;
  date: string;
  observations?: string;
  passed: boolean | null;
  student: Student;
  lessons: Lesson[];
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
