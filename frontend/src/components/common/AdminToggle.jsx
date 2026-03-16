// ===== ADMIN TOGGLE =====
// Botao para alternar entre modo usuario e admin
// Visivel apenas para usuarios admin

import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { Icons } from '@constants/icons';

const AdminToggle = ({ inDarkHeader = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Verifica se esta no admin
  const isInAdmin = location.pathname.startsWith('/admin');

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Aplica classe de fade-out no body
    document.body.classList.add('admin-transition-out');

    setTimeout(() => {
      // Navega para a rota oposta
      const targetRoute = isInAdmin ? '/' : '/admin';
      navigate(targetRoute);

      // Remove classe de saida e adiciona de entrada
      document.body.classList.remove('admin-transition-out');
      document.body.classList.add('admin-transition-in');

      setTimeout(() => {
        document.body.classList.remove('admin-transition-in');
        setIsTransitioning(false);
      }, 200);
    }, 150);
  }, [isInAdmin, isTransitioning, navigate]);

  // So mostra para admins
  if (!user?.isAdmin) return null;

  // Liquid glass — gold-tinted quando em modo admin, neutro quando em modo usuário
  const glassStyles = (() => {
    if (inDarkHeader) {
      return isInAdmin
        ? {
            background: 'linear-gradient(160deg, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.14) 100%)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(212, 175, 55, 0.50)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
            color: '#D4AF37'
          }
        : {
            background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.28)',
            color: '#D4AF37'
          };
    }
    return isInAdmin
      ? {
          background: 'linear-gradient(160deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%)',
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.15)',
          color: 'var(--accent-dark)'
        }
      : {
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-box-shadow)',
          color: 'var(--text-secondary)'
        };
  })();

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      title={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      aria-label={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      style={{
        width: inDarkHeader ? '36px' : '40px',
        height: inDarkHeader ? '36px' : '40px',
        borderRadius: inDarkHeader ? '10px' : '12px',
        ...glassStyles,
        cursor: isTransitioning ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s ease',
        opacity: isTransitioning ? 0.7 : 1
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          transition: 'transform 0.3s ease',
          transform: isInAdmin ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
      >
        <Icons.Key />
      </div>
    </button>
  );
};

export default AdminToggle;
