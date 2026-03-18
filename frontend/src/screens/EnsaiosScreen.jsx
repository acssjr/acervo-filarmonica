// ===== ENSAIOS SCREEN =====
// Histórico completo de ensaios com navegação por mês

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { API } from '@services/api';
import EnsaioDetailModal from '@components/stats/EnsaioDetailModal';

const MONTH_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const EnsaioListCard = ({ ensaio, index, onClick }) => {
  const presente = ensaio.usuario_presente === 1;
  const [, mesIdx, dia] = ensaio.data_ensaio.split('-').map(Number);
  const mes = MONTH_ABBR[mesIdx - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(ensaio)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: presente
          ? '1px solid rgba(74,180,74,0.12)'
          : '1px solid rgba(239,68,68,0.1)',
        borderLeft: presente
          ? '3px solid rgba(74,180,74,0.55)'
          : '3px solid rgba(239,68,68,0.45)',
        padding: '14px 16px 14px 14px',
        cursor: 'pointer',
        boxShadow: presente
          ? '0 2px 12px rgba(0,0,0,0.25)'
          : '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Data */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '48px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--text-muted)',
          letterSpacing: '0.3px',
          marginBottom: '1px',
        }}>
          {ensaio.dia_semana}
        </span>
        <span style={{
          fontSize: '36px',
          fontWeight: '800',
          lineHeight: 1,
          color: presente ? 'rgba(180,255,180,0.9)' : 'rgba(255,180,180,0.82)',
        }}>
          {String(dia).padStart(2, '0')}
        </span>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          color: presente ? 'rgba(74,180,74,0.6)' : 'rgba(239,68,68,0.5)',
        }}>
          {mes}
        </span>
      </div>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '48px',
        background: 'rgba(255,255,255,0.07)',
        flexShrink: 0,
      }} />

      {/* Info + status */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {ensaio.numero_ensaio ? (
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            letterSpacing: '0.5px',
          }}>
            #{ensaio.numero_ensaio}
          </span>
        ) : null}

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          alignSelf: 'flex-start',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          background: presente
            ? 'rgba(74,180,74,0.12)'
            : 'rgba(239,68,68,0.1)',
          border: presente
            ? '1px solid rgba(74,180,74,0.3)'
            : '1px solid rgba(239,68,68,0.22)',
          color: presente ? '#5DD85D' : '#FF7070',
        }}>
          {presente ? <CheckIcon /> : <CrossIcon />}
          {presente ? 'Presente' : 'Ausente'}
        </div>
      </div>

      {/* Seta */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.div>
  );
};

const EnsaiosScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [presencaData, setPresencaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEnsaio, setSelectedEnsaio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPresenca = async () => {
      try {
        setLoading(true);
        const data = await API.getMinhaPresenca();
        setPresencaData(data);
      } catch {
        // Silencioso — tela mostrará estado vazio
      } finally {
        setLoading(false);
      }
    };

    fetchPresenca();
  }, [user]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    if (isCurrentMonth) return;

    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const isAtCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  const filteredEnsaios = (presencaData?.ultimos_ensaios || []).filter(e => {
    const [ano, mes] = e.data_ensaio.split('-').map(Number);
    return mes - 1 === selectedMonth && ano === selectedYear;
  });

  const handleEnsaioClick = (ensaio) => {
    setSelectedEnsaio(ensaio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedEnsaio(null), 300);
  };

  return (
    <div style={{ width: '100%', paddingBottom: '120px' }}>
      {/* Topo: back + título */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 20px 8px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
          aria-label="Voltar"
        >
          <BackIcon />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
          Histórico de Ensaios
        </h1>
      </div>

      {/* Navegação de mês */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '16px 20px 20px',
      }}>
        <button
          onClick={handlePrevMonth}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
          aria-label="Mês anterior"
        >
          <ChevronLeft />
        </button>

        <span style={{
          fontSize: '16px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          minWidth: '140px',
          textAlign: 'center',
        }}>
          {MONTH_NAMES[selectedMonth].toUpperCase()} {selectedYear}
        </span>

        <button
          onClick={handleNextMonth}
          disabled={isAtCurrentMonth}
          style={{
            background: isAtCurrentMonth ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isAtCurrentMonth ? 'default' : 'pointer',
            color: isAtCurrentMonth ? 'rgba(255,255,255,0.2)' : 'var(--text-primary)',
          }}
          aria-label="Próximo mês"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Lista de ensaios */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '88px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          ))
        ) : filteredEnsaios.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: 'var(--text-muted)',
            fontSize: '14px',
            fontStyle: 'italic',
          }}>
            Nenhum ensaio registrado neste mês
          </div>
        ) : (
          filteredEnsaios.map((ensaio, i) => (
            <EnsaioListCard
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
    </div>
  );
};

export default EnsaiosScreen;
