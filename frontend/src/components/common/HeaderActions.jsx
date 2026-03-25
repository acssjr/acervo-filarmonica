// ===== HEADER ACTIONS =====
// Ações do header (tema + notificações) - apenas mobile

import { useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { useBellAnimation } from '@hooks/useBellAnimation';
import ThemeSelector from './ThemeSelector';
import AdminToggle from './AdminToggle';

const HeaderActions = ({ inDarkHeader = false }) => {
  const { setShowNotifications } = useUI();
  const { unreadCount } = useNotifications();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const bellRef = useRef(null);
  useBellAnimation(bellRef, unreadCount > 0);

  // No desktop, não mostra nada (já está na sidebar)
  if (isDesktop) return null;

  // Liquid glass sobre o header vinho (mobile institucional)
  const darkHeaderStyles = {
    background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.28)',
    color: '#F4E4BC'
  };

  // Liquid glass adaptativo (usa CSS vars light/dark)
  const normalStyles = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-box-shadow)',
    color: 'var(--text-primary)'
  };

  const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {/* Seletor de tema */}
      <ThemeSelector inDarkHeader={inDarkHeader} compact />

      {/* Sininho de notificações */}
      <button
        className="btn-hover"
        onClick={() => setShowNotifications(true)}
        aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          ...buttonStyles,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div ref={bellRef} style={{ width: '18px', height: '18px' }}>
          <Icons.Bell />
        </div>

        {/* Badge de contagem */}
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '16px',
            height: '16px',
            padding: '0 4px',
            borderRadius: '8px',
            background: '#E74C3C',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Toggle Admin (só para admins) - à direita das notificações */}
      <AdminToggle inDarkHeader={inDarkHeader} />
    </div>
  );
};

export default HeaderActions;
