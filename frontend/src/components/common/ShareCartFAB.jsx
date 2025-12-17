// ===== SHARE CART FAB =====
// Botao flutuante para acessar o carrinho de compartilhamento
// Mostra apenas quando ha itens no carrinho

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import useAnimatedVisibility from '@hooks/useAnimatedVisibility';

const ShareCartFAB = () => {
  const { shareCart, setShowShareCart } = useUI();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animacao de entrada/saida
  const { shouldRender, isExiting } = useAnimatedVisibility(shareCart.length > 0, 200);

  if (!shouldRender) return null;

  return (
    <button
      onClick={() => setShowShareCart(true)}
      aria-label={`Carrinho de compartilhamento: ${shareCart.length} itens`}
      style={{
        position: 'fixed',
        bottom: isMobile ? '100px' : '90px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
        border: 'none',
        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 998,
        animation: isExiting
          ? 'slideDownFAB 0.2s ease forwards'
          : 'slideUpFAB 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Icone */}
      <div style={{ width: '24px', height: '24px', color: '#FFFFFF' }}>
        <Icons.Share />
      </div>

      {/* Badge com contador */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        minWidth: '22px',
        height: '22px',
        borderRadius: '11px',
        background: 'var(--primary)',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '700',
        fontFamily: 'Outfit, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 6px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {shareCart.length}
      </div>
    </button>
  );
};

export default ShareCartFAB;
