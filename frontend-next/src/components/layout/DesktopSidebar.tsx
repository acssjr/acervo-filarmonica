"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useData } from "@contexts/DataContext";
import { Icons } from "@constants/icons";
import { SidebarLogo, SidebarNavItem, SidebarSection } from "./sidebar";

interface DesktopSidebarProps {
  activeTab: string;
}

const DesktopSidebar = ({ activeTab }: DesktopSidebarProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();
  const { selectedCategory, setSelectedCategory, selectedComposer, setSelectedComposer, sheets, categories } = useData();
  const sidebarContentRef = useRef<HTMLDivElement>(null);

  const composers = useMemo(() => {
    const composerSet = new Set(sheets.map(s => s.composer).filter(c => c && c.trim()));
    return Array.from(composerSet).sort();
  }, [sheets]);

  const categoriesWithCount = useMemo(() => {
    return categories.map(cat => ({ ...cat, count: sheets.filter(s => s.category === cat.id).length })).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [sheets, categories]);

  const displayComposers = useMemo(() => {
    const priorityComposers = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heraclio Guerreiro'];
    const topComposers = priorityComposers.filter(name => composers.includes(name)).slice(0, 3);
    if (topComposers.length > 0) return topComposers.map(name => ({ name, id: name }));
    return composers.map(comp => ({ name: comp, id: comp, count: sheets.filter(s => s.composer === comp).length })).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 3);
  }, [composers, sheets]);

  const navItems = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Inicio' },
    { id: 'repertorio', path: '/repertorio', icon: Icons.ListMusic, label: 'Repertório' },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' }
  ];

  const handleWheel = useCallback((e: WheelEvent) => {
    const content = sidebarContentRef.current;
    if (!content) return;
    const { scrollTop, scrollHeight, clientHeight } = content;
    const hasScroll = scrollHeight > clientHeight;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if (!hasScroll || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) { e.preventDefault(); e.stopPropagation(); }
  }, []);

  useEffect(() => {
    const sidebar = document.querySelector('.desktop-sidebar');
    if (sidebar) {
      sidebar.addEventListener('wheel', handleWheel as EventListener, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel as EventListener);
    }
  }, [handleWheel]);

  const handleNavigation = (path: string) => router.push(path);
  const handleCategoryClick = (cat: { id?: string; name: string }) => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation(`/acervo/${cat.id}`); };
  const handleComposerClick = (comp: { name: string }) => { setSelectedComposer(comp.name); setSelectedCategory(null); handleNavigation('/acervo'); };
  const handleViewAllGenres = () => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/generos'); };
  const handleViewAllComposers = () => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/compositores'); };
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <aside className="desktop-sidebar" style={{ width: sidebarCollapsed ? '72px' : '260px', minWidth: sidebarCollapsed ? '72px' : '260px', transition: 'all 0.3s ease', position: 'fixed', top: 0, left: 0, height: '100vh', background: 'linear-gradient(180deg, #722F37 0%, #5C1A1B 50%, #3D1518 100%)', display: 'flex', flexDirection: 'column', zIndex: 300, overflow: 'hidden' }}>
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'} style={{ position: 'absolute', top: '24px', right: '-14px', width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)', border: '2px solid #D4AF37', color: '#F4E4BC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', zIndex: 110, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div style={{ width: '14px', height: '14px' }}>{sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}</div>
      </button>
      <div ref={sidebarContentRef} className="desktop-sidebar-content" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 0' }}>
        <div style={{ padding: sidebarCollapsed ? '0 12px' : '0 20px', marginBottom: '32px', marginTop: '8px' }}>
          <SidebarLogo collapsed={sidebarCollapsed} />
        </div>
        <nav style={{ padding: '0 12px', marginBottom: '20px' }}>
          {!sidebarCollapsed && <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 12px', marginBottom: '8px' }}>Menu</p>}
          {navItems.map(item => (
            <SidebarNavItem key={item.id} data-sidebar={item.id} icon={item.icon} label={item.label} isActive={activeTab === item.id} collapsed={sidebarCollapsed} onClick={() => handleNavigation(item.path)} />
          ))}
        </nav>
        {!sidebarCollapsed && (
          <div style={{ padding: '0 12px' }}>
            <SidebarSection title="Gêneros" items={categoriesWithCount} selectedId={selectedCategory} showCount onItemClick={handleCategoryClick} onHeaderClick={handleViewAllGenres} onViewAllClick={handleViewAllGenres} />
            <SidebarSection title="Compositores" items={displayComposers} selectedId={selectedComposer} onItemClick={handleComposerClick} onHeaderClick={handleViewAllComposers} onViewAllClick={handleViewAllComposers} />
          </div>
        )}
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <SidebarNavItem icon={Icons.User} label="Perfil" isActive={activeTab === 'profile'} collapsed={sidebarCollapsed} onClick={() => handleNavigation('/perfil')} />
        <SidebarNavItem icon={Icons.Logout} label="Sair" isActive={false} collapsed={sidebarCollapsed} onClick={handleLogout} danger />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
