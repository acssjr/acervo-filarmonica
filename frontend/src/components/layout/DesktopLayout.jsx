// ===== DESKTOP LAYOUT =====
// Wrapper de layout para desktop com sidebar

import { useUI } from '@contexts/UIContext';
import { BREAKPOINTS } from '@constants/config';
import { useMediaQuery } from '@hooks/useMediaQuery';
import DesktopSidebar from './DesktopSidebar';
import DesktopHeader from './DesktopHeader';

const DesktopLayout = ({ children, activeTab, onTabChange }) => {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
  const { sidebarCollapsed } = useUI();

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
