// ===== ADMIN ANALYTICS =====
// Dashboard de Analytics & Insights — Filarmônica 25 de Março
// Design consistente com AdminDashboard: cards, grids, tipografia Outfit

import { useState, useEffect, useMemo } from 'react';
import { API } from '@services/api';
import { useMediaQuery } from '@hooks/useMediaQuery';
import LineChart from '@components/charts/LineChart';
import BarChart from '@components/charts/BarChart';
import PieChart from '@components/charts/PieChart';
import {
    Download, Users, Search, TrendingUp, Music,
    RefreshCw, AlertTriangle, Clock, Award, Activity,
    Eye, BarChart3, UserCheck, CalendarDays, Flame
} from 'lucide-react';

// ============ DESIGN TOKENS ============
const GOLD = '#D4AF37';
const GOLD_DARK = '#B8860B';
const COLORS = {
    gold: GOLD,
    blue: '#4A90D9',
    green: '#34C759',
    red: '#E74C3C',
    purple: '#9B59B6',
    orange: '#E67E22',
    cyan: '#00BCD4',
    pink: '#E91E63'
};

// Gradiente signature da filarmônica
const GOLD_GRADIENT = `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`;

// ============ COMPONENT ============
const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const isMobile = useMediaQuery('(max-width: 767px)');

    useEffect(() => { loadAnalytics(); }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await API.getAnalyticsDashboard();
            setData(result);
        } catch (err) {
            console.error('Erro analytics:', err);
            setError(err.message || 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    // Músicos inativos (sem acesso > 30 dias)
    const musicosInativos = useMemo(() => {
        if (!data?.ultimo_acesso) return [];
        const limite = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return data.ultimo_acesso.filter(m => {
            if (!m.ultimo_acesso) return true;
            return new Date(m.ultimo_acesso).getTime() < limite;
        });
    }, [data]);

    if (loading) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '400px', gap: '16px'
            }}>
                <div style={{
                    width: '36px', height: '36px',
                    border: '3px solid var(--border)',
                    borderTop: `3px solid ${GOLD}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Carregando analytics...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '400px', gap: '16px',
                padding: isMobile ? '20px' : '40px'
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: 'rgba(231, 76, 60, 0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <AlertTriangle size={28} color={COLORS.red} />
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0, fontFamily: 'Outfit' }}>
                    Erro ao carregar analytics
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, textAlign: 'center' }}>
                    {error}
                </p>
                <button onClick={loadAnalytics} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', background: GOLD_GRADIENT,
                    border: 'none', borderRadius: '10px', color: '#fff',
                    fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit',
                    marginTop: '8px'
                }}>
                    <RefreshCw size={16} /> Tentar novamente
                </button>
            </div>
        );
    }

    if (!data) return null;

    const tabs = [
        { id: 'overview', icon: BarChart3, label: 'Visão Geral' },
        { id: 'musicians', icon: Users, label: 'Músicos' },
        { id: 'engagement', icon: Activity, label: 'Engajamento' },
        { id: 'search', icon: Search, label: 'Buscas' },
    ];

    return (
        <div className="page-transition" style={{
            padding: isMobile ? '16px' : '32px',
            maxWidth: '1200px', margin: '0 auto',
            fontFamily: 'Outfit, sans-serif'
        }}>

            {/* ====== HEADER ====== */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: isMobile ? '20px' : '28px',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '12px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: isMobile ? '22px' : '28px', fontWeight: '700',
                        margin: '0 0 6px 0',
                        background: GOLD_GRADIENT,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Analytics & Insights
                    </h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
                        Análise completa do acervo e engajamento
                    </p>
                </div>
                <button onClick={loadAnalytics} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: '10px',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    fontFamily: 'Outfit', fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>
                    <RefreshCw size={14} /> Atualizar
                </button>
            </div>

            {/* ====== KPI CARDS ====== */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isMobile ? '10px' : '16px',
                marginBottom: isMobile ? '20px' : '28px'
            }}>
                <KpiCard
                    icon={Users} label="Músicos Ativos"
                    value={data.resumo?.musicos_ativos || 0}
                    color={COLORS.gold} isMobile={isMobile}
                />
                <KpiCard
                    icon={Download} label="Downloads Total"
                    value={data.resumo?.total_downloads || 0}
                    color={COLORS.blue} isMobile={isMobile}
                />
                <KpiCard
                    icon={CalendarDays} label="Ensaios (30d)"
                    value={data.resumo?.ensaios_ultimo_mes || 0}
                    color={COLORS.green} isMobile={isMobile}
                />
                <KpiCard
                    icon={UserCheck} label="Presentes (30d)"
                    value={data.resumo?.presentes_ultimo_mes || 0}
                    color={COLORS.purple} isMobile={isMobile}
                />
            </div>

            {/* ====== TABS ====== */}
            <div style={{
                display: 'flex', gap: '4px',
                marginBottom: isMobile ? '20px' : '28px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px', padding: '4px',
                border: '1px solid var(--border)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: isMobile ? '8px 12px' : '10px 16px',
                            background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                            border: 'none', borderRadius: '8px',
                            color: activeTab === tab.id ? GOLD : 'var(--text-muted)',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            cursor: 'pointer', transition: 'all 0.2s',
                            fontFamily: 'Outfit', fontSize: isMobile ? '12px' : '14px',
                            whiteSpace: 'nowrap', flex: isMobile ? '1' : 'none',
                            justifyContent: 'center',
                            boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                        }}
                    >
                        <tab.icon size={isMobile ? 14 : 16} />
                        {isMobile ? tab.label.split(' ')[0] : tab.label}
                    </button>
                ))}
            </div>

            {/* ====== TAB CONTENT ====== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>

                {/* ---------- OVERVIEW ---------- */}
                {activeTab === 'overview' && (
                    <>
                        <Panel title="Downloads — últimos 30 dias" icon={<TrendingUp size={18} color={GOLD} />}>
                            {data.downloads_timeline?.length > 0 ? (
                                <LineChart data={data.downloads_timeline} xAxisKey="data" dataKey="total" />
                            ) : (
                                <EmptyState icon={TrendingUp} message="Sem downloads registrados neste período" />
                            )}
                        </Panel>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                            gap: isMobile ? '16px' : '24px'
                        }}>
                            <Panel title="Top Partituras" icon={<Award size={18} color={GOLD} />}>
                                <RankingList
                                    items={data.top_partituras}
                                    renderItem={(item, i) => ({
                                        primary: item.titulo,
                                        secondary: item.compositor,
                                        value: item.downloads,
                                        suffix: 'downloads'
                                    })}
                                    accentColor={GOLD}
                                    isMobile={isMobile}
                                />
                            </Panel>

                            <Panel title="Atividade Recente" icon={<Activity size={18} color={COLORS.blue} />}>
                                <ActivityFeed items={data.atividade_recente} isMobile={isMobile} />
                            </Panel>
                        </div>
                    </>
                )}

                {/* ---------- MUSICIANS ---------- */}
                {activeTab === 'musicians' && (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                            gap: isMobile ? '16px' : '24px'
                        }}>
                            <Panel title="Distribuição por Instrumento" icon={<Music size={18} color={COLORS.purple} />}>
                                {data.instrumentos_dist?.length > 0 ? (
                                    <PieChart data={data.instrumentos_dist} nameKey="instrumento" dataKey="total" />
                                ) : (
                                    <EmptyState icon={Music} message="Sem dados de instrumentos" />
                                )}
                            </Panel>

                            <Panel title="Presenças por Naipe (90 dias)" icon={<UserCheck size={18} color={COLORS.green} />}>
                                {data.presencas_familia?.length > 0 ? (
                                    <BarChart
                                        data={data.presencas_familia}
                                        xAxisKey="familia"
                                        dataKey="total_presencas"
                                        colors={[COLORS.blue, COLORS.red, COLORS.green, COLORS.purple, COLORS.orange]}
                                    />
                                ) : (
                                    <EmptyState icon={UserCheck} message="Sem dados de presença" />
                                )}
                            </Panel>
                        </div>

                        <Panel title="Último Acesso dos Músicos" icon={<Clock size={18} color={COLORS.orange} />}>
                            <AccessTable data={data.ultimo_acesso} isMobile={isMobile} />
                        </Panel>
                    </>
                )}

                {/* ---------- ENGAGEMENT ---------- */}
                {activeTab === 'engagement' && (
                    <>
                        <Panel title="Quem Mais Baixou Partituras" icon={<Flame size={18} color={COLORS.orange} />}>
                            <RankingList
                                items={data.musicos_mais_ativos}
                                renderItem={(item) => ({
                                    primary: item.nome,
                                    secondary: item.instrumento,
                                    value: item.total_downloads,
                                    suffix: 'downloads',
                                    avatar: item.foto_url,
                                    initials: item.nome?.charAt(0)
                                })}
                                accentColor={COLORS.orange}
                                showAvatar
                                isMobile={isMobile}
                            />
                        </Panel>

                        <Panel title="Tendência de Presença" icon={<TrendingUp size={18} color={COLORS.green} />}>
                            {data.tendencia_presenca?.length > 0 ? (
                                <LineChart
                                    data={data.tendencia_presenca}
                                    xAxisKey="data"
                                    dataKey="presentes"
                                    color={COLORS.green} unit="músicos"
                                />
                            ) : (
                                <EmptyState icon={TrendingUp} message="Sem dados de presença" />
                            )}
                        </Panel>

                        <Panel title="Músicos Inativos (+30 dias)" icon={<AlertTriangle size={18} color={COLORS.red} />}>
                            {musicosInativos.length > 0 ? (
                                <AccessTable data={musicosInativos} isMobile={isMobile} highlight="danger" />
                            ) : (
                                <EmptyState icon={UserCheck} message="Todos os músicos acessaram recentemente 🎉" positive />
                            )}
                        </Panel>
                    </>
                )}

                {/* ---------- SEARCH ---------- */}
                {activeTab === 'search' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: isMobile ? '16px' : '24px'
                    }}>
                        <Panel title="Buscas sem Resultado" icon={<AlertTriangle size={18} color={COLORS.red} />}>
                            <p style={{
                                fontSize: '13px', color: 'var(--text-muted)',
                                margin: '0 0 16px 0', lineHeight: '1.5'
                            }}>
                                Termos que retornaram 0 resultados. Priorize digitalizar estas obras.
                            </p>
                            <RankingList
                                items={data.failed_search_terms}
                                renderItem={(item) => ({
                                    primary: item.termo,
                                    value: item.tentativas,
                                    suffix: 'tentativas'
                                })}
                                accentColor={COLORS.red}
                                isMobile={isMobile}
                            />
                        </Panel>

                        <Panel title="Termos Mais Buscados" icon={<Eye size={18} color={COLORS.blue} />}>
                            <RankingList
                                items={data.top_search_terms}
                                renderItem={(item) => ({
                                    primary: item.termo,
                                    value: item.total,
                                    suffix: 'buscas'
                                })}
                                accentColor={COLORS.blue}
                                isMobile={isMobile}
                            />
                        </Panel>
                    </div>
                )}

            </div>
        </div>
    );
};


// ============================================================
//  SUB-COMPONENTS — Design System Interno
// ============================================================

// KPI Card (estilo consistente com AdminDashboard.StatCard)
const KpiCard = ({ icon: Icon, label, value, color, isMobile }) => (
    <div className="card-hover" style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: isMobile ? '14px 12px' : '20px',
        textAlign: 'center',
        border: '1px solid var(--border)',
    }}>
        <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '8px' : '12px'
        }}>
            <div style={{
                width: isMobile ? '36px' : '44px',
                height: isMobile ? '36px' : '44px',
                borderRadius: isMobile ? '10px' : '12px',
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={isMobile ? 18 : 22} color={color} />
            </div>
        </div>
        <div style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '700', color,
            marginBottom: '2px', fontFamily: 'Outfit'
        }}>
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
        <div style={{
            fontSize: isMobile ? '11px' : '12px',
            color: 'var(--text-muted)', fontFamily: 'Outfit'
        }}>
            {label}
        </div>
    </div>
);

// Panel / Card wrapper
const Panel = ({ title, icon, children }) => (
    <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
    }}>
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '20px'
        }}>
            {icon}
            <h3 style={{
                margin: 0, fontSize: '16px', fontWeight: '600',
                color: 'var(--text-primary)', fontFamily: 'Outfit'
            }}>
                {title}
            </h3>
        </div>
        {children}
    </div>
);

// Empty State
const EmptyState = ({ icon: Icon, message, positive }) => (
    <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', gap: '12px'
    }}>
        <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: positive ? 'rgba(52, 199, 89, 0.1)' : 'var(--bg-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={24} color={positive ? COLORS.green : 'var(--text-muted)'} style={{ opacity: positive ? 1 : 0.4 }} />
        </div>
        <span style={{
            color: positive ? COLORS.green : 'var(--text-muted)',
            fontSize: '14px', fontFamily: 'Outfit', textAlign: 'center'
        }}>
            {message}
        </span>
    </div>
);

// Ranking List — substitui o antigo TopList (sem border-left genérico)
const RankingList = ({ items, renderItem, accentColor, showAvatar, isMobile }) => {
    if (!items || items.length === 0) {
        return <EmptyState icon={BarChart3} message="Nenhum dado disponível" />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((item, i) => {
                const { primary, secondary, value, suffix, avatar, initials } = renderItem(item, i);
                const isTop3 = i < 3;
                const badgeColors = [GOLD, '#C0C0C0', '#CD7F32']; // ouro, prata, bronze

                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: isMobile ? '10px 12px' : '12px 16px',
                        background: isTop3 ? `${accentColor}08` : 'var(--bg-primary)',
                        borderRadius: '12px',
                        transition: 'background 0.2s',
                    }}>
                        {/* Badge de posição */}
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: isTop3 ? `${badgeColors[i]}18` : 'var(--bg-secondary)',
                            color: isTop3 ? badgeColors[i] : 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: '700', fontFamily: 'Outfit',
                            flexShrink: 0,
                            border: isTop3 ? `1px solid ${badgeColors[i]}30` : '1px solid var(--border)'
                        }}>
                            {i + 1}
                        </div>

                        {/* Avatar (se habilitado) */}
                        {showAvatar && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: avatar ? 'transparent' : `${accentColor}20`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', flexShrink: 0,
                                border: `1px solid ${accentColor}30`
                            }}>
                                {avatar ? (
                                    <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{
                                        fontSize: '13px', fontWeight: '700',
                                        color: accentColor, fontFamily: 'Outfit'
                                    }}>
                                        {initials || '?'}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: '500', color: 'var(--text-primary)',
                                fontSize: isMobile ? '13px' : '14px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                fontFamily: 'Outfit'
                            }}>
                                {primary}
                            </div>
                            {secondary && (
                                <div style={{
                                    fontSize: '12px', color: 'var(--text-muted)',
                                    fontFamily: 'Outfit'
                                }}>
                                    {secondary}
                                </div>
                            )}
                        </div>

                        {/* Value */}
                        <div style={{
                            fontWeight: '600', fontSize: '13px',
                            color: isTop3 ? accentColor : 'var(--text-muted)',
                            whiteSpace: 'nowrap', fontFamily: 'Outfit'
                        }}>
                            {value} <span style={{ fontWeight: '400', fontSize: '11px' }}>{suffix}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Access Table - Último acesso
const AccessTable = ({ data, _isMobile, highlight }) => {
    // ... (same as before until formatDate)

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Nunca acessou';
        // Force UTC parsing for SQLite timestamps
        const safeDate = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
        const d = new Date(safeDate);
        const now = new Date();
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

        if (diff < 0) return 'Hoje'; // Safety for small clock skew
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Ontem';
        if (diff < 7) return `${diff} dias atrás`;
        if (diff < 30) return `${Math.floor(diff / 7)} sem. atrás`;
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const getStatusColor = (dateStr) => {
        if (!dateStr) return COLORS.red;
        const safeDate = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
        const diff = Math.floor((Date.now() - new Date(safeDate).getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 7) return COLORS.green;
        if (diff < 30) return COLORS.orange;
        return COLORS.red;
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '6px',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            {data.map((m, i) => {
                const statusColor = highlight === 'danger' ? COLORS.red : getStatusColor(m.ultimo_acesso);
                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '10px',
                        background: 'var(--bg-primary)',
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: `${statusColor}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, overflow: 'hidden'
                        }}>
                            {m.foto_url ? (
                                <img src={m.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{
                                    fontSize: '13px', fontWeight: '700',
                                    color: statusColor, fontFamily: 'Outfit'
                                }}>
                                    {m.nome?.charAt(0) || '?'}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: '500', fontSize: '13px',
                                color: 'var(--text-primary)', fontFamily: 'Outfit',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {m.nome}
                            </div>
                            <div style={{
                                fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Outfit'
                            }}>
                                {m.instrumento || 'Sem instrumento'}
                            </div>
                        </div>

                        {/* Status dot + date */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '7px', height: '7px', borderRadius: '50%',
                                background: statusColor, flexShrink: 0
                            }} />
                            <span style={{
                                fontSize: '11px', color: statusColor,
                                fontWeight: '500', fontFamily: 'Outfit', whiteSpace: 'nowrap'
                            }}>
                                {formatDate(m.ultimo_acesso)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Activity Feed — atividade recente
const ActivityFeed = ({ items, _isMobile }) => {
    if (!items || items.length === 0) {
        return <EmptyState icon={Activity} message="Sem atividades recentes" />;
    }

    const getIcon = (tipo) => {
        const map = {
            'upload': Download,
            'download': Download,
            'login': Users,
            'cadastro': UserCheck,
            'admin': Award,
        };
        return map[tipo] || Activity;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        // Force UTC parsing
        const safeDate = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
        const d = new Date(safeDate);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMs / 3600000);
        const diffD = Math.floor(diffMs / 86400000);

        if (diffMin < 0) return 'agora'; // Clock skew
        if (diffMin < 1) return 'agora';
        if (diffMin < 60) return `${diffMin} min`;
        if (diffH < 24) return `${diffH} h`;
        if (diffD < 7) return `${diffD} d`;
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            maxHeight: '360px', overflowY: 'auto'
        }}>
            {items.slice(0, 10).map((item, i) => {
                const Icon = getIcon(item.tipo);
                // Lógica de exibição: Nome do usuário > Título da Ação > Detalhes
                const primaryText = item.usuario_nome || item.titulo;
                const secondaryText = item.usuario_nome ? item.titulo : item.detalhes;
                const tertiaryText = item.usuario_nome && item.detalhes ? item.detalhes : null;

                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', borderRadius: '10px',
                        background: i % 2 === 0 ? 'transparent' : 'var(--bg-primary)',
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: `${COLORS.blue}12`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: '1px'
                        }}>
                            <Icon size={14} color={COLORS.blue} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '13px', color: 'var(--text-primary)',
                                fontFamily: 'Outfit', fontWeight: '500',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {primaryText}
                            </div>
                            {secondaryText && (
                                <div style={{
                                    fontSize: '12px', color: 'var(--text-muted)',
                                    fontFamily: 'Outfit',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {secondaryText}
                                </div>
                            )}
                            {tertiaryText && (
                                <div style={{
                                    fontSize: '11px', color: 'var(--text-muted)',
                                    fontFamily: 'Outfit', opacity: 0.8,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {tertiaryText}
                                </div>
                            )}
                        </div>
                        <span style={{
                            fontSize: '11px', color: 'var(--text-muted)',
                            fontFamily: 'Outfit', whiteSpace: 'nowrap', flexShrink: 0
                        }}>
                            {formatDate(item.criado_em)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminAnalytics;
