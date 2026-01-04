// ===== ENSAIO DETAIL MODAL =====
// Modal mostrando detalhes de um ensaio específico
// Data, status de presença, lista de partituras tocadas

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@services/api';
import styles from './PresenceStats.module.css';

const EnsaioDetailModal = ({ ensaio, isOpen, onClose }) => {
  const [partituras, setPartituras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !ensaio) return;

    const loadPartituras = async () => {
      setLoading(true);
      try {
        const result = await API.getPartiturasEnsaio(ensaio.data_ensaio);
        setPartituras(result.partituras || []);
      } catch (error) {
        console.error('Erro ao carregar partituras do ensaio:', error);
        setPartituras([]);
      } finally {
        setLoading(false);
      }
    };

    loadPartituras();
  }, [isOpen, ensaio]);

  if (!ensaio) return null;

  // Formatar data
  const data = new Date(ensaio.data_ensaio + 'T00:00:00Z');
  const dataFormatada = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  const presente = ensaio.usuario_presente === 1;

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Modal variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.modalBackdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={styles.modalContainer}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Ensaio</h2>
                <p className={styles.modalDate}>{dataFormatada}</p>
              </div>
              <button
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Fechar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Status de presença */}
            <div className={`${styles.modalBadge} ${presente ? styles.badgePresent : styles.badgeAbsent}`}>
              {presente ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Presente
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Ausente
                </>
              )}
            </div>

            {/* Lista de partituras */}
            <div className={styles.modalContent}>
              <h3 className={styles.modalSectionTitle}>
                Partituras tocadas ({partituras.length})
              </h3>

              {loading ? (
                <div className={styles.modalLoading}>Carregando...</div>
              ) : partituras.length === 0 ? (
                <div className={styles.modalEmpty}>
                  Nenhuma partitura registrada para este ensaio
                </div>
              ) : (
                <div className={styles.modalList}>
                  {partituras.map((partitura, index) => (
                    <div key={partitura.id} className={styles.modalListItem}>
                      <div className={styles.modalItemNumber}>{index + 1}</div>
                      <div className={styles.modalItemContent}>
                        <div className={styles.modalItemTitle}>{partitura.titulo}</div>
                        <div className={styles.modalItemSubtitle}>{partitura.compositor}</div>
                      </div>
                      <div
                        className={styles.modalItemBadge}
                        style={{ backgroundColor: partitura.categoria_cor }}
                      >
                        {partitura.categoria_nome}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnsaioDetailModal;
