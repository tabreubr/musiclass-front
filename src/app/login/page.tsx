"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type LoginMode = "instructor" | "student";

const fieldStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
  padding: "16px 18px",
  fontSize: "15px",
  color: "#F1F5F9",
  width: "100%",
  outline: "none",
  colorScheme: "dark",
};

export default function LoginPage() {
  const { login, studentLogin } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("instructor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<LoginMode | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const goldenStyle = {
    background: "linear-gradient(135deg, #5C3F0E 0%, #9A7228 30%, #C49A32 55%, #9A7228 75%, #5C3F0E 100%)",
    boxShadow: "0 4px 16px rgba(154,114,40,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    color: "#1A0F00",
  };

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
      className="flex flex-col"
      style={{
        minHeight: "100dvh",
        position: "relative",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "64px",
        paddingBottom: "40px",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Fundo escuro base */}
      <div style={{ position: "fixed", inset: 0, background: "#0A0419", zIndex: 0 }} />

      {/* Imagem de fundo com baixa opacidade */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/imagem_fundo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center -120px",
          opacity: 0.35,
          zIndex: 1,
        }}
      />

      {/* Gradiente sobre a imagem para escurecer bordas e fundo */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,4,25,0.3) 0%, rgba(10,4,25,0.15) 35%, rgba(10,4,25,0.6) 70%, rgba(10,4,25,0.95) 100%)",
          zIndex: 2,
        }}
      />

      {/* Conteúdo (acima dos layers de fundo) */}
      <div className="flex flex-col" style={{ position: "relative", zIndex: 10, gap: "20px", flex: 1, justifyContent: "space-between" }}>

      {/* Logo + título */}
      <div className="flex flex-col items-center" style={{ gap: "20px", marginTop: "16px" }}>
        <img
          src="/logo.png"
          alt="Musiclass"
          style={{ width: "160px", height: "160px", objectFit: "contain", filter: "drop-shadow(0 12px 40px rgba(109,40,217,0.5))" }}
        />
        <div className="text-center">
          <img
            src="/Musiclass_Text.png"
            alt="Musiclass"
            style={{ width: "260px", objectFit: "contain", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6))" }}
          />
          <p style={{ color: "#A8862A", fontSize: "14px", marginTop: "8px", fontWeight: 500, letterSpacing: "0.04em" }}>Gerencie suas aulas de música</p>
        </div>
      </div>

      {/* Formulário */}
      <div
        className="flex flex-col"
        style={{
          gap: "20px",
          background: "rgba(10,4,25,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px",
          padding: "24px 20px",
          border: "1px solid rgba(167,139,250,0.12)",
        }}
      >

        {/* Toggle Instrutor / Aluno */}
        <div
          className="flex"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "18px",
            padding: "5px",
            gap: "4px",
          }}
        >
          {(["instructor", "student"] as LoginMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null); }}
              onMouseEnter={() => setHoveredTab(m)}
              onMouseLeave={() => setHoveredTab(null)}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: "12px",
                borderRadius: "14px",
                fontSize: "14px",
                ...(hoveredTab === m
                  ? goldenStyle
                  : mode === m
                    ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "white" }
                    : { color: "#64748B" }
                ),
              }}
            >
              {m === "instructor" ? "🎓 Instrutor" : "🎵 Aluno"}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col" style={{ gap: "12px" }}>

          {/* Email */}
          <div className="flex flex-col" style={{ gap: "6px" }}>
            <label style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "4px" }}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={fieldStyle}
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col" style={{ gap: "6px" }}>
            <label style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "4px" }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ ...fieldStyle, paddingRight: "52px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="flex items-center justify-center"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#475569",
                  background: "none",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div
              className="flex items-center"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "12px",
                padding: "12px 14px",
                gap: "8px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#F87171" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p style={{ color: "#F87171", fontSize: "13px" }}>{error}</p>
            </div>
          )}

          {/* Botão entrar */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            className="w-full font-bold active:scale-[0.98] transition-all disabled:opacity-60"
            style={{
              ...(hoveredBtn
                ? goldenStyle
                : {
                    background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                    boxShadow: "0 6px 24px rgba(109,40,217,0.45)",
                    color: "white",
                  }
              ),
              borderRadius: "16px",
              padding: "17px",
              fontSize: "16px",
              fontWeight: 800,
              marginTop: "4px",
              letterSpacing: "0.04em",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-6">
        <button style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 500 }}>
          Esqueceu a senha?
        </button>
        <button
          onClick={() => router.push("/register")}
          style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 500 }}
        >
          Criar conta
        </button>
      </div>

      </div>{/* fim do conteúdo z-index */}
    </div>
  );
}
