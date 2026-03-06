import { useState, useCallback } from 'react';
import RepertorioCardExport from './RepertorioCardExport';

const SKIP_KEY = 'filarmonica_card_skip_confirm';

export default function CompartilharCardModal({ repertorio, onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [step, setStep] = useState(() =>
    localStorage.getItem(SKIP_KEY) === 'true' ? 'generating' : 'confirm'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirm = () => {
    if (dontShowAgain) localStorage.setItem(SKIP_KEY, 'true');
    setStep('generating');
  };

  // Callback ref: dispara quando o card entra no DOM
  const cardRef = useCallback(async (node) => {
    if (!node) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 800));

      const canvas = await html2canvas(node, {
        width: 1080,
        height: 1350,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#3D1518',
        logging: false,
      });

      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.95));
      const nomeSafe = (repertorio.nome || 'repertorio')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const filename = `repertorio-${nomeSafe}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Repertório — ${repertorio.nome}` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      onClose();
    } catch (err) {
      console.error('Erro ao gerar card:', err);
      setErrorMsg('Erro ao gerar imagem. Tente novamente.');
      setStep('confirm');
    }
  }, [repertorio, onClose]);

  return (
    <>
      {/* Backdrop + modal */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 60%)',
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(212,175,55,0.08)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(114,47,55,0.3), rgba(92,26,27,0.2))',
                border: '1px solid rgba(212,175,55,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  Compartilhar Repertório
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                  {repertorio.nome}
                </div>
              </div>
            </div>
          </div>

          {step === 'confirm' && (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
                Isso vai gerar uma <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>imagem do repertório</strong> — com todas as músicas, compositores e a data da apresentação — ideal para compartilhar de forma visual.
              </p>

              {errorMsg && (
                <p style={{ fontSize: '13px', color: '#e74c3c', marginBottom: 16, padding: '10px 12px', background: 'rgba(231,76,60,0.08)', borderRadius: '8px', border: '1px solid rgba(231,76,60,0.15)' }}>
                  {errorMsg}
                </p>
              )}

              {/* Checkbox não mostrar novamente */}
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px', userSelect: 'none' }}
                onClick={() => setDontShowAgain(v => !v)}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${dontShowAgain ? '#D4AF37' : 'var(--border)'}`,
                  background: dontShowAgain ? '#D4AF37' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {dontShowAgain && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#3D1518" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Não mostrar esta mensagem novamente
                </span>
              </label>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#F4E4BC', fontSize: '14px', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 4px 12px rgba(114,47,55,0.3)',
                    transition: 'all 0.15s',
                  }}
                >
                  Prosseguir
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div style={{ padding: '36px 20px', textAlign: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginBottom: 14 }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Gerando imagem...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card off-screen para captura — só monta quando step === 'generating' */}
      {step === 'generating' && (
        <div style={{
          position: 'fixed', top: -9999, left: -9999,
          width: 1080, height: 1350,
          overflow: 'hidden', zIndex: -1,
          pointerEvents: 'none',
        }}>
          <RepertorioCardExport ref={cardRef} repertorio={repertorio} />
        </div>
      )}
    </>
  );
}
