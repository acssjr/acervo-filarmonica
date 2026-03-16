// ===== CATEGORY CARD =====
// Card de categoria/gênero musical — estilo premium com gradiente e ícone decorativo

import { memo } from 'react';
import { motion } from 'framer-motion';
import CategoryIcon from '@components/common/CategoryIcon';

// Paleta de gradientes e cores de ícone por categoria
const CARD_THEMES = {
  'dobrados':           { gradient: 'linear-gradient(145deg, #8B2E3A 0%, #4E1620 100%)', iconColor: '#F4C0C8' },
  'marchas':            { gradient: 'linear-gradient(145deg, #1A3460 0%, #0D1A35 100%)', iconColor: '#9EC4F0' },
  'marchas-funebres':   { gradient: 'linear-gradient(145deg, #282830 0%, #141418 100%)', iconColor: '#B8B8C8' },
  'marchas-religiosas': { gradient: 'linear-gradient(145deg, #5A2C1A 0%, #2E1408 100%)', iconColor: '#ECC09A' },
  'fantasias':          { gradient: 'linear-gradient(145deg, #4A1E7A 0%, #280F48 100%)', iconColor: '#C8A8F0' },
  'polacas':            { gradient: 'linear-gradient(145deg, #1A4830 0%, #0C2818 100%)', iconColor: '#9ECEB8' },
  'boleros':            { gradient: 'linear-gradient(145deg, #7A2C18 0%, #401208 100%)', iconColor: '#F0A888' },
  'valsas':             { gradient: 'linear-gradient(145deg, #5A1A40 0%, #300D20 100%)', iconColor: '#F0A8C8' },
  'arranjos':           { gradient: 'linear-gradient(145deg, #183848 0%, #0A1E28 100%)', iconColor: '#88B8D8' },
  'hinos':              { gradient: 'linear-gradient(145deg, #1A3C20 0%, #0C2010 100%)', iconColor: '#90C898' },
  'hinos-civicos':      { gradient: 'linear-gradient(145deg, #1A2E60 0%, #0A1838 100%)', iconColor: '#88A8E8' },
  'hinos-religiosos':   { gradient: 'linear-gradient(145deg, #4A2A10 0%, #281408 100%)', iconColor: '#E8B880' },
  'preludios':          { gradient: 'linear-gradient(145deg, #1E2840 0%, #0E1422 100%)', iconColor: '#88A0C0' },
};

const DEFAULT_THEME = {
  gradient: 'linear-gradient(145deg, #2A2A3A 0%, #151520 100%)',
  iconColor: '#B0B0C8',
};

const CategoryCard = memo(({ category, count, onClick, index }) => {
  const { gradient, iconColor } = CARD_THEMES[category.id] || DEFAULT_THEME;

  return (
    <motion.div
      className="card-hover"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: gradient,
        borderRadius: '20px',
        padding: '14px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '108px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Highlight especular no topo */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Texto — recuado à direita para não sobrepor o ícone */}
      <div style={{ paddingRight: '64px', flex: 1 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#FFFFFF',
          lineHeight: 1.2,
          marginBottom: '3px',
          letterSpacing: '-0.2px',
        }}>
          {category.name}
        </h3>
        <span style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.58)',
          fontWeight: '500',
        }}>
          {count} partitura{count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Botão seta — canto inferior esquerdo */}
      <div
        aria-hidden="true"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.18)',
          flexShrink: 0,
          marginTop: '6px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      {/* Brilho radial atrás do ícone */}
      <div style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        width: '145px',
        height: '145px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Ícone decorativo grande — canto inferior direito */}
      <div style={{
        position: 'absolute',
        right: '10px',
        bottom: '8px',
        width: '60px',
        height: '60px',
        opacity: 0.42,
        transform: 'rotate(-8deg)',
        pointerEvents: 'none',
      }}>
        <CategoryIcon categoryId={category.id} size={60} color={iconColor} />
      </div>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
