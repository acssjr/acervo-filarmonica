// ===== FAVORITES SCREEN =====
// Tela de favoritos
// Categorias carregadas da API via DataContext

import { useMemo } from 'react';
import { useData } from '@contexts/DataContext';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import EmptyState from '@components/common/EmptyState';
import FileCard from '@components/music/FileCard';

const FavoritesScreen = () => {
  const { sheets, favorites, toggleFavorite, categoriesMap } = useData();

  const favoriteSheets = useMemo(() => {
    return sheets.filter(s => favorites.includes(s.id));
  }, [sheets, favorites]);

  return (
    <div>
      <Header title="Favoritos" subtitle={`${favoriteSheets.length} partitura${favoriteSheets.length !== 1 ? 's' : ''}`} />

      {favoriteSheets.length === 0 ? (
        <EmptyState
          icon={Icons.Heart}
          title="Nenhum favorito ainda"
          subtitle="Toque no coracao para adicionar"
        />
      ) : (
        <div className="files-grid" style={{
          padding: '0 20px',
          contentVisibility: 'auto',
          containIntrinsicSize: '0 2000px'
        }}>
          {favoriteSheets.map(sheet => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={categoriesMap.get(sheet.category)}
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
