// ===== BOTTOM NAVIGATION =====
// Navegacao movel inferior com efeito glassmorphism

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab }) => {
  const navigate = useNavigate();
  const { theme, showNotifications } = useUI();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isHiding = showNotifications && isMobile;

  useEffect(() => {
    if (!isMobile) return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const heightDiff = initialHeight - window.visualViewport?.height;
      setKeyboardOpen(heightDiff > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile]);

  const tabs = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Início' },
    { id: 'repertorio', path: '/repertorio', icon: Icons.ListMusic, label: 'Repertório' },
    { id: 'search', path: '/buscar', icon: Icons.Search, label: 'Buscar', isCenter: true },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' },
    { id: 'profile', path: '/perfil', icon: Icons.User, label: 'Perfil' }
  ];

  const isDark = theme === 'dark';
  const shouldHide = isHiding || keyboardOpen;

  const navClasses = [
    'mobile-only',
    styles.nav,
    isDark ? styles.dark : styles.light,
    shouldHide ? styles.hidden : styles.visible
  ].join(' ');

  return (
    <nav className={navClasses}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;

        if (tab.isCenter) {
          return (
            <button
              key={tab.id}
              aria-label={tab.label}
              className={styles.centerButton}
              onClick={() => navigate(tab.path)}
            >
              <div className={styles.centerIcon}><tab.icon filled /></div>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`${styles.tabButton} ${isActive ? styles.active : styles.inactive}`}
            onClick={() => navigate(tab.path)}
          >
            <div className={styles.tabIcon}><tab.icon filled={isActive} /></div>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
