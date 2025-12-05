// ===== THEME SELECTOR =====
// Seletor de tema (claro/escuro/sistema)

import { useState, useEffect, useRef } from 'react';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';

const ThemeSelector = ({ inDarkHeader = false, compact = false, inline = false }) => {
  const { theme, themeMode, setThemeMode } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const options = [
    { id: 'light', label: 'Claro', icon: Icons.Sun },
    { id: 'dark', label: 'Escuro', icon: Icons.Moon },
    { id: 'system', label: 'Sistema', icon: Icons.Monitor }
  ];

  // Função para ciclar entre temas
  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % order.length;
    setThemeMode(order[nextIndex]);
  };

  // Versão inline (3 botões lado a lado) para header desktop
  if (inline) {
    return (
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px',
        padding: '4px',
        border: '1px solid var(--border)'
      }}>
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = themeMode === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setThemeMode(option.id)}
              title={option.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: isActive ? 'var(--primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '16px', height: '16px' }}>
                <Icon />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = options.find(o => o.id === themeMode);
  const CurrentIcon = currentOption?.icon || Icons.Sun;

  // Estilos para o header vinho (institucional)
  const darkHeaderStyles = {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#F4E4BC'
  };

  // Estilos normais
  const normalStyles = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)'
  };

  const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;

  // No mobile, clique direto muda o tema (cicla)
  const handleClick = () => {
    if (isMobile) {
      cycleTheme();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={selectorRef} style={{ position: 'relative' }}>
      {/* Botão de toggle */}
      <button
        className="btn-hover"
        onClick={handleClick}
        style={{
          width: compact ? '36px' : '40px',
          height: compact ? '36px' : '40px',
          borderRadius: '10px',
          ...buttonStyles,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ width: '18px', height: '18px' }}>
          <CurrentIcon />
        </div>
      </button>

      {/* Dropdown de opções */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '6px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 1000,
          minWidth: '140px',
          animation: 'fadeIn 0.15s ease'
        }}>
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = themeMode === option.id;

            return (
              <button
                key={option.id}
                onClick={() => {
                  setThemeMode(option.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '16px', height: '16px', opacity: isActive ? 1 : 0.7 }}>
                  <Icon />
                </div>
                <span>{option.label}</span>
                {isActive && (
                  <div style={{ marginLeft: 'auto', width: '14px', height: '14px' }}>
                    <Icons.Check />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
