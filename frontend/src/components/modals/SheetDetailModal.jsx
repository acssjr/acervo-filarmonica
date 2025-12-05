// ===== SHEET DETAIL MODAL =====
// Modal de detalhes da partitura com opcoes de download
// Suporta URL compartilhavel: /acervo/:categoria/:id
// Refatorado: extraido componentes e hook de download

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { CATEGORIES } from '@constants/categories';
import { Icons } from '@constants/icons';
import { API_BASE_URL } from '@constants/api';
import CategoryIcon from '@components/common/CategoryIcon';
import { useSheetDownload } from '@hooks/useSheetDownload';
import { PartePicker, DownloadConfirm, InstrumentSelector, DEFAULT_INSTRUMENTS } from './sheet';

const SheetDetailModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedSheet, setSelectedSheet, showToast } = useUI();
  const { favorites, toggleFavorite } = useData();

  // Estado local
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  const [partes, setPartes] = useState([]);
  const [loadingPartes, setLoadingPartes] = useState(false);

  // Hook de download
  const download = useSheetDownload({
    showToast,
    selectedSheet,
    partes
  });

  // Detectar desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Buscar partes quando abrir o modal
  useEffect(() => {
    if (selectedSheet) {
      setShowInstrumentPicker(false);
      download.handleCancelDownload();

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
    : DEFAULT_INSTRUMENTS;

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
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Modal de Selecao de Partes */}
      <PartePicker
        isOpen={download.showPartePicker}
        partes={download.partesDisponiveis}
        instrumentName={download.confirmInstrument}
        downloading={download.downloading}
        onSelectParte={download.downloadParteDireta}
        onClose={download.closePartePicker}
      />

      {/* Modal de Confirmacao */}
      <DownloadConfirm
        isOpen={!!download.confirmInstrument && !download.showPartePicker}
        instrumentName={download.confirmInstrument}
        downloading={download.downloading}
        onConfirm={download.handleConfirmDownload}
        onCancel={download.handleCancelDownload}
      />

      {/* Modal Principal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-detail-title"
        style={{
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
        }}
      >
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
              <CategoryIcon categoryId={category?.id} size={26} color="var(--accent)" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                id="sheet-detail-title"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '17px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '3px',
                  lineHeight: '1.3'
                }}
              >
                {selectedSheet.title}
              </h2>
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
                color: 'var(--accent)',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '600',
                fontFamily: 'Outfit, sans-serif'
              }}>{category?.name}</span>
            </div>

            <button
              onClick={handleClose}
              aria-label="Fechar modal"
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
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
            <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                {selectedSheet.year}
              </span>
            </div>
            {selectedSheet.featured && (
              <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)" stroke="none" aria-hidden="true">
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

            {/* Botao Download - Meu Instrumento ou Grade (Maestro) */}
            <button
              onClick={() => download.handleSelectInstrument(isMaestro ? 'Grade' : userInstrument)}
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
                <span>{isMaestro ? 'Baixar Grade' : 'Meu Instrumento'}</span>
              </div>
              <span style={{
                background: 'rgba(244, 228, 188, 0.2)',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700'
              }}>{isMaestro ? 'Grade' : userInstrument}</span>
            </button>

            {/* Seletor de Outros Instrumentos */}
            <InstrumentSelector
              isOpen={showInstrumentPicker}
              instruments={availableInstruments}
              userInstrument={userInstrument}
              isMaestro={isMaestro}
              downloading={download.downloading}
              onToggle={() => setShowInstrumentPicker(!showInstrumentPicker)}
              onSelectInstrument={download.handleSelectParteEspecifica}
            />
          </div>

          {/* Botao Favoritar */}
          <button
            onClick={() => toggleFavorite(selectedSheet.id)}
            aria-pressed={isFavorite}
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
