// ===== PROFILE SCREEN =====
// Tela de perfil do usuario com todas as funcionalidades

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import { Storage } from '@services/storage';
import Header from '@components/common/Header';
import ChangePinModal from '@components/modals/ChangePinModal';

const ProfileScreen = () => {
  const { user, setUser } = useAuth();
  const { showToast, theme } = useUI();
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => Storage.get(`profilePhoto_${user?.id}`, null));
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const fileInputRef = useRef(null);

  // Atualiza foto do perfil quando usuario muda
  useEffect(() => {
    if (user?.id) {
      setProfilePhoto(Storage.get(`profilePhoto_${user.id}`, null));
      setEditedName(user.name);
    }
  }, [user?.id]);

  // Handler para upload de foto
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande (max 2MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProfilePhoto(base64);
      Storage.set(`profilePhoto_${user.id}`, base64);
      showToast('Foto atualizada!');
    };
    reader.readAsDataURL(file);
  };

  // Salvar nome editado
  const handleSaveName = () => {
    if (editedName.trim() && editedName !== user.name) {
      setUser({ ...user, name: editedName.trim() });
      showToast('Nome atualizado!');
    }
    setIsEditingName(false);
  };

  const handleLogout = () => {
    Storage.remove('authToken');
    Storage.remove('savedUsername');
    Storage.remove('rememberMe');
    setUser(null);
    showToast('Voce saiu da conta');
  };

  if (!user) {
    return (
      <div>
        <Header title="Perfil" />
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--text-muted)'
          }}><div style={{ width: '32px', height: '32px' }}><Icons.User /></div></div>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Bem-vindo!</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Faca login para acessar o acervo</p>
        </div>
      </div>
    );
  }

  // Componente de item de configuracao
  const SettingItem = ({ icon, label, value, onClick, rightElement, danger }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        marginBottom: '8px'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: danger ? 'rgba(214, 69, 69, 0.1)' : 'rgba(212, 175, 55, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <div style={{ width: '20px', height: '20px', color: danger ? '#D64545' : 'var(--primary)' }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          color: danger ? '#D64545' : 'var(--text-primary)',
          marginBottom: value ? '2px' : 0
        }}>{label}</p>
        {value && (
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>{value}</p>
        )}
      </div>
      {rightElement}
      {onClick && !rightElement && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );

  return (
    <div>
      <Header title="Perfil" subtitle="Configuracoes da conta" />

      {/* Foto e Info Principal */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Foto de Perfil */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: profilePhoto ? `url(${profilePhoto}) center/cover` : 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '700',
            color: '#F4E4BC',
            fontFamily: "Outfit, sans-serif",
            border: '3px solid #D4AF37',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {!profilePhoto && user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Botao de editar foto */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              border: '2px solid var(--bg-primary)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Nome */}
        {isEditingName ? (
          <div style={{ marginBottom: '4px' }}>
            <input
              type="text"
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '22px',
                fontWeight: '700',
                textAlign: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--primary)',
                borderRadius: '8px',
                padding: '4px 12px',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '200px'
              }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              onBlur={handleSaveName}
            />
          </div>
        ) : (
          <div
            onClick={() => setIsEditingName(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}
          >
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {user.name}
            </h2>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>{user.instrument}</p>

        {user.isAdmin && (
          <span style={{
            display: 'inline-block',
            background: 'rgba(212, 175, 55, 0.15)',
            color: '#D4AF37',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Administrador</span>
        )}
      </div>

      {/* Configuracoes */}
      <div style={{ padding: '0 20px 20px' }}>
        {/* Secao: Conta */}
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
          paddingLeft: '4px'
        }}>Conta</p>

        <SettingItem
          icon={<Icons.User />}
          label="Informacoes Pessoais"
          value={user.instrument}
          onClick={() => showToast('Em breve!')}
        />

        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>}
          label="Alterar PIN"
          onClick={() => setShowChangePinModal(true)}
        />

        {/* Secao: Contato */}
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
          marginTop: '24px',
          paddingLeft: '4px'
        }}>Contato</p>

        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>}
          label="Contato com o desenvolvedor"
          value="WhatsApp"
          onClick={() => window.open('https://wa.me/5575981234176', '_blank')}
        />

        {/* Secao: Sobre */}
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
          marginTop: '24px',
          paddingLeft: '4px'
        }}>Sobre</p>

        <SettingItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>}
          label="Acervo Digital"
          value="Versao 2.2.0 - Dezembro 2025"
          onClick={() => setShowAboutModal(true)}
        />

        {/* Sair */}
        <div style={{ marginTop: '32px' }}>
          <SettingItem
            icon={<Icons.Logout />}
            label="Sair da conta"
            onClick={handleLogout}
            danger
          />
        </div>
      </div>

      {/* Padding inferior para bottom nav */}
      <div style={{ height: '100px' }} />

      {/* Modal Alterar PIN */}
      {showChangePinModal && (
        <ChangePinModal onClose={() => setShowChangePinModal(false)} />
      )}

      {/* Modal Sobre - Completo com Changelog */}
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
              maxWidth: '420px',
              maxHeight: '85vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header fixo */}
            <div style={{ padding: '24px 24px 0', textAlign: 'center', flexShrink: 0 }}>
              {/* Logo */}
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
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
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
              }}>Sociedade Filarmonica 25 de Marco</p>

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
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>2.2.0</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tecnologias</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>React • JS • CSS</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dev</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Antonio Jr.</p>
                </div>
              </div>
            </div>

            {/* Changelog scrollavel */}
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

              {/* v2.2.0 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>2.2.0</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Atual</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}><strong>Arquitetura:</strong> Contexts separados (Auth, UI, Data, Notifications)</li>
                  <li style={{ marginBottom: '4px' }}><strong>Performance:</strong> Re-renders isolados por dominio</li>
                  <li>30+ componentes migrados para nova arquitetura</li>
                </ul>
              </div>

              {/* v2.1.0 */}
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
                  }}>2.1.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> JWT com expiracao de 24h</li>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> Senhas criptografadas com PBKDF2</li>
                  <li style={{ marginBottom: '4px' }}><strong>Seguranca:</strong> Rate limiting contra ataques</li>
                  <li style={{ marginBottom: '4px' }}><strong>Admin:</strong> Redirecionamento automatico</li>
                  <li>Toggle de tema no header admin</li>
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
                  <li style={{ marginBottom: '4px' }}>Seletor de partes multiplas no download</li>
                  <li style={{ marginBottom: '4px' }}>Download direto ao selecionar instrumento</li>
                  <li style={{ marginBottom: '4px' }}>Secao "Em Destaque" so com marcados</li>
                  <li>Correcao de bugs e melhorias gerais</li>
                </ul>
              </div>

              {/* v1.5.0 */}
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
                  }}>1.5.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Modal "Sobre" com changelog</li>
                  <li style={{ marginBottom: '4px' }}>Validacao PIN nao pode ser igual ao anterior</li>
                  <li>Espacamento entre cards no mobile</li>
                </ul>
              </div>

              {/* v1.4.0 */}
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
                  }}>1.4.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Perfil completo: foto, edicao de nome</li>
                  <li style={{ marginBottom: '4px' }}>Alteracao de PIN em 3 etapas</li>
                  <li style={{ marginBottom: '4px' }}>Contato via WhatsApp</li>
                  <li>Tema mobile: clique direto cicla opcoes</li>
                </ul>
              </div>

              {/* v1.3.0 */}
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
                  }}>1.3.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Login com usuario + PIN de 4 digitos</li>
                  <li style={{ marginBottom: '4px' }}>Auto-login ao completar PIN</li>
                  <li style={{ marginBottom: '4px' }}>Opcao "Lembrar meu acesso"</li>
                  <li>Otimizacao mobile para teclado virtual</li>
                </ul>
              </div>

              {/* v1.2.0 */}
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
                  }}>1.2.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Tema: Claro, Escuro, Sistema</li>
                  <li style={{ marginBottom: '4px' }}>Contador de proximo ensaio</li>
                  <li>Tela de login com glassmorphism</li>
                </ul>
              </div>

              {/* v1.1.0 */}
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
                  }}>1.1.0</span>
                </div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Modal de detalhes da partitura</li>
                  <li style={{ marginBottom: '4px' }}>Seletor de 27 instrumentos</li>
                  <li>Sistema de favoritos persistente</li>
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
                  <li style={{ marginBottom: '4px' }}>Layout desktop com sidebar</li>
                  <li style={{ marginBottom: '4px' }}>Toggle sidebar (260px - 72px)</li>
                  <li style={{ marginBottom: '4px' }}>Filtros por genero e compositor</li>
                  <li>Grid responsivo de cards</li>
                </ul>
              </div>

              {/* Versoes anteriores colapsadas */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '8px'
              }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Versoes anteriores</p>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  <strong>0.9</strong> Notificacoes •
                  <strong> 0.8</strong> Header Home •
                  <strong> 0.7</strong> Cards em destaque •
                  <strong> 0.6</strong> Favoritos, busca fuzzy •
                  <strong> 0.5</strong> Tema claro/escuro •
                  <strong> 0.4</strong> Painel Admin •
                  <strong> 0.3</strong> Busca •
                  <strong> 0.2</strong> Acervo •
                  <strong> 0.1</strong> Versao inicial
                </div>
              </div>
            </div>

            {/* Footer fixo */}
            <div style={{ padding: '16px 24px 24px', flexShrink: 0 }}>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                Feira de Santana - BA • Fundada em 1868
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

export default ProfileScreen;
