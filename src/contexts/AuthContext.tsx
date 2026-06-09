"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService, LoginRequest, LoginResponse, RegisterRequest } from "@/services/authService";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "INSTRUCTOR" | "ADMIN" | "STUDENT";
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  studentLogin: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // começa true para checar localStorage

  // Na montagem: tenta recuperar sessão salva
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // localStorage pode falhar em SSR ou modo incógnito extremo
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função auxiliar para salvar sessão e atualizar estado
  const saveSession = useCallback((response: LoginResponse, redirectTo: string) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      })
    );
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    });
    router.push(redirectTo);
  }, [router]);

  // Login do instrutor — redireciona para o dashboard de instrutor
  const login = useCallback(async (data: LoginRequest) => {
    const response: LoginResponse = await authService.login(data);
    saveSession(response, "/dashboard");
  }, [saveSession]);

  // Login do aluno — redireciona para a área do aluno
  const studentLogin = useCallback(async (data: LoginRequest) => {
    const response: LoginResponse = await authService.studentLogin(data);
    saveSession(response, "/student");
  }, [saveSession]);

  // Registro de novo instrutor — auto-login após cadastro
  const register = useCallback(async (data: RegisterRequest) => {
    const response: LoginResponse = await authService.register(data);
    saveSession(response, "/dashboard");
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    studentLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
