// ===== FAVORITES SCREEN =====
// Tela de favoritos
// Categorias carregadas da API via DataContext
// Otimizado: usa Set para O(1) lookups

import { useMemo, useCallback } from 'react';
import { useData } from '@contexts/DataContext';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import EmptyState from '@components/common/EmptyState';
import FileCard from '@components/music/FileCard';



const FavoritesScreen = () => {
  const { sheets, favoritesSet, toggleFavorite, categoriesMap } = useData();

  // Otimizado: usa Set.has() O(1) em vez de array.includes() O(n)
  const favoriteSheets = useMemo(() => {
    return sheets.filter(s => favoritesSet.has(s.id));
  }, [sheets, favoritesSet]);

  // Callback estável para toggle
  const handleToggleFavorite = useCallback((id) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

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
              onToggleFavorite={() => handleToggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
