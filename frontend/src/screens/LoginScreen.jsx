// ===== LOGIN SCREEN =====
// Card glass flutuante centralizado — inspirado na referência com glass translúcido real

import PropTypes from 'prop-types';
import useLoginForm from '@hooks/useLoginForm';
import LoginBackground from '@components/login/LoginBackground';
import PinInput from '@components/login/PinInput';

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

  const getInputBorderColor = () => {
    if (userFound) return 'rgba(212,175,55,0.55)';
    if (userNotFound) return 'rgba(239,68,68,0.45)';
    return 'rgba(255,255,255,0.13)';
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

      {/* Container que centraliza o card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        minHeight: 'min-content'
      }}>

        {/* ── CARD GLASS TRUE — foto do fundo visível através ── */}
        <div
          ref={cardRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            /* Glass quente — foto visível, cores acolhedoras de vinho */
            background: 'linear-gradient(145deg, rgba(55,14,16,0.60) 0%, rgba(16,4,4,0.82) 100%)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.2)',
            padding: '28px 24px 24px',
            animation: 'scaleInLogin 0.4s cubic-bezier(0.16,1,0.3,1)'
          }}>

          {/* Botão fechar */}
          {!required && (
            <button
              onClick={() => onClose?.()}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.65)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>
          )}

          {/* ── LOGO: círculo dourado estático ── */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 100%)',
              border: '1.5px solid rgba(212,175,55,0.55)',
              boxShadow: '0 0 0 3px rgba(212,175,55,0.10), 0 4px 20px rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              padding: '10px'
            }}>
              <img
                src="/assets/images/ui/brasao-256x256.png"
                alt="Brasão Filarmônica 25 de Março"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* ── HEADER CENTRALIZADO ── */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#F4E4BC',
              letterSpacing: '-0.4px',
              lineHeight: 1.15,
              marginBottom: '6px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)'
            }}>
              Acervo Digital
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'rgba(244,228,188,0.48)',
              marginBottom: '14px'
            }}>
              S.F. 25 de Março • Feira de Santana
            </p>

            {/* Badge Sistema Online */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(34,197,94,0.14)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1px solid rgba(34,197,94,0.28)',
              boxShadow: 'inset 0 1px 0 rgba(34,197,94,0.2)'
            }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#22C55E',
                boxShadow: '0 0 5px rgba(34,197,94,0.7)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sistema Online
              </span>
            </div>
          </div>

          {/* Divisor */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
              entrar com usuário
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* ── FORM ── */}

          {/* Campo USUÁRIO */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '7px'
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(244,228,188,0.55)" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(244,228,188,0.65)', letterSpacing: '0.3px' }}>
                Usuário
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', zIndex: 1
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
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
                  padding: '13px 16px 13px 40px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.22)',
                  border: `1px solid ${getInputBorderColor()}`,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)',
                  color: '#F4E4BC',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(212,175,55,0.55)';
                  e.target.style.background = 'rgba(0,0,0,0.28)';
                  scrollToCard();
                }}
                onBlur={e => {
                  e.target.style.borderColor = getInputBorderColor();
                  e.target.style.background = 'rgba(0,0,0,0.22)';
                }}
              />
            </div>

            {/* Status do usuário */}
            <div style={{ marginTop: '4px', paddingLeft: '2px' }}>
              {checkingUser && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(212,175,55,0.85)', fontSize: '12px' }}>
                  <div style={{
                    width: '10px', height: '10px',
                    border: '2px solid rgba(212,175,55,0.3)', borderTopColor: '#D4AF37',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0
                  }} />
                  Verificando...
                </span>
              )}
              {!checkingUser && userFound && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#22C55E', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  Olá, {userInfo?.name}
                </span>
              )}
              {!checkingUser && userNotFound && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#EF4444', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Não encontrado
                </span>
              )}
            </div>
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

          {/* Lembrar-me */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '4px',
            marginBottom: '4px'
          }}>
            <label
              onClick={toggleRememberMe}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
                transition: 'opacity 0.2s ease'
              }}>
              {/* Checkbox estilo referência — quadrado glass */}
              <div style={{
                width: '18px', height: '18px',
                borderRadius: '5px',
                background: rememberMe ? '#D4AF37' : 'rgba(0,0,0,0.25)',
                border: rememberMe ? 'none' : '1.5px solid rgba(255,255,255,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease', flexShrink: 0
              }}>
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3D1518" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Lembrar meu acesso
              </span>
            </label>
          </div>

          {/* Zona de status — só renderiza quando há conteúdo, sem altura fixa */}
          {(isLoading || error) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 0 2px'
            }}>
              {isLoading && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '6px 18px',
                  background: 'rgba(212,175,55,0.12)',
                  borderRadius: '100px',
                  border: '1px solid rgba(212,175,55,0.22)',
                  animation: 'fadeInSlide 0.3s ease-out'
                }}>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37',
                    borderRadius: '50%', animation: 'spin 0.6s cubic-bezier(0.5,0.1,0.4,0.9) infinite'
                  }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#D4AF37' }}>Entrando...</span>
                </div>
              )}
              {!isLoading && error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '6px 14px',
                  background: 'rgba(239,68,68,0.15)',
                  borderRadius: '100px',
                  border: '1px solid rgba(239,68,68,0.3)',
                  animation: 'shake 0.4s ease-in-out'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444' }}>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.09)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '4px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Conexão Segura
            </div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
              Sociedade Filarmônica 25 de Março • Fundada em 1868
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

LoginScreen.propTypes = {
  onClose: PropTypes.func,
  required: PropTypes.bool
};

LoginScreen.defaultProps = {
  onClose: undefined,
  required: false
};

export default LoginScreen;
