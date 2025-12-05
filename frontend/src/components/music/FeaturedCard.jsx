// ===== FEATURED CARD =====
// Card de destaque com borda dourada animada

import { memo, useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import styles from './FeaturedCard.module.css';

const FeaturedCard = memo(({ sheet, category, bgImage, isFav, onToggleFavorite, isDesktop, stopAnimation }) => {
  const { setSelectedSheet } = useUI();
  const cardMouseStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (isDesktop) {
      cardMouseStart.current = { x: e.clientX, y: e.clientY };
    }
    stopAnimation();
  };

  const handleClick = (e) => {
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

  return (
    <div
      className={`featured-card ${styles.card} ${isDesktop ? styles.desktop : styles.mobile}`}
      onMouseDown={handleMouseDown}
      onTouchStart={stopAnimation}
      onClick={handleClick}
    >
      <div className={styles.goldenBorder} />

      <div
        className={styles.decorativeImage}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className={styles.badge}>Em estudo</div>

      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <div className={styles.icon}><Icons.Music /></div>
        </div>

        <h4 className={styles.title}>{sheet.title}</h4>
        <p className={styles.composer}>{sheet.composer}</p>

        <div className={styles.footer}>
          <div className={styles.categoryTag}>
            <span className={styles.categoryText}>{category?.name}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(sheet.id); }}
            className={`${styles.favButton} ${isFav ? styles.active : styles.inactive}`}
          >
            <div className={styles.favIcon}><Icons.Heart filled={isFav} /></div>
          </button>
        </div>
      </div>
    </div>
  );
});

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
