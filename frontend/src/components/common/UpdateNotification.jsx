// ===== UPDATE NOTIFICATION =====
// Componente que verifica e notifica sobre novas versões do app
// Aparece discretamente quando há atualização disponível

import { useState, useEffect, useCallback } from 'react';
import { API } from '@services/api';

// Versão atual do frontend (deve corresponder ao package.json)
const CURRENT_VERSION = '2.8.0';

// Intervalo de verificação: 5 minutos
const CHECK_INTERVAL = 5 * 60 * 1000;

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Verificar nova versão
  const checkVersion = useCallback(async () => {
    try {
      const data = await API.getVersion();
      if (data?.version && data.version !== CURRENT_VERSION) {
        // Comparar versões (maior = atualização disponível)
        const current = CURRENT_VERSION.split('.').map(Number);
        const server = data.version.split('.').map(Number);

        const isNewer = server[0] > current[0] ||
          (server[0] === current[0] && server[1] > current[1]) ||
          (server[0] === current[0] && server[1] === current[1] && server[2] > current[2]);

        if (isNewer) {
          setNewVersion(data.version);
          setUpdateAvailable(true);
          // Animar entrada após pequeno delay
          setTimeout(() => setIsVisible(true), 100);
        }
      }
    } catch {
      // Silencioso - não bloquear o app por erro de versão
    }
  }, []);

  // Verificar ao montar e periodicamente
  useEffect(() => {
    // Primeira verificação após 10s (dar tempo do app carregar)
    const initialCheck = setTimeout(checkVersion, 10000);

    // Verificações periódicas
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    // Verificar quando a janela ganha foco (usuário voltou ao app)
    const handleFocus = () => {
      checkVersion();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkVersion]);

  // Handler para atualizar
  const handleUpdate = () => {
    // Força reload ignorando cache
    window.location.reload(true);
  };

  // Handler para dispensar
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  // Não renderizar se não há atualização ou foi dispensado
  if (!updateAvailable || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '100px'})`,
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(10px)',
          maxWidth: 'calc(100vw - 32px)'
        }}
      >
        {/* Ícone de atualização */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: 'spin 2s linear infinite'
            }}
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Nova versao disponivel
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            v{CURRENT_VERSION} → v{newVersion}
          </p>
        </div>

        {/* Botão Atualizar */}
        <button
          onClick={handleUpdate}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            border: 'none',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'Outfit, sans-serif',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Atualizar
        </button>

        {/* Botão Fechar */}
        <button
          onClick={handleDismiss}
          aria-label="Fechar"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Keyframes para animação do ícone */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateNotification;
