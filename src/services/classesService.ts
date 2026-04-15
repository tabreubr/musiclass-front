import api from "@/lib/api";
import { ClassItem } from "@/types";

export const classesService = {
  findAll: async (): Promise<ClassItem[]> => {
    const response = await api.get("/classes");
    return response.data;
  },

  findById: async (id: number): Promise<ClassItem> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  save: async (data: Partial<ClassItem>): Promise<ClassItem> => {
    const response = await api.post("/classes", data);
    return response.data;
  },

  updateById: async (id: number, data: Partial<ClassItem>): Promise<ClassItem> => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/classes/${id}`);
  },
};
