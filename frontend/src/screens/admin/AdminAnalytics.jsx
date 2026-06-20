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
      <style>{`
        @keyframes pulse-flame {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(230, 126, 34, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0); }
        }

        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .kpi-card-premium {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }

        .kpi-card-premium:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 55, 0.3) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3) !important;
        }

        .kpi-card-premium::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
          transform: skewX(-25deg);
          transition: 0.75s;
        }

        .kpi-card-premium:hover::before {
          left: 125%;
        }

        .flame-pulse {
          position: relative;
        }
        
        .flame-pulse .kpi-icon-container {
          animation: pulse-flame 2s infinite ease-in-out;
        }

        .panel-premium {
          border-radius: 12px !important;
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18) !important;
          transition: all 0.3s ease;
        }

        .panel-premium:hover {
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.25) !important;
        }

        .list-item-premium {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .list-item-premium:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .podium-1 {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(212, 175, 55, 0.05)) !important;
          border: 1px solid rgba(212, 175, 55, 0.4) !important;
          color: #D4AF37 !important;
        }

        .podium-2 {
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.22), rgba(192, 192, 192, 0.05)) !important;
          border: 1px solid rgba(192, 192, 192, 0.4) !important;
          color: #C0C0C0 !important;
        }

        .podium-3 {
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.22), rgba(205, 127, 50, 0.05)) !important;
          border: 1px solid rgba(205, 127, 50, 0.4) !important;
          color: #CD7F32 !important;
        }

        .dropdown-item-premium {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropdown-item-premium:hover {
          background: rgba(212, 175, 55, 0.12) !important;
          color: #D4AF37 !important;
          padding-left: 14px !important;
        }

        .naipe-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .naipe-card:hover {
          transform: translateY(-3px);
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }

        .timeline-line {
          position: absolute;
          top: 16px;
          bottom: 0;
          left: 26px;
          width: 2px;
          background: var(--border);
          opacity: 0.5;
        }

        .timeline-item {
          position: relative;
          padding-left: 52px;
          margin-bottom: 12px;
          animation: slide-in-up 0.4s ease forwards;
        }

        .timeline-icon-container {
          position: absolute;
          left: 14px;
          top: 10px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
          background: var(--bg-secondary);
          border: 2px solid var(--border);
          z-index: 2;
        }

        .admin-tag {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 6px;
          display: inline-block;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255,255,255,0.04);
        }
      `}</style>
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

          <Panel title="Músicos mais ativos (Acervo)" icon={<Users size={18} color={GOLD} />} wide>
            <CompactList
              items={usoAcervo.ranking_musicos || []}
              initialLimit={5}
              renderItem={(item) => ({
                primary: item.nome,
                secondary: `${item.instrumento || 'Sem instrumento'} · ${number(item.aberturas)} aberturas · ${number(item.visualizacoes)} visualizações · ${number(item.downloads)} downloads · ${number(item.buscas)} buscas`,
                value: `${number(item.total_acoes)} ações`
              })}
            />
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
                secondary: `${item.compositor || 'Sem compositor'} · ${number(item.aberturas)} aberturas · ${number(item.visualizacoes)} visualizações · ${number(item.downloads)} downloads`,
                value: `${number(Number(item.aberturas || 0) + Number(item.visualizacoes || 0) + Number(item.downloads || 0))} acessos`
              })}
            />
          </Panel>

          <Panel title="Partes mais usadas" icon={<Download size={18} color={COLORS.green} />}>
            <CompactList
              items={usoAcervo.top_partes || []}
              renderItem={(item) => ({
                primary: item.instrumento,
                secondary: `${item.partitura_titulo} · ${number(item.visualizacoes)} visualizações · ${number(item.downloads)} downloads`,
                value: `${number(Number(item.visualizacoes || 0) + Number(item.downloads || 0))} acessos`
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
              options={(pessoas.usuarios || []).map(user => ({ value: String(user.id), label: user.nome, sub: user.instrumento }))}
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
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', marginTop: '4px' }}>
              {(ensaios.presenca_naipes || []).map(item => {
                let barColor = '#EF4444';
                let statusText = 'Baixa';
                if (item.taxa >= 75) {
                  barColor = '#10B981';
                  statusText = 'Excelente';
                } else if (item.taxa >= 50) {
                  barColor = '#F59E0B';
                  statusText = 'Regular';
                }
                
                return (
                  <div key={item.familia} className="naipe-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: 800 }}>{item.familia}</h3>
                        <span style={{ fontSize: '10px', color: barColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Presença {statusText}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>
                        {percent(item.taxa)}
                      </div>
                    </div>
                    
                    <div style={{ height: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ width: `${Math.max(4, Number(item.taxa || 0))}%`, height: '100%', background: barColor, borderRadius: '999px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    </div>
                    
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.45 }}>
                      <strong>{number(item.registradas)}</strong> de <strong>{number(item.esperadas)}</strong> presenças registradas <br />
                      <span style={{ fontSize: '11px', opacity: 0.85 }}>
                        ({number(item.musicos)} músicos ativos em {number(item.ensaios)} ensaios)
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
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

  const getInitials = (name) => {
    if (!name || name === placeholder) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          ...controlStyle,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          borderColor: open ? GOLD : 'var(--border)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {selectedOption && selectedOption.value !== '' && (
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${GOLD}44, ${GOLD}22)`,
              border: `1px solid ${GOLD}66`,
              color: GOLD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 800,
              flexShrink: 0
            }}>
              {getInitials(selectedOption.label)}
            </div>
          )}
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selectedOption ? 700 : 500 }}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          color={GOLD} 
          style={{ 
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: open ? 'rotate(180deg)' : 'rotate(0)'
          }} 
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 40,
          maxHeight: '260px',
          overflowY: 'auto',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '6px',
          boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          animation: 'slide-in-up 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {allOptions.map(option => {
            const selected = String(option.value) === String(value);
            const initials = getInitials(option.label);
            return (
              <button
                key={option.value || '__empty'}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="dropdown-item-premium"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  background: selected ? `${GOLD}1f` : 'transparent',
                  color: selected ? GOLD : 'var(--text-primary)',
                  padding: '8px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: selected ? 800 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '2px',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  {initials ? (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: selected ? `linear-gradient(135deg, ${GOLD}55, ${GOLD}33)` : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${selected ? GOLD : 'var(--border)'}`,
                      color: selected ? GOLD : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {initials}
                    </div>
                  ) : (
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  )}
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {option.label}
                  </span>
                </div>
                {option.sub && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    background: selected ? `${GOLD}33` : 'var(--bg-primary)',
                    color: selected ? GOLD : 'var(--text-muted)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    border: '1px solid var(--border)'
                  }}>
                    {option.sub}
                  </span>
                )}
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

const KpiCard = ({ icon: Icon, label, value, color }) => {
  const isFlame = Icon === Flame;
  return (
    <div className={`kpi-card-premium ${isFlame ? 'flame-pulse' : ''}`} style={{ minWidth: 0, borderRadius: '12px', padding: '16px' }}>
      <div style={{ 
        width: '38px', 
        height: '38px', 
        borderRadius: '50%', 
        background: `${color}18`, 
        color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '12px',
        border: `1px solid ${color}33`,
        boxShadow: `0 0 10px ${color}10`,
        transition: 'all 0.3s ease'
      }} className="kpi-icon-container">
        <Icon size={20} />
      </div>
      <div style={{ color: 'var(--text-primary)', fontSize: '28px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', fontWeight: 600, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
    </div>
  );
};

const Panel = ({ title, icon, children, wide }) => (
  <section className="panel-premium" style={{ gridColumn: wide ? '1 / -1' : undefined, borderRadius: '12px', padding: '18px', minWidth: 0, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '10px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
      <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>{title}</h2>
    </div>
    {children}
  </section>
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
        const isPodium = rank <= 3;
        
        let podiumClass = '';
        if (isPodium) {
          if (rank === 1) podiumClass = 'podium-1';
          else if (rank === 2) podiumClass = 'podium-2';
          else if (rank === 3) podiumClass = 'podium-3';
        }

        return (
          <div 
            key={item.id ?? index} 
            className="list-item-premium"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '32px minmax(0, 1fr) auto', 
              gap: '12px', 
              alignItems: 'center', 
              padding: '10px 12px', 
              borderRadius: '10px', 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid rgba(255, 255, 255, 0.03)',
              minWidth: 0 
            }}
          >
            <div 
              className={podiumClass}
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 900,
                fontSize: '12px',
                border: '1px solid var(--border)',
                boxShadow: isPodium ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {rank}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rendered.primary}</div>
              {rendered.secondary && <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.3, marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rendered.secondary}</div>}
            </div>
            {rendered.value && (
              <div style={{ 
                color: isPodium ? 'inherit' : GOLD, 
                fontWeight: 900, 
                lineHeight: 1.2, 
                whiteSpace: 'nowrap', 
                fontSize: '13px',
                background: isPodium ? 'transparent' : 'rgba(212, 175, 55, 0.08)',
                padding: isPodium ? '0' : '4px 8px',
                borderRadius: '6px',
                border: isPodium ? 'none' : `1px solid ${GOLD}22`
              }}>
                {rendered.value}
              </div>
            )}
          </div>
        );
      })}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          style={{ 
            ...controlStyle, 
            width: '100%', 
            justifyContent: 'center', 
            color: GOLD, 
            fontWeight: 800, 
            cursor: 'pointer', 
            padding: '9px 12px',
            background: 'rgba(212, 175, 55, 0.04)',
            border: `1px solid rgba(212, 175, 55, 0.15)`,
            transition: 'all 0.25s ease',
            borderRadius: '10px',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.04)'; }}
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
    <div style={{ position: 'relative', padding: '10px 0' }}>
      <div className="timeline-line" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item, idx) => {
          const info = getAtividadeInfo(item.tipo, true);
          let iconColor = GOLD;
          if (item.tipo?.startsWith('pdf_visualizado')) iconColor = COLORS.blue;
          else if (item.tipo?.includes('download')) iconColor = COLORS.green;
          else if (item.tipo?.includes('busca')) iconColor = COLORS.purple;

          return (
            <div key={item.id} className="timeline-item" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="timeline-icon-container" style={{ borderColor: iconColor }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: iconColor }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'minmax(0, 1fr) auto', 
                gap: '12px', 
                padding: '12px 14px', 
                borderRadius: '10px', 
                background: 'rgba(255, 255, 255, 0.015)', 
                border: '1px solid rgba(255, 255, 255, 0.03)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden' 
              }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {info.action}
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    lineHeight: 1.4,
                    marginTop: '4px',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {getTimelineDetail(item)}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', marginTop: '2px' }}>
                  {formatTimeAgo(item.criado_em, true)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, paddingLeft: '52px', marginTop: '12px' }}>
        {number(items.length)} de {number(total)} eventos
      </div>
    </div>
  );
};

const ActivityFeed = ({ items, totalCount, onLoadMore, loadingMore }) => {
  if (!items?.length) return <EmptyState icon={Activity} message="Sem alterações recentes" />;
  const hasMore = Number(totalCount || 0) > items.length;

  const getAdminTagInfo = (tipo) => {
    const lowerType = String(tipo || '').toLowerCase();
    if (lowerType.includes('partitura')) {
      return { label: 'Partitura', bg: 'rgba(74, 144, 217, 0.12)', color: COLORS.blue };
    }
    if (lowerType.includes('repertorio')) {
      return { label: 'Repertório', bg: 'rgba(212, 175, 55, 0.12)', color: GOLD };
    }
    if (lowerType.includes('parte')) {
      return { label: 'Parte', bg: 'rgba(52, 199, 89, 0.12)', color: COLORS.green };
    }
    if (lowerType.includes('aviso')) {
      return { label: 'Aviso', bg: 'rgba(230, 126, 34, 0.12)', color: COLORS.orange };
    }
    return { label: 'Sistema', bg: 'rgba(155, 89, 182, 0.12)', color: COLORS.purple };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => {
        const info = getAtividadeInfo(item.tipo, true);
        const tagInfo = getAdminTagInfo(item.tipo);
        return (
          <div 
            key={item.id} 
            className="list-item-premium"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(0, 1fr) auto', 
              gap: '16px', 
              padding: '14px', 
              borderRadius: '10px', 
              background: 'rgba(255, 255, 255, 0.015)', 
              border: '1px solid rgba(255, 255, 255, 0.03)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden' 
            }}
          >
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', lineHeight: 1.3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span className="admin-tag" style={{ background: tagInfo.bg, color: tagInfo.color }}>
                  {tagInfo.label}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {info.action}: {compactText(item.titulo, 100)}
                </span>
              </div>
              <div style={{
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                lineHeight: 1.4,
                marginTop: '6px',
                overflow: 'hidden',
                overflowWrap: 'anywhere',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {[item.usuario_nome, item.detalhes].map(value => compactText(value, 140)).filter(Boolean).join(' · ')}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', marginTop: '2px' }}>
              {formatTimeAgo(item.criado_em, true)}
            </span>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>{number(items.length)} de {number(totalCount)} alterações</span>
        {hasMore && (
          <button 
            onClick={onLoadMore} 
            disabled={loadingMore}
            style={{
              ...controlStyle,
              cursor: loadingMore ? 'wait' : 'pointer',
              color: GOLD,
              fontWeight: 800,
              fontSize: '12px',
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.04)',
              border: `1px solid rgba(212, 175, 55, 0.15)`,
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { if (!loadingMore) e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)'; }}
            onMouseLeave={(e) => { if (!loadingMore) e.currentTarget.style.background = 'rgba(212, 175, 55, 0.04)'; }}
          >
            {loadingMore ? 'Carregando...' : 'Carregar mais'}
          </button>
        )}
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
