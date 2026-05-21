import api from "@/lib/api";
import { ClassItem } from "@/types";

export const studentAreaService = {
  // Retorna as aulas do aluno autenticado
  getMyClasses: async (): Promise<ClassItem[]> => {
    const response = await api.get<ClassItem[]>("/student/classes");
    return response.data;
  },
};
