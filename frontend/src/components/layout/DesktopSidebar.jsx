// ===== DESKTOP SIDEBAR =====
// Sidebar lateral para desktop com navegacao e filtros
// Refatorado: componentes extraidos para /sidebar/

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { Icons } from '@constants/icons';
import { SidebarLogo, SidebarNavItem, SidebarSection } from './sidebar';

const DesktopSidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();
  const {
    selectedCategory, setSelectedCategory,
    selectedComposer, setSelectedComposer,
    sheets, categories
  } = useData();

  const sidebarContentRef = useRef(null);

  // Extrair compositores unicos das partituras (filtrando vazios)
  const composers = useMemo(() => {
    const composerSet = new Set(sheets.map(s => s.composer).filter(c => c && c.trim()));
    return Array.from(composerSet).sort();
  }, [sheets]);

  // Memoiza categorias ordenadas por quantidade (top 4)
  const categoriesWithCount = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      name: cat.name,
      count: sheets.filter(s => s.category === cat.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [sheets, categories]);

  // Memoiza compositores a exibir (top 3 por prioridade ou quantidade)
  const displayComposers = useMemo(() => {
    const priorityComposers = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heraclio Guerreiro'];
    const topComposers = priorityComposers.filter(name => composers.includes(name)).slice(0, 3);

    if (topComposers.length > 0) {
      return topComposers.map(name => ({ name, id: name }));
    }

    return composers
      .map(comp => ({ name: comp, id: comp, count: sheets.filter(s => s.composer === comp).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [composers, sheets]);

  const navItems = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Inicio' },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' }
  ];

  // Bloqueia scroll da pagina quando mouse esta na sidebar
  const handleWheel = useCallback((e) => {
    const content = sidebarContentRef.current;
    if (!content) return;

    const { scrollTop, scrollHeight, clientHeight } = content;
    const hasScroll = scrollHeight > clientHeight;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (!hasScroll || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    const sidebar = document.querySelector('.desktop-sidebar');
    if (sidebar) {
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Handlers de navegacao
  const handleNavigation = (path) => navigate(path);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(null);
    setSelectedComposer(null);
    handleNavigation(`/acervo/${cat.id}`);
  };

  const handleComposerClick = (comp) => {
    setSelectedComposer(comp.name);
    setSelectedCategory(null);
    handleNavigation('/acervo');
  };

  const handleViewAllGenres = () => {
    setSelectedCategory(null);
    setSelectedComposer(null);
    handleNavigation('/generos');
  };

  const handleViewAllComposers = () => {
    setSelectedCategory(null);
    setSelectedComposer(null);
    handleNavigation('/compositores');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: sidebarCollapsed ? '72px' : '260px',
        minWidth: sidebarCollapsed ? '72px' : '260px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        style={{
          position: 'absolute',
          top: '24px',
          right: '-14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
          border: '2px solid #D4AF37',
          color: '#F4E4BC',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 110,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ width: '14px', height: '14px' }}>
          {sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
        </div>
      </button>

      {/* Conteudo scrollavel */}
      <div ref={sidebarContentRef} className="desktop-sidebar-content">
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '0 12px' : '0 20px', marginBottom: '32px', marginTop: '8px' }}>
          <SidebarLogo collapsed={sidebarCollapsed} />
        </div>

        {/* Navegacao Principal */}
        <nav style={{ padding: '0 12px', marginBottom: '20px' }}>
          {!sidebarCollapsed && (
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '10px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 12px',
              marginBottom: '8px'
            }}>Menu</p>
          )}
          {navItems.map(item => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              collapsed={sidebarCollapsed}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </nav>

        {/* Secoes de Generos e Compositores */}
        {!sidebarCollapsed && (
          <div style={{ padding: '0 12px' }}>
            <SidebarSection
              title="Generos"
              items={categoriesWithCount}
              selectedId={selectedCategory}
              showCount
              onItemClick={handleCategoryClick}
              onHeaderClick={handleViewAllGenres}
              onViewAllClick={handleViewAllGenres}
            />

            <SidebarSection
              title="Compositores"
              items={displayComposers}
              selectedId={selectedComposer}
              onItemClick={handleComposerClick}
              onHeaderClick={handleViewAllComposers}
              onViewAllClick={handleViewAllComposers}
            />
          </div>
        )}
      </div>

      {/* Perfil e Sair - Fixo no final */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <SidebarNavItem
          icon={Icons.User}
          label="Perfil"
          isActive={activeTab === 'profile'}
          collapsed={sidebarCollapsed}
          onClick={() => handleNavigation('/perfil')}
        />
        <SidebarNavItem
          icon={Icons.Logout}
          label="Sair"
          isActive={false}
          collapsed={sidebarCollapsed}
          onClick={handleLogout}
          danger
        />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
