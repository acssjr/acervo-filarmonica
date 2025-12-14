// ===== REPERTORIO SCREEN =====
// Tela de repertório com download em lote
// Músicos veem o repertório ativo e podem baixar suas partes

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { API } from '@services/api';
import Storage from '@services/storage';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import EmptyState from '@components/common/EmptyState';

// ============ MODAL DE DOWNLOAD ============
// Usa o mesmo padrão do SheetDetailModal (compacto, no estilo bottom-sheet)
const DownloadModal = ({
  isOpen,
  onClose,
  sheets,
  instruments,
  userInstrument,
  downloading,
  onDownload
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState(userInstrument || '');
  const [selectedIds, setSelectedIds] = useState(new Set(sheets.map(s => s.id)));
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Detectar desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset quando abre
  useEffect(() => {
    if (isOpen) {
      setSelectedInstrument(''); // Começa sem instrumento selecionado para mostrar os dois botões
      setSelectedIds(new Set(sheets.map(s => s.id)));
      setShowInstrumentPicker(false);
    }
  }, [isOpen, sheets]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => setSelectedIds(new Set(sheets.map(s => s.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const allSelected = selectedIds.size === sheets.length;

  const handleDownload = (formato) => {
    onDownload(formato, selectedInstrument, Array.from(selectedIds));
  };

  const handleSelectInstrument = (inst) => {
    setSelectedInstrument(inst);
    setShowInstrumentPicker(false);
  };

  if (!isOpen) return null;

  // Filtrar instrumentos (sem Grade para download em lote)
  const filteredInstruments = instruments.filter(i => i.toLowerCase() !== 'grade');

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000
        }}
      />

      {/* Modal - desktop centralizado, mobile bottom-sheet */}
      <div style={{
        position: 'fixed',
        ...(isDesktop ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxWidth: '90vw',
          borderRadius: '20px',
          maxHeight: '70vh'
        } : {
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '24px 24px 0 0',
          maxHeight: '80vh'
        }),
        background: 'var(--bg-card)',
        zIndex: 2001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: isDesktop ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 -10px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Handle - apenas mobile */}
        {!isDesktop && (
          <div style={{
            width: '40px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            margin: '12px auto 8px',
            flexShrink: 0
          }} />
        )}

        {/* Header */}
        <div style={{
          padding: isDesktop ? '20px 20px 16px' : '0 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: '700',
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text-primary)'
          }}>
            Baixar Partituras
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '16px', height: '16px' }}><Icons.Close /></div>
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div style={{
          padding: '0 20px 20px',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* Seção: Instrumento */}
          <p style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginBottom: '8px',
            fontFamily: 'Outfit, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>Instrumento</p>

          {/* Estado 1: Mostrar botões Meu Instrumento + Outro Instrumento */}
          {!showInstrumentPicker && !selectedInstrument && userInstrument && (
            <>
              {/* Botão Meu Instrumento */}
              <button
                onClick={() => handleSelectInstrument(userInstrument)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                  border: 'none',
                  color: '#F4E4BC',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  boxShadow: '0 4px 12px rgba(114, 47, 55, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px' }}><Icons.Download /></div>
                  <span>Meu Instrumento</span>
                </div>
                <span style={{
                  background: 'rgba(244, 228, 188, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}>{userInstrument}</span>
              </button>

              {/* Botão Outro Instrumento */}
              <button
                onClick={() => setShowInstrumentPicker(true)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px' }}><Icons.Music /></div>
                  <span>Outro Instrumento</span>
                </div>
                <div style={{ width: '16px', height: '16px' }}><Icons.ChevronDown /></div>
              </button>
            </>
          )}

          {/* Estado 2: Instrumento já selecionado - mostrar qual e permitir trocar */}
          {!showInstrumentPicker && selectedInstrument && (
            <button
              onClick={() => setShowInstrumentPicker(true)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                border: 'none',
                color: '#F4E4BC',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                boxShadow: '0 4px 12px rgba(114, 47, 55, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px' }}><Icons.Music /></div>
                <span>{selectedInstrument}</span>
              </div>
              <span style={{
                background: 'rgba(244, 228, 188, 0.2)',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700'
              }}>
                {selectedInstrument === userInstrument ? 'MEU' : 'ALTERAR'}
              </span>
            </button>
          )}

          {/* Estado 3: Lista de instrumentos aberta (picker) */}
          {showInstrumentPicker && (
            <>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                maxHeight: '180px',
                overflowY: 'auto',
                marginBottom: '8px'
              }}>
                {filteredInstruments.map((inst, idx) => {
                  const isUserInst = inst === userInstrument;
                  return (
                    <button
                      key={inst}
                      onClick={() => handleSelectInstrument(inst)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: idx < filteredInstruments.length - 1 ? '1px solid var(--border)' : 'none',
                        color: isUserInst ? 'var(--accent)' : 'var(--text-primary)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '13px',
                        fontWeight: isUserInst ? '600' : '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <span>{inst}</span>
                      {isUserInst && (
                        <span style={{
                          fontSize: '9px',
                          background: 'rgba(212,175,55,0.2)',
                          color: 'var(--accent)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '700'
                        }}>MEU</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Botão voltar */}
              <button
                onClick={() => setShowInstrumentPicker(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ width: '14px', height: '14px', transform: 'rotate(90deg)' }}>
                  <Icons.ChevronDown />
                </div>
                Voltar
              </button>
            </>
          )}

          {/* Estado 4: Usuário não tem instrumento definido - mostrar lista direto */}
          {!showInstrumentPicker && !selectedInstrument && !userInstrument && (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              maxHeight: '180px',
              overflowY: 'auto',
              marginBottom: '14px'
            }}>
              {filteredInstruments.map((inst, idx) => (
                <button
                  key={inst}
                  onClick={() => handleSelectInstrument(inst)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: idx < filteredInstruments.length - 1 ? '1px solid var(--border)' : 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {inst}
                </button>
              ))}
            </div>
          )}

          {/* Seção: Partituras (só aparece quando tem instrumento selecionado e picker fechado) */}
          {selectedInstrument && !showInstrumentPicker && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <p style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  margin: 0,
                  fontFamily: 'Outfit, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '600'
                }}>Partituras ({selectedIds.size}/{sheets.length})</p>
                <button
                  onClick={allSelected ? deselectAll : selectAll}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  {allSelected ? 'Desmarcar' : 'Todas'}
                </button>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                maxHeight: '150px',
                overflowY: 'auto',
                marginBottom: '16px'
              }}>
                {sheets.map((sheet, idx) => {
                  const isSelected = selectedIds.has(sheet.id);
                  return (
                    <button
                      key={sheet.id}
                      onClick={() => toggleSelection(sheet.id)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: idx < sheets.length - 1 ? '1px solid var(--border)' : 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'left'
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: `2px solid ${isSelected ? '#D4AF37' : 'rgba(255,255,255,0.3)'}`,
                        background: isSelected ? '#D4AF37' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isSelected && (
                          <div style={{ width: '10px', height: '10px', color: '#fff' }}>
                            <Icons.Check />
                          </div>
                        )}
                      </div>
                      <span style={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: '500'
                      }}>
                        {idx + 1}. {sheet.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botões de download */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={selectedIds.size === 0 || downloading}
                  style={{
                    flex: '1 1 45%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: selectedIds.size > 0 ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' : 'var(--bg-secondary)',
                    color: selectedIds.size > 0 ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: selectedIds.size > 0 ? '0 4px 12px rgba(212, 175, 55, 0.3)' : 'none'
                  }}
                >
                  {downloading ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <div style={{ width: '16px', height: '16px' }}><Icons.File /></div>
                  )}
                  PDF
                </button>

                <button
                  onClick={() => handleDownload('zip')}
                  disabled={selectedIds.size === 0 || downloading}
                  style={{
                    flex: '1 1 45%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: selectedIds.size > 0 ? '#9b59b6' : 'var(--bg-secondary)',
                    color: selectedIds.size > 0 ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: selectedIds.size > 0 ? '0 4px 12px rgba(155, 89, 182, 0.3)' : 'none'
                  }}
                >
                  <div style={{ width: '16px', height: '16px' }}><Icons.Archive /></div>
                  ZIP
                </button>

                <button
                  onClick={() => handleDownload('print')}
                  disabled={selectedIds.size === 0 || downloading}
                  style={{
                    flex: '1 1 100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: selectedIds.size > 0 ? '#3498db' : 'var(--bg-secondary)',
                    color: selectedIds.size > 0 ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: selectedIds.size > 0 ? '0 4px 12px rgba(52, 152, 219, 0.3)' : 'none'
                  }}
                >
                  <div style={{ width: '16px', height: '16px' }}><Icons.Printer /></div>
                  Imprimir Tudo
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

// ============ COMPONENTE PRINCIPAL ============
const RepertorioScreen = () => {
  const { user } = useAuth();
  const { showToast, setSelectedSheet } = useUI();
  const { favorites, toggleFavorite, categoriesMap } = useData();

  const [repertorio, setRepertorio] = useState(null);
  const [repertorioInstrumentos, setRepertorioInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Carregar repertório ativo e seus instrumentos
  const loadRepertorio = async () => {
    setLoading(true);
    try {
      const data = await API.getRepertorioAtivo();
      setRepertorio(data);

      // Carregar instrumentos reais das partes do repertório
      if (data?.id) {
        const instrumentos = await API.getRepertorioInstrumentos(data.id);
        setRepertorioInstrumentos(instrumentos);
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      showToast(err.message || 'Erro ao carregar repertório', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRepertorio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler de download
  const handleDownload = async (formato, instrumento, partituraIds) => {
    if (!repertorio || !instrumento) return;

    setDownloading(true);
    const isPrint = formato === 'print';

    try {
      const url = API.getRepertorioDownloadUrl(
        repertorio.id,
        instrumento,
        isPrint ? 'pdf' : formato,
        partituraIds
      );

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Erro no download');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (isPrint) {
        // Abrir em nova janela para impressão
        const printWindow = window.open(blobUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
        showToast('Abrindo impressão...');
      } else {
        // Download normal
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1]
          || `Repertorio_${repertorio.nome}.${formato === 'zip' ? 'zip' : 'pdf'}`;

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        showToast('Download iniciado!');
      }

      setShowDownloadModal(false);
    } catch (err) {
      console.error('Erro no download:', err);
      showToast(err.message || 'Erro no download', 'error');
    }

    setDownloading(false);
  };

  // Handler para remover do repertório (admin)
  const handleRemoveFromRepertorio = async (partituraId) => {
    if (!user?.admin || !repertorio) return;

    try {
      await API.removePartituraFromRepertorio(repertorio.id, partituraId);
      showToast('Partitura removida do repertório');
      loadRepertorio();
    } catch (err) {
      showToast(err.message || 'Erro ao remover', 'error');
    }
  };

  // Converter partituras para formato simplificado
  const sheets = useMemo(() => {
    if (!repertorio?.partituras) return [];
    return repertorio.partituras.map(p => ({
      id: p.id,
      title: p.titulo,
      composer: p.compositor,
      category: p.categoria_id
    }));
  }, [repertorio]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(212, 175, 55, 0.2)',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!repertorio) {
    return (
      <div>
        <Header title="Repertório" subtitle="Próxima apresentação" />
        <EmptyState
          icon={Icons.ListMusic}
          title="Nenhum repertório definido"
          subtitle="O regente ainda não definiu o repertório da próxima apresentação"
        />
      </div>
    );
  }

  return (
    <div>
      <Header
        title={repertorio.nome}
        subtitle={`${repertorio.partituras?.length || 0} música${(repertorio.partituras?.length || 0) !== 1 ? 's' : ''}`}
      />

      {/* Ações */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        {/* Data da apresentação */}
        {repertorio.data_apresentacao && (
          <p style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '0 0 12px 0'
          }}>
            <span style={{ width: '16px', height: '16px' }}><Icons.Calendar /></span>
            {new Date(repertorio.data_apresentacao).toLocaleDateString('pt-BR')}
          </p>
        )}

        {/* Botão centralizado */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setShowDownloadModal(true)}
            disabled={!repertorio.partituras?.length}
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
              fontWeight: '700',
              cursor: 'pointer',
              opacity: repertorio.partituras?.length ? 1 : 0.5,
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}><Icons.Archive /></div>
            Baixar Tudo
          </button>
        </div>
      </div>

      {/* Lista de partituras */}
      {sheets.length === 0 ? (
        <EmptyState
          icon={Icons.Music}
          title="Repertório vazio"
          subtitle="Nenhuma partitura adicionada ainda"
        />
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sheets.map((sheet, index) => {
            const category = categoriesMap.get(sheet.category);
            return (
              <div
                key={sheet.id}
                onClick={() => setSelectedSheet(sheet)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent'
                }}
              >
                {/* Número da ordem */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>

                {/* Título, compositor e tag de categoria */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {sheet.title}
                    </p>
                    {category && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        color: 'var(--accent)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        {category.name}
                      </span>
                    )}
                  </div>
                  {sheet.composer && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {sheet.composer}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(sheet.id); }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: favorites.includes(sheet.id) ? '#e74c3c' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '18px', height: '18px' }}>
                      <Icons.Heart filled={favorites.includes(sheet.id)} />
                    </div>
                  </button>

                  {user?.admin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromRepertorio(sheet.id); }}
                      title="Remover do repertório"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ width: '16px', height: '16px' }}>
                        <Icons.Close />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Download */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        sheets={sheets}
        instruments={repertorioInstrumentos}
        userInstrument={user?.instrumento}
        downloading={downloading}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default RepertorioScreen;
