"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { API } from "@lib/api";

interface Partitura {
  id: string;
  titulo: string;
  compositor: string;
  categoria_nome?: string;
  categoria_cor?: string;
}

interface Ensaio {
  data_ensaio: string;
  dia_semana?: string;
  usuario_presente: number;
  total_partituras?: number;
}

interface EnsaioDetailModalProps {
  ensaio: Ensaio | null;
  isOpen: boolean;
  onClose: () => void;
}

const EnsaioDetailModal = ({
  ensaio,
  isOpen,
  onClose,
}: EnsaioDetailModalProps) => {
  const [partituras, setPartituras] = useState<Partitura[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !ensaio) return;
    const loadPartituras = async () => {
      setLoading(true);
      try {
        const result = await API.getPartiturasEnsaio(ensaio.data_ensaio);
        setPartituras(result.partituras || []);
      } catch (error) {
        console.error("Erro ao carregar partituras do ensaio:", error);
        setPartituras([]);
      } finally {
        setLoading(false);
      }
    };
    loadPartituras();
  }, [isOpen, ensaio]);

  if (!ensaio) return null;

  const data = new Date(ensaio.data_ensaio + "T00:00:00Z");
  const dataFormatada = data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
  const presente = ensaio.usuario_presente === 1;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "hidden",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "24px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Ensaio
                </h2>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    margin: "4px 0 0 0",
                    textTransform: "capitalize",
                  }}
                >
                  {dataFormatada}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Status badge */}
            <div
              style={{
                margin: "0 24px",
                marginTop: "16px",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                fontWeight: "600",
                background: presente
                  ? "rgba(67, 185, 127, 0.15)"
                  : "rgba(150, 150, 150, 0.15)",
                color: presente ? "#43B97F" : "var(--text-muted)",
                alignSelf: "flex-start",
              }}
            >
              {presente ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Presente
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Ausente
                </>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  margin: "0 0 16px 0",
                }}
              >
                Partituras tocadas ({partituras.length})
              </h3>

              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Carregando...
                </div>
              ) : partituras.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Nenhuma partitura registrada para este ensaio
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {partituras.map((partitura, index) => (
                    <div
                      key={partitura.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px",
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(145deg, #D4AF37 0%, #F4E4BC 100%)",
                          color: "#3D1011",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "12px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {partitura.titulo}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {partitura.compositor}
                        </div>
                      </div>
                      {partitura.categoria_nome && (
                        <div
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#FFFFFF",
                            flexShrink: 0,
                            backgroundColor:
                              partitura.categoria_cor || "var(--text-muted)",
                          }}
                        >
                          {partitura.categoria_nome}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnsaioDetailModal;
