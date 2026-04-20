import api from "@/lib/api";
import { Instrument } from "@/types";

export const instrumentsService = {
  findAll: async (): Promise<Instrument[]> => {
    const response = await api.get("/instruments");
    return response.data;
  },

  save: async (name: string): Promise<Instrument> => {
    const response = await api.post("/instruments", { name });
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/instruments/${id}`);
  },
};
