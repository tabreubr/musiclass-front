import api from "@/lib/api";
import { DevelopmentGoal } from "@/types";

export const developmentGoalsService = {
  findAll: async (): Promise<DevelopmentGoal[]> => {
    const response = await api.get("/development-goals");
    return response.data;
  },

  save: async (data: Partial<DevelopmentGoal>): Promise<DevelopmentGoal> => {
    const response = await api.post("/development-goals", data);
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/development-goals/${id}`);
  },
};
