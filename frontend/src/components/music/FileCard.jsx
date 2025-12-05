// ===== FILE CARD =====
// Card de partitura com navegacao por URL
// Memoizado para evitar re-renders desnecessarios

import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';

const FileCard = memo(({ sheet, category, onDownload, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { setSelectedSheet } = useUI();
  const [isPressed, setIsPressed] = useState(false);

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    // Abre o modal da partitura para escolher instrumento e baixar
    setSelectedSheet(sheet);
    // Atualiza a URL para ser compartilhavel
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  const handleCardClick = () => {
    setSelectedSheet(sheet);
    // Atualiza a URL para ser compartilhavel
    navigate(`/acervo/${sheet.category}/${sheet.id}`, { replace: true });
  };

  const handleMouseDown = (e) => {
    // Só aplica animação se clicar no card diretamente (não nos botões)
    if (e.target.closest('button')) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <div
      className="file-card"
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
        background: 'var(--bg-card)', borderRadius: 'var(--radius)',
        cursor: 'pointer', border: '1px solid var(--border)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: isPressed ? 'scale(0.98)' : 'none'
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: 'var(--radius-sm)',
        background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        position: 'relative'
      }}>
        <CategoryIcon categoryId={category?.id} size={24} color="#D4AF37" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '15px', fontWeight: '600', marginBottom: '3px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)'
        }}>{sheet.title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sheet.composer}</p>
      </div>
      <button
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        style={{
          width: '32px', height: '32px', borderRadius: '8px', background: isFavorite ? 'rgba(232,90,79,0.1)' : 'transparent',
          border: 'none', color: isFavorite ? 'var(--primary)' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          transition: 'color 0.15s ease, background 0.15s ease'
        }}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
      >
        <div style={{ width: '16px', height: '16px' }}><Icons.Heart filled={isFavorite} /></div>
      </button>
      <button
        aria-label={`Baixar partitura ${sheet.title}`}
        title="Baixar partitura"
        style={{
          width: '32px', height: '32px', borderRadius: '8px', background: 'transparent',
          border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onClick={handleDownloadClick}
      >
        <div style={{ width: '18px', height: '18px' }}><Icons.Download /></div>
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders
  return (
    prevProps.sheet.id === nextProps.sheet.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.category?.id === nextProps.category?.id
  );
});

FileCard.displayName = 'FileCard';

export default FileCard;
