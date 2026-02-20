// ===== ENSAIO DETAIL MODAL =====
// Modal mostrando detalhes de um ensaio específico
// Data, status de presença, lista de partituras tocadas

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { API } from '@services/api';
import styles from './PresenceStats.module.css';

const EnsaioDetailModal = ({ ensaio, isOpen, onClose }) => {
  const [partituras, setPartituras] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Travar scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.documentElement.classList.add('modal-open');
      document.body.style.top = `-${scrollY}px`;

      return () => {
        document.documentElement.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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

  // Formatar data de forma segura
  const [ano, mesIndex, dia] = ensaio.data_ensaio.split('-').map(Number);
  const dataUTC = new Date(Date.UTC(ano, mesIndex - 1, dia, 12, 0, 0));

  const dataFormatada = dataUTC.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    timeZone: 'UTC'
  });

  const presente = ensaio.usuario_presente === 1;

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return createPortal(
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
            key="ensaio-modal-content"
            role="dialog"
            aria-modal="true"
            initial={isDesktop ? { opacity: 0, scale: 0.95 } : { opacity: 1, y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.95 } : { opacity: 1, y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: 'fixed',
              ...(isDesktop ? {
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                width: '500px',
                maxWidth: '90vw',
                borderRadius: '20px'
              } : {
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: '24px 24px 0 0'
              }),
              background: 'var(--bg-card)',
              zIndex: 10001,
              maxHeight: isDesktop ? '85vh' : '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)'
            }}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  Ensaio {ensaio.numero_ensaio ? `#${ensaio.numero_ensaio}` : ''}
                </h2>
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
    </AnimatePresence>,
    document.body
  );
};

export default EnsaioDetailModal;
