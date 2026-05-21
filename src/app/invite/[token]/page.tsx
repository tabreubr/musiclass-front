"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/contexts/LanguageContext";
import { inviteService } from "@/services/inviteService";

type PageState = "form" | "success";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(t("invite_err_fields"));
      return;
    }

    setLoading(true);
    try {
      await inviteService.register(token, { email, password });
      setPageState("success");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 410) {
        setError(t("invite_err_expired"));
      } else if (status === 404) {
        setError(t("invite_err_invalid"));
      } else {
        setError(t("invite_err_generic"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-6 py-12"
      style={{ background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)" }}
    >
      {/* Logo */}
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
          <p className="text-purple-300 text-sm mt-1">Área do Aluno</p>
        </div>
      </div>

      {/* Conteúdo */}
      {pageState === "success" ? (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t("invite_success_title")}</h2>
            <p className="text-purple-300 text-sm mt-2">{t("invite_success_subtitle")}</p>
          </div>
          <Button fullWidth onClick={() => router.push("/login")}>
            {t("invite_success_btn")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-white">{t("invite_title")}</h2>
            <p className="text-purple-300 text-sm mt-1">{t("invite_subtitle")}</p>
          </div>

          <Input
            type="email"
            placeholder={t("invite_email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            placeholder={t("invite_password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && (
            <p className="text-red-400 text-sm text-center -mt-1">{error}</p>
          )}

          <Button type="submit" fullWidth disabled={loading} className="mt-2">
            {loading ? t("invite_submitting") : t("invite_submit")}
          </Button>
        </form>
      )}

      {/* Footer */}
      <div className="flex justify-center">
        <p className="text-purple-400 text-xs">Sua jornada musical começa aqui</p>
      </div>

      {/* Decoração */}
      <div className="absolute top-10 right-8 opacity-10 text-white text-5xl select-none pointer-events-none">♩</div>
      <div className="absolute bottom-20 left-6 opacity-10 text-white text-4xl select-none pointer-events-none">♪</div>
    </div>
  );
}
