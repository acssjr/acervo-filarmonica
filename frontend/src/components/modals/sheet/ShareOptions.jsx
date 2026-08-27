import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@constants/icons';

const ShareOptions = ({ isOpen, onClose, onSendCopy, onShareLink, copyDisabled = false }) => {
  const firstButtonRef = useRef(null);
  const linkButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    (copyDisabled ? linkButtonRef.current : firstButtonRef.current)?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const buttons = [...(dialogRef.current?.querySelectorAll('button:not(:disabled)') || [])];
        const firstButton = buttons[0];
        const lastButton = buttons.at(-1);
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, copyDisabled]);

  if (!isOpen) return null;

  const optionStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    textAlign: 'left'
  };

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2100,
          background: 'rgba(0, 0, 0, 0.56)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)'
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-options-title"
        style={{
          position: 'fixed',
          zIndex: 2101,
          left: '50%',
          bottom: 'max(20px, env(safe-area-inset-bottom))',
          transform: 'translateX(-50%)',
          width: 'min(390px, calc(100vw - 32px))',
          padding: '18px',
          borderRadius: '18px',
          background: 'var(--bg-card)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.38)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h2 id="share-options-title" style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>
              Como deseja enviar?
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Escolha entre o arquivo PDF e o link da peça.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar opções de envio"
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '8px' }}
          >
            <Icons.Close />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '8px' }}>
          <button
            ref={firstButtonRef}
            type="button"
            onClick={onSendCopy}
            disabled={copyDisabled}
            style={{ ...optionStyle, cursor: copyDisabled ? 'not-allowed' : 'pointer', opacity: copyDisabled ? 0.5 : 1 }}
          >
            <span style={{ width: '36px', height: '36px', padding: '9px', borderRadius: '10px', color: '#25D366', background: 'rgba(37, 211, 102, 0.12)', flexShrink: 0 }}>
              <Icons.File />
            </span>
            <span>
              <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Enviar cópia</strong>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                {copyDisabled ? 'Não disponível neste navegador' : 'Compartilha o PDF do seu instrumento'}
              </span>
            </span>
          </button>

          <button ref={linkButtonRef} type="button" onClick={onShareLink} style={{ ...optionStyle, cursor: 'pointer', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            <span style={{ width: '36px', height: '36px', padding: '9px', borderRadius: '10px', color: 'var(--accent)', background: 'rgba(212, 175, 55, 0.12)', flexShrink: 0 }}>
              <Icons.Share />
            </span>
            <span>
              <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Compartilhar link</strong>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Envia o cartão da peça e copia o link</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

ShareOptions.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSendCopy: PropTypes.func.isRequired,
  onShareLink: PropTypes.func.isRequired,
  copyDisabled: PropTypes.bool
};

export default ShareOptions;
