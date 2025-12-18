// ===== FILE CARD =====
// Card de partitura com navegacao por URL

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';
import styles from './FileCard.module.css';

const FileCard = memo(({ sheet, category, isFavorite, onToggleFavorite, index = 0 }) => {
  const navigate = useNavigate();
  const { setSelectedSheet } = useUI();

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    setSelectedSheet(sheet);
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  const handleCardClick = () => {
    setSelectedSheet(sheet);
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  return (
    <motion.div
      className={`file-card ${styles.card}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      <div className={styles.thumbnail}>
        <CategoryIcon categoryId={category?.id} size={24} color="#D4AF37" />
      </div>

      <div className={styles.info}>
        <h4 className={styles.title}>{sheet.title}</h4>
        <p className={styles.composer}>{sheet.composer}</p>
      </div>

      <button
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
        onClick={handleDownloadClick}
      >
        <div className={styles.iconLarge}><Icons.Download /></div>
      </button>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.sheet.id === nextProps.sheet.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.category?.id === nextProps.category?.id &&
    prevProps.index === nextProps.index
  );
});

FileCard.displayName = 'FileCard';

export default FileCard;
