// ===== ADMIN CONFIG =====
// Configuracoes do admin

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import { Storage } from '@services/storage';
import { ChangePinModal } from '@components/modals';

const AdminConfig = () => {
  const { user, setUser } = useAuth();
  const { showToast, themeMode, setThemeMode } = useUI();
  const [showChangePin, setShowChangePin] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleLogout = () => {
    API.logout();
    Storage.remove('user');
    setUser(null);
    window.location.reload();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('A foto deve ter no maximo 2MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await API.uploadFotoPerfil(file);
      if (result.url) {
        setUser(prev => ({ ...prev, foto_perfil: result.url }));
        showToast('Foto atualizada!');
      }
    } catch (err) {
      showToast('Erro ao atualizar foto', 'error');
    }
    setUploadingPhoto(false);
  };

  const handleRemovePhoto = async () => {
    try {
      await API.updatePerfil({ foto_perfil: null });
      setUser(prev => ({ ...prev, foto_perfil: null }));
      showToast('Foto removida!');
    } catch (err) {
      showToast('Erro ao remover foto', 'error');
    }
  };

  const cycleTheme = () => {
    const modes = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeLabel = () => {
    if (themeMode === 'light') return 'Claro';
    if (themeMode === 'dark') return 'Escuro';
    return 'Sistema';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '32px',
        color: 'var(--text-primary)',
        fontFamily: 'Outfit, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Configuracoes
      </h1>

      {/* Foto de Perfil */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Foto de Perfil
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: user?.foto_perfil ? `url(${user.foto_perfil}) center/cover` : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: '#F4E4BC',
              fontWeight: '600'
            }}>
              {!user?.foto_perfil && (user?.name?.charAt(0)?.toUpperCase() || 'A')}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '13px',
              cursor: uploadingPhoto ? 'wait' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto ? 'Enviando...' : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Alterar Foto
                </>
              )}
            </label>
            {user?.foto_perfil && (
              <button
                onClick={handleRemovePhoto}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                Remover Foto
              </button>
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Formatos aceitos: JPG, PNG, GIF. Tamanho maximo: 2MB
        </p>
      </div>

      {/* Conta Admin */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Conta Admin
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>
              Usuario: <strong>{user?.username}</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
              {user?.name}
            </div>
          </div>
          <button onClick={() => setShowChangePin(true)} style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Alterar PIN
          </button>
        </div>
      </div>

      {/* Tema */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Aparencia
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>
              Tema: <strong>{getThemeLabel()}</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
              Alterna entre claro, escuro e sistema
            </div>
          </div>
          <button onClick={cycleTheme} style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Alterar
          </button>
        </div>
      </div>

      {/* Sobre */}
      <button
        onClick={() => setShowAboutModal(true)}
        style={{
          width: '100%',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}
      >
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '12px',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Sobre
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ marginLeft: 'auto' }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', fontFamily: 'Outfit, sans-serif' }}>
          <p><strong>Acervo Digital</strong> v2.1.0</p>
          <p>Sociedade Filarmonica 25 de Marco</p>
          <p>Fundada em 1868 - Feira de Santana, BA</p>
        </div>
      </button>

      {/* Sair */}
      <button onClick={handleLogout} style={{
        width: '100%',
        padding: '14px',
        borderRadius: 'var(--radius-sm)',
        background: '#e74c3c',
        border: 'none',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        fontFamily: 'Outfit, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair do Painel Admin
      </button>

      {showChangePin && <ChangePinModal onClose={() => setShowChangePin(false)} />}

      {/* Modal Sobre com Changelog */}
      {showAboutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          padding: '20px'
        }} onClick={() => setShowAboutModal(false)}>
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '85vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '24px 24px 0', textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                padding: '10px'
              }}>
                <img
                  src="/assets/images/ui/brasao-256x256.png"
                  alt="Brasao"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '2px'
              }}>Acervo Digital</h3>

              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '16px'
              }}>Painel Administrativo</p>

              {/* Info cards */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Versao</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>2.1.0</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Backend</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>Cloudflare Workers</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dev</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Antonio Jr.</p>
                </div>
              </div>
            </div>

            {/* Changelog */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 24px',
              WebkitOverflowScrolling: 'touch'
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>Historico de Atualizacoes</p>

              {/* v2.1.0 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>2.1.0</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Atual</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> Autenticacao JWT com expiracao de 24h</li>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> Senhas criptografadas com PBKDF2</li>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> Rate limiting para protecao contra ataques</li>
                  <li style={{ marginBottom: '4px' }}><strong>Admin:</strong> Redirecionamento automatico para /admin</li>
                  <li style={{ marginBottom: '4px' }}><strong>Admin:</strong> Toggle de tema movido para o header</li>
                  <li style={{ marginBottom: '4px' }}><strong>UX:</strong> Sessao expira com aviso ao usuario</li>
                  <li>Melhorias de performance e correcoes de bugs</li>
                </ul>
              </div>

              {/* v2.0.0 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)'
                  }}>2.0.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Upload de pasta com multiplas partes</li>
                  <li style={{ marginBottom: '4px' }}>Deteccao automatica de instrumentos</li>
                  <li style={{ marginBottom: '4px' }}>Gerenciamento de partes no admin</li>
                  <li style={{ marginBottom: '4px' }}>Sistema de favoritos sincronizado</li>
                  <li>Correcao de bugs e melhorias gerais</li>
                </ul>
              </div>

              {/* v1.0.0 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)'
                  }}>1.0.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Painel administrativo completo</li>
                  <li style={{ marginBottom: '4px' }}>Dashboard com estatisticas</li>
                  <li style={{ marginBottom: '4px' }}>Gerenciamento de musicos</li>
                  <li style={{ marginBottom: '4px' }}>Gerenciamento de partituras</li>
                  <li>Gerenciamento de categorias</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px 24px', flexShrink: 0 }}>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                S.F. 25 de Marco • Feira de Santana, BA • Fundada em 1868
              </p>
              <button
                onClick={() => setShowAboutModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;
