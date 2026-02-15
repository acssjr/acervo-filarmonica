"use client";

interface SidebarListItemProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

const SidebarListItem = ({ label, count, isActive, onClick }: SidebarListItemProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', paddingLeft: '14px', background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent', border: 'none', borderRadius: '8px', color: isActive ? '#D4AF37' : 'rgba(244, 228, 188, 0.85)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: count !== undefined ? '14px' : '13px', fontWeight: '500', transition: 'all 0.2s ease', marginBottom: '2px', position: 'relative', textAlign: 'left' }}
      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; e.currentTarget.style.color = '#F4E4BC'; } const bar = e.currentTarget.querySelector('.sidebar-bar') as HTMLElement; if (bar) bar.style.height = isActive ? '24px' : '16px'; }}
      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(244, 228, 188, 0.85)'; } const bar = e.currentTarget.querySelector('.sidebar-bar') as HTMLElement; if (bar) bar.style.height = isActive ? '24px' : '0px'; }}
    >
      <div className="sidebar-bar" style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '3px', height: isActive ? '24px' : '0px', background: '#D4AF37', borderRadius: '2px', transition: 'height 0.2s ease' }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: '11px', opacity: 0.5 }}>{count}</span>}
    </button>
  );
};

export default SidebarListItem;
