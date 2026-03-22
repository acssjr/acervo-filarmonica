// ===== FEATURED CARD =====
// Card de destaque com borda dourada animada

import { memo, useRef } from 'react';
import { gsap } from 'gsap';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import styles from './FeaturedCard.module.css';

const FeaturedCard = memo(({ sheet, category, bgImage, isFav, onToggleFavorite, isDesktop }) => {
  const { setSelectedSheet } = useUI();
  const pointerStart = useRef({ x: 0, y: 0 });
  const favIconRef = useRef(null);

  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e) => {
    // Não abre modal se foi um drag (movimento > 5px)
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    if (dx > 5 || dy > 5) return;
    setSelectedSheet(sheet);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(sheet.id);
    if (favIconRef.current) {
      gsap.timeline()
        .to(favIconRef.current, { scale: 1.35, duration: 0.1, ease: 'power2.out', overwrite: true })
        .to(favIconRef.current, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
    }
  };

  return (
    <div
      className={`featured-card ${styles.card} ${isDesktop ? styles.desktop : styles.mobile}`}
      onPointerDown={handlePointerDown}
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
            onClick={handleFavClick}
            onPointerDown={(e) => e.stopPropagation()}
            className={`${styles.favButton} ${isFav ? styles.active : styles.inactive}`}
            aria-label={isFav ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`}
          >
            <div ref={favIconRef} className={styles.favIcon}><Icons.Heart filled={isFav} /></div>
          </button>
        </div>
      </div>
    </div>
  );
});

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
