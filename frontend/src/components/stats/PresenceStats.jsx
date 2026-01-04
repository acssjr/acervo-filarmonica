// ===== PRESENCE STATS =====
// Seção de estatísticas de presença em ensaios
// Layout horizontal: StreakBar (esquerda) + AttendanceCalendar (direita)

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { API } from '@services/api';
import StreakBar from './StreakBar';
import AttendanceCalendar from './AttendanceCalendar';
import EnsaioDetailModal from './EnsaioDetailModal';
import styles from './PresenceStats.module.css';

const SkeletonLoader = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonBar} />
    <div className={styles.skeletonCalendar} />
  </div>
);

const PresenceStats = () => {
  const { user } = useAuth();
  const [presencaData, setPresencaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnsaio, setSelectedEnsaio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPresenca = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await API.getMinhaPresenca();
        setPresencaData(data);
      } catch (err) {
        console.error('Erro ao buscar presença:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPresenca();
  }, [user]);

  const handleEnsaioClick = (ensaio) => {
    setSelectedEnsaio(ensaio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Delay para animação de saída
    setTimeout(() => setSelectedEnsaio(null), 300);
  };

  // Se não estiver logado, não renderizar nada
  if (!user) return null;

  // Loading state
  if (loading) return <SkeletonLoader />;

  // Error state
  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar dados de presença</p>
      </div>
    );
  }

  // Sem dados ainda
  if (!presencaData) return null;

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* StreakBar (lado esquerdo, 80px width) */}
        <StreakBar
          streak={presencaData.streak || 0}
          percentual={presencaData.percentual_frequencia || 0}
        />

        {/* AttendanceCalendar (lado direito, flex-grow) */}
        <AttendanceCalendar
          ensaios={presencaData.ultimos_ensaios || []}
          onEnsaioClick={handleEnsaioClick}
        />
      </motion.div>

      {/* Modal de detalhes */}
      <EnsaioDetailModal
        ensaio={selectedEnsaio}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PresenceStats;
