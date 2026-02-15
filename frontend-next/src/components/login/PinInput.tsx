"use client";

// ===== PIN INPUT COMPONENT =====
// Componente reutilizavel para entrada de PIN de 4 digitos

import { type RefObject } from "react";

interface PinInputProps {
  pin: string[];
  pinRefs: RefObject<(HTMLInputElement | null)[]>;
  isLoading?: boolean;
  onPinChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  disabled?: boolean;
}

const PinInput = ({
  pin,
  pinRefs,
  isLoading,
  onPinChange,
  onKeyDown,
  onFocus,
  disabled,
}: PinInputProps) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
    onFocus?.();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, digit: string) => {
    if (!digit) {
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      e.target.style.background = 'rgba(255, 255, 255, 0.06)';
    }
  };

  return (
    <div style={{ marginBottom: '20px', opacity: disabled ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
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
            ref={(el) => {
              if (pinRefs.current) pinRefs.current[index] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => onPinChange(index, e.target.value)}
            onKeyDown={e => onKeyDown(index, e)}
            disabled={isLoading || disabled}
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
              textAlign: 'center' as const,
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box' as const,
              flexShrink: 0,
              flexGrow: 0
            }}
            onFocus={e => handleFocus(e)}
            onBlur={e => handleBlur(e, digit)}
          />
        ))}
      </div>
    </div>
  );
};

export default PinInput;
