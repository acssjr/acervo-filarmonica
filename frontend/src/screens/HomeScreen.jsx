// ===== HOME SCREEN =====
// Tela inicial com destaques, categorias e atividade recente
// Otimizado: iterações combinadas, memoização de componentes

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import { useIsMobile } from '@hooks/useResponsive';
import { API } from '@services/api';
import HomeHeader from '@components/common/HomeHeader';
import HeaderActions from '@components/common/HeaderActions';
import FeaturedSheets from '@components/music/FeaturedSheets';
import CategoryCard from '@components/music/CategoryCard';
import FileCard from '@components/music/FileCard';
import ComposerCarousel from '@components/music/ComposerCarousel';
import PresenceStats from '@components/stats/PresenceStats';
import AvisoModal from '@components/modals/AvisoModal';
import { PROFILE_ABOUT_CONFIG } from '@components/modals/AboutModal/changelog/profileChangelog';

// MemoFileCard - evita re-renders desnecessários
const MemoFileCard = memo(FileCard, (prev, next) => {
  return prev.sheet.id === next.sheet.id &&
         prev.isFavorite === next.isFavorite &&
         prev.category?.id === next.category?.id;
});

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sheets, favoritesSet, toggleFavorite, categories, categoriesMap } = useData();
  const isMobile = useIsMobile();
  const [_atividades, setAtividades] = useState([]);

  // Otimizado: uma única iteração calcula tudo
  const homeData = useMemo(() => {
    const categoryCounts = {};
    const composerCounts = {};
    
    // Single pass: conta categorias e compositores
    sheets.forEach(s => {
      // Contagem por categoria
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      
      // Contagem por compositor
      if (s.composer && s.composer.trim()) {
        composerCounts[s.composer] = (composerCounts[s.composer] || 0) + 1;
      }
    });

    // Partituras ordenadas por downloads (top 6)
    const recentSheets = [...sheets]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 6);

    // Compositores mais populares (top 6)
    const topComposers = Object.entries(composerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return { categoryCounts, recentSheets, topComposers };
  }, [sheets]);

  const { categoryCounts, recentSheets, topComposers } = homeData;
  const getCategoryCount = (catId) => categoryCounts[catId] || 0;

  // Gêneros principais para exibição na home
  const mainGenres = useMemo(() => {
    const desiredIds = ['dobrados', 'marchas', 'arranjos', 'fantasias'];
    const filtered = desiredIds
      .map(id => categories.find(cat => cat.id === id))
      .filter(Boolean);

    // Se não encontrou as categorias esperadas, usa fallback
    if (filtered.length === 0 && categories.length > 0) {
      return categories.slice(0, 4);
    }

    return filtered;
  }, [categories]);

  // Memoiza total de downloads (só calculado quando necessário)
  const _totalDownloads = useMemo(() =>
    sheets.reduce((acc, s) => acc + (s.downloads || 0), 0),
    [sheets]
  );

  // Carrega atividades da API somente se usuario estiver autenticado
  useEffect(() => {
    if (!user) return;

    const loadAtividades = async () => {
      try {
        const data = await API.getMinhasAtividades();
        setAtividades(data || []);
      } catch {
        // Silencioso - atividades nao sao criticas
      }
    };
    loadAtividades();
  }, [user]);

  // Callback estável para toggle de favorito
  const handleToggleFavorite = useCallback((id) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  return (
    <div style={{ width: '100%', overflow: 'visible' }}>
      <AvisoModal />
      <HomeHeader
        userName={user?.name || 'Visitante'}
        instrument={user?.instrument || 'Músico'}
        actions={<HeaderActions />}
      />

      <div style={{ paddingTop: '8px', overflow: 'visible' }}>
        <FeaturedSheets 
          sheets={sheets} 
          favoritesSet={favoritesSet}
          onToggleFavorite={handleToggleFavorite} 
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Gêneros Musicais</h2>
        <button 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/generos')}
        >
          Ver Todos
        </button>
      </div>

      <div data-walkthrough="categories" style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div className="categories-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '12px',
          width: '100%'
        }}>
          {mainGenres.map((cat, i) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              count={getCategoryCount(cat.id)} 
              index={i}
              onClick={() => navigate(`/acervo/${cat.id}`)} 
            />
          ))}
        </div>
      </div>

      {/* Secao de Compositores - Carrossel apenas no mobile */}
      {isMobile ? <ComposerCarousel composers={topComposers} /> : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '12px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Partituras Populares</h2>
        <button 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/acervo')}
        >
          Ver Todas
        </button>
      </div>

      <div className="sheets-grid" style={{ padding: '0 20px' }}>
        {recentSheets.map((sheet, index) => (
          <MemoFileCard
            key={sheet.id}
            sheet={sheet}
            category={categoriesMap.get(sheet.category)}
            isFavorite={favoritesSet.has(sheet.id)} // O(1) lookup
            onToggleFavorite={handleToggleFavorite}
            index={index}
          />
        ))}
      </div>

      {/* Seção de Presença */}
      <div style={{ padding: '32px 20px' }}>
        <PresenceStats />
      </div>

      {/* Footer informativo */}
      <div style={{
        padding: '24px 20px 120px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        margin: '0 20px'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
          Filarmônica 25 de Março
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', opacity: 0.7 }}>
          Acervo Digital de Partituras • Versão {PROFILE_ABOUT_CONFIG.infoCards[0].value}
        </p>
      </div>

    </div>
  );
};

export default HomeScreen;
