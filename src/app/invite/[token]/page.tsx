"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { inviteService } from "@/services/inviteService";

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

type PageState = "form" | "success";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const txt = {
    title: "Você foi convidado!",
    subtitle: "Crie sua conta para acessar a Musiclass",
    emailPlaceholder: "Digite seu email...",
    passwordPlaceholder: "Crie uma senha...",
    submit: "Criar Conta",
    submitting: "Criando conta...",
    successTitle: "Conta criada!",
    successSubtitle: "Agora você pode entrar com suas credenciais.",
    successBtn: "Ir para o Login",
    errFields: "Preencha todos os campos",
    errExpired: "Este link de convite expirou ou já foi usado.",
    errInvalid: "Este link de convite é inválido.",
    errGeneric: "Algo deu errado. Tente novamente.",
  };

  const goldenStyle = {
    background: "linear-gradient(135deg, #5C3F0E 0%, #9A7228 30%, #C49A32 55%, #9A7228 75%, #5C3F0E 100%)",
    boxShadow: "0 4px 16px rgba(154,114,40,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    color: "#1A0F00",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(txt.errFields);
      return;
    }

    setLoading(true);
    try {
      await inviteService.register(token, { email, password });
      setPageState("success");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 410) {
        setError(txt.errExpired);
      } else if (status === 404) {
        setError(txt.errInvalid);
      } else {
        setError(txt.errGeneric);
      }
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

      {/* Imagem de fundo */}
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

      {/* Gradiente */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,4,25,0.3) 0%, rgba(10,4,25,0.15) 35%, rgba(10,4,25,0.6) 70%, rgba(10,4,25,0.95) 100%)",
          zIndex: 2,
        }}
      />

      {/* Conteúdo */}
      <div className="flex flex-col" style={{ position: "relative", zIndex: 10, gap: "20px", flex: 1, justifyContent: "space-between" }}>

        {/* Logo */}
        <div className="flex flex-col items-center" style={{ gap: "20px", marginTop: "16px" }}>
          <img
            src="/logo.png"
            alt="Musiclass"
            style={{ width: "120px", height: "120px", objectFit: "contain", filter: "drop-shadow(0 12px 40px rgba(109,40,217,0.5))" }}
          />
          <div className="text-center">
            <img
              src="/Musiclass_Text.png"
              alt="Musiclass"
              style={{ width: "220px", objectFit: "contain", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6))" }}
            />
            <p style={{ color: "#A8862A", fontSize: "14px", marginTop: "8px", fontWeight: 500, letterSpacing: "0.04em" }}>
              Área do Aluno
            </p>
          </div>
        </div>

        {/* Card */}
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
          {pageState === "success" ? (
            <div className="flex flex-col items-center" style={{ gap: "20px", paddingTop: "16px", paddingBottom: "16px" }}>
              <span style={{ fontSize: "56px" }}>🎉</span>
              <div className="text-center" style={{ gap: "8px" }}>
                <h2 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700 }}>{txt.successTitle}</h2>
                <p style={{ color: "#A78BFA", fontSize: "14px", marginTop: "8px" }}>{txt.successSubtitle}</p>
              </div>
              <button
                onClick={() => router.push("/login")}
                className="w-full font-bold active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                  boxShadow: "0 6px 24px rgba(109,40,217,0.45)",
                  color: "white",
                  borderRadius: "16px",
                  padding: "17px",
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                }}
              >
                {txt.successBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "12px" }}>
              <div className="text-center" style={{ marginBottom: "4px" }}>
                <h2 style={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700 }}>{txt.title}</h2>
                <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "6px" }}>{txt.subtitle}</p>
              </div>

              {/* Email */}
              <div className="flex flex-col" style={{ gap: "6px" }}>
                <label style={{ color: "#A78BFA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "4px" }}>
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder={txt.emailPlaceholder}
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
                    placeholder={txt.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{ ...fieldStyle, paddingRight: "52px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center justify-center"
                    style={{
                      position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                      color: "#475569", background: "none", border: "none", padding: "4px", cursor: "pointer",
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

              {/* Botão */}
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
                {loading ? txt.submitting : txt.submit}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <p style={{ color: "#A78BFA", fontSize: "13px", fontWeight: 500 }}>Sua jornada musical começa aqui</p>
        </div>

      </div>
    </div>
  );
}
