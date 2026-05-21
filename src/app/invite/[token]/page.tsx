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

    // Validação local antes de chamar a API
    if (!email.trim() || !password.trim()) {
      setError(t("invite_err_fields"));
      return;
    }

    setLoading(true);
    try {
      await inviteService.register(token, { email, password });
      setPageState("success");
    } catch (err: unknown) {
      // 410 Gone = token expirado ou já usado
      // 404 = token não encontrado / inválido
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark px-6">

      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M36 8V28C36 32.418 30.627 36 24 36C17.373 36 12 32.418 12 28C12 23.582 17.373 20 24 20C26.09 20 28.05 20.45 29.75 21.23V8H36Z"
              fill="#2563EB"
              stroke="#2563EB"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="28" r="6" fill="#60A5FA" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Musiclass</h1>
        </div>
      </div>

      {/* Estado: sucesso */}
      {pageState === "success" ? (
        <div className="w-full flex flex-col items-center gap-6 text-center">
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t("invite_success_title")}</h2>
            <p className="text-primary-light text-sm mt-2">{t("invite_success_subtitle")}</p>
          </div>
          <Button
            fullWidth
            onClick={() => router.push("/login")}
            className="bg-white text-primary font-semibold hover:bg-primary-light"
          >
            {t("invite_success_btn")}
          </Button>
        </div>
      ) : (
        /* Estado: formulário de registro */
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-white">{t("invite_title")}</h2>
            <p className="text-primary-light text-sm mt-1">{t("invite_subtitle")}</p>
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

          {/* Mensagem de erro */}
          {error && (
            <p className="text-red-300 text-sm text-center -mt-1">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="mt-2 bg-primary-dark hover:bg-primary"
          >
            {loading ? t("invite_submitting") : t("invite_submit")}
          </Button>
        </form>
      )}

      {/* Decoração musical */}
      <div className="absolute top-8 right-8 opacity-20 text-white text-4xl select-none">♩</div>
      <div className="absolute bottom-16 left-8 opacity-20 text-white text-3xl select-none">♪</div>
    </div>
  );
}
