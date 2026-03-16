// ===== ADMIN CATEGORIAS =====
// Gerenciamento de categorias

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';
import { CategoryListSkeleton } from '@components/common/Skeleton';

// Paleta de gradientes por categoria (igual ao CategoryCard do acervo)
const CARD_THEMES = {
  'dobrados':           { gradient: 'linear-gradient(145deg, #8B2E3A 0%, #4E1620 100%)', iconColor: '#F4C0C8' },
  'marchas':            { gradient: 'linear-gradient(145deg, #1A3460 0%, #0D1A35 100%)', iconColor: '#9EC4F0' },
  'marchas-funebres':   { gradient: 'linear-gradient(145deg, #282830 0%, #141418 100%)', iconColor: '#B8B8C8' },
  'marchas-religiosas': { gradient: 'linear-gradient(145deg, #5A2C1A 0%, #2E1408 100%)', iconColor: '#ECC09A' },
  'fantasias':          { gradient: 'linear-gradient(145deg, #4A1E7A 0%, #280F48 100%)', iconColor: '#C8A8F0' },
  'polacas':            { gradient: 'linear-gradient(145deg, #1A4830 0%, #0C2818 100%)', iconColor: '#9ECEB8' },
  'boleros':            { gradient: 'linear-gradient(145deg, #7A2C18 0%, #401208 100%)', iconColor: '#F0A888' },
  'valsas':             { gradient: 'linear-gradient(145deg, #5A1A40 0%, #300D20 100%)', iconColor: '#F0A8C8' },
  'arranjos':           { gradient: 'linear-gradient(145deg, #183848 0%, #0A1E28 100%)', iconColor: '#88B8D8' },
  'hinos':              { gradient: 'linear-gradient(145deg, #1A3C20 0%, #0C2010 100%)', iconColor: '#90C898' },
  'hinos-civicos':      { gradient: 'linear-gradient(145deg, #1A2E60 0%, #0A1838 100%)', iconColor: '#88A8E8' },
  'hinos-religiosos':   { gradient: 'linear-gradient(145deg, #4A2A10 0%, #281408 100%)', iconColor: '#E8B880' },
  'preludios':          { gradient: 'linear-gradient(145deg, #1E2840 0%, #0E1422 100%)', iconColor: '#88A0C0' },
};
const DEFAULT_THEME = { gradient: 'linear-gradient(145deg, #2A2A3A 0%, #151520 100%)', iconColor: '#B0B0C8' };

// Função para gerar ID a partir do nome (slug)
const generateId = (nome) => {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, '');        // Remove hífens do início/fim
};

// Cores padrão para novas categorias
const CORES_PADRAO = [
  '#D4AF37', '#8B4513', '#2E8B57', '#4169E1', '#9932CC',
  '#DC143C', '#FF8C00', '#20B2AA', '#778899', '#6B8E23'
];

const AdminCategorias = () => {
  const { showToast } = useUI();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await API.getCategorias();
      setCategorias(cats || []);
    } catch {
      showToast('Erro ao carregar categorias', 'error');
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'novo') {
        setEditingCategoria(null);
        setNome('');
        setShowModal(true);
      }
    };
    window.addEventListener('admin-categorias-action', handler);
    return () => window.removeEventListener('admin-categorias-action', handler);
  }, []);

  const handleSave = async () => {
    if (!nome.trim()) {
      showToast('Digite o nome da categoria', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingCategoria) {
        await API.updateCategoria(editingCategoria.id, { nome: nome.trim() });
        showToast('Categoria atualizada!');
      } else {
        // Gerar ID, emoji e cor para nova categoria
        const id = generateId(nome.trim());
        const corIndex = categorias.length % CORES_PADRAO.length;
        const cor = CORES_PADRAO[corIndex];
        const emoji = '🎵'; // Emoji padrão - o ícone real vem do CategoryIcon

        await API.createCategoria({
          id,
          nome: nome.trim(),
          emoji,
          cor
        });
        showToast('Categoria criada!');
      }
      setShowModal(false);
      setEditingCategoria(null);
      setNome('');
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta categoria?')) return;
    try {
      await API.deleteCategoria(id);
      showToast('Categoria removida!');
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const openEdit = (cat) => {
    setEditingCategoria(cat);
    setNome(cat.nome || '');
    setShowModal(true);
  };

  return (
    <div className="page-transition" style={{ padding: isMobile ? '16px' : '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          Categorias
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Gerencie os gêneros musicais
        </p>
      </div>

      {/* Botao Nova Categoria */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => { setEditingCategoria(null); setNome(''); setShowModal(true); }}
          className="btn-primary-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
            color: '#1a1a1a',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nova Categoria
        </button>
      </div>

      {/* Grid de categorias */}
      {loading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {categorias.map((cat, index) => {
            const { gradient, iconColor } = CARD_THEMES[cat.id] || DEFAULT_THEME;
            return (
              <div
                key={cat.id}
                className="list-item-animate"
                style={{
                  background: gradient,
                  borderRadius: '20px',
                  padding: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '108px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                {/* Highlight topo */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)',
                  pointerEvents: 'none',
                }} />

                {/* Nome */}
                <div style={{ paddingRight: '52px', flex: 1 }}>
                  <h3 style={{
                    fontSize: '15px', fontWeight: '700', color: '#FFFFFF',
                    lineHeight: 1.2, marginBottom: '0', letterSpacing: '-0.1px',
                  }}>
                    {cat.nome}
                  </h3>
                </div>

                {/* Botões de ação — inferior esquerdo */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <button
                    onClick={() => openEdit(cat)}
                    title="Editar"
                    aria-label={`Editar ${cat.nome}`}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.20)',
                      color: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    title="Excluir"
                    aria-label={`Excluir ${cat.nome}`}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: 'rgba(231,76,60,0.22)',
                      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(231,76,60,0.38)',
                      color: '#ff8a7a', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>

                {/* Brilho radial atrás do ícone */}
                <div style={{
                  position: 'absolute', right: '-15px', bottom: '-15px',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }} />

                {/* Ícone decorativo */}
                <div style={{
                  position: 'absolute', right: '8px', bottom: '6px',
                  width: '56px', height: '56px',
                  opacity: 0.38, transform: 'rotate(-8deg)', pointerEvents: 'none',
                }}>
                  <CategoryIcon categoryId={cat.id} size={56} color={iconColor} />
                </div>
              </div>
            );
          })}
          {categorias.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Nenhuma categoria cadastrada
            </div>
          )}
        </div>
      )}

      {/* Modal Criar/Editar */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, }}>
                {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)', }}>
              Nome da Categoria <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Dobrado, Valsa, Marcha..."
              value={nome}
              onChange={e => setNome(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                marginBottom: '24px',
                }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} className="btn-ghost-hover" style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary-hover" style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: '#D4AF37',
                border: 'none',
                color: '#1a1a1a',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
                }}>
                {saving ? 'Salvando...' : (editingCategoria ? 'Salvar' : 'Criar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;
