// ===== FEATURED SHEETS =====
// Carrossel infinito via useInfiniteCarousel (RAF + CSS transform)

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useData } from '@contexts/DataContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { useInfiniteCarousel } from '@hooks/useInfiniteCarousel';
import FeaturedCard from './FeaturedCard';

const CATEGORY_IMAGES = {
  dobrado: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  marcha: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
  valsa: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
  fantasia: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
  polaca: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
  bolero: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
  popular: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  hinos: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80',
};

const FeaturedSheets = ({ sheets, onToggleFavorite, favoritesSet }) => {
  const { categoriesMap } = useData();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const featuredSheets = useMemo(
    () => sheets.filter(s => s.featured).slice(0, 8),
    [sheets]
  );

  const canScroll = featuredSheets.length > 2;
  const displaySheets = canScroll
    ? [...featuredSheets, ...featuredSheets]
    : featuredSheets;

  const { innerRef, outerProps } = useInfiniteCarousel({
    speed: 0.25,
    resumeDelay: 4000,
    enabled: canScroll,
  });

  if (featuredSheets.length === 0) return null;

  return (
    <div data-walkthrough="featured" style={{ marginBottom: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ padding: isDesktop ? '0' : '0 20px', marginBottom: '16px' }}>
        <span style={{
          display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '2px',
          color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '5px',
        }}>
          Partituras em estudo
        </span>
        <h2 style={{
          fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px',
          color: 'var(--text-primary)', textTransform: 'uppercase', margin: 0,
        }}>
          Em Destaque
        </h2>
      </div>

      {/* Carousel — overflow:hidden + transform (GPU) */}
      <div
        {...outerProps}
        style={{
          overflow: 'hidden',
          paddingTop: '8px',
          paddingBottom: '16px',
          marginBottom: '-8px',
          cursor: canScroll ? 'grab' : 'default',
          touchAction: 'pan-y',
          userSelect: 'none',
          maskImage: 'linear-gradient(to right, transparent 0px, black 36px, black calc(100% - 36px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 36px, black calc(100% - 36px), transparent 100%)',
        }}
      >
        <div
          ref={innerRef}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: isDesktop ? '20px' : '14px',
            paddingLeft: isDesktop ? '0' : '20px',
            paddingRight: isDesktop ? '0' : '20px',
            willChange: 'transform',
          }}
        >
          {displaySheets.map((sheet, index) => (
            <FeaturedCard
              key={`${sheet.id}-${index}`}
              sheet={sheet}
              category={categoriesMap.get(sheet.category)}
              bgImage={CATEGORY_IMAGES[sheet.category]}
              isFav={favoritesSet.has(sheet.id)}
              onToggleFavorite={onToggleFavorite}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

FeaturedSheets.propTypes = {
  sheets: PropTypes.array.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  favoritesSet: PropTypes.instanceOf(Set),
};
FeaturedSheets.defaultProps = {
  favoritesSet: new Set(),
};

export default FeaturedSheets;
