"use client";

import { useState, useEffect, useRef } from "react";
import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";

interface ThemeSelectorProps {
  inDarkHeader?: boolean;
  compact?: boolean;
  inline?: boolean;
}

const ThemeSelector = ({ inDarkHeader = false, compact = false, inline = false }: ThemeSelectorProps) => {
  const { themeMode, setThemeMode } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const options = [
    { id: 'light' as const, label: 'Claro', icon: Icons.Sun },
    { id: 'dark' as const, label: 'Escuro', icon: Icons.Moon },
    { id: 'system' as const, label: 'Sistema', icon: Icons.Monitor }
  ];

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(themeMode as 'light' | 'dark' | 'system');
    const nextIndex = (currentIndex + 1) % order.length;
    setThemeMode(order[nextIndex]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
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

  // Inline version (3 buttons side by side) for desktop header
  if (inline) {
    return (
      <div style={{
        display: 'flex', gap: '4px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px', padding: '4px',
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
              aria-label={`Tema ${option.label}`}
              aria-pressed={isActive}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px',
                background: isActive ? 'var(--primary)' : 'transparent',
                border: 'none', borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s ease'
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

  const currentOption = options.find(o => o.id === themeMode);
  const CurrentIcon = currentOption?.icon || Icons.Sun;

  const darkHeaderStyles = {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#F4E4BC'
  };

  const normalStyles = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)'
  };

  const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;

  const handleClick = () => {
    if (isMobile) {
      cycleTheme();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={selectorRef} style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        aria-label={`Tema atual: ${currentOption?.label}. Clique para alterar`}
        aria-haspopup={!isMobile}
        aria-expanded={isOpen}
        style={{
          width: compact ? '36px' : '40px',
          height: compact ? '36px' : '40px',
          borderRadius: '10px',
          ...buttonStyles,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease'
        }}
      >
        <div style={{ width: '18px', height: '18px' }}>
          <CurrentIcon />
        </div>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--bg-card)', borderRadius: '12px',
          border: '1px solid var(--border)', padding: '6px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          minWidth: '140px', zIndex: 50
        }}>
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = themeMode === option.id;
            return (
              <button
                key={option.id}
                onClick={() => { setThemeMode(option.id); setIsOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', width: '100%',
                  background: isActive ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none', borderRadius: '8px',
                  color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px', fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '16px', height: '16px' }}>
                  <Icon />
                </div>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
