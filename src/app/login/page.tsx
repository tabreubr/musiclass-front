"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: integrar com Spring Boot - POST /auth/login
    // const response = await api.post("/auth/login", { email, password });
    // guardar token JWT no localStorage/cookie

    // Por agora navega direto pro dashboard (mock)
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
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
          <p className="text-primary-light text-sm mt-1">Manage your music lessons</p>
        </div>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleLogin}
        className="w-full flex flex-col gap-4"
      >
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="mt-2 bg-primary-dark hover:bg-primary"
        >
          {loading ? "Entering..." : "Enter"}
        </Button>
      </form>

      {/* Links */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button className="text-primary-light text-sm hover:text-white transition-colors">
          Forgot password?
        </button>
        <p className="text-primary-light text-sm">
          Don&apos;t have an account?{" "}
          <span className="text-white font-semibold cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>

      {/* Decoração musical */}
      <div className="absolute top-8 right-8 opacity-20 text-white text-4xl select-none">♩</div>
      <div className="absolute bottom-16 left-8 opacity-20 text-white text-3xl select-none">♪</div>
    </div>
  );
}
