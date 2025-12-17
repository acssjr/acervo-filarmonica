// ===== SHARE CART MODAL =====
// Modal para revisar e compartilhar multiplas partes de partituras
// Agrupa partes por partitura e permite remover individualmente

import { useState, useCallback } from 'react';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import { API_BASE_URL } from '@constants/api';
import { Storage } from '@services/storage';
import useAnimatedVisibility from '@hooks/useAnimatedVisibility';

const ShareCartModal = () => {
  const {
    shareCart,
    showShareCart,
    setShowShareCart,
    removeFromShareCart,
    clearShareCart,
    showToast
  } = useUI();

  const [isDesktop] = useState(window.innerWidth >= 1024);
  const [sharing, setSharing] = useState(false);

  // Animacao de entrada/saida
  const { shouldRender, isExiting } = useAnimatedVisibility(showShareCart, 250);

  // Agrupa partes por partitura
  const groupedBySheet = shareCart.reduce((acc, item) => {
    if (!acc[item.sheetId]) {
      acc[item.sheetId] = {
        title: item.sheetTitle,
        partes: []
      };
    }
    acc[item.sheetId].partes.push(item);
    return acc;
  }, {});

  // Funcao auxiliar para baixar arquivos via download
  const downloadFiles = useCallback((files) => {
    showToast(`Baixando ${files.length} arquivo(s)...`);
    files.forEach((file, idx) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Mostra sucesso ao terminar ultimo arquivo
        if (idx === files.length - 1) {
          setTimeout(() => {
            showToast('Downloads concluídos!');
            clearShareCart();
            setShowShareCart(false);
          }, 500);
        }
      }, idx * 500);
    });
  }, [showToast, clearShareCart, setShowShareCart]);

  // Compartilha multiplos arquivos
  const handleShareAll = useCallback(async () => {
    if (sharing || shareCart.length === 0) return;
    setSharing(true);

    showToast(`Preparando ${shareCart.length} partitura(s)...`);

    try {
      const files = [];
      const errors = [];

      // Baixa cada parte
      for (const item of shareCart) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/download/parte/${item.parteId}`, {
            headers: { 'Authorization': `Bearer ${Storage.get('authToken')}` }
          });

          if (response.ok) {
            const blob = await response.blob();
            const filename = `${item.sheetTitle} - ${item.instrument}.pdf`;
            files.push(new File([blob], filename, { type: 'application/pdf' }));
          } else {
            errors.push(`${item.instrument}: erro ${response.status}`);
          }
        } catch (fetchErr) {
          console.error(`Erro ao baixar ${item.instrument}:`, fetchErr);
          errors.push(`${item.instrument}: falha na conexão`);
        }
      }

      if (files.length === 0) {
        showToast('Erro ao preparar arquivos. Verifique sua conexão.', 'error');
        setSharing(false);
        return;
      }

      // Mostra aviso se alguns arquivos falharam
      if (errors.length > 0) {
        console.warn('Alguns arquivos falharam:', errors);
      }

      // NOTA: Web Share API (navigator.share) NAO pode ser usado aqui porque
      // requer ser chamado DIRETAMENTE em um user gesture (clique).
      // Apos qualquer await (como os fetch() acima), o browser considera que
      // nao esta mais em um "user gesture" e bloqueia a chamada com NotAllowedError.
      // Por isso, usamos download direto como unica opcao viavel.
      downloadFiles(files);
    } catch (e) {
      console.error('Erro no compartilhamento:', e);
      showToast('Erro ao compartilhar. Tente novamente.', 'error');
    }

    setSharing(false);
  }, [sharing, shareCart, showToast, downloadFiles]);

  const handleClose = () => setShowShareCart(false);

  if (!shouldRender) return null;

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
          animation: isExiting
            ? 'modalBackdropOut 0.25s ease forwards'
            : 'modalBackdropIn 0.2s ease'
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-cart-title"
        style={{
          position: 'fixed',
          ...(isDesktop ? {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            maxWidth: '90vw',
            borderRadius: '20px',
            animation: isExiting
              ? 'modalScaleOut 0.25s ease forwards'
              : 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          } : {
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: '24px 24px 0 0',
            animation: isExiting
              ? 'slideDownModal 0.25s ease forwards'
              : 'slideUpModal 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }),
          background: 'var(--bg-card)',
          zIndex: 2001,
          maxHeight: isDesktop ? '80vh' : '85vh',
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

        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(37, 211, 102, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '18px', height: '18px', color: '#25D366' }}>
                <Icons.Share />
              </div>
            </div>
            <div>
              <h2
                id="share-cart-title"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                Carrinho de Envio
              </h2>
              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                color: 'var(--text-muted)',
                margin: 0
              }}>
                {shareCart.length} {shareCart.length === 1 ? 'parte selecionada' : 'partes selecionadas'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Fechar"
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
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ width: '16px', height: '16px' }}><Icons.Close /></div>
          </button>
        </div>

        {/* Lista de partes */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 20px'
        }}>
          {Object.entries(groupedBySheet).map(([sheetId, sheet]) => (
            <div key={sheetId} style={{ marginBottom: '16px' }}>
              {/* Titulo da partitura */}
              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                {sheet.title}
              </p>

              {/* Partes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sheet.partes.map(item => (
                  <div
                    key={item.parteId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '14px', height: '14px', color: 'var(--accent)' }}>
                        <Icons.Music />
                      </div>
                      <span style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)'
                      }}>
                        {item.instrument}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromShareCart(item.parteId)}
                      aria-label={`Remover ${item.instrument}`}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#e74c3c'
                      }}
                    >
                      <div style={{ width: '14px', height: '14px' }}><Icons.Close /></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {shareCart.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.4 }}>
                <Icons.Music />
              </div>
              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px'
              }}>
                Nenhuma parte selecionada
              </p>
            </div>
          )}
        </div>

        {/* Footer com botoes */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '10px',
          flexShrink: 0
        }}>
          <button
            onClick={clearShareCart}
            disabled={shareCart.length === 0}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: shareCart.length === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              cursor: shareCart.length === 0 ? 'not-allowed' : 'pointer',
              opacity: shareCart.length === 0 ? 0.5 : 1
            }}
          >
            Limpar
          </button>

          <button
            onClick={handleShareAll}
            disabled={shareCart.length === 0 || sharing}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '10px',
              background: shareCart.length === 0 ? 'var(--bg-secondary)' : 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
              border: 'none',
              color: shareCart.length === 0 ? 'var(--text-muted)' : '#FFFFFF',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              cursor: shareCart.length === 0 || sharing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: shareCart.length === 0 ? 'none' : '0 4px 12px rgba(37, 211, 102, 0.3)',
              opacity: shareCart.length === 0 ? 0.5 : 1
            }}
          >
            <div style={{ width: '16px', height: '16px' }}>
              {sharing ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              ) : (
                <Icons.Download />
              )}
            </div>
            {sharing ? 'Baixando...' : 'Baixar Todos'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareCartModal;
