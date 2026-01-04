// ===== STREAK BAR =====
// Barra vertical compacta mostrando streak de presença
// SVG apenas, sem emojis

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './PresenceStats.module.css';

const StreakBar = ({ streak = 0, percentual = 0 }) => {
  const [count, setCount] = useState(0);

  // Animação de contagem (0 → streak)
  useEffect(() => {
    if (streak === 0) {
      setCount(0);
      return;
    }

    const duration = 1000; // 1 segundo
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

      {/* Label */}
      <div className={styles.streakLabel}>Sequência</div>

      {/* Barra de progresso vertical */}
      <div className={styles.streakProgressContainer}>
        <motion.div
          className={styles.streakProgressFill}
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(percentual, 100)}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>

      {/* Ícone Fire SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={styles.streakIcon}
      >
        <path
          d="M12 2C10 6 9 9 9 12C9 15.31 11.69 18 15 18C15.34 18 15.67 17.97 16 17.92C15.38 19.73 13.82 21 12 21C9.24 21 7 18.76 7 16C7 13 8 10 12 2Z"
          fill="url(#fireGradient)"
        />
        <defs>
          <linearGradient id="fireGradient" x1="7" y1="2" x2="16" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F4E4BC" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default StreakBar;
