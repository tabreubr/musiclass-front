"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full flex flex-col"
        style={{
          background: "#141728",
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 40px",
          paddingBottom: "calc(40px + 88px)",
          gap: "20px",
          maxWidth: "430px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone */}
        <div className="flex justify-center">
          <div
            className="flex items-center justify-center"
            style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(248,113,113,0.12)", fontSize: "24px" }}
          >
            🗑️
          </div>
        </div>

        {/* Texto */}
        <div className="text-center flex flex-col" style={{ gap: "6px" }}>
          <p style={{ color: "#F1F5F9", fontSize: "17px", fontWeight: 700 }}>{title}</p>
          <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.5" }}>{message}</p>
        </div>

        {/* Botões */}
        <div className="flex flex-col" style={{ gap: "10px" }}>
          <button
            onClick={onConfirm}
            className="w-full font-semibold active:scale-95 transition-transform"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171", borderRadius: "16px", padding: "15px", fontSize: "15px" }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full font-semibold active:scale-95 transition-transform"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", borderRadius: "16px", padding: "15px", fontSize: "15px" }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
