// ===== DESKTOP SIDEBAR =====
// Sidebar lateral para desktop com navegacao e filtros
// Refatorado: componentes extraidos para /sidebar/
// Otimizado: prefetch de rotas on hover

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { Icons } from '@constants/icons';
import { SidebarLogo, SidebarNavItem, SidebarSection } from './sidebar';

// Map de paths para funções de import (prefetch)
const ROUTE_IMPORTS = {
  '/': () => import('@screens/HomeScreen'),
  '/repertorio': () => import('@screens/RepertorioScreen'),
  '/favoritos': () => import('@screens/FavoritesScreen'),
  '/generos': () => import('@screens/GenresScreen'),
  '/compositores': () => import('@screens/ComposersScreen'),
  '/acervo': () => import('@screens/LibraryScreen'),
  '/perfil': () => import('@screens/ProfileScreen'),
  '/buscar': () => import('@screens/SearchScreen'),
};

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
    { id: 'repertorio', path: '/repertorio', icon: Icons.ListMusic, label: 'Repertorio' },
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

  // Handler de prefetch - carrega componente em background
  const prefetchRoute = useCallback((path) => {
    const importFn = ROUTE_IMPORTS[path];
    if (importFn) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => importFn(), { timeout: 500 });
      } else {
        setTimeout(() => importFn(), 50);
      }
    }
  }, []);

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
          {!sidebarCollapsed ? (
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
          ) : null}
          {navItems.map(item => (
            <div
              key={item.id}
              onMouseEnter={() => prefetchRoute(item.path)}
            >
              <SidebarNavItem
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                collapsed={sidebarCollapsed}
                onClick={() => handleNavigation(item.path)}
              />
            </div>
          ))}
        </nav>

        {/* Seção de Generos */}
        {!sidebarCollapsed && categoriesWithCount.length > 0 ? (
          <SidebarSection
            title="Generos"
            items={categoriesWithCount}
            selectedId={selectedCategory}
            onItemClick={handleCategoryClick}
            onViewAllClick={handleViewAllGenres}
            showCount={true}
          />
        ) : null}

        {/* Seção de Compositores */}
        {!sidebarCollapsed && displayComposers.length > 0 ? (
          <SidebarSection
            title="Compositores"
            items={displayComposers}
            selectedId={selectedComposer}
            onItemClick={handleComposerClick}
            onViewAllClick={handleViewAllComposers}
            showCount={true}
          />
        ) : null}

        {/* Espaçador para empurrar logout para baixo */}
        <div style={{ flex: 1, minHeight: '40px' }} />

        {/* Logout */}
        <div style={{ padding: '0 12px', marginTop: 'auto', marginBottom: '20px' }}>
          <SidebarNavItem
            icon={Icons.Logout}
            label={sidebarCollapsed ? '' : 'Sair'}
            isActive={false}
            collapsed={sidebarCollapsed}
            onClick={handleLogout}
            danger
            data-sidebar="logout"
          />
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
