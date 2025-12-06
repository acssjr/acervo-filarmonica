// ===== COMPOSER CAROUSEL =====
// Carrossel de compositores com glassmorphism para mobile
// Exibe os 3 principais compositores em cards hero com auto-scroll

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Fotos dos compositores (caminhos locais - WebP otimizado)
const composerPhotos = {
  'Estevam Moura': '/assets/images/compositores/estevam-moura.webp',
  'Tertuliano Santos': '/assets/images/compositores/tertuliano-santos.webp',
  'Amando Nobre': '/assets/images/compositores/amando-nobre.webp',
  'Heráclio Guerreiro': '/assets/images/compositores/heraclio-guerreiro.webp'
};

// Compositores prioritários (ordem de importância)
const priorityOrder = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heráclio Guerreiro'];

const ComposerCarousel = ({ composers = [] }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Pega os 3 principais compositores (priorizando os da lista)
  const topComposers = useMemo(() => {
    return [...composers]
      .sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.name);
        const bIndex = priorityOrder.indexOf(b.name);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return b.count - a.count;
      })
      .slice(0, 3);
  }, [composers]);

  // Duplica cards para animacao fluida
  const duplicatedComposers = topComposers.length > 1
    ? [...topComposers, ...topComposers]
    : topComposers;

  // Para a animacao quando o usuario interage
  const stopAnimation = useCallback(() => {
    if (!hasInteracted) {
      if (innerRef.current && scrollRef.current) {
        const computedStyle = window.getComputedStyle(innerRef.current);
        const transform = computedStyle.transform;
        if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform);
          const currentX = matrix.m41;
          scrollRef.current.scrollLeft = Math.abs(currentX);
        }
      }
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  if (topComposers.length === 0) return null;

  return (
    <div style={{ padding: '32px 0 0' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: '18px',
          fontWeight: '700'
        }}>
          Compositores
        </h2>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}
          onClick={() => navigate('/compositores')}
        >
          Ver Todos
        </button>
      </div>

      {/* Carrossel com auto-scroll */}
      <div
        ref={scrollRef}
        onTouchStart={stopAnimation}
        onMouseDown={stopAnimation}
        style={{
          overflowX: hasInteracted ? 'auto' : 'hidden',
          overflowY: 'visible',
          paddingTop: '8px',
          paddingBottom: '16px',
          paddingLeft: '20px',
          paddingRight: '20px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overscrollBehaviorX: 'contain'
        }}
      >
        <div
          ref={innerRef}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: (!hasInteracted && topComposers.length > 1)
              ? 'marqueeScroll 25s linear infinite'
              : 'none'
          }}
        >
          {(hasInteracted || topComposers.length <= 1 ? topComposers : duplicatedComposers).map((composer, index) => {
            const hasPhoto = composerPhotos[composer.name];
            const isFirst = index === 0 || index === topComposers.length;

            return (
              <button
                key={`${composer.name}-${index}`}
                onClick={() => navigate('/compositores')}
                style={{
                  flex: '0 0 220px',
                  width: '220px',
                  height: '140px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: hasPhoto
                    ? 'var(--bg-card)'
                    : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 50%, #3D1011 100%)'
                }}
              >
                {/* Imagem de fundo com zoom out */}
                {hasPhoto && (
                  <div style={{
                    position: 'absolute',
                    inset: '-10%',
                    backgroundImage: `url(${hasPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                    filter: 'brightness(0.85)'
                  }} />
                )}

                {/* Gradiente escuro na parte inferior */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 80%)'
                }} />

                {/* Glass card overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '2px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {composer.name}
                  </p>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    {composer.count} partitura{composer.count !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Badge de destaque para o primeiro */}
                {isFirst && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    fontFamily: 'Outfit, sans-serif',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                  }}>
                    Destaque
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de arraste */}
      {!hasInteracted && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)',
          fontSize: '12px',
          marginTop: '8px'
        }}>
          <span>Arraste</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ComposerCarousel;
