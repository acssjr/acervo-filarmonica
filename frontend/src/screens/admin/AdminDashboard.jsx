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
import QuickActionButton from './components/QuickActionButton';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { emoji: '🌅', prefix: 'Bom dia,', msg: 'Hora de organizar essa papelada.' };
  if (h >= 12 && h < 18) return { emoji: '🌤️', prefix: 'Boa tarde,', msg: 'Vamos colocar as coisas em ordem.' };
  return { emoji: '🌙', prefix: 'Boa noite,', msg: 'Ainda tem coisa pra resolver?' };
};

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
    <div className="page-transition" style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto', }}>
      {/* Header com saudação */}
      <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
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

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px',
        marginBottom: isMobile ? '20px' : '32px'
      }}>
        <StatCard icon="users" label="Músicos Ativos" value={stats.musicos_ativos || 0} loading={loading} index={0} onClick={() => window.adminNav?.('musicos')} />
        <StatCard icon="music" label="Partituras" value={stats.total_partituras || 0} loading={loading} index={1} onClick={() => window.adminNav?.('partituras')} />
        <StatCard icon="download" label="Downloads" value={stats.total_downloads || 0} loading={loading} index={2} onClick={() => window.adminNav?.('analytics')} />
        <StatCard icon="folder" label="Categorias" value={stats.total_categorias || 0} loading={loading} index={3} onClick={() => window.adminNav?.('categorias')} />
      </div>

      {/* Acoes Rapidas */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Ações Rápidas
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <QuickActionButton icon="users" label="Novo Músico" onClick={() => window.adminNav?.('musicos', 'novo')} />
          <QuickActionButton icon="upload" label="Nova Pasta" onClick={() => window.adminNav?.('partituras', 'pasta')} />
          <QuickActionButton icon="folder" label="Nova Categoria" onClick={() => window.adminNav?.('categorias', 'novo')} />
        </div>
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
