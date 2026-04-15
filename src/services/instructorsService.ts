import api from "@/lib/api";
import { Instructor } from "@/types";

export const instructorsService = {
  findAll: async (): Promise<Instructor[]> => {
    const response = await api.get("/instructors");
    return response.data;
  },
};
