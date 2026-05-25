"use client";

export default function StudentGoalsPage() {
  return (
    <div style={{ background: "#0A0D1A", minHeight: "100dvh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1A0F3C 0%, #0A0D1A 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "44px",
        paddingBottom: "16px",
      }}>
        <p style={{ color: "#A78BFA", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
          Metas
        </p>
        <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800 }}>Suas Metas</h1>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col items-center text-center" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "64px", gap: "16px" }}>
        <div
          className="flex items-center justify-center"
          style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)", fontSize: "36px" }}
        >
          🎯
        </div>
        <div style={{ gap: "8px" }} className="flex flex-col">
          <p style={{ color: "#F1F5F9", fontSize: "16px", fontWeight: 700 }}>Em breve</p>
          <p style={{ color: "#64748B", fontSize: "13px", lineHeight: "1.6", maxWidth: "260px" }}>
            Aqui você verá as metas definidas pelo seu instrutor — tanto de desenvolvimento quanto de progresso.
          </p>
        </div>
      </div>
    </div>
  );
}
