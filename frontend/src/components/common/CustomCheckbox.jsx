
const CustomCheckbox = ({ checked, onChange, accentColor = '#D4AF37', size = 22 }) => {
  return (
    <label
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: size * 0.27,
        border: `2px solid ${checked ? accentColor : 'var(--border)'}`,
        background: checked ? accentColor : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      />
      {checked && (
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 16 16"
          fill="none"
          style={{
            animation: 'checkIn 0.15s ease-out',
            pointerEvents: 'none'
          }}
        >
          <path
            d="M3 8.5L6.5 12L13 4"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <style>{`
        @keyframes checkIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </label>
  );
};

export default CustomCheckbox;
