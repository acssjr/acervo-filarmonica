// ===== LOGIN SCREEN =====
// Tela de login com efeito glassmorphism

import PropTypes from 'prop-types';
import useLoginForm from '@hooks/useLoginForm';
import { LoginBackground, LoginHeader, PinInput } from '@components/login';

const LoginScreen = ({ onClose, required = false }) => {
  const {
    username,
    pin,
    rememberMe,
    isLoading,
    error,
    userFound,
    userNotFound,
    checkingUser,
    userInfo,
    pinRefs,
    cardRef,
    handleUsernameChange,
    handlePinChange,
    handlePinKeyDown,
    toggleRememberMe,
    scrollToCard
  } = useLoginForm({ onClose });

  // Determina a cor da borda do input
  const getInputBorderColor = () => {
    if (userFound) return 'rgba(34, 197, 94, 0.4)';
    if (userNotFound) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(255, 255, 255, 0.12)';
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
      <LoginBackground />

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

          <LoginHeader />

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
                Usuário

                {/* Loading de verificação */}
                {checkingUser && (
                  <span style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'rgba(212, 175, 55, 0.8)',
                    fontSize: '11px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderTopColor: '#D4AF37',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Verificando...
                  </span>
                )}

                {/* Usuário encontrado */}
                {!checkingUser && userFound && (
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

                {/* Usuário não encontrado */}
                {!checkingUser && userNotFound && (
                  <span style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#EF4444',
                    fontSize: '11px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Não encontrado
                  </span>
                )}
              </label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="seuusuario"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                className="login-input"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${getInputBorderColor()}`,
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
                  e.target.style.borderColor = getInputBorderColor();
                  e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              />
            </div>

            {/* PIN */}
            <PinInput
              pin={pin}
              pinRefs={pinRefs}
              isLoading={isLoading}
              onPinChange={handlePinChange}
              onKeyDown={handlePinKeyDown}
              onFocus={scrollToCard}
            />

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

            {/* Loading - Barras de áudio animadas */}
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
                {/* Barras de equalizer musical */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '4px',
                  height: '40px'
                }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        borderRadius: '3px',
                        background: 'linear-gradient(to top, #D4AF37, #F4E4BC)',
                        animation: `equalizer 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
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
              onClick={toggleRememberMe}
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
              Conexão Segura
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            color: 'rgba(244, 228, 188, 0.3)'
          }}>
            Sociedade Filarmônica 25 de Março • Fundada em 1868
          </p>
        </div>
      </div>
    </div>
  );
};

LoginScreen.propTypes = {
  onClose: PropTypes.func,
  required: PropTypes.bool
};

export default LoginScreen;
