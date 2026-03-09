// ===== ADMIN REPERTÓRIO =====
// Gerenciamento de repertórios (criar, editar, histórico)
// Design premium com glassmorphism e micro-animações

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { Icons } from '@constants/icons';
import CompartilharCardModal from '@components/CompartilharCardModal';

const AdminRepertorio = () => {
  const { showToast } = useUI();
  const [cardRepertorio, setCardRepertorio] = useState(null);
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRepertorio, setEditingRepertorio] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '', data_apresentacao: '', ativo: false });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPartituras, setExpandedPartituras] = useState({});

  // Seleção de partituras no modal de criação
  const [allPartituras, setAllPartituras] = useState([]);
  const [loadingPartituras, setLoadingPartituras] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [partituraSearch, setPartituraSearch] = useState('');

  const handleGenerateCard = async (rep) => {
    let partituras = expandedPartituras[rep.id];
    if (!partituras) {
      try {
        const data = await API.getRepertorio(rep.id);
        partituras = data.partituras || [];
      } catch {
        partituras = [];
      }
    }
    setCardRepertorio({ ...rep, partituras });
  };

  const loadRepertorios = async () => {
    setLoading(true);
    try {
      const data = await API.getRepertorios();
      setRepertorios(data || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar repertórios', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRepertorios();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
  }, []);

  const openCreateModal = async () => {
    setEditingRepertorio(null);
    setForm({ nome: '', descricao: '', data_apresentacao: '', ativo: true });
    setSelectedIds([]);
    setPartituraSearch('');
    setShowModal(true);
    setLoadingPartituras(true);
    try {
      const data = await API.getPartituras();
      setAllPartituras(data?.partituras || data || []);
    } catch {
      setAllPartituras([]);
    }
    setLoadingPartituras(false);
  };

  const openEditModal = (rep) => {
    setEditingRepertorio(rep);
    setForm({
      nome: rep.nome || '',
      descricao: rep.descricao || '',
      data_apresentacao: rep.data_apresentacao || '',
      ativo: rep.ativo === 1
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRepertorio(null);
    setForm({ nome: '', descricao: '', data_apresentacao: '', ativo: false });
    setSelectedIds([]);
    setPartituraSearch('');
    setAllPartituras([]);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      showToast('Nome é obrigatório', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingRepertorio) {
        await API.updateRepertorio(editingRepertorio.id, form);
        showToast('Repertório atualizado!');
      } else {
        const novo = await API.createRepertorio(form);
        const id = novo?.id || novo?.repertorio?.id;
        if (id && selectedIds.length > 0) {
          await Promise.all(selectedIds.map(pid => API.addPartituraToRepertorio(id, pid)));
        }
        showToast(`Repertório criado com ${selectedIds.length} música${selectedIds.length !== 1 ? 's' : ''}!`);
      }
      closeModal();
      loadRepertorios();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este repertório?')) return;

    try {
      await API.deleteRepertorio(id);
      showToast('Repertório excluído!');
      loadRepertorios();
    } catch (err) {
      showToast(err.message || 'Erro ao excluir', 'error');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await API.duplicarRepertorio(id);
      showToast('Repertório duplicado!');
      loadRepertorios();
    } catch (err) {
      showToast(err.message || 'Erro ao duplicar', 'error');
    }
  };

  const handleActivate = async (rep) => {
    try {
      await API.updateRepertorio(rep.id, { ...rep, ativo: true });
      showToast('Repertório ativado!');
      loadRepertorios();
    } catch (err) {
      showToast(err.message || 'Erro ao ativar', 'error');
    }
  };

  const handleDeactivate = async (rep) => {
    if (!window.confirm('Desativar este repertório?')) return;
    try {
      await API.updateRepertorio(rep.id, { ...rep, ativo: false });
      showToast('Repertório desativado!');
      loadRepertorios();
    } catch (err) {
      showToast(err.message || 'Erro ao desativar', 'error');
    }
  };

  const toggleExpand = async (rep) => {
    if (expandedId === rep.id) {
      setExpandedId(null);
    } else {
      setExpandedId(rep.id);
      if (!expandedPartituras[rep.id]) {
        try {
          const data = await API.getRepertorio(rep.id);
          setExpandedPartituras(prev => ({
            ...prev,
            [rep.id]: data.partituras || []
          }));
        } catch {
          showToast('Erro ao carregar partituras', 'error');
        }
      }
    }
  };

  // Mover partitura na ordem
  const handleMovePartitura = async (repertorioId, fromIndex, toIndex) => {
    const partituras = [...(expandedPartituras[repertorioId] || [])];
    if (toIndex < 0 || toIndex >= partituras.length) return;

    const [moved] = partituras.splice(fromIndex, 1);
    partituras.splice(toIndex, 0, moved);
    setExpandedPartituras(prev => ({
      ...prev,
      [repertorioId]: partituras
    }));

    try {
      const ordens = partituras.map((p, idx) => ({ partitura_id: p.id, ordem: idx }));
      await API.reorderRepertorioPartituras(repertorioId, ordens);
    } catch {
      showToast('Erro ao reordenar', 'error');
      const data = await API.getRepertorio(repertorioId);
      setExpandedPartituras(prev => ({
        ...prev,
        [repertorioId]: data.partituras || []
      }));
    }
  };

  const activeRepertorio = repertorios.find(r => r.ativo === 1);
  const historico = repertorios.filter(r => r.ativo !== 1);

  return (
    <div className="page-transition" style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            }}>
            <div style={{ width: '24px', height: '24px' }}><Icons.ListMusic /></div>
            Repertório
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '6px 0 0',
            }}>Gerencie os repertórios das apresentações</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '16px', height: '16px' }}><Icons.Plus /></div>
          Novo Repertório
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <p style={{ marginTop: '12px', }}>Carregando repertórios...</p>
        </div>
      ) : (
        <>
          {/* Repertório Ativo */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#2ecc71',
                boxShadow: '0 0 8px rgba(46, 204, 113, 0.6)',
                animation: 'pulse-green 2s ease-in-out infinite'
              }} />
              <h2 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                }}>Repertório Ativo</h2>
            </div>

            {activeRepertorio ? (
              <RepertorioCard
                repertorio={activeRepertorio}
                partituras={expandedPartituras[activeRepertorio.id]}
                isActive
                isExpanded={expandedId === activeRepertorio.id}
                onEdit={() => openEditModal(activeRepertorio)}
                onDelete={() => handleDelete(activeRepertorio.id)}
                onDuplicate={() => handleDuplicate(activeRepertorio.id)}
                onDeactivate={() => handleDeactivate(activeRepertorio)}
                onToggleExpand={() => toggleExpand(activeRepertorio)}
                onReorder={(from, to) => handleMovePartitura(activeRepertorio.id, from, to)}
                onGenerateCard={() => handleGenerateCard(activeRepertorio)}
              />
            ) : (
              <div style={{
                padding: '48px 32px',
                background: 'var(--bg-secondary)',
                borderRadius: '20px',
                textAlign: 'center',
                border: '2px dashed var(--border)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  margin: '0 auto 16px',
                  borderRadius: '16px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  <div style={{ width: '24px', height: '24px', color: '#D4AF37' }}><Icons.ListMusic /></div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: '0 0 4px', }}>Nenhum repertório ativo</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 20px', }}>Crie um repertório para organizar as músicas da próxima apresentação</p>
                <button
                  onClick={openCreateModal}
                  className="btn-primary-hover"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    }}
                >
                  Criar Repertório
                </button>
              </div>
            )}
          </div>

          {/* Histórico */}
          {historico.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}>
                <div style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }}><Icons.Clock /></div>
                <h2 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  }}>Histórico</h2>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-secondary)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  }}>{historico.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historico.map(rep => (
                  <RepertorioCard
                    key={rep.id}
                    repertorio={rep}
                    partituras={expandedPartituras[rep.id]}
                    isExpanded={expandedId === rep.id}
                    onEdit={() => openEditModal(rep)}
                    onDelete={() => handleDelete(rep.id)}
                    onDuplicate={() => handleDuplicate(rep.id)}
                    onActivate={() => handleActivate(rep)}
                    onToggleExpand={() => toggleExpand(rep)}
                    onReorder={(from, to) => handleMovePartitura(rep.id, from, to)}
                    onGenerateCard={() => handleGenerateCard(rep)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal — Editar Repertório (simples) */}
      {showModal && editingRepertorio && (
        <ModalSimples
          form={form}
          setForm={setForm}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Modal — Criar Repertório (com seleção de músicas) */}
      {showModal && !editingRepertorio && (
        <ModalCriar
          form={form}
          setForm={setForm}
          saving={saving}
          allPartituras={allPartituras}
          loadingPartituras={loadingPartituras}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          partituraSearch={partituraSearch}
          setPartituraSearch={setPartituraSearch}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Estilos */}
      {cardRepertorio && (
        <CompartilharCardModal
          repertorio={cardRepertorio}
          onClose={() => setCardRepertorio(null)}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 8px rgba(46, 204, 113, 0.6); }
          50% { box-shadow: 0 0 16px rgba(46, 204, 113, 0.9); }
        }
        .draggable-item-hover:hover {
          background: rgba(212, 175, 55, 0.06) !important;
          border-color: rgba(212, 175, 55, 0.25) !important;
        }
      `}</style>
    </div>
  );
};

// Componente de card do repertório
const RepertorioCard = ({
  repertorio,
  partituras,
  isActive,
  isExpanded,
  onEdit,
  onDelete,
  onDuplicate,
  onActivate,
  onDeactivate,
  onToggleExpand,
  onReorder,
  onGenerateCard,
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onReorder(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      // Evita bug de fuso horário: new Date("2026-03-07") interpreta como UTC,
      // que no Brasil (UTC-3) vira dia 06. Splitando a string evita isso.
      const [year, month, day] = dateStr.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    } catch { return dateStr; }
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: isActive ? '1.5px solid rgba(46, 204, 113, 0.35)' : '1px solid var(--border)',
      overflow: 'hidden',
      transition: 'all 0.2s ease'
    }}>
      {/* Header do card */}
      <div
        onClick={onToggleExpand}
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: isActive
                ? 'linear-gradient(145deg, rgba(46, 204, 113, 0.15) 0%, rgba(46, 204, 113, 0.05) 100%)'
                : 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isActive ? '1px solid rgba(46, 204, 113, 0.25)' : '1px solid rgba(212, 175, 55, 0.2)',
              flexShrink: 0
            }}>
              <div style={{ width: '18px', height: '18px', color: isActive ? '#2ecc71' : '#D4AF37' }}>
                <Icons.ListMusic />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {repertorio.nome}
                </h3>
                {isActive && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71',
                    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                    flexShrink: 0
                  }}>
                    Ativo
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px',
                fontSize: '12px', color: 'var(--text-muted)', }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px' }}><Icons.Music /></div>
                  {repertorio.total_partituras || 0} músicas
                </span>
                {repertorio.data_apresentacao && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px' }}><Icons.Calendar /></div>
                    {formatDate(repertorio.data_apresentacao)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '12px' }} onClick={e => e.stopPropagation()}>
          {!isActive && onActivate && (
            <button
              onClick={onActivate}
              title="Ativar repertório"
              className="btn-success-hover"
              style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.25)',
                color: '#2ecc71', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          )}
          {isActive && onDeactivate && (
            <button
              onClick={onDeactivate}
              title="Desativar repertório"
              style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.3)',
                color: '#f39c12', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          )}
          <button
            onClick={onDuplicate}
            title="Duplicar"
            className="btn-icon-hover"
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
          >
            <div style={{ width: '14px', height: '14px' }}><Icons.Copy /></div>
          </button>
          <button
            onClick={onEdit}
            title="Editar"
            className="btn-info-hover"
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.25)',
              color: '#3498db', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onGenerateCard}
            title="Compartilhar Repertório"

            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'rgba(114, 47, 55, 0.15)', border: '1px solid rgba(212,175,55,0.2)',
              color: '#D4AF37', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',

            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            title="Excluir"
            className="btn-danger-hover"
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.25)',
              color: '#e74c3c', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          {/* Seta expandir */}
          <div
            onClick={onToggleExpand}
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <div style={{ width: '16px', height: '16px' }}><Icons.ChevronDown /></div>
          </div>
        </div>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 20px',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            marginTop: '16px', marginBottom: '12px',
            }}>
            Músicas do repertório
          </p>
          {!partituras ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            </div>
          ) : partituras.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
              Nenhuma música adicionada
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {partituras.map((p, i) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  className={draggedIndex !== i && dragOverIndex !== i ? 'draggable-item-hover' : ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px',
                    background: draggedIndex === i
                      ? 'rgba(212, 175, 55, 0.1)'
                      : dragOverIndex === i
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'var(--bg-primary)',
                    borderRadius: '10px',
                    border: dragOverIndex === i
                      ? '1.5px dashed #D4AF37'
                      : '1px solid var(--border)',
                    cursor: 'grab',
                    opacity: draggedIndex === i ? 0.5 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Drag handle */}
                  <div style={{ width: '14px', height: '14px', color: 'var(--text-muted)', flexShrink: 0, opacity: 0.5 }}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </div>

                  {/* Número */}
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '8px',
                    background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
                    color: '#D4AF37', fontSize: '11px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, }}>
                    {i + 1}
                  </span>

                  {/* Título */}
                  <span style={{
                    fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    flex: 1, }}>
                    {p.titulo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== Componentes de Modal =====

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box'
};

const focusInput = (e) => {
  e.target.style.borderColor = '#D4AF37';
  e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
};
const blurInput = (e) => {
  e.target.style.borderColor = 'var(--border)';
  e.target.style.boxShadow = 'none';
};

const ModalBackdrop = ({ onClose }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
    zIndex: 1000, animation: 'fadeIn 0.2s ease'
  }} />
);

const ModalHeader = ({ title, subtitle, onClose }) => (
  <div style={{
    padding: '20px 24px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: 'linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(212,175,55,0.25)', flexShrink: 0
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
      </div>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>
      </div>
    </div>
    <button onClick={onClose} style={{
      width: '30px', height: '30px', borderRadius: '50%',
      background: 'var(--bg-primary)', border: '1px solid var(--border)',
      color: 'var(--text-muted)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
);

const ActiveToggle = ({ value, onChange }) => (
  <div onClick={onChange} style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
    background: value ? 'rgba(46,204,113,0.08)' : 'var(--bg-primary)',
    border: value ? '1.5px solid rgba(46,204,113,0.3)' : '1.5px solid var(--border)',
    transition: 'all 0.2s'
  }}>
    <div style={{
      width: '40px', height: '22px', borderRadius: '11px', flexShrink: 0,
      background: value ? 'linear-gradient(135deg,#2ecc71,#27ae60)' : 'var(--bg-secondary)',
      border: value ? 'none' : '1px solid var(--border)',
      position: 'relative', transition: 'all 0.3s'
    }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '2px',
        left: value ? '20px' : '2px',
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
      }} />
    </div>
    <div>
      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
        Definir como repertório ativo
      </span>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '1px 0 0' }}>
        {value ? 'O repertório anterior será arquivado' : 'Ativar para exibição imediata'}
      </p>
    </div>
  </div>
);

const SaveButton = ({ saving, disabled, onClick, label }) => (
  <button onClick={onClick} disabled={saving || disabled} style={{
    flex: 2, padding: '13px 20px', borderRadius: '10px', border: 'none',
    background: saving || disabled
      ? 'linear-gradient(135deg,rgba(212,175,55,0.4),rgba(184,134,11,0.4))'
      : 'linear-gradient(135deg,#D4AF37,#B8860B)',
    color: '#fff', fontSize: '14px', fontWeight: '600',
    cursor: saving || disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: saving || disabled ? 'none' : '0 4px 12px rgba(212,175,55,0.3)'
  }}>
    {saving ? (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
        </svg>
        Salvando...
      </>
    ) : label}
  </button>
);

// Modal simples — só para EDITAR
const ModalSimples = ({ form, setForm, saving, onClose, onSave }) => (
  <>
    <ModalBackdrop onClose={onClose} />
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      width: '100%', maxWidth: '460px', background: 'var(--bg-card)',
      borderRadius: '18px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      zIndex: 1001, overflow: 'hidden',
      animation: 'scaleIn 0.25s cubic-bezier(0.4,0,0.2,1)',
      border: '1px solid rgba(212,175,55,0.15)'
    }}>
      <ModalHeader title="Editar Repertório" subtitle="Altere as informações abaixo" onClose={onClose} />
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Nome</label>
          <input type="text" value={form.nome} autoFocus
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Ex: Apresentação 7 de Setembro"
            style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Data da Apresentação</label>
          <input type="date" value={form.data_apresentacao}
            onChange={(e) => setForm({ ...form, data_apresentacao: e.target.value })}
            style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
        </div>
        <ActiveToggle value={form.ativo} onChange={() => setForm({ ...form, ativo: !form.ativo })} />
      </div>
      <div style={{ padding: '0 24px 20px', display: 'flex', gap: '10px' }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '13px', borderRadius: '10px',
          border: '1.5px solid var(--border)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
        }}>Cancelar</button>
        <SaveButton saving={saving} disabled={!form.nome.trim()} onClick={onSave} label="Salvar Alterações" />
      </div>
    </div>
  </>
);

// Modal de criação — com seleção de músicas
const ModalCriar = ({
  form, setForm, saving, allPartituras, loadingPartituras,
  selectedIds, setSelectedIds, partituraSearch, setPartituraSearch,
  onClose, onSave
}) => {
  const filtradas = allPartituras.filter(p =>
    p.titulo?.toLowerCase().includes(partituraSearch.toLowerCase()) ||
    p.compositor?.toLowerCase().includes(partituraSearch.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtradas.length && filtradas.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtradas.map(p => p.id));
    }
  };

  return (
    <>
      <ModalBackdrop onClose={onClose} />
      <style>{`
        .modal-criar {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: calc(100% - 32px); max-width: 920px; height: 68vh; min-height: 480px;
          background: var(--bg-card); border-radius: 18px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          z-index: 1001; display: flex; flex-direction: column;
          animation: scaleIn 0.25s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid rgba(212,175,55,0.15);
        }
        .modal-criar-body {
          display: flex; flex: 1; overflow: hidden;
        }
        .modal-criar-info {
          width: 300px; flex-shrink: 0; padding: 20px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 14px;
          overflow-y: auto;
        }
        .modal-criar-lista {
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
        }
        @media (max-width: 600px) {
          .modal-criar {
            width: 100%; height: 100%; max-width: 100%;
            border-radius: 0; top: 0; left: 0; transform: none;
            min-height: unset;
          }
          .modal-criar-body {
            flex-direction: column;
          }
          .modal-criar-info {
            width: 100%; border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 14px 16px; gap: 10px; flex-shrink: 0;
          }
          .modal-criar-info-row {
            flex-direction: column !important;
          }
        }
      `}</style>

      <div className="modal-criar">
        <ModalHeader title="Novo Repertório" subtitle="Defina as informações e selecione as músicas" onClose={onClose} />

        <div className="modal-criar-body">
          {/* Painel esquerdo — informações */}
          <div className="modal-criar-info">
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome *</label>
              <input type="text" value={form.nome} autoFocus
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Apresentação 7 de Setembro"
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div className="modal-criar-info-row" style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data</label>
                <input type="date" value={form.data_apresentacao}
                  onChange={(e) => setForm({ ...form, data_apresentacao: e.target.value })}
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>

            <ActiveToggle value={form.ativo} onChange={() => setForm({ ...form, ativo: !form.ativo })} />

            {/* Contador de selecionadas — fica no fundo */}
            <div style={{ flex: 1 }} />
            <div style={{
              padding: '12px 14px', borderRadius: '10px',
              background: selectedIds.length > 0 ? 'rgba(212,175,55,0.08)' : 'var(--bg-secondary)',
              border: selectedIds.length > 0 ? '1px solid rgba(212,175,55,0.25)' : '1px solid var(--border)',
              transition: 'all 0.2s'
            }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: selectedIds.length > 0 ? '#D4AF37' : 'var(--text-muted)' }}>
                {selectedIds.length > 0
                  ? `${selectedIds.length} música${selectedIds.length !== 1 ? 's' : ''} selecionada${selectedIds.length !== 1 ? 's' : ''}`
                  : 'Nenhuma música selecionada'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                Selecione na lista ao lado
              </p>
            </div>
          </div>

          {/* Painel direito — lista de músicas */}
          <div className="modal-criar-lista">
            {/* Busca */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Buscar por título ou compositor..."
                  value={partituraSearch}
                  onChange={(e) => setPartituraSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '36px', fontSize: '13px' }}
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>

            {/* Barra de contagem + selecionar todas */}
            {!loadingPartituras && filtradas.length > 0 && (
              <div style={{
                padding: '7px 14px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
                background: 'var(--bg-secondary)'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {filtradas.length} música{filtradas.length !== 1 ? 's' : ''}
                </span>
                <button onClick={toggleAll} style={{
                  fontSize: '11px', color: '#D4AF37', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: '600', padding: '2px 6px'
                }}>
                  {selectedIds.length === filtradas.length && filtradas.length > 0 ? 'Desmarcar todas' : 'Selecionar todas'}
                </button>
              </div>
            )}

            {/* Lista scrollável */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingPartituras ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: '13px' }}>Carregando músicas...</span>
                </div>
              ) : filtradas.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  {partituraSearch ? 'Nenhuma música encontrada' : 'Nenhuma música disponível'}
                </div>
              ) : (
                <div style={{ padding: '6px 8px' }}>
                  {filtradas.map((p) => {
                    const selected = selectedIds.includes(p.id);
                    return (
                      <div key={p.id} onClick={() => toggleSelect(p.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', borderRadius: '8px',
                        cursor: 'pointer', transition: 'background 0.12s',
                        background: selected ? 'rgba(212,175,55,0.08)' : 'transparent',
                        border: selected ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                        marginBottom: '2px'
                      }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                          background: selected ? 'linear-gradient(135deg,#D4AF37,#B8860B)' : 'var(--bg-primary)',
                          border: selected ? 'none' : '1.5px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                        }}>
                          {selected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            margin: 0, fontSize: '13px', fontWeight: '500',
                            color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>{p.titulo}</p>
                          {p.compositor && (
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.compositor}
                            </p>
                          )}
                        </div>
                        {p.categoria_nome && (
                          <span style={{
                            fontSize: '10px', padding: '2px 7px', borderRadius: '5px',
                            background: 'var(--bg-primary)', color: 'var(--text-muted)',
                            flexShrink: 0, border: '1px solid var(--border)', whiteSpace: 'nowrap'
                          }}>{p.categoria_nome}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: '10px', background: 'var(--bg-secondary)', flexShrink: 0
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: '10px',
            border: '1.5px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>Cancelar</button>
          <SaveButton
            saving={saving}
            disabled={!form.nome.trim()}
            onClick={onSave}
            label={`Criar Repertório${selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}`}
          />
        </div>
      </div>
    </>
  );
};

export default AdminRepertorio;
