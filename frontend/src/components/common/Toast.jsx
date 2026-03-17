// ===== TOAST COMPONENT =====
// Notificação liquid glass com animações de entrada e saída

import { useEffect, useState, useCallback } from 'react';
import { useUI } from '@contexts/UIContext';

// Converte nome do instrumento para título do músico com sufixo correto
const getInstrumentTitle = (instrument) => {
  if (!instrument) return null;
  const n = instrument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Ordem importa: mais específico primeiro
  const map = [
    ['flautim',      'Flautinista'],
    ['flauta',       'Flautista'],
    ['requinta',     'Requintista'],
    ['clarone',      'Claronista'],
    ['clarinete',    'Clarinetista'],
    ['oboe',         'Oboísta'],
    ['fagote',       'Fagotista'],
    ['saxofone',     'Saxofonista'],
    ['sax',          'Saxofonista'],
    ['trompete',     'Trompetista'],
    ['trompa',       'Trompista'],
    ['trombone',     'Trombonista'],
    ['bombardino',   'Bombardinista'],
    ['eufonio',      'Eufonista'],
    ['tuba',         'Tubista'],
    ['pratos',       'Pratileiro'],
    ['prato',        'Pratileiro'],
    ['bombo',        'Bombista'],
    ['bumbo',        'Bumbista'],
    ['caixa',        'Caixista'],
    ['repique',      'Repicador'],
    ['surdo',        'Surdista'],
    ['timpano',      'Timbalista'],
    ['timbal',       'Timbalista'],
    ['percussao',    'Percussionista'],
    ['percussão',    'Percussionista'],
    ['lira',         'Lirísta'],
    ['xilofone',     'Xilofonista'],
    ['vibrafone',    'Vibrafonista'],
  ];

  for (const [key, title] of map) {
    if (n.includes(key)) return title;
  }
  return null;
};

const Toast = ({ message, type = 'success', instrument, onClose }) => {
  const { theme } = useUI();
  const isDark = theme === 'dark';
  const [closing, setClosing] = useState(false);

  const isDownload = message.toLowerCase().includes('download') || message.toLowerCase().includes('preparando');
  const isWelcome = message.toLowerCase().startsWith('bem-vindo');
  const duration = isDownload ? 4500 : 3200;

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(handleClose, duration);
    return () => clearTimeout(t);
  }, [handleClose, duration]);

  // Paleta por tipo e tema
  const palette = (() => {
    if (type === 'error') return {
      bg:        isDark ? 'rgba(55,8,8,0.70)'         : 'rgba(254,226,226,0.88)',
      borderTop: isDark ? 'rgba(252,165,165,0.22)'    : 'rgba(239,68,68,0.35)',
      border:    isDark ? 'rgba(239,68,68,0.28)'       : 'rgba(220,38,38,0.25)',
      iconBg:    isDark ? 'rgba(239,68,68,0.14)'       : 'rgba(239,68,68,0.12)',
      iconColor: isDark ? '#F87171'                    : '#DC2626',
      text:      isDark ? '#FCA5A5'                    : '#991B1B',
      sub:       isDark ? 'rgba(252,165,165,0.60)'     : 'rgba(153,27,27,0.65)',
      glow:      'rgba(239,68,68,0.20)',
    };
    if (isDownload) return {
      bg:        isDark ? 'rgba(30,18,4,0.72)'         : 'rgba(254,243,199,0.90)',
      borderTop: isDark ? 'rgba(212,175,55,0.30)'      : 'rgba(212,175,55,0.40)',
      border:    isDark ? 'rgba(212,175,55,0.22)'      : 'rgba(180,140,30,0.25)',
      iconBg:    isDark ? 'rgba(212,175,55,0.13)'      : 'rgba(212,175,55,0.15)',
      iconColor: '#D4AF37',
      text:      isDark ? '#F4E4BC'                    : '#92400E',
      sub:       isDark ? 'rgba(244,228,188,0.65)'     : 'rgba(146,64,14,0.65)',
      glow:      'rgba(212,175,55,0.22)',
    };
    // success / bem-vindo
    return {
      bg:        isDark ? 'rgba(5,28,16,0.72)'         : 'rgba(220,252,231,0.90)',
      borderTop: isDark ? 'rgba(74,222,128,0.25)'      : 'rgba(22,163,74,0.35)',
      border:    isDark ? 'rgba(34,197,94,0.22)'       : 'rgba(22,163,74,0.22)',
      iconBg:    isDark ? 'rgba(34,197,94,0.13)'       : 'rgba(34,197,94,0.12)',
      iconColor: isDark ? '#4ADE80'                    : '#16A34A',
      text:      isDark ? '#BBF7D0'                    : '#15803D',
      sub:       isDark ? 'rgba(187,247,208,0.60)'     : 'rgba(21,128,61,0.65)',
      glow:      'rgba(34,197,94,0.18)',
    };
  })();

  // Ícone SVG inline por tipo
  const Icon = () => {
    if (isDownload) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    );
    if (type === 'error') return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    );
    if (isWelcome) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    );
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    );
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      onClick={handleClose}
      style={{
        position: 'fixed',
        bottom: '108px',
        left: '20px',
        right: '20px',
        maxWidth: '380px',
        margin: '0 auto',
        /* Liquid glass */
        background: palette.bg,
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        borderRadius: '20px',
        borderTop:    `1px solid ${palette.borderTop}`,
        borderLeft:   `1px solid ${palette.border}`,
        borderRight:  `1px solid rgba(0,0,0,0.12)`,
        borderBottom: `1px solid rgba(0,0,0,0.16)`,
        boxShadow: [
          `0 20px 56px rgba(0,0,0,0.40)`,
          `0 4px 16px ${palette.glow}`,
          `inset 0 1.5px 0 rgba(255,255,255,${isDark ? '0.12' : '0.55'})`,
          `inset 0 -1px 0 rgba(0,0,0,0.10)`,
        ].join(', '),
        padding: isDownload ? '14px 16px' : '12px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 3000,
        cursor: 'pointer',
        userSelect: 'none',
        animation: closing
          ? 'toast-out 0.28s cubic-bezier(0.4,0,1,1) forwards'
          : 'toast-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
      }}
    >
      {/* Ícone em círculo glass */}
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: palette.iconBg,
        border: `1px solid ${palette.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${isDark ? '0.1' : '0.4'})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: palette.iconColor,
      }}>
        <Icon />
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: palette.text,
          display: 'block',
          letterSpacing: '-0.1px',
        }}>
          {message}
        </span>
        {isDownload && (
          <span style={{
            fontSize: '11px',
            color: palette.sub,
            display: 'block',
            marginTop: '2px',
          }}>
            Verifique a barra de notificações
          </span>
        )}
        {isWelcome && (
          <span style={{
            fontSize: '11px',
            color: palette.sub,
            display: 'block',
            marginTop: '2px',
          }}>
            {getInstrumentTitle(instrument) ?? 'Filarmônica 25 de Março'}
          </span>
        )}
      </div>

      {/* Botão fechar */}
      <button
        aria-label="Dispensar notificação"
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: palette.sub,
          fontSize: '12px',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
