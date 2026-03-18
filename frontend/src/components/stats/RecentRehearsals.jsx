// ===== RECENT REHEARSALS =====
// Seção da HomeScreen: mostra os 4 ensaios mais recentes em grid 2×2

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { API } from '@services/api';
import EnsaioDetailModal from './EnsaioDetailModal';

const MONTH_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

// Ícone 3D de presença — quadrado verde arredondado com checkmark
const Check3D = () => (
  <div style={{
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #5BE065 0%, #2DB830 55%, #1A8C22 100%)',
    boxShadow: '0 4px 12px rgba(45,184,48,0.28), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

// Ícone 3D de ausência — círculo vermelho com X
const Cross3D = () => (
  <div style={{
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #FF6B6B 0%, #E53935 55%, #B71C1C 100%)',
    boxShadow: '0 6px 16px rgba(229,57,53,0.55), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,220,0.95)" strokeWidth="3.5" strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </div>
);

const SkeletonCard = () => (
  <div style={{
    borderRadius: '20px',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    minHeight: '108px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }}>
    <div style={{
      width: '32px', height: '10px', borderRadius: '4px',
      background: 'rgba(255,255,255,0.08)',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }} />
    <div style={{
      width: '48px', height: '32px', borderRadius: '6px',
      background: 'rgba(255,255,255,0.06)',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }} />
    <div style={{
      width: '28px', height: '10px', borderRadius: '4px',
      background: 'rgba(255,255,255,0.06)',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }} />
    <div style={{ flex: 1 }} />
    <div style={{
      width: '72px', height: '22px', borderRadius: '20px',
      background: 'rgba(255,255,255,0.05)',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }} />
  </div>
);

const RehearsalCard = ({ ensaio, index, onClick }) => {
  const presente = ensaio.usuario_presente === 1;
  const [ano, mesIdx, dia] = ensaio.data_ensaio.split('-').map(Number);
  const mes = MONTH_ABBR[mesIdx - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(ensaio)}
      style={{
        borderRadius: '20px',
        background: presente
          ? 'linear-gradient(145deg, #0D2B1A 0%, #061510 100%)'
          : 'linear-gradient(145deg, #2B0D0D 0%, #150606 100%)',
        border: presente
          ? '1px solid rgba(74,180,74,0.18)'
          : '1px solid rgba(239,68,68,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
        minHeight: '108px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '14px 16px 14px 14px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        gap: '12px',
      }}
    >
      {/* Highlight especular no topo */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: presente
          ? 'linear-gradient(90deg, rgba(74,180,74,0.25) 0%, rgba(74,180,74,0.06) 60%, transparent 100%)'
          : 'linear-gradient(90deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.04) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Informação da data */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: presente ? 'rgba(74,180,74,0.55)' : 'rgba(239,68,68,0.45)',
          marginBottom: '0px',
        }}>
          {mes}
        </span>
        <span style={{
          fontSize: '38px',
          fontWeight: '800',
          lineHeight: 1.05,
          color: presente ? 'rgba(180,255,180,0.92)' : 'rgba(255,180,180,0.85)',
          marginBottom: '0px',
        }}>
          {String(dia).padStart(2, '0')}
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginTop: '4px',
        }}>
          {ensaio.dia_semana}
        </span>
      </div>

      {/* Ícone 3D de status */}
      {presente ? <Check3D /> : <Cross3D />}
    </motion.div>
  );
};

const RecentRehearsals = () => {
  const navigate = useNavigate();
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
    setTimeout(() => setSelectedEnsaio(null), 300);
  };

  if (!user) return null;

  const recentEnsaios = presencaData?.ultimos_ensaios?.slice(0, 4) || [];

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Últimos Ensaios</h2>
        <button
          className="glass-pill-btn"
          onClick={() => navigate('/ensaios')}
        >
          Ver Histórico
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Grid 2×2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '12px',
      }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '24px 0',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}>
            Erro ao carregar ensaios
          </div>
        ) : recentEnsaios.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '24px 0',
            color: 'var(--text-muted)',
            fontSize: '14px',
            fontStyle: 'italic',
          }}>
            Nenhum ensaio registrado
          </div>
        ) : (
          recentEnsaios.map((ensaio, i) => (
            <RehearsalCard
              key={ensaio.data_ensaio}
              ensaio={ensaio}
              index={i}
              onClick={handleEnsaioClick}
            />
          ))
        )}
      </div>

      <EnsaioDetailModal
        ensaio={selectedEnsaio}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default RecentRehearsals;
