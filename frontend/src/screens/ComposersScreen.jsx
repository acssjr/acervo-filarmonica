// ===== COMPOSERS SCREEN =====
// Tela de compositores com fotos e glassmorphism
// Suporta navegacao via URL: /compositores, /compositores/:slug

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@contexts/DataContext';
import { slugify } from '@utils/slugify';

// Compositores prioritários (ordem de importância para a banda) - definido fora do componente para estabilidade
const PRIORITY_ORDER = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heráclio Guerreiro'];

const ComposersScreen = ({ composerSlugFromUrl }) => {
  const navigate = useNavigate();
  const { sheets, setSelectedComposer, setSelectedCategory } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('count'); // 'count' ou 'alpha'

  // Fotos dos compositores (caminhos locais - WebP otimizado)
  const composerPhotos = {
    'Estevam Moura': '/assets/images/compositores/estevam-moura.webp',
    'Tertuliano Santos': '/assets/images/compositores/tertuliano-santos.webp',
    'Amando Nobre': '/assets/images/compositores/amando-nobre.webp',
    'Heráclio Guerreiro': '/assets/images/compositores/heraclio-guerreiro.webp'
  };

  // Calcular compositores com contagem
  const composersWithCount = useMemo(() => {
    const composerMap = {};
    sheets.forEach(s => {
      if (s.composer && s.composer.trim()) {
        if (!composerMap[s.composer]) {
          composerMap[s.composer] = 0;
        }
        composerMap[s.composer]++;
      }
    });

    return Object.entries(composerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const aIndex = PRIORITY_ORDER.indexOf(a.name);
        const bIndex = PRIORITY_ORDER.indexOf(b.name);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return b.count - a.count;
      });
  }, [sheets]);

  // Scroll to top quando a tela abrir
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Se vier slug da URL, redireciona para o acervo com o compositor selecionado
  useEffect(() => {
    if (composerSlugFromUrl && composersWithCount.length > 0) {
      // Busca o compositor pelo slug
      const composer = composersWithCount.find(c => slugify(c.name) === composerSlugFromUrl);
      if (composer) {
        setSelectedComposer(composer.name);
        setSelectedCategory(null);
        navigate('/acervo');
      }
    }
  }, [composerSlugFromUrl, composersWithCount, setSelectedComposer, setSelectedCategory, navigate]);

  // Filtrar por busca
  const filteredComposers = useMemo(() => {
    if (!searchQuery.trim()) return composersWithCount;
    const query = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return composersWithCount.filter(c =>
      c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
    );
  }, [composersWithCount, searchQuery]);

  // Separar destaque dos demais
  const featuredComposers = filteredComposers.filter(c => PRIORITY_ORDER.includes(c.name));
  const otherComposers = useMemo(() => {
    const others = filteredComposers.filter(c => !PRIORITY_ORDER.includes(c.name));
    if (sortBy === 'alpha') {
      return [...others].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }
    return [...others].sort((a, b) => b.count - a.count);
  }, [filteredComposers, sortBy]);

  const handleSelectComposer = (composerName) => {
    setSelectedComposer(composerName);
    setSelectedCategory(null);
    navigate('/acervo');
  };

  // Componente de Card do Compositor com Glassmorphism
  const ComposerCard = ({ composer, featured = false }) => {
    const hasPhoto = composerPhotos[composer.name];
    const photoUrl = hasPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(composer.name)}&size=400&background=2a2a38&color=D4AF37&bold=true&font-size=0.4`;

    return (
      <button
        onClick={() => handleSelectComposer(composer.name)}
        style={{
          position: 'relative',
          width: '100%',
          height: featured ? '160px' : '120px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: 'none',
          cursor: 'pointer',
          background: 'var(--bg-card)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Imagem de fundo com zoom out */}
        <div style={{
          position: 'absolute',
          inset: '-15%',
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'brightness(0.9)'
        }} />

        {/* Gradiente escuro na parte inferior */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)'
        }} />

        {/* Badge de destaque */}
        {featured && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '3px 8px',
            background: 'rgba(212, 175, 55, 0.9)',
            borderRadius: '20px',
            fontSize: '9px',
            fontWeight: '600',
            color: '#1a1a1a',
            fontFamily: 'Outfit, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Destaque
          </div>
        )}

        {/* Conteúdo com Glassmorphism */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '8px 10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: featured ? '13px' : '12px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '1px',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.3'
          }}>
            {composer.name}
          </h3>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.75)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            lineHeight: '1.2'
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            {composer.count} {composer.count === 1 ? 'partitura' : 'partituras'}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="screen-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '0'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Compositores
        </h1>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          color: 'var(--text-muted)'
        }}>
          Mestres da música que moldaram o repertório da filarmônica
        </p>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '32px', maxWidth: '400px' }}>
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar compositor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredComposers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>Nenhum compositor encontrado</p>
        </div>
      ) : (
        <>
          {/* Compositores em Destaque */}
          {featuredComposers.length > 0 && !searchQuery && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                color: '#D4AF37',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                </svg>
                Destaques
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px'
              }}>
                {featuredComposers.map(comp => (
                  <ComposerCard key={comp.name} composer={comp} featured />
                ))}
              </div>
            </div>
          )}

          {/* Outros Compositores - Lista textual */}
          {(searchQuery ? filteredComposers.filter(c => !PRIORITY_ORDER.includes(c.name)) : otherComposers).length > 0 && (
            <div>
              {/* Header com título e ordenação */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h2 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}>
                  {searchQuery ? 'Resultados' : 'Todos os Compositores'} ({(searchQuery ? filteredComposers.filter(c => !PRIORITY_ORDER.includes(c.name)) : otherComposers).length})
                </h2>

                {/* Botões de ordenação */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  background: 'var(--bg-card)',
                  borderRadius: '8px',
                  padding: '3px',
                  border: '1px solid var(--border)'
                }}>
                  <button
                    onClick={() => setSortBy('count')}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: sortBy === 'count' ? 'var(--primary)' : 'transparent',
                      color: sortBy === 'count' ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Partituras
                  </button>
                  <button
                    onClick={() => setSortBy('alpha')}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: sortBy === 'alpha' ? 'var(--primary)' : 'transparent',
                      color: sortBy === 'alpha' ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              {/* Lista textual */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden'
              }}>
                {(searchQuery ? filteredComposers.filter(c => !PRIORITY_ORDER.includes(c.name)) : otherComposers).map((comp, index, arr) => (
                  <button
                    key={comp.name}
                    onClick={() => handleSelectComposer(comp.name)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: index < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)'
                    }}>
                      {comp.name}
                    </span>
                    <span style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </svg>
                      {comp.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComposersScreen;
