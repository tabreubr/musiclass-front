import api from "@/lib/api";

export interface InviteRegisterRequest {
  email: string;
  password: string;
}

export interface InviteResponse {
  token: string;
  inviteLink: string;
  expiresAt: string;
}

export const inviteService = {
  // Registra o aluno usando o token do convite — rota pública
  register: async (token: string, data: InviteRegisterRequest): Promise<void> => {
    await api.post(`/invites/${token}/register`, data);
  },

  // Gera um link de convite para o aluno — rota protegida (instrutor autenticado)
  generate: async (studentId: number): Promise<InviteResponse> => {
    const response = await api.post<InviteResponse>(`/invites/student/${studentId}`);
    return response.data;
  },
};
