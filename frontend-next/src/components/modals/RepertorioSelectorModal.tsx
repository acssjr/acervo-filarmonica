"use client";

// ===== REPERTORIO SELECTOR MODAL =====
// Modal para selecionar/criar repertorio ao adicionar partitura

import { useState, type KeyboardEvent, type ChangeEvent } from "react";

interface Repertorio {
  id: number;
  nome: string;
  ativo: number;
  total_partituras?: number;
}

interface RepertorioSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (repertorio: Repertorio) => void;
  onCreate: (name: string) => Promise<void>;
  repertorios?: Repertorio[];
  partituraTitulo?: string;
  loading?: boolean;
}

const RepertorioSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  onCreate,
  repertorios = [],
  partituraTitulo = "",
  loading = false,
}: RepertorioSelectorModalProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newName.trim()) return;

    setCreating(true);
    try {
      await onCreate(newName.trim());
      setNewName("");
      setShowCreateForm(false);
    } finally {
      setCreating(false);
    }
  };

  const hasRepertorios = repertorios.length > 0;
  const activeRepertorio = repertorios.find((r) => r.ativo === 1);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--bg-card)",
          borderRadius: "20px",
          padding: "0",
          zIndex: 1001,
          width: "400px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {hasRepertorios ? "Adicionar ao Repertório" : "Criar Repertório"}
              </h3>
              {partituraTitulo && (
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "280px",
                  }}
                >
                  {partituraTitulo}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="btn-icon-hover"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 24px", maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
              Carregando...
            </div>
          ) : !hasRepertorios || showCreateForm ? (
            /* Formulario de criacao */
            <div>
              {!hasRepertorios && (
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(155, 89, 182, 0.1)",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(155, 89, 182, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b59b6" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--text-primary)",
                      }}
                    >
                      Nenhum repertório encontrado
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                      }}
                    >
                      Crie um repertório para organizar suas partituras por apresentação.
                    </p>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Nome do Repertório
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                  placeholder="Ex: Apresentacao 7 de Setembro"
                  autoFocus
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCreate()}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid var(--border)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {hasRepertorios && (
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn-ghost-hover"
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="btn-primary-hover"
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      creating || !newName.trim()
                        ? "rgba(155, 89, 182, 0.3)"
                        : "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: creating || !newName.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {creating ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      Criando...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Criar e Adicionar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Lista de repertorios */
            <div>
              {/* Repertorio ativo primeiro */}
              {activeRepertorio && (
                <div style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Repertório Ativo
                  </p>
                  <button
                    onClick={() => onSelect(activeRepertorio)}
                    className="list-item-hover"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "2px solid rgba(46, 204, 113, 0.4)",
                      background: "rgba(46, 204, 113, 0.08)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#2ecc71",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {activeRepertorio.nome}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                        }}
                      >
                        {activeRepertorio.total_partituras || 0} músicas
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Outros repertorios */}
              {repertorios.filter((r) => r.ativo !== 1).length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Outros Repertórios
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {repertorios
                      .filter((r) => r.ativo !== 1)
                      .map((rep) => (
                        <button
                          key={rep.id}
                          onClick={() => onSelect(rep)}
                          className="list-item-hover"
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            background: "var(--bg-primary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: "rgba(155, 89, 182, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b59b6" strokeWidth="2">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "var(--text-primary)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {rep.nome}
                            </p>
                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                              }}
                            >
                              {rep.total_partituras || 0} músicas
                            </p>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Botao criar novo */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-ghost-hover"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px dashed var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Criar Novo Repertório
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default RepertorioSelectorModal;
