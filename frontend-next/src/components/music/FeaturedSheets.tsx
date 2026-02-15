"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useUI } from "@contexts/UIContext";
import { useData } from "@contexts/DataContext";
import { useMediaQuery } from "@hooks/useMediaQuery";
import FeaturedCard from "./FeaturedCard";

const CATEGORY_IMAGES: Record<string, string> = {
  dobrado: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  marcha: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
  valsa: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
  fantasia: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
  polaca: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
  bolero: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
  popular: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  hinos: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80'
};

interface Sheet {
  id: string;
  title: string;
  composer: string;
  category: string;
  featured?: boolean;
  downloads?: number;
}

interface FeaturedSheetsProps {
  sheets: Sheet[];
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

const FeaturedSheets = ({ sheets, onToggleFavorite, favorites }: FeaturedSheetsProps) => {
  const { theme } = useUI();
  const { categoriesMap } = useData();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const featuredSheets = useMemo(() => {
    const featured = sheets.filter(s => s.featured);
    return featured.slice(0, 8);
  }, [sheets]);

  const stopAnimation = useCallback(() => {
    if (innerRef.current && scrollRef.current) {
      const computedStyle = window.getComputedStyle(innerRef.current);
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        const currentX = matrix.m41;
        innerRef.current.style.animation = 'none';
        innerRef.current.style.transform = 'none';
        scrollRef.current.scrollLeft = Math.abs(currentX);
      }
    }
    setHasInteracted(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setHasInteracted(false);
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isDesktop && scrollRef.current) {
      scrollRef.current.dataset.startX = String(e.pageX);
      scrollRef.current.dataset.scrollLeft = String(scrollRef.current.scrollLeft);
      scrollRef.current.dataset.isDragging = 'true';
    }
  }, [isDesktop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDesktop || !scrollRef.current || scrollRef.current.dataset.isDragging !== 'true') return;
    const startX = parseFloat(scrollRef.current.dataset.startX || '0');
    const scrollLeft = parseFloat(scrollRef.current.dataset.scrollLeft || '0');
    const diff = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollLeft - diff;
  }, [isDesktop]);

  const handleMouseUp = useCallback(() => {
    if (scrollRef.current) scrollRef.current.dataset.isDragging = 'false';
  }, []);

  if (featuredSheets.length === 0) return null;

  const duplicatedSheets = featuredSheets.length > 2
    ? [...featuredSheets, ...featuredSheets]
    : featuredSheets;

  return (
    <div data-walkthrough="featured" style={{ marginBottom: '32px', width: '100%', overflow: 'visible' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isDesktop ? '0' : '0 20px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>Em Destaque</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Partituras em estudo</p>
        </div>
      </div>

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
          maskImage: (!hasInteracted && theme === 'dark') ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
          WebkitMaskImage: (!hasInteracted && theme === 'dark') ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none'
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
          {(featuredSheets.length > 2 ? duplicatedSheets : featuredSheets).map((sheet, index) => (
            <FeaturedCard
              key={`${sheet.id}-${index}`}
              sheet={sheet}
              category={categoriesMap.get(sheet.category)}
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
