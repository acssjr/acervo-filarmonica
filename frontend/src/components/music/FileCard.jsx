// ===== FILE CARD =====
// Card de partitura com navegacao por URL

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';
import styles from './FileCard.module.css';

const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const formatDownloads = (n) => {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const FileCard = memo(({ sheet, category, isFavorite, onToggleFavorite, index = 0, showStats = false }) => {
  const navigate = useNavigate();
  const { setSelectedSheet } = useUI();

  const handleCardClick = () => {
    setSelectedSheet(sheet);
    // showStats: apenas abre modal sem mudar URL (igual ao FeaturedCard)
    if (!showStats) navigate(`/acervo/${sheet.category}/${sheet.id}`);
  };

  const isTop3 = showStats && index < 3;
  const rankLabel = ['1º', '2º', '3º'][index];

  return (
    <motion.div
      data-walkthrough="sheet-card"
      className={`file-card ${styles.card}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      <div className={styles.thumbnail}>
        <CategoryIcon categoryId={category?.id} size={24} color="#D4AF37" />
        {isTop3 && (
          <div className={styles.rankBadge}>{rankLabel}</div>
        )}
      </div>

      <div className={styles.info}>
        <h4 className={styles.title}>{sheet.title}</h4>
        <p className={styles.composer}>{sheet.composer}</p>
        {sheet.arranger && (
          <p className={styles.composer} style={{ fontSize: '11px', marginTop: '2px' }}>
            Arr: {sheet.arranger}
          </p>
        )}
      </div>

      {showStats ? (
        <div className={styles.statsCompact}>
          <span className={styles.trendArrow}><TrendUpIcon /></span>
          <span className={styles.statsNumber}>{formatDownloads(sheet.downloads)}</span>
          <span className={styles.statsLabel}>downloads</span>
        </div>
      ) : (
        <>
          <button
            data-walkthrough="favorite-btn"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`${styles.favButton} ${isFavorite ? styles.active : styles.inactive}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
          >
            <div className={styles.icon}><Icons.Heart filled={isFavorite} /></div>
          </button>

          <button
            aria-label={`Baixar partitura ${sheet.title}`}
            title="Baixar partitura"
            className={styles.downloadButton}
            onClick={handleCardClick}
          >
            <div className={styles.iconLarge}><Icons.Download /></div>
          </button>
        </>
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.sheet.id === nextProps.sheet.id &&
    prevProps.sheet.arranger === nextProps.sheet.arranger &&
    prevProps.sheet.title === nextProps.sheet.title &&
    prevProps.sheet.composer === nextProps.sheet.composer &&
    prevProps.sheet.downloads === nextProps.sheet.downloads &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.category?.id === nextProps.category?.id &&
    prevProps.index === nextProps.index &&
    prevProps.showStats === nextProps.showStats
  );
});

FileCard.displayName = 'FileCard';

export default FileCard;
