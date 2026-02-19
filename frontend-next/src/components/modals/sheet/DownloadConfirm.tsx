"use client";

// ===== DOWNLOAD CONFIRM MODAL =====
// Modal de confirmacao de download de partitura

interface DownloadConfirmProps {
  isOpen: boolean;
  instrumentName?: string;
  downloading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DownloadConfirm = ({
  isOpen,
  instrumentName = "",
  downloading = false,
  onConfirm,
  onCancel,
}: DownloadConfirmProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onCancel}
        role="presentation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 2002,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Modal */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="download-confirm-title"
        aria-describedby="download-confirm-desc"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "24px",
          zIndex: 2003,
          width: "300px",
          maxWidth: "85vw",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <h3
          id="download-confirm-title"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Confirmar Download
        </h3>
        <p
          id="download-confirm-desc"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Baixar partitura de{" "}
          <strong style={{ color: "var(--accent)" }}>{instrumentName}</strong>?
        </p>

        {/* Botoes */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={downloading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background:
                "linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)",
              border: "none",
              color: "#F4E4BC",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: downloading ? "wait" : "pointer",
              opacity: downloading ? 0.6 : 1,
            }}
          >
            {downloading ? "Baixando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadConfirm;
