"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

type LoginMode = "instructor" | "student";

export default function LoginPage() {
  const { login, studentLogin } = useAuth();
  const [mode, setMode] = useState<LoginMode>("instructor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "instructor") {
        await login({ email, password });
      } else {
        await studentLogin({ email, password });
      }
    } catch {
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-6 py-12"
      style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)" }}
    >
      {/* Logo + título */}
      <div className="flex flex-col items-center gap-5 mt-8">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", boxShadow: "0 8px 32px rgba(124,58,237,0.5)" }}
        >
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <path
              d="M36 8V28C36 32.418 30.627 36 24 36C17.373 36 12 32.418 12 28C12 23.582 17.373 20 24 20C26.09 20 28.05 20.45 29.75 21.23V8H36Z"
              fill="white"
            />
            <circle cx="24" cy="28" r="6" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Musiclass</h1>
          <p className="text-purple-300 text-sm mt-1">Gerencie suas aulas de música</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex flex-col gap-5">

        {/* Toggle */}
        <div
          className="flex p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {(["instructor", "student"] as LoginMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={mode === m
                ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" }
                : { color: "#94A3B8" }
              }
            >
              {m === "instructor" ? "Instrutor" : "Aluno"}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button type="submit" fullWidth disabled={loading} className="mt-1">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="flex justify-center">
        <button className="text-purple-400 text-sm">Esqueceu a senha?</button>
      </div>

      {/* Decoração */}
      <div className="absolute top-10 right-8 opacity-10 text-white text-5xl select-none pointer-events-none">♩</div>
      <div className="absolute bottom-20 left-6 opacity-10 text-white text-4xl select-none pointer-events-none">♪</div>
    </div>
  );
}
