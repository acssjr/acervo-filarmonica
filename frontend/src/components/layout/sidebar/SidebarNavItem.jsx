// ===== SIDEBAR NAV ITEM =====
// Item de navegacao da sidebar

const SidebarNavItem = ({ icon: Icon, label, isActive, collapsed, onClick }) => {
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
        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease',
        marginBottom: '2px'
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
