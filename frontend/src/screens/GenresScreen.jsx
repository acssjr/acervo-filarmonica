// ===== GENRES SCREEN =====
// Tela de todos os generos musicais

import { useNavigate } from 'react-router-dom';
import { useData } from '@contexts/DataContext';
import { CATEGORIES } from '@constants/categories';
import Header from '@components/common/Header';
import CategoryCard from '@components/music/CategoryCard';

const GenresScreen = () => {
  const navigate = useNavigate();
  const { sheets, setSelectedCategory } = useData();

  const getCategoryCount = (catId) => sheets.filter(s => s.category === catId).length;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(null);
    navigate(`/acervo/${categoryId}`);
  };

  return (
    <div>
      <Header title="Gêneros" subtitle={`${CATEGORIES.length} gêneros musicais`} />

      <div style={{ padding: '0 20px' }}>
        <div className="categories-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '12px',
          width: '100%'
        }}>
          {CATEGORIES.map((cat, i) => (
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
    </div>
  );
};

export default GenresScreen;
