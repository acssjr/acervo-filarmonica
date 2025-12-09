// ===== LIBRARY SCREEN =====
// Tela de biblioteca com categorias e partituras
// Suporta navegacao via URL: /acervo, /acervo/:categoria, /acervo/:categoria/:partituraId
// Categorias carregadas da API via DataContext

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import { useUI } from '@contexts/UIContext';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import IconButton from '@components/common/IconButton';
import EmptyState from '@components/common/EmptyState';
import CategoryCard from '@components/music/CategoryCard';
import FileCard from '@components/music/FileCard';

const LibraryScreen = ({ categoryFromUrl, sheetIdFromUrl }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    sheets,
    categories, categoriesMap,
    selectedCategory, setSelectedCategory,
    selectedComposer, setSelectedComposer,
    favorites, toggleFavorite
  } = useData();
  const { setSelectedSheet } = useUI();

  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sincroniza categoria da URL com o estado
  useEffect(() => {
    if (categoryFromUrl) {
      // Busca categoria pelo ID (O(1) via Map)
      const cat = categoriesMap.get(categoryFromUrl);
      if (cat) {
        setSelectedCategory(cat.id);
        setSelectedComposer(null);
      }
    }
  }, [categoryFromUrl, categoriesMap, setSelectedCategory, setSelectedComposer]);

  // Abre modal da partitura se vier ID na URL
  useEffect(() => {
    if (sheetIdFromUrl && sheets.length > 0) {
      const sheet = sheets.find(s => s.id === parseInt(sheetIdFromUrl) || s.id === sheetIdFromUrl);
      if (sheet) {
        setSelectedSheet(sheet);
      }
    }
  }, [sheetIdFromUrl, sheets, setSelectedSheet]);

  const filteredSheets = useMemo(() => {
    let result = sheets;
    if (selectedCategory) {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (selectedComposer) {
      result = result.filter(s => s.composer === selectedComposer);
    }
    return result;
  }, [sheets, selectedCategory, selectedComposer]);

  const currentCategory = categoriesMap.get(selectedCategory);
  const getCategoryCount = (catId) => sheets.filter(s => s.category === catId).length;

  const handleBack = () => {
    if (selectedComposer) {
      setSelectedComposer(null);
      navigate('/compositores');
    } else if (selectedCategory) {
      setSelectedCategory(null);
      navigate('/generos');
    }
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setSelectedComposer(null);
    navigate(`/acervo/${catId}`);
  };

  const getTitle = () => {
    if (selectedComposer) return selectedComposer;
    if (currentCategory) return currentCategory.name;
    return "Acervo";
  };

  const getSubtitle = () => {
    if (selectedComposer || selectedCategory) return `${filteredSheets.length} partituras`;
    return "Todas as categorias";
  };

  return (
    <div>
      <Header
        title={getTitle()}
        subtitle={getSubtitle()}
        showBack={!!(selectedCategory || selectedComposer)}
        onBack={handleBack}
        actions={user?.isAdmin && (
          <IconButton icon={Icons.Plus} primary onClick={() => setShowUploadModal(true)} />
        )}
      />

      {!selectedCategory && !selectedComposer ? (
        <div style={{ padding: '0 20px' }}>
          <div className="categories-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '12px',
            width: '100%'
          }}>
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                count={getCategoryCount(cat.id)}
                index={i}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        </div>
      ) : filteredSheets.length === 0 ? (
        <EmptyState icon={Icons.Folder} title="Nenhuma partitura encontrada" />
      ) : (
        <div className="files-grid" style={{ padding: '0 20px' }}>
          {filteredSheets.map(sheet => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={currentCategory}
              isFavorite={favorites.includes(sheet.id)}
              onToggleFavorite={() => toggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryScreen;
