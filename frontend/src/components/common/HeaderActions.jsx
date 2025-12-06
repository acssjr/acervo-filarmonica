// ===== HEADER ACTIONS =====
// Ações do header (tema + notificações) - apenas mobile

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import ThemeSelector from './ThemeSelector';
import AdminToggle from './AdminToggle';

const HeaderActions = ({ inDarkHeader = false }) => {
  const { setShowNotifications } = useUI();
  const { unreadCount } = useNotifications();
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // No desktop, não mostra nada (já está na sidebar)
  if (isDesktop) return null;

  // Estilos para o header vinho (institucional)
  const darkHeaderStyles = {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#F4E4BC'
  };

  // Estilos normais
  const normalStyles = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)'
  };

  const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {/* Seletor de tema */}
      <ThemeSelector inDarkHeader={inDarkHeader} compact />

      {/* Toggle Admin (só para admins) */}
      <AdminToggle />

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
        <div style={{ width: '18px', height: '18px' }}>
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
            fontFamily: 'Outfit, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default HeaderActions;
