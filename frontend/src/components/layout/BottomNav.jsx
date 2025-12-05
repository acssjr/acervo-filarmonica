// ===== BOTTOM NAVIGATION =====
// Navegacao movel inferior com efeito glassmorphism

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';

const BottomNav = ({ activeTab }) => {
  const navigate = useNavigate();
  const { theme, showNotifications } = useUI();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Detecta se e dispositivo touch
  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isHiding = showNotifications && isMobile;

  // Detecta quando o teclado abre/fecha
  useEffect(() => {
    if (!isMobile) return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      // Se a altura diminuiu significativamente, o teclado provavelmente abriu
      const heightDiff = initialHeight - window.visualViewport?.height;
      setKeyboardOpen(heightDiff > 150);
    };

    // Usar visualViewport se disponivel (mais preciso)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile]);

  const tabs = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Inicio' },
    { id: 'library', path: '/acervo', icon: Icons.Folder, label: 'Acervo' },
    { id: 'search', path: '/buscar', icon: Icons.Search, label: 'Buscar', isCenter: true },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' },
    { id: 'profile', path: '/perfil', icon: Icons.User, label: 'Perfil' }
  ];

  const isDark = theme === 'dark';
  const shouldHide = isHiding || keyboardOpen;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: shouldHide ? 'translateX(-50%) translateY(100px)' : 'translateX(-50%) translateY(0)',
      opacity: shouldHide ? 0 : 1,
      background: isDark
        ? 'rgba(72, 20, 21, 0.85)'
        : 'rgba(92, 26, 27, 0.88)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 8px',
      zIndex: 999,
      width: 'calc(100% - 32px)',
      maxWidth: '420px',
      borderRadius: '28px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.08)',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      pointerEvents: shouldHide ? 'none' : 'auto'
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;

        if (tab.isCenter) {
          return (
            <button
              key={tab.id}
              aria-label={tab.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #D4AF37 0%, #AA8C2C 100%)',
                border: 'none',
                color: '#3D1518',
                cursor: 'pointer',
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
                flexShrink: 0
              }}
              onClick={() => handleNavigation(tab.path)}
            >
              <div style={{ width: '28px', height: '28px' }}><tab.icon filled /></div>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none',
              color: isActive ? '#F4E4BC' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s ease',
              minWidth: '56px'
            }}
            onClick={() => handleNavigation(tab.path)}
          >
            <div style={{ width: '22px', height: '22px' }}><tab.icon filled={isActive} /></div>
            <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.2px' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
