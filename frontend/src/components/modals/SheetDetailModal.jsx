// ===== SHEET DETAIL MODAL =====
// Modal de detalhes da partitura com opcoes de download
// Suporta URL compartilhavel: /acervo/:categoria/:id

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { CATEGORIES } from '@constants/categories';
import { Icons } from '@constants/icons';
import { Storage } from '@services/storage';
import CategoryIcon from '@components/common/CategoryIcon';

const API_BASE_URL = 'https://acervo-filarmonica-api.acssjr.workers.dev';

const SheetDetailModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedSheet, setSelectedSheet, showToast } = useUI();
  const { favorites, toggleFavorite } = useData();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  const [confirmInstrument, setConfirmInstrument] = useState(null);
  const [partes, setPartes] = useState([]);
  const [loadingPartes, setLoadingPartes] = useState(false);
  const [showPartePicker, setShowPartePicker] = useState(false);
  const [partesDisponiveis, setPartesDisponiveis] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [selectedParte, setSelectedParte] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Buscar partes da partitura quando abrir o modal
  useEffect(() => {
    if (selectedSheet) {
      setShowInstrumentPicker(false);
      setConfirmInstrument(null);
      setShowPartePicker(false);
      setPartesDisponiveis([]);

      const fetchPartes = async () => {
        setLoadingPartes(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/partituras/${selectedSheet.id}/partes`);
          if (response.ok) {
            const data = await response.json();
            setPartes(data || []);
          } else {
            setPartes([]);
          }
        } catch (e) {
          console.error('Erro ao buscar partes:', e);
          setPartes([]);
        }
        setLoadingPartes(false);
      };

      fetchPartes();
    }
  }, [selectedSheet]);

  if (!selectedSheet) return null;

  const category = CATEGORIES.find(c => c.id === selectedSheet.category);
  const isFavorite = favorites.includes(selectedSheet.id);
  const userInstrument = user?.instrument || 'Trompete Bb';
  const isMaestro = userInstrument?.toLowerCase() === 'maestro';

  // Lista de instrumentos disponiveis
  const availableInstruments = partes.length > 0
    ? partes.map(p => p.instrumento)
    : [
      'Grade', 'Flautim', 'Flauta', 'Requinta',
      'Clarinete Bb', 'Clarinete Bb 1', 'Clarinete Bb 2',
      'Sax. Soprano', 'Sax. Alto', 'Sax. Alto 1', 'Sax. Alto 2',
      'Sax. Tenor', 'Sax. Tenor 1', 'Sax. Tenor 2', 'Sax. Baritono',
      'Trompete Bb', 'Trompete Bb 1', 'Trompete Bb 2',
      'Trompa F', 'Trompa Eb', 'Trompa Eb 1', 'Trompa Eb 2',
      'Baritono Bb', 'Baritono Bb 1', 'Baritono Bb 2',
      'Trombone', 'Trombone 1', 'Trombone 2',
      'Bombardino', 'Bombardino Bb',
      'Baixo Eb', 'Baixo Bb',
      'Caixa', 'Bombo', 'Pratos'
    ];

  // Encontra TODAS as partes correspondentes ao instrumento
  const findPartesCorrespondentes = (instrumento) => {
    if (!instrumento || partes.length === 0) return [];

    const instrLower = instrumento.toLowerCase();
    const instrBase = instrLower.replace(/\s*(bb|eb)?\s*\d*$/i, '').trim();

    const correspondentes = partes.filter(p => {
      const parteLower = p.instrumento.toLowerCase();
      const parteBase = parteLower.replace(/\s*(bb|eb)?\s*\d*$/i, '').trim();

      return parteLower === instrLower ||
        parteLower.startsWith(instrLower) ||
        parteBase === instrBase ||
        instrLower.startsWith(parteBase);
    });

    return correspondentes;
  };

  const findParteExata = (instrumento) => {
    return partes.find(p => p.instrumento.toLowerCase() === instrumento.toLowerCase());
  };

  // Funcao para salvar blob como arquivo
  const saveBlob = (blob, filename) => {
    // Metodo 1: msSaveBlob para IE/Edge legado
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, filename);
      return;
    }

    // Metodo 2: Criar link com blob URL
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Importante: adicionar ao DOM antes de clicar
    document.body.appendChild(link);

    // Usar setTimeout para garantir que o DOM foi atualizado
    setTimeout(() => {
      link.click();
      // Limpar apos um tempo maior
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 250);
    }, 0);
  };

  // Funcao de download direto
  const downloadParteDireta = async (parte) => {
    if (downloading) return;
    setDownloading(true);

    showToast(`Preparando "${selectedSheet.title}" - ${parte.instrumento}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/download/parte/${parte.id}`, {
        headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
      });

      if (response.ok) {
        // Extrair nome do arquivo do header Content-Disposition se disponivel
        let filename = `${selectedSheet.title} - ${parte.instrumento}.pdf`;
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }

        const blob = await response.blob();
        // Criar blob com tipo explicito para PDF
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });

        // Usar funcao de save dedicada
        saveBlob(pdfBlob, filename);

        showToast('Download iniciado!');
      } else {
        const error = await response.json().catch(() => ({}));
        showToast(error.error || 'Erro ao baixar arquivo', 'error');
      }
    } catch (e) {
      console.error('Erro no download:', e);
      showToast('Erro ao baixar arquivo', 'error');
    }

    setDownloading(false);
    setShowPartePicker(false);
    setConfirmInstrument(null);
  };

  const handleSelectInstrument = (instrument) => {
    const correspondentes = findPartesCorrespondentes(instrument);

    if (correspondentes.length === 0) {
      setConfirmInstrument(instrument);
    } else if (correspondentes.length === 1) {
      downloadParteDireta(correspondentes[0]);
    } else {
      setPartesDisponiveis(correspondentes);
      setShowPartePicker(true);
      setConfirmInstrument(instrument);
    }
  };

  const handleSelectParteEspecifica = (instrumento) => {
    const parte = findParteExata(instrumento);
    if (parte) {
      setConfirmInstrument(instrumento);
      setSelectedParte(parte);
    } else {
      showToast('Parte nao encontrada', 'error');
    }
  };

  const handleConfirmDownload = async () => {
    if (selectedParte) {
      downloadParteDireta(selectedParte);
      setConfirmInstrument(null);
      setSelectedParte(null);
      setShowInstrumentPicker(false);
      return;
    }

    const correspondentes = findPartesCorrespondentes(confirmInstrument);

    if (correspondentes.length > 0) {
      downloadParteDireta(correspondentes[0]);
    } else {
      setDownloading(true);
      showToast(`Preparando "${selectedSheet.title}"...`);
      try {
        const response = await fetch(`${API_BASE_URL}/api/download/${selectedSheet.id}`, {
          headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedSheet.title}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          showToast('Iniciando download...');
        } else {
          showToast('Erro ao baixar arquivo', 'error');
        }
      } catch (e) {
        showToast('Erro ao baixar arquivo', 'error');
      }
      setDownloading(false);
    }

    setConfirmInstrument(null);
    setShowInstrumentPicker(false);
  };

  const handleCancelDownload = () => {
    setConfirmInstrument(null);
    setSelectedParte(null);
  };

  const handleClose = () => {
    setSelectedSheet(null);
    // Se estamos numa URL de partitura, volta para o acervo da categoria
    if (location.pathname.includes('/acervo/') && location.pathname.split('/').length > 3) {
      const categoria = selectedSheet?.category || 'dobrado';
      navigate(`/acervo/${categoria}`, { replace: true });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Modal de Selecao de Partes Multiplas */}
      {showPartePicker && partesDisponiveis.length > 0 && (
        <>
          <div
            onClick={() => { setShowPartePicker(false); setConfirmInstrument(null); }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 2002,
              animation: 'fadeIn 0.15s ease'
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '24px',
            zIndex: 2003,
            width: '340px',
            maxWidth: '90vw',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 4px 12px rgba(114, 47, 55, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4E4BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>Escolha sua parte</h3>
              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                color: 'var(--text-muted)'
              }}>
                Encontramos {partesDisponiveis.length} partes de <strong style={{ color: '#D4AF37' }}>{confirmInstrument}</strong>
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {partesDisponiveis.map((parte, idx) => (
                <button
                  key={parte.id}
                  onClick={() => downloadParteDireta(parte)}
                  disabled={downloading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: downloading ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: downloading ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#D4AF37'
                    }}>
                      {idx + 1}
                    </span>
                    <span>{parte.instrumento}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowPartePicker(false); setConfirmInstrument(null); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Modal de Confirmacao */}
      {confirmInstrument && !showPartePicker && (
        <>
          <div
            onClick={handleCancelDownload}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 2002,
              animation: 'fadeIn 0.15s ease'
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '24px',
            zIndex: 2003,
            width: '300px',
            maxWidth: '85vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
              textAlign: 'center'
            }}>Confirmar Download</h3>
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Baixar partitura de <strong style={{ color: '#D4AF37' }}>{confirmInstrument}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCancelDownload}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDownload}
                disabled={downloading}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                  border: 'none',
                  color: '#F4E4BC',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: downloading ? 0.6 : 1
                }}
              >
                {downloading ? 'Baixando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal Principal */}
      <div style={{
        position: 'fixed',
        ...(isDesktop ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          maxWidth: '90vw',
          borderRadius: '20px',
          animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        } : {
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '24px 24px 0 0',
          animation: 'slideUpModal 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }),
        background: 'var(--bg-card)',
        zIndex: 2001,
        maxHeight: isDesktop ? '85vh' : '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Handle - apenas mobile */}
        {!isDesktop && (
          <div style={{
            width: '40px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            margin: '12px auto',
            flexShrink: 0
          }} />
        )}

        {/* Header com imagem */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
          padding: isDesktop ? '20px' : '16px 20px',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '50%'
          }} />

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CategoryIcon categoryId={category?.id} size={26} color="#D4AF37" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '17px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '3px',
                lineHeight: '1.3'
              }}>{selectedSheet.title}</h2>
              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>{selectedSheet.composer}</p>
              <span style={{
                display: 'inline-block',
                padding: '3px 8px',
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '600',
                fontFamily: 'Outfit, sans-serif'
              }}>{category?.name}</span>
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                flexShrink: 0
              }}
            >
              <div style={{ width: '16px', height: '16px' }}><Icons.Close /></div>
            </button>
          </div>
        </div>

        {/* Conteudo scrollavel */}
        <div style={{
          padding: isDesktop ? '16px 20px 20px' : '16px 20px 28px',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* Info compacta */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }}><Icons.Download /></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                {selectedSheet.downloads || 0}
              </span>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                {selectedSheet.year}
              </span>
            </div>
            {selectedSheet.featured && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.15)',
                padding: '8px 12px',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#D4AF37', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Destaque
                </span>
              </div>
            )}
          </div>

          {/* Opcoes de Download */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              fontFamily: 'Outfit, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600'
            }}>Baixar Partitura</p>

            {/* Botao Download - Meu Instrumento */}
            {!isMaestro && (
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
            )}

            {/* Botao Baixar Grade - So para Maestro */}
            {isMaestro && (
              <button
                onClick={() => handleSelectInstrument('Grade')}
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
                  <span>Baixar Grade</span>
                </div>
                <span style={{
                  background: 'rgba(244, 228, 188, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '10px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4E4BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </span>
              </button>
            )}

            {/* Botao Outro Instrumento */}
            <button
              onClick={() => setShowInstrumentPicker(!showInstrumentPicker)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: showInstrumentPicker ? '10px 10px 0 0' : '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderBottom: showInstrumentPicker ? 'none' : '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px' }}><Icons.Music /></div>
                <span>{isMaestro ? 'Escolher Parte' : 'Outro Instrumento'}</span>
              </div>
              <div style={{
                width: '16px',
                height: '16px',
                transition: 'transform 0.2s ease',
                transform: showInstrumentPicker ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                <Icons.ChevronDown />
              </div>
            </button>

            {/* Lista de Instrumentos */}
            {showInstrumentPicker && (
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {availableInstruments.map((instrument, idx) => (
                  <button
                    key={instrument}
                    onClick={() => handleSelectParteEspecifica(instrument)}
                    disabled={downloading}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: idx < availableInstruments.length - 1 ? '1px solid var(--border)' : 'none',
                      color: (isMaestro ? instrument === 'Grade' : instrument === userInstrument) ? '#D4AF37' : 'var(--text-primary)',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '13px',
                      fontWeight: (isMaestro ? instrument === 'Grade' : instrument === userInstrument) ? '600' : '500',
                      cursor: downloading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      opacity: downloading ? 0.6 : 1
                    }}
                  >
                    <span>{instrument}</span>
                    {(isMaestro ? instrument === 'Grade' : instrument === userInstrument) && (
                      <span style={{
                        fontSize: '9px',
                        background: 'rgba(212,175,55,0.2)',
                        color: '#D4AF37',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '700'
                      }}>
                        {isMaestro ? '★' : 'MEU'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botao Favoritar */}
          <button
            onClick={() => toggleFavorite(selectedSheet.id)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: isFavorite ? 'rgba(232,90,79,0.1)' : 'transparent',
              border: isFavorite ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              color: isFavorite ? 'var(--primary)' : 'var(--text-muted)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <div style={{ width: '14px', height: '14px' }}><Icons.Heart filled={isFavorite} /></div>
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </button>
        </div>
      </div>
    </>
  );
};

export default SheetDetailModal;
