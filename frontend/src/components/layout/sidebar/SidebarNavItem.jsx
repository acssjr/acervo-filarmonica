// ===== SIDEBAR NAV ITEM =====
// Item de navegacao da sidebar

const SidebarNavItem = ({ icon: Icon, label, isActive, collapsed, onClick, danger = false }) => {
  // Cores para item de perigo (logout)
  const dangerColor = 'rgba(239, 68, 68, 0.8)';
  const dangerHoverColor = 'rgba(239, 68, 68, 1)';

  return (
    <button
      onClick={onClick}
      title={collapsed ? label : ''}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '12px',
        padding: collapsed ? '11px' : '11px 12px',
        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
        border: 'none',
        borderRadius: '10px',
        color: danger ? dangerColor : (isActive ? '#fff' : 'rgba(255,255,255,0.7)'),
        cursor: 'pointer',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease',
        marginBottom: '2px'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }
        if (danger) {
          e.currentTarget.style.color = dangerHoverColor;
        } else if (!isActive) {
          e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
        }
        if (danger) {
          e.currentTarget.style.color = dangerColor;
        } else if (!isActive) {
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }
      }}
    >
      <div style={{ width: '18px', height: '18px', flexShrink: 0 }}>
        <Icon filled={isActive} />
      </div>
      {!collapsed && label}
    </button>
  );
};

export default SidebarNavItem;
