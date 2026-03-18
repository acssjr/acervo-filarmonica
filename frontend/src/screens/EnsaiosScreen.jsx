// ===== ENSAIOS SCREEN =====
// Histórico de ensaios — spring physics swipe, cache in-memory, skeletons neutros

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { API } from '@services/api';
import EnsaioDetailModal from '@components/stats/EnsaioDetailModal';

const MONTH_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const CARD_PALETTE = [
  { bg: '#2E1A4A', text: 'rgba(220,195,255,0.92)', sub: 'rgba(185,155,240,0.6)',  pill: 'rgba(180,140,255,0.18)', pillBorder: 'rgba(180,140,255,0.35)' },
  { bg: '#0F2D38', text: 'rgba(160,230,240,0.92)', sub: 'rgba(90,195,215,0.6)',   pill: 'rgba(80,195,220,0.18)',  pillBorder: 'rgba(80,195,220,0.35)'  },
  { bg: '#381220', text: 'rgba(255,175,195,0.92)', sub: 'rgba(220,100,130,0.6)',  pill: 'rgba(230,90,125,0.18)', pillBorder: 'rgba(230,90,125,0.35)' },
  { bg: '#1A2E12', text: 'rgba(165,230,135,0.92)', sub: 'rgba(100,185,70,0.6)',   pill: 'rgba(100,190,70,0.18)',  pillBorder: 'rgba(100,190,70,0.35)'  },
  { bg: '#302010', text: 'rgba(240,200,115,0.92)', sub: 'rgba(200,155,50,0.6)',   pill: 'rgba(210,165,50,0.18)',  pillBorder: 'rgba(210,165,50,0.35)'  },
];

// ── Cache em memória — persiste entre navegações, reseta no refresh ──────────
const _presencaCacheByUser = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// ── Variantes de animação: parallax assimétrico (estilo iOS) ─────────────────
// O conteúdo que entra vem de mais longe (45%) e o que sai vai menos (22%)
// + scale sutil ao sair cria sensação de profundidade/camadas
const listVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? '28%' : '-28%',
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? '-14%' : '14%',
    opacity: 0,
    scale: 0.98,
  }),
};

// Spring rápido e firme — settle em ~220ms
const springTransition = {
  x: { type: 'spring', stiffness: 540, damping: 40, mass: 0.7 },
  opacity: { duration: 0.12, ease: 'easeOut' },
  scale: { duration: 0.16, ease: 'easeOut' },
};

// ── Componentes ──────────────────────────────────────────────────────────────

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ArrowButton = () => (
  <div aria-hidden="true" style={{
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

const EnsaioCard = ({ ensaio, index, onClick }) => {
  const p = CARD_PALETTE[index % CARD_PALETTE.length];
  const presente = ensaio.usuario_presente === 1;
  const [, mesIdx, dia] = ensaio.data_ensaio.split('-').map(Number);
  const mes = MONTH_ABBR[mesIdx - 1];
  const totalPartituras = ensaio.total_partituras ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 380, damping: 38 }}
      whileTap={{ scale: 0.982 }}
      onClick={() => onClick(ensaio)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(ensaio); } }}
      style={{
        borderRadius: '20px', background: p.bg,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        padding: '18px 20px', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Data */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '52px' }}>
        <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: p.sub, marginBottom: '2px' }}>{mes}</span>
        <span style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1, color: p.text, letterSpacing: '-1px' }}>{String(dia).padStart(2, '0')}</span>
        <span style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase', color: p.sub, marginTop: '3px' }}>{ensaio.dia_semana}</span>
      </div>

      <div style={{ width: '1px', height: '52px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          alignSelf: 'flex-start', padding: '4px 10px', borderRadius: '20px',
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.3px',
          background: p.pill, border: `1px solid ${p.pillBorder}`, color: p.text,
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: presente ? '#5DE065' : '#FF6B6B', flexShrink: 0 }} />
          {presente ? 'Presente' : 'Ausente'}
        </div>
        {totalPartituras !== null && (
          <span style={{ fontSize: '12px', fontWeight: '500', color: p.sub }}>
            {totalPartituras} {totalPartituras === 1 ? 'partitura' : 'partituras'}
          </span>
        )}
        {ensaio.numero_ensaio ? (
          <span style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.25)' }}>Ensaio #{ensaio.numero_ensaio}</span>
        ) : null}
      </div>

      <ArrowButton />
    </motion.div>
  );
};

// Skeleton neutro — sem cor, full-width, shimmer
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.25 }}
    style={{
      borderRadius: '20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    }}
  >
    {/* Coluna data */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '52px' }}>
      <div style={{ width: '28px', height: '9px', borderRadius: '4px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ width: '46px', height: '40px', borderRadius: '6px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ width: '34px', height: '9px', borderRadius: '4px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite' }} />
    </div>

    <div style={{ width: '1px', height: '52px', background: 'var(--border)', flexShrink: 0 }} />

    {/* Info — ocupa todo o espaço restante */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '9px' }}>
      <div style={{ height: '26px', borderRadius: '20px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite', width: '90px' }} />
      <div style={{ height: '12px', borderRadius: '4px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ height: '10px', borderRadius: '4px', background: 'var(--border)', animation: 'shimmer 1.4s ease-in-out infinite', width: '70%' }} />
    </div>

    {/* Seta placeholder */}
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0, animation: 'shimmer 1.4s ease-in-out infinite' }} />
  </motion.div>
);

// ── Screen ───────────────────────────────────────────────────────────────────

const EnsaiosScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userCacheKey = user?.id ?? user?.usuario_id ?? user?.email ?? null;
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [presencaData, setPresencaData] = useState(() => _presencaCacheByUser.get(userCacheKey)?.data ?? null); // inicia com cache se disponível
  const [loading, setLoading] = useState(!_presencaCacheByUser.get(userCacheKey));
  const [selectedEnsaio, setSelectedEnsaio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const swipeStartX = useRef(null);
  const swipeStartY = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const nowMs = Date.now();
    // Cache válido → não faz fetch
    const cached = _presencaCacheByUser.get(userCacheKey);
    if (cached && nowMs - cached.time < CACHE_TTL) {
      setPresencaData(cached.data);
      setLoading(false);
      return;
    }

    const fetchPresenca = async () => {
      try {
        setLoading(true);
        const data = await API.getMinhaPresenca();
        _presencaCacheByUser.set(userCacheKey, { data, time: Date.now() });
        setPresencaData(data);
      } catch { /* silencioso */ } finally {
        setLoading(false);
      }
    };
    fetchPresenca();
  }, [user, userCacheKey]);

  const isAtCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
  const getPrevMonth = () => (selectedMonth === 0 ? 11 : selectedMonth - 1);
  const getNextMonth = () => (selectedMonth === 11 ? 0 : selectedMonth + 1);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  }, [selectedMonth]);

  const handleNextMonth = useCallback(() => {
    if (isAtCurrentMonth) return;
    setDirection(1);
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  }, [selectedMonth, isAtCurrentMonth]);

  const handleTouchStart = (e) => {
    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (swipeStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    const dy = e.changedTouches[0].clientY - swipeStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      if (dx < 0) handleNextMonth();
      else handlePrevMonth();
    }
    swipeStartX.current = null;
    swipeStartY.current = null;
  };

  const filteredEnsaios = (presencaData?.ultimos_ensaios || []).filter(e => {
    const [ano, mes] = e.data_ensaio.split('-').map(Number);
    return mes - 1 === selectedMonth && ano === selectedYear;
  });

  const handleEnsaioClick = (ensaio) => { setSelectedEnsaio(ensaio); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setTimeout(() => setSelectedEnsaio(null), 300); };

  return (
    <div style={{ width: '100%', paddingBottom: '120px', overflowX: 'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── HEADER VINHO/DOURADO ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(145deg, #3D1517 0%, #220B0C 100%)',
        padding: '20px 20px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.12) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '-30px', top: '-30px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            marginBottom: '16px',
          }}
          aria-label="Voltar"
        >
          <BackIcon />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '18px', height: '1.5px', background: 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.3))' }} />
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '2px', color: 'rgba(212,175,55,0.75)', textTransform: 'uppercase' }}>
            Filarmônica 25 de Março
          </span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
          Histórico de Ensaios
        </h1>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.25) 70%, transparent 100%)',
        }} />
      </div>

      {/* ── MONTH NAV ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 20px' }}>
        <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px' }} aria-label="Mês anterior">
          <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{MONTH_ABBR[getPrevMonth()]}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)', display: 'flex' }} aria-label="Anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={`${selectedMonth}-${selectedYear}`}
              custom={direction}
              variants={{
                enter: (d) => ({ x: d >= 0 ? 20 : -20, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d) => ({ x: d >= 0 ? -12 : 12, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 540, damping: 40, mass: 0.7 }, opacity: { duration: 0.1 } }}
              style={{
                fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)',
                letterSpacing: '0.2px', minWidth: '140px', textAlign: 'center',
                display: 'block', userSelect: 'none',
              }}
            >
              {MONTH_NAMES[selectedMonth].toUpperCase()} {selectedYear}
            </motion.span>
          </AnimatePresence>

          <button onClick={handleNextMonth} disabled={isAtCurrentMonth}
            style={{ background: 'none', border: 'none', cursor: isAtCurrentMonth ? 'default' : 'pointer', padding: '4px', display: 'flex', color: 'var(--text-secondary)', opacity: isAtCurrentMonth ? 0.3 : 1 }}
            aria-label="Próximo mês"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        <button onClick={handleNextMonth} disabled={isAtCurrentMonth}
          style={{ background: 'none', border: 'none', cursor: isAtCurrentMonth ? 'default' : 'pointer', padding: '6px 8px', opacity: isAtCurrentMonth ? 0.3 : 1 }}
          aria-label="Próximo mês"
        >
          <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{MONTH_ABBR[getNextMonth()]}</span>
        </button>
      </div>

      {/* ── LISTA COM PARALLAX SPRING ─────────────────────────── */}
      <div style={{ padding: '0 20px', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`list-${selectedMonth}-${selectedYear}`}
            custom={direction}
            variants={listVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springTransition}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} index={i} />)
            ) : filteredEnsaios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>
                Nenhum ensaio registrado neste mês
              </div>
            ) : (
              filteredEnsaios.map((ensaio, i) => (
                <EnsaioCard key={ensaio.data_ensaio} ensaio={ensaio} index={i} onClick={handleEnsaioClick} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <EnsaioDetailModal ensaio={selectedEnsaio} isOpen={modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default EnsaiosScreen;
