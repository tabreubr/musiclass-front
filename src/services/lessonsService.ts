import api from "@/lib/api";
import { Lesson } from "@/types";

export const lessonsService = {
  addToClass: async (
    classId: number,
    payload: { methodName: string; page?: number; lessonNumber?: number }
  ): Promise<Lesson> => {
    const response = await api.post(`/classes/${classId}/lessons`, payload);
    return response.data;
  },

  toggleCompleted: async (classId: number, lessonId: number, completed: boolean): Promise<Lesson> => {
    const response = await api.patch(`/classes/${classId}/lessons/${lessonId}`, { completed });
    return response.data;
  },

  deleteFromClass: async (classId: number, lessonId: number): Promise<void> => {
    await api.delete(`/classes/${classId}/lessons/${lessonId}`);
  },
};
