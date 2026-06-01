import api from "@/lib/api";
import { ClassItem, DevelopmentGoal, ProgressGoal } from "@/types";

export interface StudentGoalsResponse {
  developmentGoals: DevelopmentGoal[];
  progressGoals: ProgressGoal[];
}

export const studentAreaService = {
  // Retorna todas as aulas do aluno autenticado
  getMyClasses: async (): Promise<ClassItem[]> => {
    const response = await api.get<ClassItem[]>("/student/classes");
    return response.data;
  },

  // Retorna o detalhe de uma aula específica (endpoint compartilhado com instrutor)
  getClassById: async (id: number): Promise<ClassItem> => {
    const response = await api.get<ClassItem>(`/classes/${id}`);
    return response.data;
  },

  // Retorna todas as metas (desenvolvimento + progresso) do aluno autenticado
  getMyGoals: async (): Promise<StudentGoalsResponse> => {
    const response = await api.get<StudentGoalsResponse>("/student/goals");
    return response.data;
  },
};
