import api from "@/lib/api";

export interface InviteRegisterRequest {
  email: string;
  password: string;
}

export const inviteService = {
  // Registra o aluno usando o token do convite — rota pública
  register: async (token: string, data: InviteRegisterRequest): Promise<void> => {
    await api.post(`/invites/${token}/register`, data);
  },
};
