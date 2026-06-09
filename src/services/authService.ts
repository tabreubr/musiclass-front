import api from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  role: "INSTRUCTOR" | "ADMIN" | "STUDENT";
  email: string;
  id: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  // Login do instrutor
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // Login do aluno — endpoint separado pois busca em tabela diferente
  async studentLogin(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/student/login", data);
    return response.data;
  },

  // Registro de novo instrutor — retorna JWT para auto-login
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
  },
};
