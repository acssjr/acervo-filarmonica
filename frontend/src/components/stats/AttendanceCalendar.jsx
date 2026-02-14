// ===== ATTENDANCE CALENDAR =====
// Grid de últimos 7 ensaios com estados presente/ausente
// Clicável para abrir modal com detalhes

import { motion } from 'framer-motion';
import styles from './PresenceStats.module.css';

const AttendanceCalendar = ({ ensaios = [], onEnsaioClick }) => {
  // Se não houver dados
  if (!ensaios || ensaios.length === 0) {
    return (
      <div className={styles.calendarSection}>
        <div className={styles.calendarEmpty}>
          Nenhum ensaio registrado ainda
        </div>
      </div>
    );
  }

  // Container variants para stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // 50ms delay entre cada item
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={styles.calendarSection}>
      <div className={styles.calendarTitle}>Últimos ensaios</div>

      <motion.div
        className={styles.calendarGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ensaios.map((ensaio) => {
          // Formatar data de forma segura (ignorando timezone local)
          const [ano, mesIndex, dia] = ensaio.data_ensaio.split('-').map(Number);

          // Criar data em UTC (meio-dia) para obter nome do mês/semana corretamente sem shifts
          // Note: mês em JS é 0-indexed, mas no split vem 1-indexed
          const dataUTC = new Date(Date.UTC(ano, mesIndex - 1, dia, 12, 0, 0));

          const diaSemana = ensaio.dia_semana || dataUTC.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' });
          const mes = dataUTC.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
          const presente = ensaio.usuario_presente === 1;

          return (
            <motion.button
              key={ensaio.data_ensaio}
              className={`${styles.calendarDay} ${presente ? styles.present : styles.absent}`}
              variants={itemVariants}
              onClick={() => onEnsaioClick && onEnsaioClick(ensaio)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Mês abreviado */}
              <div className={styles.calendarMonth}>{mes}</div>

              {/* Dia do mês */}
              <div className={styles.calendarDayNumber}>{dia}</div>

              {/* Dia da semana */}
              <div className={styles.calendarWeekday}>
                {diaSemana.slice(0, 3)}
              </div>

              {/* Ícone (checkmark verde ou X cinza) */}
              <div className={styles.calendarIcon}>
                {presente ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AttendanceCalendar;
