// ===== ADMIN REPERTÓRIO =====
// Gerenciamento de repertórios (criar, editar, histórico)

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { Icons } from '@constants/icons';

const AdminRepertorio = () => {
  const { showToast } = useUI();
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRepertorio, setEditingRepertorio] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '', data_apresentacao: '', ativo: false });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPartituras, setExpandedPartituras] = useState({});

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
  }, []);

  const openCreateModal = () => {
    setEditingRepertorio(null);
    setForm({ nome: '', descricao: '', data_apresentacao: '', ativo: true });
    setShowModal(true);
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
        await API.createRepertorio(form);
        showToast('Repertório criado!');
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

  const toggleExpand = async (rep) => {
    if (expandedId === rep.id) {
      setExpandedId(null);
    } else {
      setExpandedId(rep.id);
      // Carregar partituras se ainda não carregadas
      if (!expandedPartituras[rep.id]) {
        try {
          const data = await API.getRepertorio(rep.id);
          setExpandedPartituras(prev => ({
            ...prev,
            [rep.id]: data.partituras || []
          }));
        } catch (err) {
          showToast('Erro ao carregar partituras', 'error');
        }
      }
    }
  };

  // Mover partitura na ordem
  const handleMovePartitura = async (repertorioId, fromIndex, toIndex) => {
    const partituras = [...(expandedPartituras[repertorioId] || [])];
    if (toIndex < 0 || toIndex >= partituras.length) return;

    // Mover localmente primeiro (UI otimista)
    const [moved] = partituras.splice(fromIndex, 1);
    partituras.splice(toIndex, 0, moved);
    setExpandedPartituras(prev => ({
      ...prev,
      [repertorioId]: partituras
    }));

    // Salvar no backend
    try {
      const ordens = partituras.map((p, idx) => ({ partitura_id: p.id, ordem: idx }));
      await API.reorderRepertorioPartituras(repertorioId, ordens);
    } catch (err) {
      showToast('Erro ao reordenar', 'error');
      // Recarregar estado original em caso de erro
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
    <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>Repertório</h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '4px 0 0'
          }}>Gerencie os repertórios das apresentações</p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: '16px', height: '16px' }}><Icons.Plus /></div>
          Novo Repertório
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Carregando...
        </div>
      ) : (
        <>
          {/* Repertorio Ativo */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#2ecc71'
              }} />
              Repertório Ativo
            </h2>

            {activeRepertorio ? (
              <RepertorioCard
                repertorio={activeRepertorio}
                partituras={expandedPartituras[activeRepertorio.id]}
                isActive
                isExpanded={expandedId === activeRepertorio.id}
                onEdit={() => openEditModal(activeRepertorio)}
                onDelete={() => handleDelete(activeRepertorio.id)}
                onDuplicate={() => handleDuplicate(activeRepertorio.id)}
                onToggleExpand={() => toggleExpand(activeRepertorio)}
                onReorder={(from, to) => handleMovePartitura(activeRepertorio.id, from, to)}
              />
            ) : (
              <div style={{
                padding: '32px',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <p>Nenhum repertório ativo</p>
                <button
                  onClick={openCreateModal}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#D4AF37',
                    cursor: 'pointer'
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
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ width: '16px', height: '16px' }}><Icons.Clock /></div>
                Histórico
              </h2>

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
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid var(--border)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {editingRepertorio ? 'Editar Repertório' : 'Novo Repertório'}
              </h3>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Apresentação 7 de Setembro"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Data da Apresentação
                </label>
                <input
                  type="date"
                  value={form.data_apresentacao}
                  onChange={(e) => setForm({ ...form, data_apresentacao: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={form.ativo}
                    onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    Definir como repertório ativo
                  </span>
                </label>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '30px' }}>
                  O repertório atual será arquivado
                </p>
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  color: '#fff',
                  cursor: saving ? 'wait' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  onToggleExpand,
  onReorder
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

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: isActive ? '2px solid rgba(46, 204, 113, 0.5)' : '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      {/* Header do card */}
      <div
        onClick={onToggleExpand}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {repertorio.nome}
            </h3>
            {isActive && (
              <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(46, 204, 113, 0.2)',
                color: '#2ecc71',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                Ativo
              </span>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '8px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '14px', height: '14px' }}><Icons.Music /></div>
              {repertorio.total_partituras || 0} músicas
            </span>
            {repertorio.data_apresentacao && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '14px', height: '14px' }}><Icons.Calendar /></div>
                {new Date(repertorio.data_apresentacao).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          {!isActive && onActivate && (
            <button
              onClick={onActivate}
              title="Ativar repertório"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(46, 204, 113, 0.1)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                color: '#2ecc71',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icons.Check />
            </button>
          )}
          <button
            onClick={onDuplicate}
            title="Duplicar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(155, 89, 182, 0.1)',
              border: '1px solid rgba(155, 89, 182, 0.3)',
              color: '#9b59b6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '14px', height: '14px' }}><Icons.Copy /></div>
          </button>
          <button
            onClick={onEdit}
            title="Editar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(52, 152, 219, 0.1)',
              border: '1px solid rgba(52, 152, 219, 0.3)',
              color: '#3498db',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            title="Excluir"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(231, 76, 60, 0.1)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              color: '#e74c3c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <div style={{
            width: '14px',
            height: '14px',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <Icons.ChevronDown />
          </div>
        </div>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 16px',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginTop: '16px',
            marginBottom: '12px'
          }}>
            Músicas do repertório
          </p>
          {!partituras ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Carregando...
            </p>
          ) : partituras.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Nenhuma música adicionada
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {partituras.map((p, i) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: draggedIndex === i
                      ? 'rgba(212, 175, 55, 0.1)'
                      : dragOverIndex === i
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: dragOverIndex === i
                      ? '2px dashed #D4AF37'
                      : '1px solid var(--border)',
                    cursor: 'grab',
                    opacity: draggedIndex === i ? 0.5 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Ícone de arrastar */}
                  <div style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="1.5"/>
                      <circle cx="15" cy="6" r="1.5"/>
                      <circle cx="9" cy="12" r="1.5"/>
                      <circle cx="15" cy="12" r="1.5"/>
                      <circle cx="9" cy="18" r="1.5"/>
                      <circle cx="15" cy="18" r="1.5"/>
                    </svg>
                  </div>

                  {/* Número */}
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#D4AF37',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {i + 1}
                  </span>

                  {/* Título */}
                  <span style={{
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}>
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

export default AdminRepertorio;
