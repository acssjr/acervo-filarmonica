// ===== FILE CARD =====
// Card de partitura com navegacao por URL

import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';
import styles from './FileCard.module.css';

const FileCard = memo(({ sheet, category, onDownload, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { setSelectedSheet } = useUI();
  const [isPressed, setIsPressed] = useState(false);

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    setSelectedSheet(sheet);
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  const handleCardClick = () => {
    setSelectedSheet(sheet);
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => setIsPressed(false);

  return (
    <div
      className={`file-card ${styles.card} ${isPressed ? styles.pressed : ''}`}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
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
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.sheet.id === nextProps.sheet.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.category?.id === nextProps.category?.id
  );
});

FileCard.displayName = 'FileCard';

export default FileCard;
