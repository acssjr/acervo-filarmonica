// ===== ADMIN MÚSICOS =====
// Gerenciamento de músicos

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { COLORS, COLORS_RGBA } from '@constants/colors';
import { LABELS } from '@constants/organization';
import { UserListSkeleton } from '@components/common/Skeleton';
import UsuarioFormModal from './modals/UsuarioFormModal';
import ResetPinModal from './modals/ResetPinModal';

const AdminMusicos = () => {
  const { showToast } = useUI();
  const [usuarios, setUsuarios] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showResetPin, setShowResetPin] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [users, instr] = await Promise.all([
        API.getUsuarios(),
        API.getInstrumentos()
      ]);
      setUsuarios(users || []);
      setInstrumentos(instr || []);
    } catch {
      showToast('Erro ao carregar dados', 'error');
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega apenas na montagem
  useEffect(() => { loadData(); }, []);

  // Listener para ação de novo
  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'novo') setShowModal(true);
    };
    window.addEventListener('admin-musicos-action', handler);
    return () => window.removeEventListener('admin-musicos-action', handler);
  }, []);

  const filtered = usuarios.filter(u =>
    // Esconde o super admin (@admin) da lista
    u.username !== 'admin' && (
      u.nome?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSave = async (data) => {
    try {
      if (editingUser) {
        await API.updateUsuario(editingUser.id, data);
        showToast('Músico atualizado!');
      } else {
        await API.createUsuario(data);
        showToast('Músico cadastrado!');
      }
      setShowModal(false);
      setEditingUser(null);
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleResetPin = async (userId, newPin) => {
    try {
      await API.updateUsuario(userId, { pin: newPin });
      showToast('PIN resetado!');
      setShowResetPin(null);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleToggleAtivo = async (user) => {
    try {
      await API.updateUsuario(user.id, { ativo: !user.ativo });
      showToast(user.ativo ? 'Músico desativado' : 'Músico reativado');
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="page-transition" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Músicos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Gerencie os membros da filarmônica
        </p>
      </div>

      {/* Botão Novo Músico */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="btn-primary-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            borderRadius: '12px',
            background: `linear-gradient(145deg, ${COLORS.gold.primary} 0%, ${COLORS.gold.darkest} 100%)`,
            color: '#1a1a1a',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: `0 4px 16px ${COLORS_RGBA.gold.bg30}`
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Músico
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div className="search-bar" style={{ maxWidth: '100%' }}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar músico pelo nome ou instrumento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch('')}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
          {filtered.filter(u => u.ativo).length} ativos
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
          {filtered.filter(u => !u.ativo).length} inativos
        </span>
      </div>

      {/* Lista */}
      {loading ? (
        <UserListSkeleton count={6} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((user, index) => (
            <div
              key={user.id}
              className="list-item-animate card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                opacity: user.ativo ? 1 : 0.6,
                animationDelay: `${index * 0.03}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Avatar com circulo dourado */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: `linear-gradient(145deg, ${COLORS.gold.primary} 0%, ${COLORS.gold.darkest} 100%)`,
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 8px ${COLORS_RGBA.gold.bg30}`
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `linear-gradient(145deg, ${COLORS.wine.primary} 0%, ${COLORS.wine.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: COLORS.text.cream,
                    fontWeight: '600',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    {user.nome?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {user.nome}
                    {!!user.admin && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: COLORS.gold.primary,
                        background: COLORS_RGBA.gold.bg15,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${COLORS_RGBA.gold.border30}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {LABELS.adminBadge}
                      </span>
                    )}
                    {!user.ativo && <span style={{ fontSize: '12px', color: COLORS.error.primary }}>{LABELS.inactive}</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    @{user.username} • {user.instrumento_nome || 'Sem instrumento'}
                  </div>
                  {user.ultimo_acesso && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Último acesso: {new Date(user.ultimo_acesso).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => { setEditingUser(user); setShowModal(true); }} title="Editar" className="btn-icon-hover" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                {/* Botão de resetar PIN - oculto para super admin (@admin) */}
                {user.username !== 'admin' && (
                  <button onClick={() => setShowResetPin(user)} title="Redefinir PIN" className="btn-icon-hover" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </button>
                )}
                {/* Botão de ativar/desativar - oculto para super admin (@admin) */}
                {user.username !== 'admin' && (
                  <button onClick={() => handleToggleAtivo(user)} title={user.ativo ? 'Desativar' : 'Ativar'} className={user.ativo ? 'btn-danger-hover' : 'btn-success-hover'} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: user.ativo ? COLORS_RGBA.error.bg10 : COLORS_RGBA.success.bg10,
                    border: `1px solid ${user.ativo ? COLORS_RGBA.error.border30 : COLORS_RGBA.success.border30}`,
                    color: user.ativo ? COLORS.error.primary : COLORS.success.primary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.ativo ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              {LABELS.noMusician}
            </div>
          )}
        </div>
      )}

      {/* Modal de Criar/Editar */}
      {showModal && (
        <UsuarioFormModal
          usuario={editingUser}
          instrumentos={instrumentos}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
        />
      )}

      {/* Modal de Reset PIN */}
      {showResetPin && (
        <ResetPinModal
          usuario={showResetPin}
          onReset={handleResetPin}
          onClose={() => setShowResetPin(null)}
        />
      )}
    </div>
  );
};

export default AdminMusicos;
