// ===== ICON BUTTON =====
// Botão com ícone reutilizável

const IconButton = ({ icon: Icon, onClick, primary, style }) => (
  <button className="btn-hover" style={{
    width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
    background: primary ? 'var(--primary)' : 'var(--bg-card)',
    border: primary ? 'none' : '1px solid var(--border)',
    color: primary ? '#fff' : 'var(--text-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...style
  }} onClick={onClick}>
    <div style={{ width: '20px', height: '20px' }}><Icon /></div>
  </button>
);

export default IconButton;
