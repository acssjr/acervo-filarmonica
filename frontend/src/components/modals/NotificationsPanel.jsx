// ===== NOTIFICATIONS PANEL =====
// Painel de notificacoes — glassmorphism + GSAP always-in-DOM

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useNotifications } from '@contexts/NotificationContext';
import { useIsMobile } from '@hooks/useResponsive';
import { useScrollLock } from '@hooks/useScrollLock';
import { Icons } from '@constants/icons';
import EmptyState from '@components/common/EmptyState';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getDateGroup = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  if (date >= todayStart) return 'Hoje';
  if (date >= yesterdayStart) return 'Ontem';
  if (date >= weekStart) return 'Esta semana';
  return 'Anteriores';
};

const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Hoje';
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atr\u00e1s`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const GROUP_ORDER = ['Hoje', 'Ontem', 'Esta semana', 'Anteriores'];

const groupNotifications = (notifications) => {
  const groups = {};
  for (const n of notifications) {
    const group = getDateGroup(n.date);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  return GROUP_ORDER.filter(g => groups[g]).map(g => ({ label: g, items: groups[g] }));
};

const getNotificationIcon = (iconName) => {
  // Fallback for icon names that don't exist in Icons (e.g. 'Repertorio' -> 'ListMusic')
  if (Icons[iconName]) return Icons[iconName];
  if (iconName === 'Repertorio') return Icons.ListMusic;
  return Icons.Music;
};

// ── Component ────────────────────────────────────────────────────────────────

const NotificationsPanel = () => {
  const navigate = useNavigate();
  const { showNotifications, setShowNotifications, theme } = useUI();
  const { sheets } = useData();
  const { notifications, loading, markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications } = useNotifications();
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';

  const containerRef = useRef(null);
  const cardRef = useRef(null);

  // Scroll lock for mobile
  useScrollLock(showNotifications && isMobile);

  // ── Initial hidden state ─────────────────────────────────────────────────
  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    gsap.set(cardRef.current, { y: 20, scale: 0.97 });
  }, { scope: containerRef });

  // ── Open/close animations ────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    if (showNotifications) {
      refreshNotifications();

      gsap.set(container, { pointerEvents: 'auto' });
      // Backdrop fade in
      gsap.to(container, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });
      // Card entrance
      gsap.fromTo(card,
        { autoAlpha: 0, y: 20, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }
      );
    } else {
      // Card out first
      gsap.to(card, {
        y: 10, scale: 0.98, autoAlpha: 0,
        duration: 0.2, ease: 'power2.in',
      });
      // Then backdrop
      gsap.to(container, {
        autoAlpha: 0, duration: 0.22, ease: 'power2.in',
        delay: 0.05,
        onComplete: () => gsap.set(container, { pointerEvents: 'none' }),
      });
    }
  }, [showNotifications]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setShowNotifications(false);
  }, [setShowNotifications]);

  const handleNotificationClick = useCallback((notification) => {
    markNotificationAsRead(notification.id);

    const sheet = sheets.find(s =>
      s.title.toLowerCase() === notification.title.toLowerCase()
    );

    if (sheet) {
      navigate(`/acervo/${sheet.category}/${sheet.id}`);
    } else {
      navigate('/acervo');
    }

    setShowNotifications(false);
  }, [markNotificationAsRead, sheets, navigate, setShowNotifications]);

  // ── Grouped notifications ────────────────────────────────────────────────
  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);
  const hasUnread = useMemo(() => notifications.some(n => !n.read), [notifications]);

  // ── Styles ───────────────────────────────────────────────────────────────
  const goldColor = isDark ? '#D4AF37' : '#8B6914';
  const mutedColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const subColor = isDark ? 'rgba(255,255,255,0.52)' : 'rgba(0,0,0,0.55)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';

  const glassBackground = isDark
    ? 'linear-gradient(160deg, rgba(30,20,22,0.92) 0%, rgba(20,12,16,0.96) 100%)'
    : 'linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(248,245,240,0.92) 100%)';

  const glassBorder = isDark
    ? '1px solid rgba(255,255,255,0.10)'
    : '1px solid rgba(255,255,255,0.9)';

  const glassShadow = isDark
    ? '0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 24px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)';

  const iconBoxStyle = {
    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
    background: isDark
      ? 'linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.07) 100%)'
      : 'linear-gradient(135deg, rgba(114,47,55,0.14) 0%, rgba(114,47,55,0.07) 100%)',
    border: `1px solid ${isDark ? 'rgba(212,175,55,0.22)' : 'rgba(114,47,55,0.22)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: isDark ? '#D4AF37' : '#722F37',
  };

  // ── Container style (mobile vs desktop) ──────────────────────────────────
  const containerStyle = isMobile
    ? {
        position: 'fixed', inset: 0, zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
        background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15,8,3,0.38)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }
    : {
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'transparent',
      };

  const cardStyle = isMobile
    ? {
        width: '100%', maxWidth: '380px',
        maxHeight: '80vh',
        borderRadius: '20px',
        background: glassBackground,
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        border: glassBorder,
        boxShadow: glassShadow,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }
    : {
        position: 'absolute',
        top: '70px', right: '16px',
        width: 'calc(100% - 32px)', maxWidth: '380px',
        maxHeight: '70vh',
        borderRadius: '20px',
        background: glassBackground,
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        border: glassBorder,
        boxShadow: glassShadow,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      };

  // ── Render notification item ─────────────────────────────────────────────
  const renderNotification = (notification) => {
    const IconComponent = getNotificationIcon(notification.iconName);
    const isUnread = !notification.read;

    return (
      <div
        key={notification.id}
        onClick={() => handleNotificationClick(notification)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          cursor: 'pointer',
          background: isUnread
            ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.1)')
            : 'transparent',
          borderBottom: `1px solid ${dividerColor}`,
          transition: 'background 0.2s ease',
        }}
      >
        {/* Icon */}
        <div style={iconBoxStyle}>
          <div style={{ width: '20px', height: '20px' }}>
            <IconComponent />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label tag */}
          {notification.label && (
            <span style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: goldColor,
              marginBottom: '2px',
            }}>
              {notification.label}
            </span>
          )}
          {/* Title */}
          <p style={{
            fontSize: '14px',
            fontWeight: isUnread ? '600' : '500',
            color: textColor,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {notification.title}
          </p>
          {/* Subtitle (e.g. "por Admin") */}
          {notification.subtitle && (
            <p style={{
              fontSize: '12px',
              color: subColor,
              margin: '1px 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {notification.subtitle}
            </p>
          )}
          {/* Date */}
          <p style={{
            fontSize: '11px',
            color: mutedColor,
            margin: '2px 0 0',
          }}>
            {formatRelativeDate(notification.date)}
          </p>
        </div>

        {/* Unread dot */}
        {isUnread && (
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: '#D4AF37',
            flexShrink: 0,
          }} />
        )}
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        style={cardStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: `1px solid ${dividerColor}`,
          flexShrink: 0,
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: textColor,
            margin: 0,
          }}>
            Notifica\u00e7\u00f5es
          </h3>
          {hasUnread && (
            <button
              onClick={markAllNotificationsAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: goldColor,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              Marcar como lidas
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}>
          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{
                width: '32px', height: '32px',
                border: `3px solid ${dividerColor}`,
                borderTopColor: goldColor,
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ fontSize: '14px', color: mutedColor, margin: 0 }}>
                Carregando...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState icon={Icons.Music} title="Nenhuma notifica\u00e7\u00e3o" size="small" />
          ) : (
            grouped.map(group => (
              <div key={group.label}>
                {/* Group separator */}
                <div style={{
                  padding: '12px 20px 6px',
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: mutedColor,
                  }}>
                    {group.label}
                  </span>
                </div>
                {group.items.map(renderNotification)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
