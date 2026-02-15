"use client";

// ===== USUARIO FORM MODAL =====
// Modal para criar/editar musico

import { useState } from "react";

interface Instrumento {
  id: string | number;
  nome: string;
}

interface Usuario {
  id: string | number;
  nome: string;
  username: string;
  admin: boolean;
  instrumento_id?: string | number;
}

interface UsuarioFormModalProps {
  usuario: Usuario | null;
  instrumentos: Instrumento[];
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

const UsuarioFormModal = ({ usuario, instrumentos, onSave, onClose }: UsuarioFormModalProps) => {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [username, setUsername] = useState(usuario?.username || "");
  const [pin, setPin] = useState("");
  const [instrumentoId, setInstrumentoId] = useState<string | number>(usuario?.instrumento_id || "");
  const [isAdmin, setIsAdmin] = useState(usuario?.admin || false);
  const [saving, setSaving] = useState(false);
  const [showInstrumentoDropdown, setShowInstrumentoDropdown] = useState(false);
  const [instrumentoSearch, setInstrumentoSearch] = useState("");

  // Auto-gerar username e PIN quando nome mudar (apenas para novo usuario)
  const handleNomeChange = (value: string) => {
    setNome(value);
    if (!usuario && value.trim().length > 2) {
      const normalized = value.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "");
      setUsername(normalized);

      if (!pin) {
        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
        setPin(randomPin);
      }
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) return;
    if (!usuario && (!username.trim() || !pin || pin.length !== 4)) return;

    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        nome: nome.trim(),
        instrumento_id: instrumentoId || null,
        admin: isAdmin,
      };
      if (!usuario) {
        data.username = username.trim().toLowerCase();
        data.pin = pin;
      }
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const gerarUsername = () => {
    const normalized = nome.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "");
    setUsername(normalized);
  };

  const gerarPin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(randomPin);
  };

  const selectedInstrumento = instrumentos.find((i) => String(i.id) === String(instrumentoId));
  const filteredInstrumentos = instrumentoSearch
    ? instrumentos.filter((i) => i.nome.toLowerCase().includes(instrumentoSearch.toLowerCase()))
    : instrumentos;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-secondary)",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "480px",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "scaleInLogin 0.25s ease-out",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text-primary)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
            {usuario ? "Editar Músico" : "Novo Músico"}
          </h2>
          <button onClick={onClose} style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nome Completo */}
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
          Nome Completo <span style={{ color: "#e74c3c" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Ex: Joao da Silva Santos"
          value={nome}
          onChange={(e) => handleNomeChange(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "10px",
            border: "1.5px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: "15px",
            marginBottom: "20px",
            transition: "border-color 0.2s",
            fontFamily: "Outfit, sans-serif",
          }}
        />

        {!usuario && (
          <>
            {/* Username e PIN lado a lado */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* Username */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
                  Login <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="joaosilva"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      paddingRight: "50px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      fontSize: "15px",
                      transition: "border-color 0.2s",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  />
                  <button onClick={gerarUsername} title="Gerar automaticamente" style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 0.15s",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PIN */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
                  PIN <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="1234"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      paddingRight: "50px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      fontSize: "15px",
                      letterSpacing: "4px",
                      transition: "border-color 0.2s",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  />
                  <button onClick={gerarPin} title="Gerar novo PIN" style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 0.15s",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "-12px", marginBottom: "20px", fontFamily: "Outfit, sans-serif" }}>
              Campos gerados automaticamente. Clique nos icones para regenerar.
            </p>
          </>
        )}

        {/* Instrumento - Dropdown customizado */}
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
          Instrumento
        </label>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => setShowInstrumentoDropdown(!showInstrumentoDropdown)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1.5px solid var(--border)",
              background: "var(--bg-primary)",
              color: selectedInstrumento ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "15px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "border-color 0.2s",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            <span>{selectedInstrumento ? selectedInstrumento.nome : "Selecione o instrumento"}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
              transform: showInstrumentoDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showInstrumentoDropdown && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border)",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              zIndex: 10,
              maxHeight: "240px",
              overflow: "hidden",
            }}>
              {/* Busca */}
              <div style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
                <input
                  type="text"
                  placeholder="Buscar instrumento..."
                  value={instrumentoSearch}
                  onChange={(e) => setInstrumentoSearch(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontFamily: "Outfit, sans-serif",
                  }}
                />
              </div>

              {/* Lista */}
              <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                <button
                  onClick={() => { setInstrumentoId(""); setShowInstrumentoDropdown(false); setInstrumentoSearch(""); }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: !instrumentoId ? "var(--bg-primary)" : "transparent",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Nenhum instrumento
                </button>
                {filteredInstrumentos.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => { setInstrumentoId(inst.id); setShowInstrumentoDropdown(false); setInstrumentoSearch(""); }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: String(instrumentoId) === String(inst.id) ? "rgba(212, 175, 55, 0.15)" : "transparent",
                      color: String(instrumentoId) === String(inst.id) ? "#D4AF37" : "var(--text-primary)",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      fontWeight: String(instrumentoId) === String(inst.id) ? "500" : "400",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {inst.nome}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checkbox Administrador - Estilizado */}
        <label style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
          padding: "16px",
          background: isAdmin ? "rgba(212, 175, 55, 0.1)" : "var(--bg-primary)",
          borderRadius: "12px",
          marginBottom: "28px",
          border: isAdmin ? "1.5px solid rgba(212, 175, 55, 0.3)" : "1.5px solid var(--border)",
          transition: "all 0.2s",
        }}>
          {/* Toggle Switch */}
          <div style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            background: isAdmin ? "#D4AF37" : "var(--border)",
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              top: "2px",
              left: isAdmin ? "22px" : "2px",
              width: "20px",
              height: "20px",
              borderRadius: "10px",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "left 0.2s ease",
            }} />
          </div>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            style={{ display: "none" }}
          />
          <div>
            <span style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "14px", fontFamily: "Outfit, sans-serif" }}>
              Este músico é administrador
            </span>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0", fontFamily: "Outfit, sans-serif" }}>
              Tera acesso ao painel de gerenciamento
            </p>
          </div>
        </label>

        {/* Botoes */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            background: "var(--bg-primary)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "Outfit, sans-serif",
          }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            background: "#D4AF37",
            border: "none",
            color: "#1a1a1a",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "all 0.15s",
            fontFamily: "Outfit, sans-serif",
          }}>
            {saving ? "Salvando..." : (usuario ? "Salvar Alterações" : "Cadastrar Músico")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioFormModal;
