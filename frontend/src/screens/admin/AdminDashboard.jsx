// ===== ADMIN DASHBOARD =====
// Dashboard principal do painel administrativo

import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useAuth } from '@contexts/AuthContext';
import { API } from '@services/api';
import { BREAKPOINTS } from '@constants/config';
import { formatTimeAgo, getAtividadeInfo } from '@utils/formatters';
import { useMediaQuery } from '@hooks/useMediaQuery';
import StatCard from './components/StatCard';
import './admin-dashboard.css';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { emoji: '🌅', prefix: 'Bom dia,', msg: 'Hora de organizar essa papelada.' };
  if (h >= 12 && h < 18) return { emoji: '🌤️', prefix: 'Boa tarde,', msg: 'Vamos colocar as coisas em ordem.' };
  return { emoji: '🌙', prefix: 'Boa noite,', msg: 'Ainda tem coisa pra resolver?' };
};

const actionIcons = {
  partituras: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  repertorio: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  presenca: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
};

const ActionCard = ({ type, title, description, primary, onClick }) => (
  <button type="button" className={`admin-action-card${primary ? ' is-primary' : ''}`} onClick={onClick}>
    <div className="admin-action-card-top">
      <span className="admin-action-icon" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{actionIcons[type]}</svg></span>
      <svg className="admin-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </div>
    <div><strong>{title}</strong><p>{description}</p></div>
  </button>
);

const AdminDashboard = () => {
  const { stats, loading } = useAdmin();
  const { user } = useAuth();
  const [atividades, setAtividades] = useState([]);
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
  const greeting = getGreeting();
  const firstName = (user?.name || 'Admin').split(' ')[0];

  // Carrega atividades
  useEffect(() => {
    const loadAtividades = async () => {
      try {
        const data = await API.getAtividades();
        setAtividades(data || []);
      } catch {
        // Silencioso - atividades podem não estar disponíveis
      }
    };
    loadAtividades();
  }, []);

  return (
    <div className="page-transition admin-dashboard">
      {/* Header com saudação */}
      <div className="admin-dashboard-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '800',
              letterSpacing: '-0.4px',
              color: 'var(--text-primary)',
              margin: '0 0 4px',
              lineHeight: 1.2,
            }}>
              {greeting.prefix}{' '}
              <span className="liquid-metal-name">{firstName}.</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {greeting.msg}
              </p>
              <span style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                color: '#fff',
                padding: '3px 9px',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                flexShrink: 0,
              }}>
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="admin-action-section" aria-labelledby="admin-action-title">
        <p id="admin-action-title" className="admin-section-eyebrow">O que você precisa fazer agora?</p>
        <div className="admin-action-grid">
          <ActionCard type="partituras" title="Partituras" description="Adicionar, substituir ou organizar partes" primary onClick={() => window.adminNav?.('partituras')} />
          <ActionCard type="repertorio" title="Repertório" description="Montar e atualizar repertórios" onClick={() => window.adminNav?.('repertorio')} />
          <ActionCard type="presenca" title="Presença" description="Registrar ensaios e apresentações" onClick={() => window.adminNav?.('presenca')} />
        </div>
      </section>

      <div className="admin-summary-row">
        <div className="admin-stats-grid" aria-label="Resumo do acervo">
          <StatCard icon="users" label="Músicos Ativos" value={stats.musicos_ativos || 0} loading={loading} onClick={() => window.adminNav?.('musicos')} />
          <StatCard icon="music" label="Partituras" value={stats.total_partituras || 0} loading={loading} onClick={() => window.adminNav?.('partituras')} />
          <StatCard icon="download" label="Downloads" value={stats.total_downloads || 0} loading={loading} />
          <StatCard icon="folder" label="Categorias" value={stats.total_categorias || 0} loading={loading} onClick={() => window.adminNav?.('categorias')} />
        </div>
        <button type="button" className="admin-analytics-link" onClick={() => window.adminNav?.('analytics')}>
          Ver analytics <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Top Partituras */}
      {stats.top_partituras && stats.top_partituras.length > 0 && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Partituras Mais Baixadas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.top_partituras.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: i === 0 ? '#f1c40f' : i === 1 ? '#95a5a6' : i === 2 ? '#cd7f32' : 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: i < 3 ? '#fff' : 'var(--text-secondary)',
                  }}>{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)', }}>{p.titulo}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', }}>{p.compositor}</div>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--accent)', }}>{p.downloads} downloads</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atividades Recentes */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border)',
        marginTop: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Atividade Recente
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {atividades.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Nenhuma atividade registrada
            </div>
          ) : (
            atividades.slice(0, 10).map((a, i) => {
              const info = getAtividadeInfo(a.tipo, true);
              // Para login, não mostrar detalhes (contém IP)
              const detalhes = a.tipo === 'login' ? null : a.detalhes;
              // Título: para login, mostrar nome do usuário; para outros, o título da atividade
              const titulo = a.tipo === 'login' ? (a.usuario_nome || 'Usuário') : a.titulo;
              return (
                <div key={a.id || i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: info.color,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {info.action}: {titulo}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', }}>
                      {a.usuario_nome || 'Sistema'} {detalhes && `• ${detalhes}`}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {formatTimeAgo(a.criado_em, true)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
