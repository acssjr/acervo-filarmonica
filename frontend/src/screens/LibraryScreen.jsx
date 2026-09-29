// ===== LIBRARY SCREEN =====
// Tela de biblioteca com categorias e partituras
// Suporta navegacao via URL: /acervo, /acervo/:categoria, /acervo/:categoria/:partituraId
// Categorias carregadas da API via DataContext
// Otimizado: usa Set para O(1) lookups de favoritos

import { useMemo, useEffect, useCallback, useState } from 'react';
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
    favoritesSet, toggleFavorite
  } = useData();
  const { setSelectedSheet } = useUI();
  const [audioTab, setAudioTab] = useState(false);
  const [audioQuery, setAudioQuery] = useState('');

  const audioSheets = useMemo(() => sheets.filter(sheet => {
    if (!sheet.hasAudio && !sheet.youtubeUrl) return false;
    const query = audioQuery.trim().toLocaleLowerCase('pt-BR');
    return !query || `${sheet.title} ${sheet.composer}`.toLocaleLowerCase('pt-BR').includes(query);
  }), [sheets, audioQuery]);

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

  // Memoiza contagem por categoria (evita O(n) a cada render)
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    for (const sheet of sheets) {
      const catId = sheet.category;
      counts.set(catId, (counts.get(catId) || 0) + 1);
    }
    return counts;
  }, [sheets]);

  const getCategoryCount = useCallback((categoryId) => {
    return categoryCounts.get(categoryId) || 0;
  }, [categoryCounts]);

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

  // Callback estável para toggle
  const handleToggleFavorite = useCallback((id) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const getTitle = () => {
    if (selectedComposer) return selectedComposer;
    if (currentCategory) return currentCategory.name;
    return "Acervo";
  };

  const getSubtitle = () => {
    if (selectedComposer || selectedCategory) return `${filteredSheets.length} partituras`;
    return audioTab ? `${audioSheets.length} ${audioSheets.length === 1 ? 'música' : 'músicas'} com áudio ou link` : "Todas as categorias";
  };

  return (
    <div>
      <Header
        title={getTitle()}
        subtitle={getSubtitle()}
        showBack={!!(selectedCategory || selectedComposer)}
        onBack={handleBack}
        actions={user?.isAdmin ? (
          <IconButton icon={Icons.Plus} primary onClick={() => navigate('/admin/partituras')} />
        ) : null}
      />

      {!selectedCategory && !selectedComposer && (
        <div role="tablist" aria-label="Seções do acervo" style={{ display: 'flex', gap: 18, margin: '0 20px 18px', borderBottom: '1px solid var(--border)' }}>
          <button type="button" role="tab" aria-selected={!audioTab} onClick={() => setAudioTab(false)} style={{ minHeight: 44, border: 0, borderBottom: !audioTab ? '3px solid var(--accent)' : '3px solid transparent', background: 'none', color: !audioTab ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Partituras</button>
          <button type="button" role="tab" aria-selected={audioTab} onClick={() => setAudioTab(true)} style={{ minHeight: 44, border: 0, borderBottom: audioTab ? '3px solid var(--accent)' : '3px solid transparent', background: 'none', color: audioTab ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Áudios das músicas</button>
        </div>
      )}

      {!selectedCategory && !selectedComposer && audioTab ? (
        <div style={{ padding: '0 20px 24px' }} role="tabpanel" aria-label="Áudios das músicas">
          <label htmlFor="audio-sheet-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)' }}>Buscar música ou compositor</label>
          <input id="audio-sheet-search" type="search" value={audioQuery} onChange={event => setAudioQuery(event.target.value)} placeholder="Buscar música ou compositor" style={{ width: '100%', minHeight: 44, marginBottom: 14, padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13 }} />
          {audioSheets.length === 0 ? <EmptyState icon={Icons.Folder} title="Nenhuma música com áudio encontrada" /> : (
            <div style={{ display: 'grid', gap: 9 }}>
              {audioSheets.map(sheet => (
                <button key={sheet.id} type="button" onClick={() => setSelectedSheet(sheet)} aria-label={`Abrir partitura ${sheet.title}`} style={{ width: '100%', minHeight: 64, display: 'flex', alignItems: 'center', gap: 12, padding: 11, textAlign: 'left', border: '1px solid var(--border)', borderRadius: 13, background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <span aria-hidden="true" style={{ width: 40, height: 40, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 10, background: '#3d1517', color: '#d4af37', fontSize: 21 }}>♫</span>
                  <span style={{ flex: 1, minWidth: 0 }}><strong style={{ display: 'block', fontSize: 13 }}>{sheet.title}</strong><small style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)' }}>{sheet.composer}</small></span>
                  <span style={{ flexShrink: 0, color: '#722f37', fontSize: 11, fontWeight: 700 }}>{sheet.hasAudio ? 'Ouvir' : 'Link YouTube'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : !selectedCategory && !selectedComposer ? (
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
        <div className="files-grid" style={{
          padding: '0 20px',
          contentVisibility: 'auto',
          containIntrinsicSize: '0 2000px'
        }}>
          {filteredSheets.map(sheet => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={currentCategory}
              isFavorite={favoritesSet.has(sheet.id)} // O(1) lookup
              onToggleFavorite={() => handleToggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryScreen;
