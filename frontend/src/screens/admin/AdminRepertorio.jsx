// ===== ADMIN REPERTÓRIO =====
// Gerenciamento de repertórios (criar, editar, histórico)
// Design premium com glassmorphism e micro-animações

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
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
    <div className="page-transition" style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
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
            fontFamily: 'Outfit, sans-serif'
          }}>
            <div style={{ width: '24px', height: '24px' }}><Icons.ListMusic /></div>
            Repertório
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '6px 0 0',
            fontFamily: 'Outfit, sans-serif'
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
            fontFamily: 'Outfit, sans-serif',
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
          <p style={{ marginTop: '12px', fontFamily: 'Outfit, sans-serif' }}>Carregando repertórios...</p>
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
                fontFamily: 'Outfit, sans-serif'
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
                onToggleExpand={() => toggleExpand(activeRepertorio)}
                onReorder={(from, to) => handleMovePartitura(activeRepertorio.id, from, to)}
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>Nenhum repertório ativo</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 20px', fontFamily: 'Outfit, sans-serif' }}>Crie um repertório para organizar as músicas da próxima apresentação</p>
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
                    fontFamily: 'Outfit, sans-serif'
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
                  fontFamily: 'Outfit, sans-serif'
                }}>Histórico</h2>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-secondary)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontFamily: 'Outfit, sans-serif'
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
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal — Criar/Editar Repertório */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '480px',
            background: 'var(--bg-card)',
            borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            overflow: 'hidden',
            animation: 'scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(212, 175, 55, 0.15)'
          }}>
            {/* Header do Modal */}
            <div style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.25)'
                }}>
                  <div style={{ width: '20px', height: '20px', color: '#D4AF37' }}><Icons.ListMusic /></div>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    {editingRepertorio ? 'Editar Repertório' : 'Novo Repertório'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'Outfit, sans-serif' }}>
                    {editingRepertorio ? 'Altere as informações abaixo' : 'Preencha as informações do repertório'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Corpo */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Nome */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  Nome do Repertório
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Apresentação 7 de Setembro"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Descrição */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Data */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  Data da Apresentação
                </label>
                <input
                  type="date"
                  value={form.data_apresentacao}
                  onChange={(e) => setForm({ ...form, data_apresentacao: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Toggle Ativo */}
              <div
                onClick={() => setForm({ ...form, ativo: !form.ativo })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: form.ativo ? 'rgba(46, 204, 113, 0.08)' : 'var(--bg-primary)',
                  border: form.ativo ? '1.5px solid rgba(46, 204, 113, 0.3)' : '1.5px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Custom toggle */}
                <div style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: form.ativo
                    ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                    : 'var(--bg-secondary)',
                  border: form.ativo ? 'none' : '1px solid var(--border)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '2px',
                    left: form.ativo ? '22px' : '2px',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', fontFamily: 'Outfit, sans-serif' }}>
                    Definir como repertório ativo
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'Outfit, sans-serif' }}>
                    {form.ativo ? 'O repertório anterior será arquivado' : 'Ativar este repertório para exibição'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 28px 24px',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={closeModal}
                className="btn-ghost-hover"
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'Outfit, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.nome.trim()}
                className="btn-primary-hover"
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: saving || !form.nome.trim()
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)'
                    : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'Outfit, sans-serif',
                  cursor: saving || !form.nome.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: saving || !form.nome.trim() ? 'none' : '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
              >
                {saving ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {editingRepertorio ? 'Salvar Alterações' : 'Criar Repertório'}
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Estilos */}
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

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
                  fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {repertorio.nome}
                </h3>
                {isActive && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71',
                    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                    fontFamily: 'Outfit, sans-serif', flexShrink: 0
                  }}>
                    Ativo
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px',
                fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif'
              }}>
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
            fontFamily: 'Outfit, sans-serif'
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
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'Outfit, sans-serif', textAlign: 'center', padding: '16px' }}>
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
                    flexShrink: 0, fontFamily: 'Outfit, sans-serif'
                  }}>
                    {i + 1}
                  </span>

                  {/* Título */}
                  <span style={{
                    fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    flex: 1, fontFamily: 'Outfit, sans-serif'
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
