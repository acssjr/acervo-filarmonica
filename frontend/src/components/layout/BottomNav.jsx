// ===== BOTTOM NAVIGATION =====
// Navegacao movel inferior com efeito glassmorphism e indicador animado
// Otimizado: prefetch de telas on hover/touch para navegação instantânea

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import { useRoutePrefetch } from '@hooks/useRoutePrefetch';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab }) => {
  const navigate = useNavigate();
  const { theme, showNotifications } = useUI();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const handlePrefetch = useRoutePrefetch();

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

  // Handler para navegação
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className={navClasses}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;

        if (tab.isCenter) {
          return (
            <motion.button
              key={tab.id}
              data-walkthrough="search"
              aria-label={tab.label}
              className={styles.centerButton}
              onClick={() => handleNavigate(tab.path)}
              onMouseEnter={() => handlePrefetch(tab.path)} // Prefetch on hover
              onTouchStart={() => handlePrefetch(tab.path)} // Prefetch on touch
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.div
                className={styles.centerIcon}
                animate={{ rotate: isActive ? 0 : 0 }}
              >
                <tab.icon filled />
              </motion.div>
            </motion.button>
          );
        }

        return (
          <motion.button
            key={tab.id}
            data-nav={tab.id}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`${styles.tabButton} ${isActive ? styles.active : styles.inactive}`}
            onClick={() => handleNavigate(tab.path)}
            onMouseEnter={() => handlePrefetch(tab.path)} // Prefetch on hover
            onTouchStart={() => handlePrefetch(tab.path)} // Prefetch on touch
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Indicador animado - só aparece no tab ativo */}
            {isActive ? (
              <motion.div
                layoutId="bottomNavIndicator"
                className={styles.indicator}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            ) : null}
            <motion.div
              className={styles.tabIcon}
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <tab.icon filled={isActive} />
            </motion.div>
            <motion.span
              className={styles.tabLabel}
              animate={{
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1.05 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {tab.label}
            </motion.span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
