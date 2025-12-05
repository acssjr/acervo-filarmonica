// ===== DESKTOP SIDEBAR =====
// Sidebar lateral para desktop com navegacao e filtros

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { Icons } from '@constants/icons';
import { CATEGORIES } from '@constants/categories';

const DesktopSidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();
  const {
    selectedCategory, setSelectedCategory,
    selectedComposer, setSelectedComposer,
    sheets
  } = useData();

  const [genresExpanded, setGenresExpanded] = useState(true);
  const [composersExpanded, setComposersExpanded] = useState(true);

  // Extrair compositores unicos das partituras (filtrando vazios)
  const composers = useMemo(() => {
    const composerSet = new Set(sheets.map(s => s.composer).filter(c => c && c.trim()));
    return Array.from(composerSet).sort();
  }, [sheets]);

  const navItems = [
    { id: 'home', path: '/', icon: Icons.Home, label: 'Inicio' },
    { id: 'favorites', path: '/favoritos', icon: Icons.Heart, label: 'Favoritos' }
  ];

  // Item de perfil separado para ficar no final
  const profileItem = { id: 'profile', path: '/perfil', icon: Icons.User, label: 'Perfil' };

  const sidebarContentRef = useRef(null);

  // Bloqueia scroll da pagina quando mouse esta na sidebar
  const handleWheel = useCallback((e) => {
    const content = sidebarContentRef.current;
    if (!content) return;

    const { scrollTop, scrollHeight, clientHeight } = content;
    const hasScroll = scrollHeight > clientHeight;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    // Se nao ha scroll ou esta nos limites, bloqueia propagacao
    if (!hasScroll || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Adiciona event listener com passive: false para poder usar preventDefault
  useEffect(() => {
    const sidebar = document.querySelector('.desktop-sidebar');
    if (sidebar) {
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Funcao de navegacao
  const handleNavigation = (path) => {
    navigate(path);
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
      {/* Toggle Button - na borda direita da sidebar */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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

      {/* Conteudo scrollavel da sidebar */}
      <div ref={sidebarContentRef} className="desktop-sidebar-content">

        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '0 12px' : '0 20px', marginBottom: '32px', marginTop: '8px' }}>
          {sidebarCollapsed ? (
            <div style={{
              textAlign: 'center',
              width: '40px',
              height: '40px',
              margin: '0 auto',
              background: 'rgba(244, 228, 188, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(244, 228, 188, 0.3)',
              overflow: 'hidden',
              padding: '4px'
            }}>
              <img
                src="/assets/images/ui/brasao-256x256.png"
                alt="Brasao"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Logo da filarmonica */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(244, 228, 188, 0.15)',
                border: '2px solid rgba(244, 228, 188, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
                padding: '5px'
              }}>
                <img
                  src="/assets/images/ui/brasao-256x256.png"
                  alt="Brasao"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <h1 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#F4E4BC',
                  marginBottom: '1px',
                  lineHeight: '1.2'
                }}>
                  S.F. 25 de Marco
                </h1>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Feira de Santana - BA</p>
                <p style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '9px',
                  fontWeight: '600',
                  color: '#D4AF37',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>Acervo Digital</p>
              </div>
            </div>
          )}
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
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                title={sidebarCollapsed ? item.label : ''}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  padding: sidebarCollapsed ? '11px' : '11px 12px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px'
                }}
              >
                <div style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                  <item.icon filled={isActive} />
                </div>
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Container para Generos e Compositores */}
        <div style={{ padding: '0 12px' }}>

          {/* Secao Generos - Top 4 por popularidade */}
          {!sidebarCollapsed && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '12px'
            }}>
              <button
                onClick={() => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/generos'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '4px 4px 8px 4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'rgba(244, 228, 188, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  transition: 'color 0.2s'
                }}
                  onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(244, 228, 188, 0.6)'}
                >Generos</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 228, 188, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Lista de Generos - Top 4 */}
              <div>
                {(() => {
                  // Ordenar categorias por quantidade de partituras
                  const categoriesWithCount = CATEGORIES.map(cat => ({
                    ...cat,
                    count: sheets.filter(s => s.category === cat.id).length
                  })).sort((a, b) => b.count - a.count).slice(0, 4);

                  return categoriesWithCount.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation(`/acervo/${cat.id}`); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          paddingLeft: '14px',
                          background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          color: isActive ? '#D4AF37' : 'rgba(244, 228, 188, 0.85)',
                          cursor: 'pointer',
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          marginBottom: '2px',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                            e.currentTarget.style.color = '#F4E4BC';
                          }
                          const bar = e.currentTarget.querySelector('.sidebar-bar');
                          if (bar) bar.style.height = isActive ? '24px' : '16px';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(244, 228, 188, 0.85)';
                          }
                          const bar = e.currentTarget.querySelector('.sidebar-bar');
                          if (bar) bar.style.height = isActive ? '24px' : '0px';
                        }}
                      >
                        <div
                          className="sidebar-bar"
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            height: isActive ? '24px' : '0px',
                            background: '#D4AF37',
                            borderRadius: '2px',
                            transition: 'height 0.2s ease'
                          }}
                        />
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>{cat.count}</span>
                      </button>
                    );
                  });
                })()}

                {/* Ver todos */}
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/generos'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    marginTop: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Ver todos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Secao Compositores - Top 3 por importancia */}
          {!sidebarCollapsed && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '12px'
            }}>
              <button
                onClick={() => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/compositores'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '4px 4px 8px 4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'rgba(244, 228, 188, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  transition: 'color 0.2s'
                }}
                  onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(244, 228, 188, 0.6)'}
                >Compositores</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 228, 188, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Lista de Compositores - Top 3 por importancia */}
              <div>
                {(() => {
                  // Compositores prioritarios (ordem de importancia)
                  const priorityComposers = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heraclio Guerreiro'];

                  // Filtrar apenas os que existem no acervo
                  const topComposers = priorityComposers
                    .filter(name => composers.includes(name))
                    .slice(0, 3);

                  // Se nao tiver os prioritarios, usa os que tem mais partituras
                  let displayComposers = topComposers;
                  if (topComposers.length === 0) {
                    displayComposers = composers
                      .map(comp => ({ name: comp, count: sheets.filter(s => s.composer === comp).length }))
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3)
                      .map(c => c.name);
                  }

                  return displayComposers.map(compName => (
                    <button
                      key={compName}
                      onClick={() => { setSelectedComposer(compName); setSelectedCategory(null); handleNavigation('/acervo'); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        paddingLeft: '14px',
                        background: selectedComposer === compName ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: selectedComposer === compName ? '#D4AF37' : 'rgba(244, 228, 188, 0.85)',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        marginBottom: '2px',
                        textAlign: 'left',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedComposer !== compName) {
                          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                          e.currentTarget.style.color = '#F4E4BC';
                        }
                        const bar = e.currentTarget.querySelector('.sidebar-bar');
                        if (bar) bar.style.height = selectedComposer === compName ? '24px' : '16px';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedComposer !== compName) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(244, 228, 188, 0.85)';
                        }
                        const bar = e.currentTarget.querySelector('.sidebar-bar');
                        if (bar) bar.style.height = selectedComposer === compName ? '24px' : '0px';
                      }}
                    >
                      <div
                        className="sidebar-bar"
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '3px',
                          height: selectedComposer === compName ? '24px' : '0px',
                          background: '#D4AF37',
                          borderRadius: '2px',
                          transition: 'height 0.2s ease'
                        }}
                      />
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{compName}</span>
                    </button>
                  ));
                })()}

                {/* Ver todos */}
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedComposer(null); handleNavigation('/compositores'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    marginTop: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Ver todos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Perfil - Fixo no final da sidebar */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto'
      }}>
        <button
          onClick={() => handleNavigation(profileItem.path)}
          title={sidebarCollapsed ? profileItem.label : ''}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: sidebarCollapsed ? '11px' : '11px 12px',
            background: activeTab === 'profile' ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            color: activeTab === 'profile' ? '#fff' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: activeTab === 'profile' ? '600' : '500',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '18px', height: '18px', flexShrink: 0 }}>
            <Icons.User filled={activeTab === 'profile'} />
          </div>
          {!sidebarCollapsed && profileItem.label}
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
