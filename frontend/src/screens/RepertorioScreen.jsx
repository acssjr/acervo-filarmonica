// ===== REPERTORIO SCREEN =====
// Tela de repertório com download em lote
// Músicos veem o repertório ativo e podem baixar suas partes

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { API } from '@services/api';
import Storage from '@services/storage';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import EmptyState from '@components/common/EmptyState';
import CompartilharCardModal from '@components/CompartilharCardModal';

// ============ SKELETON LOADING ============
const RepertorioSkeleton = () => (
  <div>
    {/* Header skeleton */}
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{
        width: '160px',
        height: '24px',
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '6px',
        marginBottom: '8px'
      }} />
      <div style={{
        width: '100px',
        height: '16px',
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px'
      }} />
    </div>

    {/* Download button skeleton */}
    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '140px',
        height: '44px',
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '12px'
      }} />
    </div>

    {/* List skeleton */}
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px'
          }}
        >
          {/* Number circle */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: `${i * 0.1}s`,
            flexShrink: 0
          }} />
          {/* Text area */}
          <div style={{ flex: 1 }}>
            <div style={{
              width: `${70 + Math.random() * 30}%`,
              height: '14px',
              background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
              borderRadius: '4px',
              marginBottom: '6px'
            }} />
            <div style={{
              width: `${40 + Math.random() * 20}%`,
              height: '12px',
              background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
              borderRadius: '4px'
            }} />
          </div>
          {/* Action button */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: `${i * 0.1}s`
          }} />
        </div>
      ))}
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

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
  const { favoritesSet, toggleFavorite, categoriesMap } = useData();
  const [showCardModal, setShowCardModal] = useState(false);

  const [repertorio, setRepertorio] = useState(null);
  const [repertorioInstrumentos, setRepertorioInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Carregar repertório ativo (instrumentos são prefetched em background)
  const loadRepertorio = async () => {
    setLoading(true);
    try {
      const data = await API.getRepertorioAtivo();
      setRepertorio(data);
      setLoading(false); // Libera UI imediatamente após dados críticos

      // Prefetch instrumentos em background (non-blocking)
      if (data?.id) {
        API.getRepertorioInstrumentos(data.id)
          .then(setRepertorioInstrumentos)
          .catch(err => console.error('Prefetch instrumentos falhou:', err));
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      showToast(err.message || 'Erro ao carregar repertório', 'error');
      setLoading(false);
    }
  };

  // Recarregar instrumentos quando o modal abre (para refletir mudanças feitas no admin)
  const reloadInstrumentos = async () => {
    if (repertorio?.id) {
      try {
        const instrumentos = await API.getRepertorioInstrumentos(repertorio.id);
        setRepertorioInstrumentos(instrumentos);
      } catch (err) {
        console.error('Erro ao recarregar instrumentos:', err);
      }
    }
  };

  useEffect(() => {
    loadRepertorio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recarrega instrumentos sempre que o modal abre
  useEffect(() => {
    if (showDownloadModal) {
      reloadInstrumentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDownloadModal]);

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
    return <RepertorioSkeleton />;
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
        {/* Card de Data da Apresentação + Botão */}
        {repertorio.data_apresentacao && (() => {
          const [y, m, d] = repertorio.data_apresentacao.split('T')[0].split('-');
          const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
          const now = new Date();
          const dateUTC = Date.UTC(Number(y), Number(m) - 1, Number(d));
          const hojeUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
          const diffMs = dateUTC - hojeUTC;
          const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

          const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
          const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          const diaSemana = diasSemana[dateObj.getDay()];
          const mesNome = meses[dateObj.getMonth()];

          let countdownText = '';
          let countdownColor = '';
          if (diffDias < 0) {
            countdownText = `Há ${Math.abs(diffDias)} dia${Math.abs(diffDias) !== 1 ? 's' : ''}`;
            countdownColor = 'rgba(231, 76, 60, 0.15)';
          } else if (diffDias === 0) {
            countdownText = 'Hoje!';
            countdownColor = 'rgba(46, 204, 113, 0.2)';
          } else if (diffDias === 1) {
            countdownText = 'Amanhã!';
            countdownColor = 'rgba(241, 196, 15, 0.2)';
          } else if (diffDias <= 7) {
            countdownText = `Em ${diffDias} dias`;
            countdownColor = 'rgba(52, 152, 219, 0.15)';
          } else {
            countdownText = `Em ${diffDias} dias`;
            countdownColor = 'rgba(155, 89, 182, 0.12)';
          }
          const countdownTextColor = diffDias < 0 ? '#e74c3c' : diffDias === 0 ? '#2ecc71' : diffDias === 1 ? '#f1c40f' : diffDias <= 7 ? '#3498db' : '#9b59b6';

          return (
            <div style={{
              background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* Ícone calendário grande */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.08) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                  }}>{mesNome.substring(0, 3)}</span>
                <span style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  }}>{d}</span>
              </div>

              {/* Info da data */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {diaSemana}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  }}>
                  {`${d} de ${mesNome} de ${y}`}
                </p>
              </div>

              {/* Badge de countdown */}
              <span style={{
                padding: '5px 12px',
                borderRadius: '20px',
                background: countdownColor,
                color: countdownTextColor,
                fontSize: '12px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {countdownText}
              </span>
            </div>
          );
        })()}

        {/* Botão centralizado */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
          {user?.admin && (
          <button
            onClick={() => setShowCardModal(true)}
            disabled={!repertorio.partituras?.length}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)',
              color: '#F4E4BC',
              border: '1px solid rgba(212,175,55,0.2)',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              opacity: repertorio.partituras?.length ? 1 : 0.5,
              boxShadow: '0 4px 12px rgba(114,47,55,0.3)',
              fontFamily: 'inherit',
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
            Compartilhar Repertório
          </button>
          )}
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
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSheet(sheet)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  cursor: 'pointer',
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
                      color: favoritesSet.has(sheet.id) ? '#e74c3c' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '18px', height: '18px' }}>
                      <Icons.Heart filled={favoritesSet.has(sheet.id)} />
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
              </motion.div>
            );
          })}
        </div>
      )}

      {showCardModal && (
        <CompartilharCardModal
          repertorio={repertorio}
          onClose={() => setShowCardModal(false)}
        />
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
