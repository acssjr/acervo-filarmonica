// ===== HOME SCREEN =====
// Tela inicial com destaques, categorias e atividade recente
// Otimizado: iterações combinadas, memoização de componentes

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import { API } from '@services/api';
import HomeHeader from '@components/common/HomeHeader';
import HeaderActions from '@components/common/HeaderActions';
import FeaturedSheets from '@components/music/FeaturedSheets';
import CategoryCard from '@components/music/CategoryCard';
import FileCard from '@components/music/FileCard';
import ComposerCarousel from '@components/music/ComposerCarousel';
import RecentRehearsals from '@components/stats/RecentRehearsals';
import AvisoModal from '@components/modals/AvisoModal';
import { PROFILE_ABOUT_CONFIG } from '@components/modals/AboutModal/changelog/profileChangelog';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sheets, favoritesSet, toggleFavorite, categories, categoriesMap } = useData();
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

    // Partituras ordenadas por downloads (top 3)
    const recentSheets = [...sheets]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 3);

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

  // Memoiza as partituras favoritas
  const favoriteSheets = useMemo(() => {
    return sheets.filter(s => favoritesSet.has(s.id));
  }, [sheets, favoritesSet]);

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

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '0 20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.2px', textTransform: 'uppercase' }}>Gêneros Musicais</h2>
        <button className="glass-pill-btn" onClick={() => navigate('/generos')}>
          Ver Todos
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div data-walkthrough="categories" style={{ padding: '0 20px', marginBottom: '0' }}>
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

      {/* Secao de Compositores */}
      <div style={{ margin: '24px 0' }}>
        <ComposerCarousel composers={topComposers} />
      </div>

      {/* Seção de Favoritos na Home */}
      <div data-walkthrough="home-favorites">
        <div style={{ padding: '0 20px', marginTop: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.2px', textTransform: 'uppercase' }}>
              Minhas Favoritas
            </h2>
            <button className="glass-pill-btn" onClick={() => navigate('/favoritos')}>
              Ver Todas
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          {favoriteSheets.length === 0 ? (
            <div style={{
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px dashed rgba(255,255,255,0.1)',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
                Nenhuma partitura favoritada ainda
              </p>
              <button
                onClick={() => navigate('/acervo')}
                style={{
                  background: 'none', border: 'none',
                  color: '#D4AF37', fontSize: '12px', fontWeight: '700',
                  cursor: 'pointer', padding: '4px 8px'
                }}
              >
                Explorar Acervo
              </button>
            </div>
          ) : (
            <div className="sheets-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {favoriteSheets.slice(0, 3).map((sheet, index) => (
                <FileCard
                  key={sheet.id}
                  sheet={sheet}
                  category={categoriesMap.get(sheet.category)}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(sheet.id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: '24px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.2px', textTransform: 'uppercase' }}>Partituras Populares</h2>
      </div>

      <div className="sheets-grid" style={{ padding: '0 20px' }}>
        {recentSheets.map((sheet, index) => (
          <FileCard
            key={sheet.id}
            sheet={sheet}
            category={categoriesMap.get(sheet.category)}
            isFavorite={favoritesSet.has(sheet.id)}
            onToggleFavorite={() => handleToggleFavorite(sheet.id)}
            index={index}
            showStats
          />
        ))}
      </div>

      {/* Seção de Ensaios Recentes */}
      <div style={{ padding: '24px 20px 32px' }}>
        <RecentRehearsals />
      </div>

      {/* Footer informativo */}
      <div style={{
        padding: '24px 20px 120px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        margin: '0 20px'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Filarmônica 25 de Março
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', opacity: 0.7 }}>
          Acervo Digital de Partituras • Versão {PROFILE_ABOUT_CONFIG.infoCards[0].value}
        </p>
      </div>

    </div>
  );
};

export default HomeScreen;
