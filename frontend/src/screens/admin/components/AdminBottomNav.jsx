// ===== ADMIN BOTTOM NAV =====
// Navegação inferior para o painel admin no mobile — floating pill liquid glass
// Espelho do BottomNav.module.css do lado público

import { useUI } from '@contexts/UIContext';

const AdminBottomNav = ({ activeSection, onNavigate, onOpenMenu }) => {
  const { theme } = useUI();
  const mainSections = ['dashboard', 'musicos', 'partituras', 'categorias'];
  const isMoreActive = !mainSections.includes(activeSection);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      id: 'musicos',
      label: 'Músicos',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'partituras',
      label: 'Partituras',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      )
    },
    {
      id: 'categorias',
      label: 'Categorias',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'mais',
      label: 'Mais',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )
    },
  ];

  const isDark = theme === 'dark';

  const navBackground = isDark
    ? 'linear-gradient(135deg, rgba(65, 18, 20, 0.4) 0%, rgba(20, 5, 5, 0.6) 100%)'
    : 'linear-gradient(135deg, rgba(75, 12, 14, 0.7) 0%, rgba(45, 5, 5, 0.9) 100%)';

  const navBorderTop = isDark
    ? '1px solid rgba(255, 255, 255, 0.18)'
    : '1px solid rgba(255, 235, 235, 0.25)';

  const navBorderLeft = isDark
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 235, 235, 0.15)';

  const navBorderRight = isDark
    ? '1px solid rgba(0, 0, 0, 0.4)'
    : '1px solid rgba(20, 0, 0, 0.2)';

  const navBorderBottom = isDark
    ? '1px solid rgba(0, 0, 0, 0.5)'
    : '1px solid rgba(20, 0, 0, 0.3)';

  const navBoxShadow = isDark
    ? '0 20px 48px rgba(0,0,0,0.7), inset 0 1.5px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.6)'
    : '0 16px 36px rgba(45, 5, 5, 0.3), inset 0 1.5px 1px rgba(255, 235, 235, 0.3), inset 0 -1.5px 2px rgba(0, 0, 0, 0.4)';

  const activeItemBackground = isDark
    ? 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.22) 0%, transparent 70%)'
    : 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.30) 0%, transparent 70%)';

  return (
    <nav
      aria-label="Navegação admin"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
        height: '80px',
        borderRadius: '40px',
        padding: '0 10px',
        background: navBackground,
        backdropFilter: 'blur(32px) saturate(160%)',
        WebkitBackdropFilter: 'blur(32px) saturate(160%)',
        borderTop: navBorderTop,
        borderLeft: navBorderLeft,
        borderRight: navBorderRight,
        borderBottom: navBorderBottom,
        boxShadow: navBoxShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 999,
      }}
    >
      {navItems.map(item => {
        const isActive = item.id === 'mais' ? isMoreActive : activeSection === item.id;
        const handleClick = item.id === 'mais' ? onOpenMenu : () => onNavigate(item.id);

        return (
          <button
            key={item.id}
            onClick={handleClick}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 10px',
              background: isActive ? activeItemBackground : 'transparent',
              border: 'none',
              borderRadius: '28px',
              cursor: 'pointer',
              color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.2s ease, background 0.2s ease',
              flex: 1,
              height: '100%',
              minWidth: 0,
            }}
          >
            <div style={{
              transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.2s ease',
            }}>
              {item.icon(isActive)}
            </div>

            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '500',
              letterSpacing: '0.2px',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default AdminBottomNav;
