// ===== ADMIN PRESENÇA =====
// Gerenciamento de presenças em ensaios + partituras tocadas

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { COLORS } from '@constants/colors';
import { UserListSkeleton } from '@components/common/Skeleton';
import CustomCheckbox from '@components/common/CustomCheckbox';
import EditarEnsaioModal from './modals/EditarEnsaioModal';

// ===== SVG ICONS MODERNOS =====
const CalendarIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const MusicIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const UsersIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SearchIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const TrashIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const RefreshIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <polyline points="23 20 23 14 17 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const PlusIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronDownIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ===== CUSTOM DATE PICKER =====
const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DIAS_SEMANA_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_SEMANA_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const ChevronLeft = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDatePt = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const diaSemana = DIAS_SEMANA_FULL[d.getDay()];
  const mes = MESES_PT[month - 1].toLowerCase();
  return `${diaSemana}, ${day} de ${mes} de ${year}`;
};

const DatePickerCalendar = ({ value, onChange, max }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedParts = value ? value.split('-').map(Number) : null;
  const [viewYear, setViewYear] = useState(selectedParts ? selectedParts[0] : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedParts ? selectedParts[1] - 1 : new Date().getMonth());

  const maxDate = max ? new Date(max + 'T00:00:00') : null;
  const todayStr = getLocalDateString();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const goToPrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleSelect = useCallback((dateStr) => {
    onChange(dateStr);
    setOpen(false);
  }, [onChange]);

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day, dateStr: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`, outside: true });
  }
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, dateStr, outside: false });
  }
  // Trailing days to fill last row
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const m = viewMonth === 11 ? 1 : viewMonth + 2;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({ day, dateStr: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`, outside: true });
    }
  }

  // Check if next month nav should be disabled
  const nextMonthDisabled = maxDate && new Date(viewYear, viewMonth + 1, 1) > maxDate;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'var(--bg)',
          border: `1px solid ${open ? '#D4AF37' : 'var(--border)'}`,
          borderRadius: '10px',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <CalendarIcon size={18} color="#D4AF37" />
        <span style={{ flex: 1 }}>
          {value ? formatDatePt(value) : 'Selecionar data'}
        </span>
        <ChevronRight size={16} color="var(--text-muted)" />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 100,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          minWidth: '300px',
          animation: 'dpFadeIn 0.15s ease-out'
        }}>
          {/* Month/Year header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <button
              type="button"
              onClick={goToPrevMonth}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {MESES_PT[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              disabled={nextMonthDisabled}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: nextMonthDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: nextMonthDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                opacity: nextMonthDisabled ? 0.4 : 1,
                transition: 'border-color 0.2s'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            marginBottom: '4px'
          }}>
            {DIAS_SEMANA_PT.map(d => (
              <div key={d} style={{
                textAlign: 'center',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                padding: '4px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px'
          }}>
            {cells.map((cell, idx) => {
              const isSelected = cell.dateStr === value;
              const isToday = cell.dateStr === todayStr;
              const cellDate = new Date(cell.dateStr + 'T00:00:00');
              const isDisabled = cell.outside || (maxDate && cellDate > maxDate);
              const dayOfWeek = cellDate.getDay();
              const isRehearsalDay = !cell.outside && (dayOfWeek === 1 || dayOfWeek === 3);

              let bg = 'transparent';
              let color = cell.outside ? 'var(--text-muted)' : 'var(--text-primary)';
              let border = '2px solid transparent';
              let fontWeight = '500';
              let opacity = isDisabled && !cell.outside ? 0.35 : cell.outside ? 0.3 : 1;

              if (isSelected) {
                bg = '#D4AF37';
                color = '#1a1a1a';
                fontWeight = '700';
                opacity = 1;
              } else if (isToday && !cell.outside) {
                border = '2px solid #D4AF37';
                fontWeight = '600';
              } else if (isRehearsalDay && !isDisabled) {
                bg = 'rgba(212, 175, 55, 0.1)';
                fontWeight = '600';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelect(cell.dateStr)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    color,
                    border,
                    borderRadius: '8px',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight,
                    cursor: isDisabled ? 'default' : 'pointer',
                    opacity,
                    transition: 'all 0.15s',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.background = bg;
                    }
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '3px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }} />
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>Dia de ensaio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '3px',
                border: '2px solid #D4AF37'
              }} />
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>Hoje</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe for fade-in */}
      <style>{`
        @keyframes dpFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ===== FAMÍLIA DE INSTRUMENTOS =====
const FAMILIA_CONFIG = {
  Madeiras: { color: '#27ae60' },
  Metais: { color: '#D4AF37' },
  Percussão: { color: '#9b59b6' },
  Outros: { color: '#3498db' }
};

const getFamiliaColor = (familia) => {
  return FAMILIA_CONFIG[familia]?.color || FAMILIA_CONFIG.Outros.color;
};

const AdminPresenca = () => {
  const { showToast } = useUI();
  const [usuarios, setUsuarios] = useState([]);

  const getUltimoEnsaio = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataAtual = new Date(hoje);

    while (true) {
      const diaSemana = dataAtual.getDay();

      if (diaSemana === 1 || diaSemana === 3) {
        const year = dataAtual.getFullYear();
        const month = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const day = String(dataAtual.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      dataAtual.setDate(dataAtual.getDate() - 1);

      const diff = Math.abs(hoje - dataAtual) / (1000 * 60 * 60 * 24);
      if (diff > 7) {
        const year = hoje.getFullYear();
        const month = String(hoje.getMonth() + 1).padStart(2, '0');
        const day = String(hoje.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
  };

  const [dataEnsaio, setDataEnsaio] = useState(getUltimoEnsaio());
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [modoMarcacao, setModoMarcacao] = useState('ausentes'); // 'presentes' ou 'ausentes'
  const [mostrarTodoHistorico, setMostrarTodoHistorico] = useState(false);
  const [agruparPorFamilia, setAgruparPorFamilia] = useState(false);

  // Estado para gestão de partituras
  const [partituras, setPartituras] = useState([]);
  const [partiturasEnsaio, setPartiturasEnsaio] = useState([]);
  const [buscaPartitura, setBuscaPartitura] = useState('');

  // Estado para edição/exclusão
  const [ensaioEditando, setEnsaioEditando] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  // Estado para expansão inline de ensaios anteriores
  const [ensaioExpandido, setEnsaioExpandido] = useState(null);
  const [detalheEnsaio, setDetalheEnsaio] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      const [users, presencas, todasPartituras] = await Promise.all([
        API.getUsuarios(),
        API.getTodasPresencas(),
        API.getPartituras()
      ]);

      // Filtrar músicos ativos (excluir convidados, inativos e conta admin do sistema)
      const musicos = (users || []).filter(u => u.ativo === 1 && u.convidado !== 1 && u.username !== 'admin');
      setUsuarios(musicos);
      setHistorico(presencas?.ensaios || []);
      setPartituras(todasPartituras || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    }
    setLoading(false);
  };

  // Carregar partituras do ensaio selecionado
  const loadPartiturasEnsaio = async (data) => {
    try {
      const result = await API.getPartiturasEnsaio(data);
      setPartiturasEnsaio(result.partituras || []);
    } catch (error) {
      console.error('Erro ao carregar partituras do ensaio:', error);
      setPartiturasEnsaio([]);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar partituras quando data mudar
  useEffect(() => {
    if (dataEnsaio) {
      loadPartiturasEnsaio(dataEnsaio);
    }
  }, [dataEnsaio]);

  // Toggle seleção individual
  const toggleUsuario = (usuarioId) => {
    setSelecionados(prev =>
      prev.includes(usuarioId)
        ? prev.filter(id => id !== usuarioId)
        : [...prev, usuarioId]
    );
  };

  // Marcar todos
  const marcarTodos = () => {
    setSelecionados(usuarios.map(u => u.id));
  };

  // Desmarcar todos
  const desmarcarTodos = () => {
    setSelecionados([]);
  };

  // Inverter seleção
  const inverterSelecao = () => {
    const naoSelecionados = usuarios.filter(u => !selecionados.includes(u.id)).map(u => u.id);
    setSelecionados(naoSelecionados);
  };

  // Marcar presença
  const handleMarcarPresenca = async () => {
    if (selecionados.length === 0) {
      showToast('Selecione pelo menos um músico', 'warning');
      return;
    }

    // Se modo = ausentes, inverter para registrar os presentes
    const idsParaRegistrar = modoMarcacao === 'ausentes'
      ? usuarios.filter(u => !selecionados.includes(u.id)).map(u => u.id)
      : selecionados;

    if (idsParaRegistrar.length === 0) {
      showToast('Nenhum músico presente para registrar', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await API.registrarPresencas(dataEnsaio, idsParaRegistrar);

      showToast(
        `Presença registrada: ${idsParaRegistrar.length} músico${idsParaRegistrar.length !== 1 ? 's' : ''}`,
        'success'
      );

      // Limpar seleção e recarregar dados
      setSelecionados([]);
      await loadData();
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
      showToast(error.message || 'Erro ao marcar presença', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdicionarPartitura = async (partituraId) => {
    const partitura = partituras.find(p => p.id === partituraId);
    if (!partitura) return;

    const novaOrdem = partiturasEnsaio.length + 1;
    const optimistic = {
      partitura_id: partituraId,
      titulo: partitura.titulo,
      compositor: partitura.compositor,
      ordem: novaOrdem
    };
    setPartiturasEnsaio(prev => [...prev, optimistic]);
    setBuscaPartitura('');

    try {
      await API.addPartituraEnsaio(dataEnsaio, partituraId);
      await loadPartiturasEnsaio(dataEnsaio);
    } catch (error) {
      await loadPartiturasEnsaio(dataEnsaio);
      showToast(error.message || 'Erro ao adicionar partitura', 'error');
    }
  };

  // Remover partitura do ensaio (optimistic)
  const handleRemoverPartitura = async (id) => {
    // Optimistic: remove imediatamente do state
    const removida = partiturasEnsaio.find(p => p.partitura_id === id);
    setPartiturasEnsaio(prev => prev.filter(p => p.partitura_id !== id));

    try {
      await API.removePartituraEnsaio(dataEnsaio, id);
    } catch (error) {
      // Rollback: restaura a partitura removida
      if (removida) {
        setPartiturasEnsaio(prev => [...prev, removida].sort((a, b) => a.ordem - b.ordem));
      }
      showToast(error.message || 'Erro ao remover partitura', 'error');
    }
  };

  // Editar ensaio
  const handleEditarEnsaio = (ensaio) => {
    setEnsaioEditando(ensaio);
    setModalEdicaoAberto(true);
  };

  // Excluir ensaio
  const handleExcluirEnsaio = async (ensaio) => {
    if (!confirm(`Excluir ensaio de ${formatDatePt(ensaio.data_ensaio)}? Todas as presenças e partituras serão removidas.`)) {
      return;
    }
    try {
      await API.excluirEnsaio(ensaio.data_ensaio);
      showToast('Ensaio excluído com sucesso', 'success');
      loadData();
    } catch (error) {
      showToast('Erro ao excluir ensaio', 'error');
    }
  };

  // Expandir/colapsar ensaio anterior inline
  const handleExpandirEnsaio = async (ensaio) => {
    if (ensaioExpandido === ensaio.data_ensaio) {
      setEnsaioExpandido(null);
      setDetalheEnsaio(null);
      return;
    }
    setEnsaioExpandido(ensaio.data_ensaio);
    setCarregandoDetalhe(true);
    try {
      const data = await API.getDetalheEnsaio(ensaio.data_ensaio);
      setDetalheEnsaio(data);
    } catch (error) {
      showToast('Erro ao carregar detalhes', 'error');
    } finally {
      setCarregandoDetalhe(false);
    }
  };

  const dataMaxima = useMemo(() => {
    return getLocalDateString();
  }, []);

  // Filtrar partituras pela busca
  const partiturasFiltered = useMemo(() => {
    if (!buscaPartitura.trim()) return [];

    const termo = buscaPartitura.toLowerCase();
    const idsJaAdicionados = new Set(partiturasEnsaio.map(p => p.partitura_id));

    return partituras
      .filter(p => !idsJaAdicionados.has(p.id))
      .filter(p =>
        p.titulo.toLowerCase().includes(termo) ||
        p.compositor.toLowerCase().includes(termo)
      )
      .slice(0, 5); // Máximo 5 resultados
  }, [buscaPartitura, partituras, partiturasEnsaio]);

  // Contar presentes/ausentes com base no modo
  const contadorTexto = useMemo(() => {
    if (modoMarcacao === 'presentes') {
      return `${selecionados.length} selecionado${selecionados.length !== 1 ? 's' : ''}`;
    } else {
      const presentes = usuarios.length - selecionados.length;
      return `${presentes} presente${presentes !== 1 ? 's' : ''}, ${selecionados.length} ausente${selecionados.length !== 1 ? 's' : ''}`;
    }
  }, [modoMarcacao, selecionados.length, usuarios.length]);

  // Agrupar músicos por família de instrumento
  const gruposPorFamilia = useMemo(() => {
    const grupos = {};
    const ordemFamilias = ['Madeiras', 'Metais', 'Percussão', 'Outros'];

    usuarios.forEach(u => {
      const familia = u.instrumento_familia || 'Outros';
      if (!grupos[familia]) {
        grupos[familia] = [];
      }
      grupos[familia].push(u);
    });

    // Ordenar músicos dentro de cada grupo por nome
    Object.keys(grupos).forEach(familia => {
      grupos[familia].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    });

    // Retornar na ordem definida
    return ordemFamilias
      .filter(f => grupos[f] && grupos[f].length > 0)
      .map(f => ({ familia: f, musicos: grupos[f] }));
  }, [usuarios]);

  // Histórico limitado
  const historicoExibido = useMemo(() => {
    if (mostrarTodoHistorico) return historico;
    return historico.slice(0, 5);
  }, [historico, mostrarTodoHistorico]);

  if (loading) return <UserListSkeleton />;

  const accentColor = modoMarcacao === 'presentes' ? COLORS.success.primary : '#E85A4F';

  const renderMusicoRow = (usuario, familiaColor) => {
    const isSelected = selecionados.includes(usuario.id);

    return (
      <label
        key={usuario.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          paddingLeft: isSelected ? '13px' : '16px',
          borderBottom: '1px solid var(--border)',
          borderLeft: isSelected ? `3px solid ${accentColor}` : '3px solid transparent',
          background: isSelected ? `${accentColor}08` : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.15s',
          fontFamily: 'Outfit, sans-serif'
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'rgba(212,175,55, 0.04)';
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'transparent';
        }}
      >
        <CustomCheckbox
          checked={isSelected}
          onChange={() => toggleUsuario(usuario.id)}
          accentColor={accentColor}
          size={20}
        />
        {/* Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: familiaColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: '700',
          fontSize: '14px',
          color: '#FFFFFF',
          flexShrink: 0
        }}>
          {usuario.nome.charAt(0).toUpperCase()}
        </div>
        {/* Nome + Badge */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {usuario.nome}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: `${familiaColor}1F`,
            color: familiaColor,
            fontWeight: '600',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}>
            {usuario.instrumento_nome}
          </span>
        </div>
      </label>
    );
  };

  return (
    <div className="screen-container" style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px'
        }}>
          Controle de Presença
        </h1>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: '1.5'
        }}>
          Registre a presença dos músicos e gerencie as partituras tocadas nos ensaios
        </p>
      </div>

      {/* Toolbar Compacta: Data + Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* DatePicker à esquerda */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <DatePickerCalendar
            value={dataEnsaio}
            max={dataMaxima}
            onChange={setDataEnsaio}
          />
        </div>

        {/* Segmented Control à direita */}
        <div style={{
          display: 'flex',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <button
            onClick={() => setModoMarcacao('presentes')}
            style={{
              padding: '10px 20px',
              background: modoMarcacao === 'presentes' ? COLORS.success.primary : 'transparent',
              color: modoMarcacao === 'presentes' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderRight: '1px solid var(--border)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircleIcon size={15} />
            Presentes
          </button>
          <button
            onClick={() => setModoMarcacao('ausentes')}
            style={{
              padding: '10px 20px',
              background: modoMarcacao === 'ausentes' ? '#E85A4F' : 'transparent',
              color: modoMarcacao === 'ausentes' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <XCircleIcon size={15} />
            Ausentes
          </button>
        </div>
      </div>

      {/* Grid Principal: Músicos + Partituras */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Seção: Músicos */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header da Seção */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UsersIcon size={20} color="#D4AF37" />
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Músicos
              </h2>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}>
                {contadorTexto}
              </span>
            </div>

            {/* Botões de Controle Compactos */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => setAgruparPorFamilia(prev => !prev)}
                style={{
                  padding: '4px 10px',
                  background: agruparPorFamilia ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: agruparPorFamilia ? '#D4AF37' : 'var(--text-muted)',
                  border: `1px solid ${agruparPorFamilia ? 'rgba(212, 175, 55, 0.4)' : 'var(--border)'}`,
                  borderRadius: '6px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Por seção
              </button>
              <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
              {[
                { label: 'Todos', onClick: marcarTodos },
                { label: 'Limpar', onClick: desmarcarTodos },
                { label: 'Inverter', onClick: inverterSelecao, icon: <RefreshIcon size={12} /> }
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  style={{
                    padding: '4px 10px',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D4AF37';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Músicos agrupada */}
          <div style={{
            maxHeight: '520px',
            overflowY: 'auto',
            flex: 1
          }}>
            {usuarios.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px'
              }}>
                Nenhum músico cadastrado
              </div>
            ) : agruparPorFamilia ? (
              gruposPorFamilia.map(({ familia, musicos }) => {
                const familiaColor = getFamiliaColor(familia);
                const selecionadosNoGrupo = musicos.filter(m => selecionados.includes(m.id)).length;

                return (
                  <div key={familia}>
                    {/* Header do grupo */}
                    <div style={{
                      padding: '8px 20px',
                      background: 'var(--bg)',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: familiaColor,
                        flexShrink: 0
                      }} />
                      <span style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        flex: 1
                      }}>
                        {familia}
                      </span>
                      <span style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        fontWeight: '500'
                      }}>
                        {selecionadosNoGrupo}/{musicos.length}
                      </span>
                    </div>

                    {/* Músicos do grupo */}
                    {musicos.map((usuario) => renderMusicoRow(usuario, getFamiliaColor(usuario.instrumento_familia || 'Outros')))}
                  </div>
                );
              })
            ) : (
              [...usuarios].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map((usuario) =>
                renderMusicoRow(usuario, getFamiliaColor(usuario.instrumento_familia || 'Outros'))
              )
            )}
          </div>

          {/* Sticky action bar */}
          {selecionados.length > 0 && (
            <div style={{
              position: 'sticky',
              bottom: 0,
              padding: '12px 16px',
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--border)',
              backdropFilter: 'blur(12px)',
              animation: 'stickyBarIn 0.2s ease-out'
            }}>
              <button
                onClick={handleMarcarPresenca}
                disabled={submitting}
                className="btn-primary-hover"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: accentColor,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {modoMarcacao === 'presentes' ? (
                  <CheckCircleIcon size={18} />
                ) : (
                  <XCircleIcon size={18} />
                )}
                {submitting ? 'Registrando...' : `Marcar ${contadorTexto}`}
              </button>
            </div>
          )}
        </div>

        {/* Seção: Partituras Tocadas */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header da Seção */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <MusicIcon size={20} color="#D4AF37" />
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Partituras Tocadas
              </h2>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}>
                {partiturasEnsaio.length}
              </span>
            </div>

            {/* Campo de Busca */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <SearchIcon size={16} color="#D4AF37" />
              </div>
              <input
                type="text"
                placeholder="Buscar partitura..."
                value={buscaPartitura}
                onChange={(e) => setBuscaPartitura(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Resultados da Busca */}
            {buscaPartitura.trim() && (
              <div style={{
                marginTop: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg)',
                overflow: 'hidden'
              }}>
                {partiturasFiltered.length === 0 ? (
                  <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Nenhuma partitura encontrada
                  </div>
                ) : (
                  partiturasFiltered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAdicionarPartitura(p.id)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <PlusIcon size={14} color="#D4AF37" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          marginBottom: '1px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {p.titulo}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)'
                        }}>
                          {p.compositor}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Lista de Partituras do Ensaio */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            flex: 1
          }}>
            {partiturasEnsaio.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px'
              }}>
                Nenhuma partitura adicionada
              </div>
            ) : (
              partiturasEnsaio.map((p, index) => (
                <div
                  key={p.id || p.partitura_id}
                  className="partitura-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.04)';
                    const btn = e.currentTarget.querySelector('.remove-btn');
                    if (btn) btn.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    const btn = e.currentTarget.querySelector('.remove-btn');
                    if (btn) btn.style.opacity = '0';
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(145deg, #D4AF37, #F4E4BC)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px',
                    color: '#3D1011',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '1px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.titulo}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.compositor}
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoverPartitura(p.partitura_id)}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#E85A4F',
                      opacity: 0,
                      transition: 'opacity 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Histórico de Ensaios */}
      <div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '20px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          letterSpacing: '-0.3px'
        }}>
          Ensaios Anteriores
        </h2>

        {historico.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '15px'
          }}>
            Nenhum ensaio registrado
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {historicoExibido.map((ensaio, index) => (
              <React.Fragment key={ensaio.data_ensaio}>
                <div
                  className="historico-row"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleExpandirEnsaio(ensaio)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (e.key === ' ') e.preventDefault();
                      handleExpandirEnsaio(ensaio);
                    }
                  }}
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    borderBottom: (ensaioExpandido === ensaio.data_ensaio || index < historicoExibido.length - 1) ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.04)';
                    const btns = e.currentTarget.querySelector('.hist-actions');
                    if (btns) btns.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    const btns = e.currentTarget.querySelector('.hist-actions');
                    if (btns) btns.style.opacity = '0';
                  }}
                >
                  {/* Date badge compacto */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(145deg, #D4AF37, #F4E4BC)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: '#3D1011',
                      fontFamily: 'Outfit, sans-serif',
                      lineHeight: 1
                    }}>
                      {(() => {
                        try {
                          const [, , dia] = ensaio.data_ensaio.split('-');
                          return dia || '?';
                        } catch {
                          return '?';
                        }
                      })()}
                    </div>
                    <div style={{
                      fontSize: '9px',
                      fontWeight: '600',
                      color: '#3D1011',
                      fontFamily: 'Outfit, sans-serif',
                      textTransform: 'uppercase',
                      marginTop: '1px'
                    }}>
                      {(() => {
                        try {
                          const [, mes] = ensaio.data_ensaio.split('-');
                          const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                          return meses[parseInt(mes) - 1] || '?';
                        } catch {
                          return '?';
                        }
                      })()}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'Outfit, sans-serif',
                      marginBottom: '4px'
                    }}>
                      {formatDatePt(ensaio.data_ensaio)}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UsersIcon size={13} color="var(--text-muted)" /> {ensaio.total_presencas} músicos
                      </span>
                      <span style={{ margin: '0 8px', color: 'var(--border)', fontSize: '11px' }}>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MusicIcon size={13} color="var(--text-muted)" /> {ensaio.total_partituras} partituras
                      </span>
                    </div>
                  </div>

                  <div
                    className="hist-actions"
                    style={{
                      display: 'flex',
                      gap: '4px',
                      opacity: 0,
                      transition: 'opacity 0.15s'
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditarEnsaio(ensaio); }}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--bg)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <EditIcon size={13} />
                      Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleExcluirEnsaio(ensaio); }}
                      style={{
                        padding: '6px',
                        background: 'var(--bg)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#E85A4F';
                        e.currentTarget.style.color = '#E85A4F';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
                {ensaioExpandido === ensaio.data_ensaio && (
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: index < historicoExibido.length - 1 ? '1px solid var(--border)' : 'none',
                    background: 'rgba(212,175,55,0.03)'
                  }}>
                    {carregandoDetalhe ? (
                      <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', fontSize: '13px' }}>
                        Carregando...
                      </div>
                    ) : detalheEnsaio ? (
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Presentes column */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{
                            fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                            fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
                            letterSpacing: '0.5px', marginBottom: '8px'
                          }}>
                            Presentes ({detalheEnsaio.total_presentes})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(detalheEnsaio.presentes || []).map(p => (
                              <div key={p.usuario_id} style={{
                                fontSize: '13px', fontFamily: 'Outfit, sans-serif',
                                color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px'
                              }}>
                                <span>{p.nome}</span>
                                {p.instrumento_nome && (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {p.instrumento_nome}
                                  </span>
                                )}
                              </div>
                            ))}
                            {(detalheEnsaio.presentes || []).length === 0 && (
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                                Nenhum presente
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Partituras column */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{
                            fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                            fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
                            letterSpacing: '0.5px', marginBottom: '8px'
                          }}>
                            Partituras ({detalheEnsaio.total_partituras})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(detalheEnsaio.partituras || []).map(p => (
                              <div key={p.id} style={{
                                fontSize: '13px', fontFamily: 'Outfit, sans-serif',
                                color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px'
                              }}>
                                <span>{p.titulo}</span>
                                {p.compositor && (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {p.compositor}
                                  </span>
                                )}
                              </div>
                            ))}
                            {(detalheEnsaio.partituras || []).length === 0 && (
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                                Nenhuma partitura
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Ver mais */}
            {historico.length > 5 && (
              <button
                onClick={() => setMostrarTodoHistorico(prev => !prev)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px solid var(--border)',
                  color: '#D4AF37',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ChevronDownIcon
                  size={14}
                  color="#D4AF37"
                />
                {mostrarTodoHistorico
                  ? 'Ver menos'
                  : `Ver mais ${historico.length - 5} ensaio${historico.length - 5 !== 1 ? 's' : ''}`
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {modalEdicaoAberto && ensaioEditando && (
        <EditarEnsaioModal
          ensaio={ensaioEditando}
          usuarios={usuarios}
          onClose={() => setModalEdicaoAberto(false)}
          onUpdate={() => loadData()}
          addNotification={showToast}
        />
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes stickyBarIn {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminPresenca;
