// ===== SIDEBAR SECTION =====
// Secao colapsavel da sidebar com lista de itens

import SidebarListItem from './SidebarListItem';

const SidebarSection = ({
  title,
  items,
  selectedId,
  onItemClick,
  onHeaderClick,
  onViewAllClick,
  showCount = false
}) => {
  return (
    <div style={{
      marginBottom: '12px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '12px',
      padding: '12px'
    }}>
      {/* Header da secao */}
      <button
        onClick={onHeaderClick}
        aria-label={`Ver todos os ${title.toLowerCase()}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '4px 4px 8px 4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '10px',
            fontWeight: '600',
            color: 'rgba(244, 228, 188, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(244, 228, 188, 0.6)'}
        >
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(244, 228, 188, 0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Lista de itens */}
      <div>
        {items.map(item => (
          <SidebarListItem
            key={item.id || item.name}
            label={item.name}
            count={showCount ? item.count : undefined}
            isActive={selectedId === (item.id || item.name)}
            onClick={() => onItemClick(item)}
          />
        ))}

        {/* Botao Ver todos */}
        <button
          onClick={onViewAllClick}
          aria-label={`Ver todos os ${title.toLowerCase()}`}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: '#D4AF37',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Ver todos
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarSection;
