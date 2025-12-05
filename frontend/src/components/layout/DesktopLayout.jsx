// ===== DESKTOP LAYOUT =====
// Wrapper de layout para desktop com sidebar

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { BREAKPOINTS } from '@constants/config';
import DesktopSidebar from './DesktopSidebar';
import DesktopHeader from './DesktopHeader';

const DesktopLayout = ({ children, activeTab, onTabChange }) => {
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.desktop : false);
  const { sidebarCollapsed } = useUI();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= BREAKPOINTS.desktop);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return children;
  }

  return (
    <div className="desktop-layout">
      <DesktopSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="desktop-main" style={{
        marginLeft: sidebarCollapsed ? '72px' : '260px',
        width: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 260px)',
        transition: 'all 0.3s ease'
      }}>
        <DesktopHeader />
        {children}
      </main>
    </div>
  );
};

export default DesktopLayout;
