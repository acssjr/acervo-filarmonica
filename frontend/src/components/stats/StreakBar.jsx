// ===== STREAK BAR =====
// Barra vertical compacta mostrando streak de presença
// Ícone Flame (lucide-react) com CSS animations

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import styles from './PresenceStats.module.css';

const StreakBar = ({ streak = 0, percentual = 0 }) => {
  const [count, setCount] = useState(0);
  const active = streak > 0;

  // Tamanho do fogo escala com o streak (min 28, max 44)
  const fireSize = Math.min(28 + streak * 2, 44);

  // Cor intensifica com o streak
  const fireColor = !active
    ? '#666'
    : streak >= 10 ? '#FFD700'
    : streak >= 5 ? '#FF8C00'
    : '#D4AF37';

  // Animação de contagem (0 → streak)
  useEffect(() => {
    if (streak === 0) {
      setCount(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = streak / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= streak) {
        setCount(streak);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [streak]);

  return (
    <motion.div
      className={styles.streakBar}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Número do streak */}
      <div className={styles.streakNumber}>{count}</div>

      {/* Ícone de fogo */}
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
        <motion.div
          className={styles.streakProgressFill}
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(percentual, 100)}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default StreakBar;
