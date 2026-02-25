// ===== PARTES DRAWER =====
// Drawer lateral para gerenciar partes individuais de uma partitura

import { useState, useEffect, useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';

const PartesDrawer = ({ isOpen, onClose, partitura, categorias, onUpdate }) => {
  const { showToast } = useUI();
  const [partes, setPartes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // ID da parte sendo substituída
  const [deleting, setDeleting] = useState(null); // ID da parte sendo deletada
  const [renaming, setRenaming] = useState(null); // ID da parte sendo renomeada
  const [renameValue, setRenameValue] = useState(''); // Novo nome do instrumento
  const [renamingSaving, setRenamingSaving] = useState(false); // Estado de loading do rename
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPartInstrumento, setNewPartInstrumento] = useState('');
  const [addingPart, setAddingPart] = useState(false);
  const addFileInputRef = useRef(null);

  const loadPartes = async () => {
    setLoading(true);
    try {
      const data = await API.getPartesPartitura(partitura.id);
      setPartes(data || []);
    } catch {
      showToast('Erro ao carregar partes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Carrega partes quando abrir
  useEffect(() => {
    if (isOpen && partitura?.id) {
      loadPartes();
    } else {
      setPartes([]);
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, partitura?.id]);

  // Substituir parte
  const handleReplacePart = async (parteId, file) => {
    if (!file) return;

    setUploading(parteId);
    try {
      const formData = new FormData();
      formData.append('arquivo', file);

      await API.replacePartePartitura(partitura.id, parteId, formData);
      showToast('Parte substituída com sucesso!');
      loadPartes();
      onUpdate?.();
    } catch (err) {
      showToast(err.message || 'Erro ao substituir parte', 'error');
    } finally {
      setUploading(null);
    }
  };

  // Deletar parte
  const handleDeletePart = async (parteId) => {
    if (!confirm('Remover esta parte da partitura?')) return;

    setDeleting(parteId);
    try {
      await API.deletePartePartitura(partitura.id, parteId);
      showToast('Parte removida com sucesso!');
      loadPartes();
      onUpdate?.();
    } catch (err) {
      showToast(err.message || 'Erro ao remover parte', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // Renomear instrumento da parte
  const handleRenamePart = async (parteId) => {
    if (renamingSaving) return; // Prevenir chamadas duplicadas
    if (!renameValue.trim()) {
      showToast('Nome do instrumento não pode ser vazio', 'error');
      return;
    }

    setRenamingSaving(true);
    try {
      await API.renomearPartePartitura(parteId, renameValue.trim());
      showToast(`Instrumento renomeado para "${renameValue.trim()}"!`);
      setRenaming(null);
      setRenameValue('');
      loadPartes();
      onUpdate?.();
    } catch (err) {
      showToast(err.message || 'Erro ao renomear parte', 'error');
    } finally {
      setRenamingSaving(false);
    }
  };

  // Adicionar nova parte
  const handleAddPart = async (file) => {
    if (!file || !newPartInstrumento.trim()) {
      showToast('Selecione um arquivo e informe o instrumento', 'error');
      return;
    }

    setAddingPart(true);
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('instrumento', newPartInstrumento.trim());

      await API.addPartePartitura(partitura.id, formData);
      showToast('Parte adicionada com sucesso!');
      setShowAddForm(false);
      setNewPartInstrumento('');
      loadPartes();
      onUpdate?.();
    } catch (err) {
      showToast(err.message || 'Erro ao adicionar parte', 'error');
    } finally {
      setAddingPart(false);
    }
  };

  // Abrir PDF em nova aba
  const handleViewPart = (parte) => {
    const url = API.getDownloadUrl(partitura.id, parte.instrumento);
    window.open(url, '_blank');
  };

  const categoria = categorias?.find(c => c.id === partitura?.categoria_id);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '450px',
        background: 'var(--bg-card)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Outfit, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <CategoryIcon categoryId={categoria?.id || partitura?.categoria_id} size={24} color="#D4AF37" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                  {partitura?.titulo}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {partitura?.compositor} {categoria && `• ${categoria.nome}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              {partes.length} parte(s)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {partitura?.downloads || 0} downloads
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              <p style={{ marginTop: '12px' }}>Carregando partes...</p>
            </div>
          ) : partes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '12px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p>Nenhuma parte encontrada</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Adicione uma parte usando o botão abaixo</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {partes.map((parte) => (
                <div
                  key={parte.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      flexShrink: 0
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {renaming === parte.id ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenamePart(parte.id);
                              if (e.key === 'Escape') { setRenaming(null); setRenameValue(''); }
                            }}
                            autoFocus
                            disabled={renamingSaving}
                            style={{
                              flex: 1,
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1.5px solid rgba(212, 175, 55, 0.5)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              fontFamily: 'Outfit, sans-serif',
                              outline: 'none',
                              minWidth: 0,
                              opacity: renamingSaving ? 0.6 : 1
                            }}
                          />
                          <button
                            onClick={() => handleRenamePart(parte.id)}
                            title="Confirmar"
                            disabled={renamingSaving}
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '6px',
                              background: renamingSaving ? 'rgba(39, 174, 96, 0.05)' : 'rgba(39, 174, 96, 0.15)',
                              border: '1px solid rgba(39, 174, 96, 0.3)',
                              color: '#27ae60',
                              cursor: renamingSaving ? 'wait' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {renamingSaving ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => { setRenaming(null); setRenameValue(''); }}
                            title="Cancelar"
                            disabled={renamingSaving}
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '6px',
                              background: 'rgba(231, 76, 60, 0.1)',
                              border: '1px solid rgba(231, 76, 60, 0.3)',
                              color: '#e74c3c',
                              cursor: renamingSaving ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                              opacity: renamingSaving ? 0.5 : 1
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div style={{
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {parte.instrumento}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {parte.nome_arquivo || 'PDF'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {/* Renomear */}
                    <button
                      onClick={() => {
                        setRenaming(parte.id);
                        setRenameValue(parte.instrumento);
                      }}
                      title="Renomear instrumento"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        background: 'rgba(52, 152, 219, 0.1)',
                        border: '1px solid rgba(52, 152, 219, 0.3)',
                        color: '#3498db',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    {/* Visualizar */}
                    <button
                      onClick={() => handleViewPart(parte)}
                      title="Visualizar PDF"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Substituir */}
                    <label
                      title="Substituir PDF"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#D4AF37',
                        cursor: uploading === parte.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {uploading === parte.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleReplacePart(parte.id, e.target.files[0]);
                          }
                          e.target.value = '';
                        }}
                        disabled={uploading === parte.id}
                      />
                    </label>

                    {/* Deletar */}
                    <button
                      onClick={() => handleDeletePart(parte.id)}
                      disabled={deleting === parte.id}
                      title="Remover parte"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                        color: '#e74c3c',
                        cursor: deleting === parte.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {deleting === parte.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Add Part */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-secondary)'
        }}>
          {showAddForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Nome do instrumento (ex: Clarinete Bb 1)"
                value={newPartInstrumento}
                onChange={(e) => setNewPartInstrumento(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'Outfit, sans-serif',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setShowAddForm(false); setNewPartInstrumento(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  Cancelar
                </button>
                <label
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: newPartInstrumento.trim() && !addingPart
                      ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
                      : 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(184, 134, 11, 0.5) 100%)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: newPartInstrumento.trim() && !addingPart ? 'pointer' : 'not-allowed',
                    fontFamily: 'Outfit, sans-serif',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {addingPart ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Selecionar PDF
                    </>
                  )}
                  <input
                    ref={addFileInputRef}
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleAddPart(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                    disabled={!newPartInstrumento.trim() || addingPart}
                  />
                </label>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1.5px dashed var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar nova parte
            </button>
          )}
        </div>

        {/* Estilos */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default PartesDrawer;
