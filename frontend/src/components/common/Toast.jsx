// ===== TOAST COMPONENT =====
// Notificacoes flutuantes

import { useEffect } from 'react';
import { Icons } from '@constants/icons';

const Toast = ({ message, type = 'success', onClose }) => {
  const isDownload = message.toLowerCase().includes('download') || message.toLowerCase().includes('preparando');
  const duration = isDownload ? 4000 : 3000;

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '20px',
      right: '20px',
      maxWidth: '390px',
      margin: '0 auto',
      background: type === 'success'
        ? (isDownload ? 'linear-gradient(145deg, #2D8A5F 0%, #236B4A 100%)' : '#2D8A5F')
        : '#D64545',
      color: '#fff',
      borderRadius: 'var(--radius-sm)',
      padding: isDownload ? '16px 20px' : '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: isDownload ? '0 8px 32px rgba(45, 138, 95, 0.4)' : 'var(--shadow-lg)',
      zIndex: 3000,
      animation: 'slideUp 0.3s ease',
      border: isDownload ? '1px solid rgba(255,255,255,0.2)' : 'none'
    }}>
      <div style={{ width: '24px', height: '24px', flexShrink: 0 }}>
        {isDownload ? <DownloadIcon /> : (type === 'success' ? <Icons.Check /> : <Icons.Close />)}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: isDownload ? '15px' : '14px', fontWeight: '600', display: 'block' }}>
          {message}
        </span>
        {isDownload && (
          <span style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px', display: 'block' }}>
            Verifique a barra de notificacoes
          </span>
        )}
      </div>
    </div>
  );
};

export default Toast;
