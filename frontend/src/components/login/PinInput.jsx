// ===== PIN INPUT COMPONENT =====
// Componente reutilizavel para entrada de PIN de 4 digitos

import { useState } from 'react';
import PropTypes from 'prop-types';

const PinInput = ({
  pin,
  pinRefs,
  isLoading,
  onPinChange,
  onKeyDown,
  onFocus
}) => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleFocus = (e, index) => {
    setFocusedIndex(index);
    onFocus?.();
  };

  const handleBlur = (_e, _index) => {
    setFocusedIndex(null);
  };

  const getCircleStyle = (digit, index) => {
    const isFocused = focusedIndex === index;
    const isFilled = !!digit;

    if (isFilled) {
      return {
        background: 'rgba(212,175,55,0.18)',
        border: '1.5px solid rgba(212,175,55,0.5)',
        boxShadow: isFocused ? '0 0 0 3px rgba(212,175,55,0.15)' : 'none'
      };
    }

    if (isFocused) {
      return {
        background: 'rgba(0,0,0,0.22)',
        border: '1.5px solid rgba(212,175,55,0.7)',
        boxShadow: '0 0 0 3px rgba(212,175,55,0.15)'
      };
    }

    return {
      background: 'rgba(0,0,0,0.22)',
      border: '1.5px solid rgba(255,255,255,0.13)',
      boxShadow: 'none'
    };
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '12px',
        paddingLeft: '4px'
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(244,228,188,0.65)" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(244,228,188,0.65)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          PIN
        </span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px'
      }}>
        {pin.map((digit, index) => {
          const circleStyle = getCircleStyle(digit, index);
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...circleStyle,
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              {/* Ponto central dourado quando preenchido */}
              {digit && (
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.9)'
                }} />
              )}
              <input
                ref={pinRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => onPinChange(index, e.target.value)}
                onKeyDown={e => onKeyDown(index, e)}
                onFocus={e => handleFocus(e, index)}
                onBlur={e => handleBlur(e, index)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'transparent',
                  caretColor: 'transparent',
                  fontSize: '1px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

PinInput.propTypes = {
  pin: PropTypes.arrayOf(PropTypes.string).isRequired,
  pinRefs: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  onPinChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onFocus: PropTypes.func
};

export default PinInput;
