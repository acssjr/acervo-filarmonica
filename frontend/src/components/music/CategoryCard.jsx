// ===== CATEGORY CARD =====
// Card de categoria/gênero musical

import { useUI } from '@contexts/UIContext';
import CategoryIcon from '@components/common/CategoryIcon';

const CategoryCard = ({ category, count, onClick, index }) => {
  const { theme } = useUI();

  return (
    <div className={`card-hover animate-in stagger-${index + 1}`} style={{
      background: theme === 'dark' ? 'rgba(58, 58, 74, 0.5)' : 'rgba(244, 228, 188, 0.15)',
      borderRadius: 'var(--radius)', padding: '14px', cursor: 'pointer',
      position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px',
      border: '1px solid rgba(212, 175, 55, 0.15)'
    }} onClick={onClick}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <CategoryIcon categoryId={category.id} size={20} color="#D4AF37" />
      </div>
      <div style={{ minWidth: 0 }}>
        <h3 style={{
          fontFamily: "Outfit, sans-serif", fontSize: '14px', fontWeight: '600',
          color: 'var(--text-primary)', marginBottom: '1px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{category.name}</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{count} partitura{count !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
