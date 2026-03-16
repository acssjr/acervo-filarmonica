// ===== ADMIN MORE MODAL =====
// Modal central com as seções extras do painel admin — liquid glass, mobile-first

import { useUI } from '@contexts/UIContext';
import { useAuth } from '@contexts/AuthContext';

const EXTRA_SECTIONS = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'repertorio',
    label: 'Repertório',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'presenca',
    label: 'Presença',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 'avisos',
    label: 'Avisos',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'assets',
    label: 'Ativos',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'config',
    label: 'Configurações',
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const AdminMoreModal = ({ activeSection, onNavigate, onClose }) => {
  const { theme } = useUI();
  const { logout } = useAuth();
  const isDark = theme === 'dark';

  const handleNavigate = (id) => {
    onNavigate(id);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  // ---- Tokens de tema ----
  const backdrop = isDark
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(0, 0, 0, 0.4)';

  const modalBg = isDark
    ? 'linear-gradient(145deg, rgba(38, 10, 10, 0.93) 0%, rgba(18, 4, 4, 0.97) 100%)'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(250, 246, 244, 0.96) 100%)';

  const modalBorder = isDark
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.95)';

  const modalShadow = isDark
    ? '0 32px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 24px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,1)';

  const titleColor = isDark ? '#F4E4BC' : '#3D1518';
  const subtitleColor = isDark ? 'rgba(212,175,55,0.8)' : 'rgba(93,30,35,0.7)';

  const itemBg = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(61, 21, 24, 0.05)';

  const itemBorder = isDark
    ? '1px solid rgba(255, 255, 255, 0.09)'
    : '1px solid rgba(61, 21, 24, 0.1)';

  const itemActiveBg = isDark
    ? 'rgba(212, 175, 55, 0.15)'
    : 'rgba(212, 175, 55, 0.12)';

  const itemActiveBorder = isDark
    ? '1px solid rgba(212, 175, 55, 0.35)'
    : '1px solid rgba(212, 175, 55, 0.4)';

  const itemLabelColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(61,21,24,0.8)';
  const itemActiveLabelColor = '#D4AF37';

  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(61,21,24,0.1)';

  const logoutBg = isDark
    ? 'rgba(231, 76, 60, 0.10)'
    : 'rgba(231, 76, 60, 0.07)';
  const logoutBorder = isDark
    ? '1px solid rgba(231, 76, 60, 0.28)'
    : '1px solid rgba(231, 76, 60, 0.22)';
  const logoutColor = isDark ? '#e74c3c' : '#c0392b';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: backdrop,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1100,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mais opções"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 48px)',
          maxWidth: '360px',
          borderRadius: '28px',
          padding: '24px',
          background: modalBg,
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: modalBorder,
          boxShadow: modalShadow,
          zIndex: 1101,
        }}
      >
        {/* Cabeçalho */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: titleColor, lineHeight: 1.2 }}>
              Mais opções
            </div>
            <div style={{ fontSize: '12px', color: subtitleColor, marginTop: '2px' }}>
              S.F. 25 de Março · Admin
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(61,21,24,0.07)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(61,21,24,0.12)',
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(61,21,24,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Grade 2×3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px',
        }}>
          {EXTRA_SECTIONS.map(section => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px 12px',
                  borderRadius: '18px',
                  background: isActive ? itemActiveBg : itemBg,
                  border: isActive ? itemActiveBorder : itemBorder,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {section.icon(isActive ? itemActiveLabelColor : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(61,21,24,0.6)'))}
                <span style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? itemActiveLabelColor : itemLabelColor,
                  letterSpacing: '0.2px',
                  whiteSpace: 'nowrap',
                }}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divisor */}
        <div style={{ height: '1px', background: dividerColor, marginBottom: '16px' }} />

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px',
            borderRadius: '18px',
            background: logoutBg,
            border: logoutBorder,
            color: logoutColor,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair da conta
        </button>
      </div>
    </>
  );
};

export default AdminMoreModal;
