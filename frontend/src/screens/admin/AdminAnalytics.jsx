// ===== ADMIN ANALYTICS =====
// Dashboard organizado por perguntas administrativas.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API } from '@services/api';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { getAtividadeInfo, formatTimeAgo } from '@utils/formatters';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Flame,
  Music,
  RefreshCw,
  Search,
  UserCheck,
  Users
} from 'lucide-react';

const GOLD = '#D4AF37';
const COLORS = {
  gold: GOLD,
  blue: '#4A90D9',
  green: '#34C759',
  red: '#E74C3C',
  purple: '#9B59B6',
  orange: '#E67E22',
};

const formatLocalDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const now = new Date();
const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const monthEnd = formatLocalDate(nextMonth);
const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DIAS_SEMANA_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_SEMANA_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const tabs = [
  { id: 'acervo', icon: Music, label: 'Uso do acervo' },
  { id: 'pessoas', icon: Users, label: 'Pessoas' },
  { id: 'ensaios', icon: UserCheck, label: 'Ensaios' },
  { id: 'alteracoes', icon: Activity, label: 'Alterações' },
];

const number = (value) => Number(value || 0).toLocaleString('pt-BR');
const percent = (value) => `${Number(value || 0).toLocaleString('pt-BR')}%`;
const compactText = (value, max = 96) => {
  if (!value) return '';
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
const formatDatePt = (dateStr) => {
  if (!dateStr) return 'Selecionar data';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${DIAS_SEMANA_FULL[date.getDay()]}, ${day} de ${MESES_PT[month - 1].toLowerCase()} de ${year}`;
};

const AdminAnalytics = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('acervo');
  const [periodStart, setPeriodStart] = useState(monthStart);
  const [periodEnd, setPeriodEnd] = useState(monthEnd);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const analyticsRequestIdRef = useRef(0);

  const buildQuery = useCallback((extra = {}) => {
    const params = new URLSearchParams({
      inicio: periodStart,
      fim: periodEnd,
      ...extra
    });

    if (selectedUserId) params.set('usuario_id', selectedUserId);
    if (selectedAdminId) params.set('atividade_usuario_id', selectedAdminId);

    return `?${params.toString()}`;
  }, [periodStart, periodEnd, selectedUserId, selectedAdminId]);

  const loadAnalytics = useCallback(async () => {
    const requestId = analyticsRequestIdRef.current + 1;
    analyticsRequestIdRef.current = requestId;

    try {
      setLoading(true);
      setError(null);
      const result = await API.getAnalyticsDashboard(buildQuery({ section: activeTab }));
      if (analyticsRequestIdRef.current !== requestId) return;
      setData(prev => ({ ...(prev || {}), ...result }));
    } catch (err) {
      if (analyticsRequestIdRef.current !== requestId) return;
      console.error('Erro analytics:', err);
      setError(err.message || 'Erro ao carregar analytics');
    } finally {
      if (analyticsRequestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [activeTab, buildQuery]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const loadMoreAtividades = async () => {
    if (!data || loadingMore) return;
    const current = data.alteracoes?.atividades || data.atividade_recente || [];
    setLoadingMore(true);
    try {
      const result = await API.getAnalyticsDashboard(buildQuery({
        section: 'alteracoes',
        atividades_limit: '30',
        atividades_offset: String(current.length)
      }));
      const nextItems = result.alteracoes?.atividades || result.atividade_recente || [];
      setData(prev => ({
        ...prev,
        alteracoes: {
          ...(prev.alteracoes || {}),
          atividades: [...current, ...nextItems],
          total: result.alteracoes?.total ?? prev.alteracoes?.total ?? prev.total_atividades ?? current.length
        },
        atividade_recente: [...current, ...nextItems],
        total_atividades: result.total_atividades ?? prev.total_atividades
      }));
    } catch (err) {
      console.error('Erro ao carregar mais atividades:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const usoAcervo = data?.uso_acervo || {};
  const pessoas = data?.pessoas || {};
  const ensaios = data?.ensaios || {};
  const alteracoes = data?.alteracoes || {
    usuarios: [],
    atividades: data?.atividade_recente || [],
    total: data?.total_atividades || 0
  };

  const maxFunil = useMemo(() => {
    return Math.max(...(usoAcervo.funil || []).map(item => Number(item.total || 0)), 1);
  }, [usoAcervo.funil]);

  if (loading && !data) {
    return <LoadingState isMobile={isMobile} />;
  }

  if (error) {
    return (
      <CenteredState
        icon={AlertTriangle}
        title="Erro ao carregar analytics"
        description={error}
        action={<Button onClick={loadAnalytics}><RefreshCw size={16} /> Tentar novamente</Button>}
      />
    );
  }

  return (
    <div className="page-transition" style={{ padding: isMobile ? '12px' : '24px', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: isMobile ? 'stretch' : 'flex-start', flexDirection: isMobile ? 'column' : 'row', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '30px', color: 'var(--text-primary)' }}>
            Analytics
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px', maxWidth: '640px', lineHeight: 1.5 }}>
            Acompanhe uso do acervo, comportamento por pessoa, assiduidade dos ensaios e alterações administrativas.
          </p>
        </div>
        <Button onClick={loadAnalytics} disabled={loading}>
          <RefreshCw size={16} /> {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto', gap: isMobile ? '8px' : '12px', alignItems: 'end', marginBottom: isMobile ? '12px' : '18px', minWidth: 0 }}>
        <div style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : undefined, gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px', minWidth: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: isMobile ? '8px 7px' : '8px 12px',
                background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === tab.id ? GOLD : 'var(--text-muted)',
                display: 'flex',
                gap: isMobile ? '5px' : '8px',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: isMobile ? '11px' : '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              <tab.icon size={isMobile ? 13 : 16} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
            </button>
          ))}
        </div>
        <DateField label="Início" value={periodStart} onChange={setPeriodStart} />
        <DateField label="Fim" value={periodEnd} onChange={setPeriodEnd} />
      </div>

      {activeTab === 'acervo' && (
        <SectionGrid>
          <KpiCard icon={Music} label="Partituras abertas" value={number(usoAcervo.resumo?.partituras_abertas)} color={COLORS.gold} />
          <KpiCard icon={Eye} label="PDFs visualizados" value={number(usoAcervo.resumo?.pdfs_visualizados)} color={COLORS.blue} />
          <KpiCard icon={Download} label="Downloads reais" value={number(usoAcervo.resumo?.downloads_reais)} color={COLORS.green} />
          <KpiCard icon={Search} label="Buscas sem resultado" value={number(usoAcervo.resumo?.buscas_sem_resultado)} color={COLORS.red} />

          <Panel title="Funil do acervo" icon={<BarChart3 size={18} color={GOLD} />} wide>
            <p style={helpTextStyle}>Consulta e download são comportamentos diferentes: visualizar PDF não conta como download real.</p>
            {(usoAcervo.funil || []).map(item => (
              <ProgressRow key={item.etapa} label={item.etapa} value={item.total} max={maxFunil} color={GOLD} />
            ))}
          </Panel>

          <Panel title="Insights do período" icon={<AlertTriangle size={18} color={COLORS.orange} />}>
            {usoAcervo.insights?.length ? (
              <CompactList items={usoAcervo.insights} renderItem={(item) => ({ primary: item.titulo, secondary: item.descricao })} />
            ) : (
              <EmptyState icon={AlertTriangle} message="Sem alertas de uso no período" />
            )}
          </Panel>

          <Panel title="Partituras mais usadas" icon={<Music size={18} color={COLORS.blue} />}>
            <CompactList
              items={usoAcervo.top_partituras || []}
              renderItem={(item) => ({
                primary: item.titulo,
                secondary: `${item.compositor || 'Sem compositor'} · ${number(item.aberturas)} aberturas · ${number(item.visualizacoes)} visualizações`,
                value: `${number(item.downloads)} downloads`
              })}
            />
          </Panel>

          <Panel title="Partes mais usadas" icon={<Download size={18} color={COLORS.green} />}>
            <CompactList
              items={usoAcervo.top_partes || []}
              renderItem={(item) => ({
                primary: item.instrumento,
                secondary: item.partitura_titulo,
                value: `${number(item.downloads)} downloads`
              })}
            />
          </Panel>
        </SectionGrid>
      )}

      {activeTab === 'pessoas' && (
        <SectionGrid>
          <Panel title="Filtro por pessoa" icon={<Users size={18} color={GOLD} />} wide>
            <SelectField
              value={selectedUserId}
              onChange={setSelectedUserId}
              placeholder="Selecione uma pessoa"
              options={(pessoas.usuarios || []).map(user => ({ value: String(user.id), label: user.nome }))}
            />
          </Panel>

          {selectedUserId ? (
            <>
              <KpiCard icon={Music} label="Partituras abertas" value={number(pessoas.resumo_usuario?.partituras_abertas)} color={COLORS.gold} />
              <KpiCard icon={Eye} label="PDFs visualizados" value={number(pessoas.resumo_usuario?.pdfs_visualizados)} color={COLORS.blue} />
              <KpiCard icon={Download} label="Downloads reais" value={number(pessoas.resumo_usuario?.downloads_reais)} color={COLORS.green} />
              <KpiCard icon={Search} label="Buscas" value={number(pessoas.resumo_usuario?.buscas)} color={COLORS.purple} />

              <Panel title="Timeline da pessoa" icon={<Activity size={18} color={COLORS.blue} />} wide>
                <Timeline items={pessoas.timeline || []} total={pessoas.total_timeline || 0} />
              </Panel>
            </>
          ) : (
            <Panel title="Resumo por pessoa" icon={<Users size={18} color={GOLD} />} wide>
              <EmptyState icon={Users} message="Selecione uma pessoa para ver resumo e timeline." />
            </Panel>
          )}
        </SectionGrid>
      )}

      {activeTab === 'ensaios' && (
        <SectionGrid>
          <KpiCard icon={UserCheck} label="Presença média do mês" value={percent(ensaios.resumo?.presenca_media)} color={COLORS.green} />
          <KpiCard icon={Flame} label="Maior streak ativo" value={number(ensaios.resumo?.maior_streak_ativo)} color={COLORS.orange} />
          <KpiCard icon={Users} label="Presença perfeita" value={number(ensaios.resumo?.musicos_presenca_perfeita)} color={COLORS.gold} />
          <KpiCard icon={CalendarDays} label="Ensaios registrados" value={number(ensaios.resumo?.ensaios_registrados)} color={COLORS.blue} />

          <Panel title="Streaks de presença" icon={<Flame size={18} color={COLORS.orange} />}>
            <CompactList
              items={ensaios.streaks || []}
              initialLimit={5}
              renderItem={(item) => ({
                rank: item.posicao,
                primary: item.nome,
                secondary: item.instrumento,
                value: `${number(item.streak)} ensaio${item.streak === 1 ? '' : 's'}`
              })}
            />
          </Panel>

          <Panel title="Assiduidade por músico" icon={<UserCheck size={18} color={COLORS.green} />}>
            <CompactList
              items={ensaios.assiduidade_musicos || []}
              initialLimit={5}
              renderItem={(item) => ({
                rank: item.posicao,
                primary: item.nome,
                secondary: `${number(item.presencas)} de ${number(item.ensaios)} ensaios`,
                value: percent(item.taxa)
              })}
            />
          </Panel>

          <Panel title="Presença por naipe" icon={<Users size={18} color={COLORS.purple} />} wide>
            {ensaios.empty_state && <p style={helpTextStyle}>{ensaios.empty_state}</p>}
            {(ensaios.presenca_naipes || []).map(item => (
              <details key={item.familia} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {item.familia}: {number(item.registradas)} presenças registradas de {number(item.esperadas)} esperadas
                </summary>
                <p style={{ ...helpTextStyle, marginTop: '8px' }}>
                  {number(item.musicos)} músicos ativos × {number(item.ensaios)} ensaios registrados = {number(item.esperadas)} presenças esperadas. Taxa: {percent(item.taxa)}.
                </p>
              </details>
            ))}
          </Panel>
        </SectionGrid>
      )}

      {activeTab === 'alteracoes' && (
        <SectionGrid>
          <Panel title="Filtro por admin" icon={<Users size={18} color={GOLD} />} wide>
            <SelectField
              value={selectedAdminId}
              onChange={setSelectedAdminId}
              placeholder="Todos os admins"
              options={(alteracoes.usuarios || []).map(user => ({ value: String(user.id), label: user.nome }))}
            />
          </Panel>
          <Panel title="Alterações recentes" icon={<Activity size={18} color={COLORS.blue} />} wide>
            <ActivityFeed
              items={alteracoes.atividades || []}
              totalCount={alteracoes.total || 0}
              onLoadMore={loadMoreAtividades}
              loadingMore={loadingMore}
            />
          </Panel>
        </SectionGrid>
      )}
    </div>
  );
};

const helpTextStyle = {
  color: 'var(--text-muted)',
  fontSize: '14px',
  lineHeight: 1.5,
  margin: '0 0 14px'
};

const controlStyle = {
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 12px',
  minHeight: '40px'
};

const calendarNavStyle = {
  width: '34px',
  height: '34px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      ...controlStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: GOLD,
      fontWeight: 700,
      cursor: props.disabled ? 'wait' : 'pointer',
      opacity: props.disabled ? 0.7 : 1
    }}
  >
    {children}
  </button>
);

const DateField = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedParts = value ? value.split('-').map(Number) : null;
  const selectedYear = selectedParts?.[0];
  const selectedMonth = selectedParts?.[1] - 1;
  const [viewYear, setViewYear] = useState(selectedParts ? selectedParts[0] : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedParts ? selectedParts[1] - 1 : new Date().getMonth());

  useEffect(() => {
    if (!open || !selectedYear || selectedMonth === undefined) return;
    setViewYear(selectedYear);
    setViewMonth(selectedMonth);
  }, [open, selectedMonth, selectedYear]);

  useEffect(() => {
    const handler = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const cells = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const nextCells = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
      const day = daysInPrevMonth - i;
      const month = viewMonth === 0 ? 12 : viewMonth;
      const year = viewMonth === 0 ? viewYear - 1 : viewYear;
      nextCells.push({ day, outside: true, dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      nextCells.push({ day, outside: false, dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
    }

    const remaining = 7 - (nextCells.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day += 1) {
        const month = viewMonth === 11 ? 1 : viewMonth + 2;
        const year = viewMonth === 11 ? viewYear + 1 : viewYear;
        nextCells.push({ day, outside: true, dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
      }
    }

    return nextCells;
  }, [viewMonth, viewYear]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(year => year - 1);
      setViewMonth(11);
      return;
    }
    setViewMonth(month => month - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(year => year + 1);
      setViewMonth(0);
      return;
    }
    setViewMonth(month => month + 1);
  };

  const handleSelect = (dateStr) => {
    onChange(dateStr);
    setOpen(false);
  };

  return (
    <label ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>
      {label}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          ...controlStyle,
          minWidth: '186px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          borderColor: open ? GOLD : 'var(--border)',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span>{formatDatePt(value)}</span>
        <CalendarDays size={16} color={GOLD} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          zIndex: 30,
          width: '300px',
          maxWidth: 'calc(100vw - 32px)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 18px 48px rgba(0,0,0,0.42)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button type="button" onClick={goToPrevMonth} style={calendarNavStyle} aria-label="Mês anterior">
              <ChevronLeft size={18} />
            </button>
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
              {MESES_PT[viewMonth]} {viewYear}
            </strong>
            <button type="button" onClick={goToNextMonth} style={calendarNavStyle} aria-label="Próximo mês">
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
            {DIAS_SEMANA_PT.map(day => (
              <div key={day} style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', fontWeight: 800 }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {cells.map(cell => {
              const selected = cell.dateStr === value;
              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => handleSelect(cell.dateStr)}
                  style={{
                    height: '34px',
                    borderRadius: '8px',
                    border: `1px solid ${selected ? GOLD : 'transparent'}`,
                    background: selected ? `${GOLD}22` : 'transparent',
                    color: selected ? GOLD : cell.outside ? 'var(--text-muted)' : 'var(--text-primary)',
                    opacity: cell.outside ? 0.5 : 1,
                    cursor: 'pointer',
                    fontWeight: selected ? 800 : 600
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </label>
  );
};

const SelectField = ({ value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(option => String(option.value) === String(value));

  useEffect(() => {
    const handler = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const allOptions = [{ value: '', label: placeholder }, ...options];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{ ...controlStyle, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', borderColor: open ? GOLD : 'var(--border)', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown size={16} color={GOLD} />
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: '240px', overflowY: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px', boxShadow: '0 16px 42px rgba(0,0,0,0.46)' }}>
          {allOptions.map(option => {
            const selected = String(option.value) === String(value);
            return (
              <button
                key={option.value || '__empty'}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={{ width: '100%', border: 'none', borderRadius: '6px', background: selected ? `${GOLD}1f` : 'transparent', color: selected ? GOLD : 'var(--text-primary)', padding: '9px 10px', textAlign: 'left', cursor: 'pointer', fontWeight: selected ? 800 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SectionGrid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
    {children}
  </div>
);

const KpiCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ minWidth: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
      <Icon size={18} />
    </div>
    <div style={{ color, fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>{value}</div>
    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '5px', lineHeight: 1.3 }}>{label}</div>
  </div>
);

const Panel = ({ title, icon, children, wide }) => (
  <section style={{ gridColumn: wide ? '1 / -1' : undefined, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', minWidth: 0, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', minWidth: 0 }}>
      {icon}
      <h2 style={{ color: 'var(--text-primary)', fontSize: '17px', lineHeight: 1.2, margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const ProgressRow = ({ label, value, max, color }) => (
  <div style={{ marginBottom: '14px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', color: 'var(--text-primary)', fontWeight: 700 }}>
      <span>{label}</span>
      <span>{number(value)}</span>
    </div>
    <div style={{ height: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(4, (Number(value || 0) / max) * 100)}%`, height: '100%', background: color, borderRadius: '999px' }} />
    </div>
  </div>
);

const CompactList = ({ items, renderItem, initialLimit = 6 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!items?.length) return <EmptyState icon={BarChart3} message="Nenhum dado disponível" />;
  const visibleItems = expanded ? items : items.slice(0, initialLimit);
  const hasMore = items.length > initialLimit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {visibleItems.map((item, index) => {
        const rendered = renderItem(item);
        const rank = rendered.rank ?? item.posicao ?? index + 1;
        const highlighted = rank <= 3;
        return (
          <div key={item.id ?? index} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '11px', borderRadius: '8px', background: 'var(--bg-primary)', minWidth: 0 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: highlighted ? `${GOLD}18` : 'var(--bg-secondary)', color: highlighted ? GOLD : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {rank}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rendered.primary}</div>
              {rendered.secondary && <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.3, marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rendered.secondary}</div>}
            </div>
            {rendered.value && <div style={{ color: GOLD, fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap', fontSize: '14px' }}>{rendered.value}</div>}
          </div>
        );
      })}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          style={{ ...controlStyle, width: '100%', justifyContent: 'center', color: GOLD, fontWeight: 800, cursor: 'pointer', padding: '9px 12px' }}
        >
          {expanded ? 'Mostrar menos' : `Ver todos (${items.length})`}
        </button>
      )}
    </div>
  );
};

const _SimpleList = ({ items, renderItem }) => {
  if (!items?.length) return <EmptyState icon={BarChart3} message="Nenhum dado disponível" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, index) => {
        const rendered = renderItem(item);
        return (
          <div key={item.id ?? index} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr)', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: index < 3 ? `${GOLD}18` : 'var(--bg-secondary)', color: index < 3 ? GOLD : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginTop: '2px' }}>
              {index + 1}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{rendered.primary}</div>
              {rendered.secondary && <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.35, marginTop: '4px', overflowWrap: 'anywhere' }}>{rendered.secondary}</div>}
              {rendered.value && <div style={{ color: GOLD, fontWeight: 800, lineHeight: 1.2, marginTop: '8px' }}>{rendered.value}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getTimelineDetail = (item) => {
  if (item.tipo?.startsWith('busca_')) {
    const term = compactText(item.termo_original, 72);
    return term ? `Busca: "${term}"` : 'Busca registrada';
  }

  const detail = [item.partitura_titulo, item.parte_instrumento]
    .map(value => compactText(value, 80))
    .filter(Boolean)
    .join(' · ');

  return detail || 'Evento registrado';
};

const Timeline = ({ items, total }) => {
  if (!items?.length) return <EmptyState icon={Activity} message="Nenhuma atividade dessa pessoa no período" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map(item => {
        const info = getAtividadeInfo(item.tipo, true);
        return (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.action}</div>
              <div style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                lineHeight: 1.35,
                marginTop: '3px',
                overflow: 'hidden',
                overflowWrap: 'anywhere',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {getTimelineDetail(item)}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>{formatTimeAgo(item.criado_em, true)}</span>
          </div>
        );
      })}
      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{number(items.length)} de {number(total)} eventos</div>
    </div>
  );
};

const ActivityFeed = ({ items, totalCount, onLoadMore, loadingMore }) => {
  if (!items?.length) return <EmptyState icon={Activity} message="Sem alterações recentes" />;
  const hasMore = Number(totalCount || 0) > items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map(item => {
        const info = getAtividadeInfo(item.tipo, true);
        return (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.25, overflowWrap: 'anywhere' }}>{info.action}: {compactText(item.titulo, 120)}</div>
              <div style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                lineHeight: 1.35,
                marginTop: '3px',
                overflow: 'hidden',
                overflowWrap: 'anywhere',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {[item.usuario_nome, item.detalhes].map(value => compactText(value, 140)).filter(Boolean).join(' · ')}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>{formatTimeAgo(item.criado_em, true)}</span>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{number(items.length)} de {number(totalCount)} alterações</span>
        {hasMore && <Button onClick={onLoadMore} disabled={loadingMore}>{loadingMore ? 'Carregando...' : 'Carregar mais'}</Button>}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
    <Icon size={28} />
    <span style={{ textAlign: 'center' }}>{message}</span>
  </div>
);

const CenteredState = ({ icon: Icon, title, description, action }) => (
  <div style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px' }}>
    <Icon size={34} color={COLORS.red} />
    <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{description}</p>
    {action}
  </div>
);

const LoadingState = ({ isMobile }) => (
  <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ height: '34px', width: '220px', borderRadius: '8px', background: 'var(--border)', marginBottom: '12px' }} />
    <div style={{ height: '16px', width: '420px', maxWidth: '100%', borderRadius: '8px', background: 'var(--border)', marginBottom: '24px' }} />
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
      {[0, 1, 2, 3].map(item => (
        <div key={item} style={{ height: '120px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
      ))}
    </div>
  </div>
);

export default AdminAnalytics;
