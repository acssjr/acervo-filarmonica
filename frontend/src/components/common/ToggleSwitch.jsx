const SIZES = {
  sm: { track: { w: 36, h: 20 }, thumb: 16 },
  md: { track: { w: 44, h: 24 }, thumb: 20 },
};

const ToggleSwitch = ({ checked, onChange, color = '#D4AF37', size = 'md' }) => {
  const { track, thumb } = SIZES[size] || SIZES.md;
  const pad = (track.h - thumb) / 2;

  return (
    <label style={{ display: 'inline-flex', cursor: 'pointer', flexShrink: 0 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div style={{
        width: track.w,
        height: track.h,
        borderRadius: track.h / 2,
        background: checked ? color : 'var(--border)',
        position: 'relative',
        transition: 'background 0.2s ease',
      }}>
        <div style={{
          position: 'absolute',
          top: pad,
          left: checked ? track.w - thumb - pad : pad,
          width: thumb,
          height: thumb,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </label>
  );
};

export default ToggleSwitch;
