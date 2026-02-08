"use client";

import { memo, useRef } from "react";
import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";

interface FeaturedCardProps {
  sheet: { id: string; title: string; composer: string; category: string; featured?: boolean };
  category?: { id: string; name: string };
  bgImage?: string;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
  isDesktop: boolean;
  stopAnimation: () => void;
}

const FeaturedCard = memo(({ sheet, category, bgImage, isFav, onToggleFavorite, isDesktop, stopAnimation }: FeaturedCardProps) => {
  const { setSelectedSheet } = useUI();
  const cardMouseStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDesktop) {
      cardMouseStart.current = { x: e.clientX, y: e.clientY };
    }
    stopAnimation();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDesktop) {
      setSelectedSheet(sheet);
      return;
    }
    const dx = Math.abs(e.clientX - cardMouseStart.current.x);
    const dy = Math.abs(e.clientY - cardMouseStart.current.y);
    if (dx < 5 && dy < 5) {
      setSelectedSheet(sheet);
    }
  };

  const cardWidth = isDesktop ? '280px' : '200px';
  const cardMinHeight = isDesktop ? '200px' : '180px';
  const cardPadding = isDesktop ? '24px' : '20px';

  return (
    <div
      className="featured-card"
      onMouseDown={handleMouseDown}
      onTouchStart={stopAnimation}
      onClick={handleClick}
      style={{ height: 'auto', flexShrink: 0, alignSelf: 'flex-start', background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)', borderRadius: '20px', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxSizing: 'border-box', width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth, minHeight: cardMinHeight, padding: cardPadding }}
    >
      {/* Golden animated border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '20px', padding: '2px', background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 25%, #D4AF37 50%, #AA8C2C 75%, #D4AF37 100%)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none', animation: 'borderGlow 2s ease-in-out infinite', willChange: 'opacity' }} />

      {/* Decorative image */}
      {bgImage && (
        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${bgImage})`, opacity: 0.15, pointerEvents: 'none', maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)' }} />
      )}

      {/* Badge */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#D4AF37', color: '#3D1518', fontSize: '9px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', padding: '4px 8px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 2 }}>Em estudo</div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ width: '24px', height: '24px', color: '#F4E4BC' }}><Icons.Music /></div>
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sheet.title}</h4>
        <p style={{ fontSize: '13px', fontFamily: "'Outfit', sans-serif", color: 'rgba(255, 255, 255, 0.7)', marginBottom: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sheet.composer}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ padding: '5px 10px', background: 'rgba(212, 175, 55, 0.2)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', flexShrink: 1, minWidth: 0, maxWidth: '70%', overflow: 'hidden' }}>
            <span style={{ fontSize: '11px', fontFamily: "'Outfit', sans-serif", color: '#D4AF37', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{category?.name}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(sheet.id); }}
            style={{ cursor: 'pointer', padding: '6px', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isFav ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.15)', border: isFav ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)', color: isFav ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)' }}
            aria-label={isFav ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`}
          >
            <div style={{ width: '16px', height: '16px' }}><Icons.Heart filled={isFav} /></div>
          </button>
        </div>
      </div>
    </div>
  );
});

FeaturedCard.displayName = "FeaturedCard";

export default FeaturedCard;
