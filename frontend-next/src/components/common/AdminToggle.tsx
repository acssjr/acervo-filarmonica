"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { Icons } from "@constants/icons";

const AdminToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isInAdmin = pathname.startsWith('/admin');

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    document.body.classList.add('admin-transition-out');

    setTimeout(() => {
      const targetRoute = isInAdmin ? '/' : '/admin';
      router.push(targetRoute);

      document.body.classList.remove('admin-transition-out');
      document.body.classList.add('admin-transition-in');

      setTimeout(() => {
        document.body.classList.remove('admin-transition-in');
        setIsTransitioning(false);
      }, 200);
    }, 150);
  }, [isInAdmin, isTransitioning, router]);

  if (!user?.is_admin) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      title={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      aria-label={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: isInAdmin
          ? 'linear-gradient(145deg, #D4AF37, #B8860B)'
          : 'linear-gradient(145deg, #722F37, #5C1A1B)',
        border: isInAdmin
          ? '1px solid rgba(212, 175, 55, 0.5)'
          : '1px solid rgba(212, 175, 55, 0.3)',
        color: isInAdmin ? '#3D1518' : '#D4AF37',
        cursor: isTransitioning ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        opacity: isTransitioning ? 0.7 : 1
      }}
    >
      <div style={{
        width: '18px', height: '18px',
        transition: 'transform 0.3s ease',
        transform: isInAdmin ? 'rotate(45deg)' : 'rotate(0deg)'
      }}>
        <Icons.Key />
      </div>
    </button>
  );
};

export default AdminToggle;
