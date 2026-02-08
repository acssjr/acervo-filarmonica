"use client";

// ===== ADMIN CATEGORIAS =====
// Gerenciamento de categorias

import { useState, useEffect } from "react";
import { useUI } from "@contexts/UIContext";
import { API } from "@lib/api";
import CategoryIcon from "@components/common/CategoryIcon";
import { CategoryListSkeleton } from "@components/common/Skeleton";

interface Categoria {
  id: string;
  nome: string;
  emoji?: string;
  cor?: string;
}

// Funcao para gerar ID a partir do nome (slug)
const generateId = (nome: string): string => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-")     // Substitui nao-alfanumericos por hifen
    .replace(/^-+|-+$/g, "");        // Remove hifens do inicio/fim
};

// Cores padrao para novas categorias
const CORES_PADRAO = [
  "#D4AF37", "#8B4513", "#2E8B57", "#4169E1", "#9932CC",
  "#DC143C", "#FF8C00", "#20B2AA", "#778899", "#6B8E23",
];

const AdminCategorias = () => {
  const { showToast } = useUI();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await API.getCategorias();
      setCategorias(cats || []);
    } catch {
      showToast("Erro ao carregar categorias", "error");
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === "novo") {
        setEditingCategoria(null);
        setNome("");
        setShowModal(true);
      }
    };
    window.addEventListener("admin-categorias-action", handler as EventListener);
    return () => window.removeEventListener("admin-categorias-action", handler as EventListener);
  }, []);

  const handleSave = async () => {
    if (!nome.trim()) {
      showToast("Digite o nome da categoria", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingCategoria) {
        await API.updateCategoria(editingCategoria.id, { nome: nome.trim() });
        showToast("Categoria atualizada!");
      } else {
        // Gerar ID, emoji e cor para nova categoria
        const id = generateId(nome.trim());
        const corIndex = categorias.length % CORES_PADRAO.length;
        const cor = CORES_PADRAO[corIndex];
        const emoji = "\uD83C\uDFB5"; // Emoji padrao - o icone real vem do CategoryIcon

        await API.createCategoria({
          id,
          nome: nome.trim(),
          emoji,
          cor,
        });
        showToast("Categoria criada!");
      }
      setShowModal(false);
      setEditingCategoria(null);
      setNome("");
      loadData();
    } catch (e: unknown) {
      showToast((e as Error).message, "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta categoria?")) return;
    try {
      await API.deleteCategoria(id);
      showToast("Categoria removida!");
      loadData();
    } catch (e: unknown) {
      showToast((e as Error).message, "error");
    }
  };

  const openEdit = (cat: Categoria) => {
    setEditingCategoria(cat);
    setNome(cat.nome || "");
    setShowModal(true);
  };

  return (
    <div className="page-transition" style={{ padding: "32px", maxWidth: "800px", margin: "0 auto", fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "26px",
          fontWeight: "700",
          color: "var(--text-primary)",
          fontFamily: "Outfit, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "8px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Categorias
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Gerencie os generos musicais
        </p>
      </div>

      {/* Botao Nova Categoria */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => { setEditingCategoria(null); setNome(""); setShowModal(true); }}
          className="btn-primary-hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            borderRadius: "12px",
            background: "linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)",
            color: "#1a1a1a",
            border: "none",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Outfit, sans-serif",
            boxShadow: "0 4px 16px rgba(212, 175, 55, 0.3)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Categoria
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <CategoryListSkeleton count={5} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {categorias.map((cat, index) => (
            <div
              key={cat.id}
              className="list-item-animate card-hover"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--bg-secondary)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                animationDelay: `${index * 0.03}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}>
                  <CategoryIcon categoryId={cat.id} size={24} color="#D4AF37" />
                </div>
                <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "16px" }}>
                  {cat.nome}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button onClick={() => openEdit(cat)} title="Editar" className="btn-icon-hover" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(cat.id)} title="Excluir" className="btn-danger-hover" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(231, 76, 60, 0.1)",
                  border: "1px solid rgba(231, 76, 60, 0.3)",
                  color: "#e74c3c",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {categorias.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
              Nenhuma categoria cadastrada
            </div>
          )}
        </div>
      )}

      {/* Modal Criar/Editar */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "var(--bg-secondary)",
            borderRadius: "16px",
            padding: "32px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-primary)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
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
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
              Nome da Categoria <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Dobrado, Valsa, Marcha..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "15px",
                marginBottom: "24px",
                fontFamily: "Outfit, sans-serif",
              }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowModal(false)} className="btn-ghost-hover" style={{
                flex: 1,
                padding: "14px",
                borderRadius: "10px",
                background: "var(--bg-primary)",
                border: "1.5px solid var(--border)",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
              }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary-hover" style={{
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
                fontFamily: "Outfit, sans-serif",
              }}>
                {saving ? "Salvando..." : (editingCategoria ? "Salvar" : "Criar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;
