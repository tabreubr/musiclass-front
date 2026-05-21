import api from "@/lib/api";
import { ClassItem } from "@/types";

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
};
