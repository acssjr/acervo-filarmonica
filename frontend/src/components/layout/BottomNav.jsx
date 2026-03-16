// ===== BOTTOM NAVIGATION — LIQUID GLASS =====
// Efeito de "vidro líquido" flutuante com suporte perfeito a modo claro e escuro.
// Botão de busca centralizado ("Floating Action Button"), labels fixas reduzidas
// e animação de background sofisticada entre ícones (layoutId).

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import { useRoutePrefetch } from '@hooks/useRoutePrefetch';
import styles from './BottomNav.module.css';

const BottomNav = ({ activeTab }) => {
  const navigate = useNavigate();
  const { theme, showNotifications } = useUI();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const handlePrefetch = useRoutePrefetch();

  const tabs = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Início' },
    { id: 'repertorio', path: '/repertorio', icon: Icons.ListMusic, label: 'Repertório' },
    { id: 'search', path: '/buscar', icon: Icons.Search, label: 'Buscar' },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' },
    { id: 'profile', path: '/perfil', icon: Icons.User, label: 'Perfil' }
  ];

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

  const isDark = theme === 'dark';
  const shouldHide = isHiding || keyboardOpen;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <LayoutGroup>
      <nav className={`${styles.nav} mobile-only ${isDark ? styles.dark : styles.light} ${shouldHide ? styles.hidden : styles.visible}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCenter = tab.id === 'search';
          const TabIcon = tab.icon;

          if (isCenter) {
            return (
              <motion.button
                key={tab.id}
                data-nav={tab.id}
                data-walkthrough="search"
                className={`${styles.centerButton} ${isActive ? styles.centerActive : ''}`}
                onClick={() => handleNavigate(tab.path)}
                onMouseEnter={() => handlePrefetch(tab.path)}
                onTouchStart={() => handlePrefetch(tab.path)}
                whileTap={{ scale: 0.88, rotate: -5 }}
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                aria-label={tab.label}
              >
                <div className={styles.centerIconWrap}>
                  <TabIcon filled />
                </div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              data-nav={tab.id}
              className={`${styles.tabSlot} ${isActive ? styles.active : ''}`}
              onClick={() => handleNavigate(tab.path)}
              onMouseEnter={() => handlePrefetch(tab.path)}
              onTouchStart={() => handlePrefetch(tab.path)}
              whileTap={{ scale: 0.88, y: 3 }} // Animação tátil que pressiona para baixo ("press down")
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Efeito highlight com LayoutId trocando fluido entre abas */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={styles.activeBackground}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <div className={styles.tabContent}>
                <motion.div
                  className={styles.tabIcon}
                  animate={{
                    y: isActive ? -4 : 0,
                    scale: isActive ? 1.15 : 1,
                    color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.65)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <TabIcon filled={isActive} />
                </motion.div>

                <motion.span
                  className={styles.tabLabel}
                  animate={{
                    opacity: isActive ? 1 : 0.85,
                    color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.65)',
                    fontWeight: isActive ? 800 : 700,
                    y: isActive ? -1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
};

export default BottomNav;
