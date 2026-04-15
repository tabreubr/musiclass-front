import api from "@/lib/api";
import { Student } from "@/types";

export const studentsService = {
  findAll: async (): Promise<Student[]> => {
    const response = await api.get("/students");
    return response.data;
  },

  findById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  save: async (data: Partial<Student>): Promise<Student> => {
    const response = await api.post("/students", data);
    return response.data;
  },

  updateById: async (id: number, data: Partial<Student>): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
