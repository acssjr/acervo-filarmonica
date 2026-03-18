// ===== COMPOSER CAROUSEL =====
// Carrossel infinito via useInfiniteCarousel (RAF + CSS transform)

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteCarousel } from '@hooks/useInfiniteCarousel';

const composerPhotos = {
  'Estevam Moura': '/assets/images/compositores/estevam-moura.webp',
  'Tertuliano Santos': '/assets/images/compositores/tertuliano-santos.webp',
  'Amando Nobre': '/assets/images/compositores/amando-nobre.webp',
  'Heráclio Guerreiro': '/assets/images/compositores/heraclio-guerreiro.webp',
};

const priorityOrder = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heráclio Guerreiro'];

const ComposerCarousel = ({ composers = [] }) => {
  const navigate = useNavigate();

  const topComposers = useMemo(() => {
    return [...composers]
      .sort((a, b) => {
        const aIdx = priorityOrder.indexOf(a.name);
        const bIdx = priorityOrder.indexOf(b.name);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return b.count - a.count;
      })
      .slice(0, 3);
  }, [composers]);

  const canScroll = topComposers.length > 1;
  const displayComposers = canScroll
    ? [...topComposers, ...topComposers]
    : topComposers;

  const { innerRef, outerProps } = useInfiniteCarousel({
    speed: 0.4,
    resumeDelay: 4000,
    enabled: canScroll,
  });

  if (topComposers.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', marginBottom: '16px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.2px', textTransform: 'uppercase' }}>
          Compositores
        </h2>
        <button className="glass-pill-btn" onClick={() => navigate('/compositores')}>
          Ver Todos
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Carousel — overflow:hidden + transform (GPU) */}
      <div
        {...outerProps}
        style={{
          overflow: 'hidden',
          paddingTop: '8px',
          paddingBottom: '16px',
          touchAction: 'pan-y',
          userSelect: 'none',
          cursor: canScroll ? 'grab' : 'default',
        }}
      >
        <div
          ref={innerRef}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: '12px',
            paddingLeft: '20px',
            paddingRight: '20px',
            willChange: 'transform',
          }}
        >
          {displayComposers.map((composer, index) => {
            const hasPhoto = composerPhotos[composer.name];
            const isFirst = index === 0 || index === topComposers.length;

            return (
              <button
                key={`${composer.name}-${index}`}
                onClick={() => navigate('/compositores')}
                style={{
                  flex: '0 0 220px', width: '220px', height: '140px',
                  borderRadius: '14px', border: 'none', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  background: hasPhoto
                    ? 'var(--bg-card)'
                    : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 50%, #3D1011 100%)',
                }}
              >
                {hasPhoto && (
                  <div style={{
                    position: 'absolute', inset: '-10%',
                    backgroundImage: `url(${hasPhoto})`,
                    backgroundSize: 'cover', backgroundPosition: 'center 30%',
                    filter: 'brightness(0.85)',
                  }} />
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 80%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: '10px', left: '10px', right: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)',
                  textAlign: 'left',
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#FFF', marginBottom: '2px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {composer.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                    </svg>
                    {composer.count} partitura{composer.count !== 1 ? 's' : ''}
                  </p>
                </div>
                {isFirst && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    padding: '3px 8px', borderRadius: '20px',
                    background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                    fontSize: '10px', fontWeight: '600', color: '#1A1A1A',
                    boxShadow: '0 2px 8px rgba(212,175,55,0.4)',
                  }}>
                    Destaque
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComposerCarousel;
