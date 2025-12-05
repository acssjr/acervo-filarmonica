// ===== NOTIFICATIONS PANEL =====
// Painel de notificacoes

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';

const NotificationsPanel = () => {
  const navigate = useNavigate();
  const { showNotifications, setShowNotifications, theme } = useUI();
  const { setSelectedCategory, sheets } = useData();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotifications();

  // Detecta se e dispositivo touch
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Bloqueia scroll do body quando painel esta aberto (apenas mobile)
  useEffect(() => {
    if (showNotifications && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showNotifications, isMobile]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atras`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);

    if (notification.type === 'new_sheet' && notification.sheetId) {
      const sheet = sheets.find(s => s.id === notification.sheetId);
      if (sheet) {
        setSelectedCategory(sheet.category);
        navigate('/acervo');
      }
    }

    setShowNotifications(false);
  };

  if (!showNotifications) return null;

  return (
    <>
      {/* Overlay - so no mobile */}
      {isMobile && (
        <div
          onClick={() => setShowNotifications(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}

      {/* Area clicavel atras do painel no desktop */}
      {!isMobile && (
        <div
          onClick={() => setShowNotifications(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '50%' : '70px',
        left: isMobile ? '50%' : 'auto',
        right: isMobile ? 'auto' : '16px',
        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
        width: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 32px)',
        maxWidth: '360px',
        maxHeight: isMobile ? '80vh' : '70vh',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        zIndex: 1001,
        overflow: 'hidden',
        animation: isMobile ? 'popIn 0.25s ease' : 'slideUp 0.3s ease',
        border: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)'
        }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Notificacoes
          </h3>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* Lista de notificacoes */}
        <div style={{ maxHeight: 'calc(70vh - 60px)', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.5 }}>
                <Icons.Bell />
              </div>
              <p style={{ fontFamily: 'Outfit, sans-serif' }}>Nenhuma notificacao</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  background: notification.read ? 'transparent' : (theme === 'dark' ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.1)'),
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s ease'
                }}
              >
                {/* Icone */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{ width: '20px', height: '20px', color: '#D4AF37' }}>
                    <Icons.Music />
                  </div>
                </div>

                {/* Conteudo */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: notification.read ? '500' : '600',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    {notification.title}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', opacity: 0.7, fontFamily: 'Outfit, sans-serif' }}>
                    {formatDate(notification.date)}
                  </p>
                </div>

                {/* Indicador de nao lida */}
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '6px'
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
