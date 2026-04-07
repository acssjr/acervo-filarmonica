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

const tabs = [
  { id: 'acervo', icon: Music, label: 'Uso do acervo' },
  { id: 'pessoas', icon: Users, label: 'Pessoas' },
  { id: 'ensaios', icon: UserCheck, label: 'Ensaios' },
  { id: 'alteracoes', icon: Activity, label: 'Alterações' },
];

const number = (value) => Number(value || 0).toLocaleString('pt-BR');
const percent = (value) => `${Number(value || 0).toLocaleString('pt-BR')}%`;

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
      const result = await API.getAnalyticsDashboard(buildQuery());
      if (analyticsRequestIdRef.current !== requestId) return;
      setData(result);
    } catch (err) {
      if (analyticsRequestIdRef.current !== requestId) return;
      console.error('Erro analytics:', err);
      setError(err.message || 'Erro ao carregar analytics');
    } finally {
      if (analyticsRequestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [buildQuery]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const loadMoreAtividades = async () => {
    if (!data || loadingMore) return;
    const current = data.alteracoes?.atividades || data.atividade_recente || [];
    setLoadingMore(true);
    try {
      const result = await API.getAnalyticsDashboard(buildQuery({
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
    <div className="page-transition" style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === tab.id ? GOLD : 'var(--text-muted)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={16} /> {tab.label}
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
              <SimpleList items={usoAcervo.insights} renderItem={(item) => ({ primary: item.titulo, secondary: item.descricao })} />
            ) : (
              <EmptyState icon={AlertTriangle} message="Sem alertas de uso no período" />
            )}
          </Panel>

          <Panel title="Partituras mais usadas" icon={<Music size={18} color={COLORS.blue} />}>
            <SimpleList
              items={usoAcervo.top_partituras || []}
              renderItem={(item) => ({
                primary: item.titulo,
                secondary: `${item.compositor || 'Sem compositor'} · ${number(item.aberturas)} aberturas · ${number(item.visualizacoes)} visualizações`,
                value: `${number(item.downloads)} downloads`
              })}
            />
          </Panel>

          <Panel title="Partes mais usadas" icon={<Download size={18} color={COLORS.green} />}>
            <SimpleList
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
            <SelectField value={selectedUserId} onChange={setSelectedUserId}>
              <option value="">Selecione uma pessoa</option>
              {(pessoas.usuarios || []).map(user => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </SelectField>
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
            <SimpleList
              items={ensaios.streaks || []}
              renderItem={(item) => ({
                primary: item.nome,
                secondary: item.instrumento,
                value: `${number(item.streak)} ensaio${item.streak === 1 ? '' : 's'}`
              })}
            />
          </Panel>

          <Panel title="Assiduidade por músico" icon={<UserCheck size={18} color={COLORS.green} />}>
            <SimpleList
              items={ensaios.assiduidade_musicos || []}
              renderItem={(item) => ({
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
            <SelectField value={selectedAdminId} onChange={setSelectedAdminId}>
              <option value="">Todos os admins</option>
              {(alteracoes.usuarios || []).map(user => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </SelectField>
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

const DateField = ({ label, value, onChange }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>
    {label}
    <input type="date" value={value} onChange={(event) => onChange(event.target.value)} style={controlStyle} />
  </label>
);

const SelectField = ({ value, onChange, children }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} style={{ ...controlStyle, width: '100%' }}>
    {children}
  </select>
);

const SectionGrid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
    {children}
  </div>
);

const KpiCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ minWidth: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px' }}>
    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
      <Icon size={20} />
    </div>
    <div style={{ color, fontSize: '28px', fontWeight: 800 }}>{value}</div>
    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{label}</div>
  </div>
);

const Panel = ({ title, icon, children, wide }) => (
  <section style={{ gridColumn: wide ? '1 / -1' : undefined, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      {icon}
      <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', margin: 0 }}>{title}</h2>
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

const SimpleList = ({ items, renderItem }) => {
  if (!items?.length) return <EmptyState icon={BarChart3} message="Nenhum dado disponível" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, index) => {
        const rendered = renderItem(item);
        return (
          <div key={item.id ?? index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: index < 3 ? `${GOLD}18` : 'var(--bg-secondary)', color: index < 3 ? GOLD : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {index + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rendered.primary}</div>
              {rendered.secondary && <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>{rendered.secondary}</div>}
            </div>
            {rendered.value && <div style={{ color: GOLD, fontWeight: 700, whiteSpace: 'nowrap' }}>{rendered.value}</div>}
          </div>
        );
      })}
    </div>
  );
};

const Timeline = ({ items, total }) => {
  if (!items?.length) return <EmptyState icon={Activity} message="Nenhuma atividade dessa pessoa no período" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map(item => {
        const info = getAtividadeInfo(item.tipo, true);
        return (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)' }}>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{info.action}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '3px' }}>
                {[item.partitura_titulo, item.parte_instrumento, item.termo_original].filter(Boolean).join(' · ') || item.origem || 'Evento registrado'}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{formatTimeAgo(item.criado_em, true)}</span>
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
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)' }}>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{info.action}: {item.titulo}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '3px' }}>
                {[item.usuario_nome, item.detalhes].filter(Boolean).join(' · ')}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{formatTimeAgo(item.criado_em, true)}</span>
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
