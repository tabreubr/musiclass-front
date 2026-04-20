import api from "@/lib/api";
import { ProgressGoal } from "@/types";

export const progressGoalsService = {
  findAll: async (): Promise<ProgressGoal[]> => {
    const response = await api.get("/progress-goals");
    return response.data;
  },

  save: async (data: Partial<ProgressGoal>): Promise<ProgressGoal> => {
    const response = await api.post("/progress-goals", data);
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/progress-goals/${id}`);
  },
};
