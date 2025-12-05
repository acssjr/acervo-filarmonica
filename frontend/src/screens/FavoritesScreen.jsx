// ===== FAVORITES SCREEN =====
// Tela de favoritos

import { useMemo } from 'react';
import { useData } from '@contexts/DataContext';
import { CATEGORIES } from '@constants/categories';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import FileCard from '@components/music/FileCard';

const FavoritesScreen = () => {
  const { sheets, favorites, toggleFavorite } = useData();

  const favoriteSheets = useMemo(() => {
    return sheets.filter(s => favorites.includes(s.id));
  }, [sheets, favorites]);

  return (
    <div>
      <Header title="Favoritos" subtitle={`${favoriteSheets.length} partitura${favoriteSheets.length !== 1 ? 's' : ''}`} />

      {favoriteSheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.3 }}>
            <Icons.Heart />
          </div>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', marginBottom: '8px' }}>
            Nenhum favorito ainda
          </p>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', opacity: 0.7 }}>
            Toque no coracao para adicionar
          </p>
        </div>
      ) : (
        <div className="files-grid" style={{ padding: '0 20px' }}>
          {favoriteSheets.map(sheet => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={CATEGORIES.find(c => c.id === sheet.category)}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
