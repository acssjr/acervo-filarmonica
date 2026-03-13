// ===== BOTTOM NAVIGATION — LIQUID NOTCH =====
// Redesenho fiel à referência: barra full-width com notch curvo e bolha flutuante
// Otimizado para centralização perfeita e animações fluidas

import { useState, useEffect, useMemo } from 'react';
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

  const activeIndex = useMemo(() => tabs.findIndex(t => t.id === activeTab), [activeTab, tabs]);

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

  const shouldHide = isHiding || keyboardOpen;

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Cálculo da posição do notch (em porcentagem)
  const notchX = useMemo(() => {
    if (activeIndex === -1) return 50;
    return (activeIndex * 20) + 10; // Centro do tab (10, 30, 50, 70, 90)
  }, [activeIndex]);

  // SVG Path dinâmico para o "Liquid Notch"
  // Desenha uma linha reta com uma curva suave (Bezier) no centro
  const curvePath = useMemo(() => {
    const x = notchX; // Centro em %
    const w = 10; // Largura da curva em %
    return `M0,0 L${x - w},0 C${x - w / 2},0 ${x - w / 2},22 ${x},22 C${x + w / 2},22 ${x + w / 2},0 ${x + w},0 L100,0 V100 H0 Z`;
  }, [notchX]);

  return (
    <LayoutGroup>
      <nav className={`${styles.nav} mobile-only ${shouldHide ? styles.hidden : ''}`}>
        {/* Background SVG com o Notch Animado */}
        <svg className={styles.navBg} viewBox="0 0 100 70" preserveAspectRatio="none">
          <motion.path
            d={curvePath}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            animate={{ d: curvePath }}
          />
        </svg>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              data-nav={tab.id}
              data-walkthrough={tab.id === 'search' ? 'search' : undefined}
              className={styles.tabSlot}
              onClick={() => handleNavigate(tab.path)}
              onMouseEnter={() => handlePrefetch(tab.path)}
              onTouchStart={() => handlePrefetch(tab.path)}
            >
              {/* Bolha dourada flutuante */}
              {isActive && (
                <motion.div
                  className={styles.bubble}
                  layoutId="activeBubble"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                >
                  <div className={styles.bubbleIcon}>
                    <TabIcon filled />
                  </div>
                </motion.div>
              )}

              {/* Conteúdo interno da tab */}
              <div className={styles.tabContent}>
                {isActive ? (
                  <motion.span
                    className={styles.activeLabel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {tab.label}
                  </motion.span>
                ) : (
                  <div className={styles.inactiveIcon}>
                    <TabIcon />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
};

export default BottomNav;
