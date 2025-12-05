// ===== LOGIN SCREEN =====
// Tela de login com efeito glassmorphism

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';

const API_BASE_URL = 'https://acervo-filarmonica-api.acssjr.workers.dev';

const LoginScreen = ({ onClose, required = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { showToast } = useUI();
  const { setFavorites } = useData();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [rememberMe, setRememberMe] = useState(() => Storage.get('rememberMe', false));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const cardRef = useRef(null);
  const checkUserTimeout = useRef(null);

  // Scroll suave para o card quando teclado abre (mobile)
  const scrollToCard = useCallback(() => {
    if (cardRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  // Carrega usuario salvo se "Lembrar-me" estava ativo
  useEffect(() => {
    if (rememberMe) {
      const savedUsername = Storage.get('savedUsername', '');
      if (savedUsername) {
        setUsername(savedUsername);
        checkUserExists(savedUsername);
      }
    }
  }, []);

  // Funcao para verificar usuario na API
  const checkUserExists = async (usernameToCheck) => {
    if (!usernameToCheck || usernameToCheck.length < 2) {
      setUserFound(false);
      setUserInfo(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck })
      });
      const data = await response.json();

      if (data.exists) {
        setUserFound(true);
        setUserInfo({ name: data.nome, instrument: data.instrumento });
        setTimeout(() => pinRefs[0].current?.focus(), 100);
      } else {
        setUserFound(false);
        setUserInfo(null);
      }
    } catch (e) {
      console.error('Erro ao verificar usuario:', e);
      setUserFound(false);
      setUserInfo(null);
    }
  };

  // Verifica se usuario existe quando digita (com debounce)
  const handleUsernameChange = (value) => {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    setUsername(normalized);
    setError('');

    if (checkUserTimeout.current) {
      clearTimeout(checkUserTimeout.current);
    }

    if (!normalized || normalized.length < 2) {
      setUserFound(false);
      setUserInfo(null);
      return;
    }

    checkUserTimeout.current = setTimeout(() => {
      checkUserExists(normalized);
    }, 300);
  };

  // Handler do PIN - autologin quando completo
  const handlePinChange = async (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    // Verifica se completou o PIN - AUTOLOGIN
    if (value && index === 3) {
      const fullPin = newPin.join('');
      const normalizedUsername = username.toLowerCase().replace(/\s/g, '');

      if (!normalizedUsername) {
        setError('Digite seu usuario');
        setPin(['', '', '', '']);
        return;
      }

      setIsLoading(true);

      try {
        if (USE_API) {
          const result = await API.login(normalizedUsername, fullPin);

          if (result.success && result.user) {
            Storage.set('rememberMe', rememberMe);
            if (rememberMe) {
              Storage.set('savedUsername', normalizedUsername);
            } else {
              Storage.remove('savedUsername');
            }

            const userData = {
              id: result.user.id,
              username: result.user.username,
              name: result.user.nome,
              isAdmin: result.user.admin,
              instrument: result.user.instrumento_nome || 'Musico',
              instrumento_id: result.user.instrumento_id,
              foto_url: result.user.foto_url
            };

            setUser(userData);
            Storage.set('user', userData);

            try {
              const favoritosIds = await API.getFavoritosIds();
              if (favoritosIds && Array.isArray(favoritosIds)) {
                const favoritosStr = favoritosIds.map(id => String(id));
                setFavorites(favoritosStr);
                Storage.set('favorites', favoritosStr);
              }
            } catch (e) {
              console.log('Favoritos serao carregados depois');
            }

            showToast(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`);

            // Redireciona apos login bem-sucedido
            if (onClose) {
              onClose();
            } else {
              // Determina destino baseado no papel do usuario
              const from = location.state?.from?.pathname;
              let destino = userData.isAdmin ? '/admin' : '/';

              // Se veio de uma rota especifica (exceto login), volta para la
              if (from && from !== '/login' && from !== '/') {
                // Mas admin nao deve ir para rotas de musico
                if (!userData.isAdmin || from.startsWith('/admin')) {
                  destino = from;
                }
              }

              navigate(destino, { replace: true });
            }

            setIsLoading(false);
            return;
          }
        }

        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        pinRefs[0].current?.focus();

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (err) {
        console.error('Erro no login:', err);
        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        pinRefs[0].current?.focus();

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      setIsLoading(false);
    }
  };

  // Handler do backspace no PIN
  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Background com imagem e overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          linear-gradient(135deg, rgba(61, 21, 24, 0.92) 0%, rgba(92, 26, 27, 0.88) 50%, rgba(61, 21, 24, 0.92) 100%),
          url('/assets/images/banda/foto-banda-sao-goncalo.webp')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.9)',
        zIndex: -2
      }} />

      {/* Padrao decorativo sutil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: -1
      }} />

      {/* Container scrollavel que centraliza o card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: 'min-content'
      }}>
        {/* Card com efeito glass */}
        <div
          ref={cardRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
            padding: '40px 32px',
            margin: '20px 0',
            animation: 'scaleInLogin 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
          {/* Botao fechar - so se nao for obrigatorio */}
          {!required && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>
          )}

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Logo */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
              overflow: 'hidden',
              padding: '8px'
            }}>
              <img
                src="/assets/images/ui/brasao-256x256.png"
                alt="Brasao Filarmonica 25 de Marco"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: '#F4E4BC',
              marginBottom: '4px'
            }}>
              Acervo Digital
            </h1>

            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              color: 'rgba(244, 228, 188, 0.6)'
            }}>
              S.F. 25 de Marco • Feira de Santana
            </p>

            {/* Status badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '6px 12px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '20px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22C55E',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: '#22C55E',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Sistema Online</span>
            </div>
          </div>

          {/* Form */}
          <div>
            {/* Usuario */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: 'rgba(244, 228, 188, 0.8)',
                marginBottom: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Usuario
                {userFound && (
                  <span style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#22C55E',
                    fontSize: '11px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {userInfo?.name}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="seu.usuario"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                className="login-input"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: userFound ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F4E4BC',
                  fontSize: '16px',
                  fontFamily: 'Outfit, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  scrollToCard();
                }}
                onBlur={e => {
                  e.target.style.borderColor = userFound ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.12)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              />
            </div>

            {/* PIN */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: 'rgba(244, 228, 188, 0.8)',
                marginBottom: '12px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                PIN
              </label>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px'
              }}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={pinRefs[index]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handlePinChange(index, e.target.value)}
                    onKeyDown={e => handlePinKeyDown(index, e)}
                    disabled={isLoading}
                    style={{
                      width: '56px',
                      minWidth: '56px',
                      maxWidth: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: digit ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                      border: digit
                        ? '2px solid rgba(212, 175, 55, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#F4E4BC',
                      fontSize: '22px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '700',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      flexShrink: 0,
                      flexGrow: 0
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      scrollToCard();
                    }}
                    onBlur={e => {
                      if (!digit) {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'shake 0.5s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  color: '#EF4444'
                }}>{error}</span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '24px',
                background: 'rgba(212, 175, 55, 0.08)',
                borderRadius: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
                  padding: '3px',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src="/assets/images/ui/brasao-256x256.png"
                      alt=""
                      style={{
                        width: '70%',
                        height: '70%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#D4AF37'
                }}>Entrando...</span>
              </div>
            )}

            {/* Lembrar-me */}
            <label
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  background: rememberMe ? '#D4AF37' : 'rgba(255, 255, 255, 0.06)',
                  border: rememberMe ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D1518" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                color: 'rgba(244, 228, 188, 0.7)'
              }}>
                Lembrar meu acesso
              </span>
            </label>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(244, 228, 188, 0.4)',
              fontSize: '11px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Conexao Segura
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            color: 'rgba(244, 228, 188, 0.3)'
          }}>
            Sociedade Filarmonica 25 de Marco • Fundada em 1868
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
