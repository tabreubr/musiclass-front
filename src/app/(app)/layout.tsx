"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Enquanto verifica o localStorage, não renderiza nada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100dvh", background: "#0A0D1A" }}>
        <span className="text-4xl animate-spin">⏳</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthGuard>
        <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>
          <main style={{ minHeight: "100dvh", paddingBottom: "88px" }}>{children}</main>
          <BottomNav />
        </div>
      </AuthGuard>
    </LanguageProvider>
  );
}
