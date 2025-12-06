// ===== ADMIN APP =====
// Layout principal do painel administrativo
// Suporta navegacao via URL: /admin, /admin/:secao

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import ThemeSelector from '@components/common/ThemeSelector';
import AdminToggle from '@components/common/AdminToggle';
import AdminContext from './AdminContext';
import AdminDashboard from './AdminDashboard';
import AdminMusicos from './AdminMusicos';
import AdminPartituras from './AdminPartituras';
import AdminCategorias from './AdminCategorias';
import AdminConfig from './AdminConfig';

const AdminApp = () => {
  const navigate = useNavigate();
  const { secao } = useParams();
  const [activeSection, setActiveSection] = useState(secao || 'dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode } = useUI();

  // Funcao de logout
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Detecta mudanca de tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadStats = async () => {
    try {
      const data = await API.getEstatisticasAdmin();
      setStats(data || {});
    } catch (e) {
      console.error('Erro ao carregar estatisticas:', e);
    }
    setLoading(false);
  };

  useEffect(() => { loadStats(); }, []);

  // Sincroniza secao da URL com estado
  useEffect(() => {
    if (secao && secao !== activeSection) {
      setActiveSection(secao);
    }
  }, [secao]);

  // Funcao para navegar entre secoes
  const navigateToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    navigate(`/admin/${section}`, { replace: true });
  };

  // Navigation helper (para compatibilidade)
  useEffect(() => {
    window.adminNav = (section, action) => {
      navigateToSection(section);
      if (action) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(`admin-${section}-action`, { detail: action }));
        }, 100);
      }
    };
    return () => { delete window.adminNav; };
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'musicos', icon: 'users', label: 'Músicos' },
    { id: 'partituras', icon: 'music', label: 'Partituras' },
    { id: 'categorias', icon: 'folder', label: 'Categorias' },
    { id: 'config', icon: 'settings', label: 'Configurações' },
  ];

  // Icones do menu como SVG
  const MenuIcon = ({ type, active }) => {
    const color = active ? '#D4AF37' : 'var(--text-secondary)';
    const icons = {
      dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      music: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      ),
      folder: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    };
    return icons[type] || icons.music;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard />;
      case 'musicos': return <AdminMusicos />;
      case 'partituras': return <AdminPartituras />;
      case 'categorias': return <AdminCategorias />;
      case 'config': return <AdminConfig />;
      default: return <AdminDashboard />;
    }
  };

  // Icones de tema
  const ThemeIcon = ({ mode }) => {
    if (mode === 'light') return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    if (mode === 'dark') return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
  };

  const cycleTheme = () => {
    const modes = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  return (
    <AdminContext.Provider value={{ stats, loading, refreshData: loadStats }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'Outfit, sans-serif' }}>

        {/* Header Mobile */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 1000
          }}>
            {/* Menu Hamburguer */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Titulo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src="/assets/images/ui/brasao-256x256.png" alt="Brasao" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
                </div>
              </div>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>Painel Admin</span>
            </div>

            {/* Acoes Mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={cycleTheme}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ThemeIcon mode={themeMode} />
              </button>
              <AdminToggle />
            </div>
          </div>
        )}

        {/* Overlay Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
          />
        )}

        {/* Sidebar */}
        <div style={{
          width: isMobile ? '280px' : (sidebarCollapsed ? '72px' : '260px'),
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transition: isMobile ? 'transform 0.3s ease' : 'width 0.3s ease',
          ...(isMobile ? {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1002,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
          } : {})
        }}>
          {/* Header com Logo e botao recolher/fechar */}
          <div style={{ padding: sidebarCollapsed && !isMobile ? '16px 12px' : '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start', flex: 1 }}>
                {/* Icone com circulo dourado */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img src="/assets/images/ui/brasao-256x256.png" alt="Brasao" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
                  </div>
                </div>
                {(!sidebarCollapsed || isMobile) && (
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Acervo Digital</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>Painel Admin</div>
                  </div>
                )}
              </div>
              {/* Botao Fechar (mobile) ou Recolher (desktop) */}
              {isMobile ? (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              ) : !sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  title="Recolher menu"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
                  </svg>
                </button>
              )}
            </div>
            {/* Botao expandir quando colapsado (apenas desktop) */}
            {!isMobile && sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                title="Expandir menu"
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
                </svg>
              </button>
            )}
          </div>

          {/* User Info - Clicavel para ir as configuracoes */}
          <button
            onClick={() => navigateToSection('config')}
            style={{
              width: '100%',
              padding: sidebarCollapsed && !isMobile ? '12px' : '16px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              textAlign: 'left'
            }}
            title="Ir para configurações"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start'
            }}>
              {/* Avatar com circulo dourado */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)',
                flexShrink: 0
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: user?.foto_perfil ? `url(${user.foto_perfil}) center/cover` : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#F4E4BC',
                  fontWeight: '600',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  {!user?.foto_perfil && (user?.name?.charAt(0)?.toUpperCase() || 'A')}
                </div>
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>
                    {user?.name || 'Administrador'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
                    @{user?.username || 'admin'}
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Menu Items */}
          <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed && !isMobile ? '12px' : '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: activeSection === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  border: activeSection === item.id ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  color: activeSection === item.id ? '#D4AF37' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: activeSection === item.id ? '600' : '500'
                }}
                title={sidebarCollapsed && !isMobile ? item.label : ''}
              >
                <MenuIcon type={item.icon} active={activeSection === item.id} />
                {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Botao Sair */}
          <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed && !isMobile ? '12px' : '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'rgba(239, 68, 68, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '500'
              }}
              title={sidebarCollapsed && !isMobile ? 'Sair' : ''}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.8)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {(!sidebarCollapsed || isMobile) && <span>Sair</span>}
            </button>
          </div>

        </div>

        {/* Main Content */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          marginTop: isMobile ? '60px' : 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header Desktop com toggle de tema */}
          {!isMobile && (
            <header style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-primary)'
            }}>
              {/* Titulo da secao atual */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <h1 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
              </div>

              {/* Acoes do header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ThemeSelector inline />
                <AdminToggle />
              </div>
            </header>
          )}

          {/* Conteudo */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
};

export default AdminApp;
