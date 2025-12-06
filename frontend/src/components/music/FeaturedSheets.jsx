// ===== FEATURED SHEETS =====
// Seção de partituras em destaque com scroll animado

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUI } from '@contexts/UIContext';
import { CATEGORIES_MAP } from '@constants/categories';
import FeaturedCard from './FeaturedCard';

// Movido para fora do componente (não recria a cada render)
const CATEGORY_IMAGES = {
  dobrado: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  marcha: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
  valsa: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
  fantasia: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
  polaca: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
  bolero: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
  popular: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  hinos: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80'
};

const FeaturedSheets = ({ sheets, onToggleFavorite, favorites }) => {
  const { theme } = useUI();
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const scrollRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featuredSheets = useMemo(() => {
    // Mostra apenas partituras marcadas como destaque
    const featured = sheets.filter(s => s.featured);
    return featured.slice(0, 8);
  }, [sheets]);

  // Não mostra a seção se não houver destaques
  if (featuredSheets.length === 0) return null;

  // Refs para scroll e animação
  const innerRef = useRef(null);

  // Só duplica os cards se tiver mais de 2 (para animação fluida)
  const duplicatedSheets = featuredSheets.length > 2
    ? [...featuredSheets, ...featuredSheets]
    : featuredSheets;

  // Para a animação quando o usuário interage
  const stopAnimation = useCallback(() => {
    if (!hasInteracted) {
      // Captura a posição atual da animação
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

  // Handlers memoizados para evitar re-renders
  const handleMouseDown = useCallback((e) => {
    if (isDesktop && scrollRef.current) {
      scrollRef.current.dataset.startX = e.pageX;
      scrollRef.current.dataset.scrollLeft = scrollRef.current.scrollLeft;
      scrollRef.current.dataset.isDragging = 'true';
    }
  }, [isDesktop]);

  const handleMouseMove = useCallback((e) => {
    if (!isDesktop || !scrollRef.current || scrollRef.current.dataset.isDragging !== 'true') return;
    const startX = parseFloat(scrollRef.current.dataset.startX);
    const scrollLeft = parseFloat(scrollRef.current.dataset.scrollLeft);
    const diff = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollLeft - diff;
  }, [isDesktop]);

  const handleMouseUp = useCallback(() => {
    if (scrollRef.current) scrollRef.current.dataset.isDragging = 'false';
  }, []);

  return (
    <div style={{ marginBottom: '32px', width: '100%', overflow: 'visible' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isDesktop ? '0' : '0 20px', marginBottom: '16px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>
            Em Destaque
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Partituras em estudo</p>
        </div>
        {!hasInteracted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Arraste</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        )}
      </div>

      {/* Cards - Scroll fluido com fade nas bordas */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          overflowX: hasInteracted ? 'auto' : 'hidden',
          overflowY: 'visible',
          paddingTop: '8px',
          paddingBottom: '16px',
          paddingLeft: isDesktop ? '0' : '20px',
          paddingRight: isDesktop ? '0' : '20px',
          marginBottom: '-8px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDesktop ? 'grab' : 'default',
          overscrollBehaviorX: 'contain',
          // Fade suave nas bordas usando mask-image (apenas durante animação)
          maskImage: !hasInteracted ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
          WebkitMaskImage: !hasInteracted ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none'
        }}
      >
        <div
          ref={innerRef}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: isDesktop ? '20px' : '14px',
            animation: (!hasInteracted && featuredSheets.length > 2)
              ? `marqueeScroll ${isDesktop ? '80s' : '60s'} linear infinite`
              : 'none'
          }}
        >
          {(hasInteracted || featuredSheets.length <= 2 ? featuredSheets : duplicatedSheets).map((sheet, index) => (
            <FeaturedCard
              key={`${sheet.id}-${index}`}
              sheet={sheet}
              category={CATEGORIES_MAP.get(sheet.category)}
              bgImage={CATEGORY_IMAGES[sheet.category]}
              isFav={favorites.includes(sheet.id)}
              onToggleFavorite={onToggleFavorite}
              isDesktop={isDesktop}
              stopAnimation={stopAnimation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSheets;
