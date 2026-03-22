// ===== STREAK BAR =====
// Barra vertical compacta mostrando streak de presenca
// Icone Flame (lucide-react) com GSAP animations

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Flame } from 'lucide-react';
import styles from './PresenceStats.module.css';

const StreakBar = ({ streak = 0, percentual = 0 }) => {
  const streakNumRef = useRef(null);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);
  const active = streak > 0;

  // Tamanho do fogo escala com o streak (min 28, max 44)
  const fireSize = Math.min(28 + streak * 2, 44);

  // Cor intensifica com o streak
  const fireColor = !active
    ? '#666'
    : streak >= 10 ? '#FFD700'
    : streak >= 5 ? '#FF8C00'
    : '#D4AF37';

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    if (!streakNumRef.current) return;
    const proxy = { val: 0 };
    const tween = gsap.to(proxy, {
      val: streak,
      duration: 1.0,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate: () => {
        if (streakNumRef.current) streakNumRef.current.textContent = String(Math.round(proxy.val));
      },
    });
    return () => tween.kill();
  }, [streak]);

  useEffect(() => {
    if (!progressBarRef.current) return;
    const tween = gsap.to(progressBarRef.current, {
      height: `${Math.min(Math.max(percentual, 0), 100)}%`,
      duration: 1.2,
      ease: 'back.out(1.4)',
      overwrite: 'auto',
    });
    return () => tween.kill();
  }, [percentual]);

  return (
    <div ref={containerRef} className={styles.streakBar}>
      {/* Numero do streak */}
      <div ref={streakNumRef} className={styles.streakNumber}>0</div>

      {/* Icone de fogo */}
      <div className={`${styles.fireContainer} ${active ? styles.fireActive : styles.fireInactive}`}>
        <Flame
          size={fireSize}
          color={fireColor}
          fill={active ? fireColor : 'none'}
          strokeWidth={active ? 1.5 : 2}
        />
      </div>

      {/* Barra de progresso vertical */}
      <div className={styles.streakProgressContainer}>
        <div ref={progressBarRef} className={styles.streakProgressFill} style={{ height: '0%' }} />
      </div>
    </div>
  );
};

export default StreakBar;
