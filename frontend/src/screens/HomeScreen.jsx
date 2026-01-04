// ===== HOME SCREEN =====
// Tela inicial com destaques, categorias e atividade recente

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import { useIsMobile } from '@hooks/useResponsive';
import { API } from '@services/api';
// import { formatTimeAgo, getAtividadeInfo } from '@utils/formatters';
import HomeHeader from '@components/common/HomeHeader';
import HeaderActions from '@components/common/HeaderActions';
import FeaturedSheets from '@components/music/FeaturedSheets';
import CategoryCard from '@components/music/CategoryCard';
import FileCard from '@components/music/FileCard';
import ComposerCarousel from '@components/music/ComposerCarousel';
import PresenceStats from '@components/stats/PresenceStats';
import { PROFILE_ABOUT_CONFIG } from '@components/modals/AboutModal/changelog/profileChangelog';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sheets, favorites, toggleFavorite, categories, categoriesMap } = useData();
  const isMobile = useIsMobile();
  const [_atividades, setAtividades] = useState([]);

  // Memoiza contagem por categoria (evita O(n) * categorias em cada render)
  const categoryCounts = useMemo(() => {
    const counts = {};
    sheets.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [sheets]);

  const getCategoryCount = (catId) => categoryCounts[catId] || 0;

  // Gêneros principais para exibição na home
  const mainGenres = useMemo(() => {
    const mainIds = ['dobrados', 'marchas', 'arranjos', 'fantasias'];
    return categories.filter(cat => mainIds.includes(cat.id));
  }, [categories]);

  // Memoiza total de downloads
  const _totalDownloads = useMemo(() =>
    sheets.reduce((acc, s) => acc + (s.downloads || 0), 0),
  [sheets]);

  const recentSheets = useMemo(() => [...sheets].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 6), [sheets]);

  // Compositores mais populares (top 6 por quantidade de partituras)
  const topComposers = useMemo(() => {
    const composerCounts = {};
    sheets.forEach(s => {
      if (s.composer && s.composer.trim()) {
        composerCounts[s.composer] = (composerCounts[s.composer] || 0) + 1;
      }
    });
    return Object.entries(composerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [sheets]);

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

  return (
    <div style={{ width: '100%', overflow: 'visible' }}>
      <HomeHeader
        userName={user?.name || 'Visitante'}
        instrument={user?.instrument || 'Músico'}
        actions={<HeaderActions />}
      />

      <div style={{ paddingTop: '8px', overflow: 'visible' }}>
        <FeaturedSheets sheets={sheets} favorites={favorites} onToggleFavorite={toggleFavorite} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Gêneros Musicais</h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/generos')}>Ver Todos</button>
      </div>

      <div data-walkthrough="categories" style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div className="categories-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '12px',
          width: '100%'
        }}>
          {mainGenres.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} count={getCategoryCount(cat.id)} index={i}
              onClick={() => navigate(`/acervo/${cat.id}`)} />
          ))}
        </div>
      </div>

      {/* Secao de Compositores - Carrossel apenas no mobile */}
      {isMobile && <ComposerCarousel composers={topComposers} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '12px' }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: '18px', fontWeight: '700' }}>Partituras Populares</h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          onClick={() => navigate('/acervo')}>Ver Todas</button>
      </div>

      <div className="sheets-grid" style={{ padding: '0 20px' }}>
        {recentSheets.map((sheet, index) => (
          <FileCard
            key={sheet.id}
            sheet={sheet}
            category={categoriesMap.get(sheet.category)}
            isFavorite={favorites.includes(sheet.id)}
            onToggleFavorite={() => toggleFavorite(sheet.id)}
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
