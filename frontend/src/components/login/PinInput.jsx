// ===== PIN INPUT COMPONENT =====
// Componente reutilizavel para entrada de PIN de 4 digitos

import PropTypes from 'prop-types';

const PinInput = ({
  pin,
  pinRefs,
  isLoading,
  onPinChange,
  onKeyDown,
  onFocus
}) => {
  const handleFocus = (e, index) => {
    e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
    onFocus?.();
  };

  const handleBlur = (e, digit) => {
    if (!digit) {
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      e.target.style.background = 'rgba(255, 255, 255, 0.06)';
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
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
            ref={pinRefs[index]}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => onPinChange(index, e.target.value)}
            onKeyDown={e => onKeyDown(index, e)}
            disabled={isLoading}
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
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              flexShrink: 0,
              flexGrow: 0
            }}
            onFocus={e => handleFocus(e, index)}
            onBlur={e => handleBlur(e, digit)}
          />
        ))}
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
