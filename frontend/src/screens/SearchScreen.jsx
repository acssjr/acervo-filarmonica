// ===== SEARCH SCREEN =====
// Tela de busca com fuzzy search

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@contexts/DataContext';
import { CATEGORIES } from '@constants/categories';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import CategoryIcon from '@components/common/CategoryIcon';
import { levenshtein } from '@utils/search';

const SearchScreen = () => {
  const navigate = useNavigate();
  const { sheets, favorites, toggleFavorite, setSelectedCategory } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Busca fuzzy nos sheets
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();

    return sheets
      .map(sheet => {
        const titleLower = sheet.title.toLowerCase();
        const composerLower = sheet.composer.toLowerCase();
        const category = CATEGORIES.find(c => c.id === sheet.category);
        const categoryLower = category?.name.toLowerCase() || '';

        let score = 0;

        if (titleLower.startsWith(query)) score += 100;
        else if (titleLower.includes(query)) score += 50;

        if (composerLower.startsWith(query)) score += 80;
        else if (composerLower.includes(query)) score += 40;

        if (categoryLower.startsWith(query)) score += 60;
        else if (categoryLower.includes(query)) score += 30;

        const titleDist = levenshtein(query, titleLower.slice(0, query.length));
        const composerDist = levenshtein(query, composerLower.slice(0, query.length));

        if (titleDist <= 2) score += (20 - titleDist * 5);
        if (composerDist <= 2) score += (15 - composerDist * 5);

        return { ...sheet, score, category };
      })
      .filter(sheet => sheet.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery, sheets]);

  return (
    <div style={{ width: '100%' }}>
      <Header title="Buscar" subtitle="Encontre partituras" />

      {/* Barra de busca */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '14px 18px',
          transition: 'all 0.2s ease',
          boxShadow: searchQuery ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
        }}>
          <div style={{ width: '20px', height: '20px', color: 'var(--text-muted)', flexShrink: 0 }}>
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Título, compositor ou gênero..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '15px',
              color: 'var(--text-primary)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Estado vazio */}
      {searchQuery.trim() === '' && (
        <div style={{
          textAlign: 'center',
          padding: '40px 40px',
          color: 'var(--text-muted)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            opacity: 0.2,
            color: 'var(--primary)'
          }}>
            <Icons.Search />
          </div>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', marginBottom: '8px' }}>
            Digite para buscar
          </p>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', opacity: 0.7 }}>
            Busque por título, compositor ou gênero
          </p>
        </div>
      )}

      {/* Sem resultados */}
      {searchQuery.trim() !== '' && searchResults.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px' }}>
            Nenhum resultado para "<strong>{searchQuery}</strong>"
          </p>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', opacity: 0.7, marginTop: '8px' }}>
            Tente outro termo de busca
          </p>
        </div>
      )}

      {/* Resultados */}
      {searchResults.length > 0 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <p style={{
            padding: '0 20px 12px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
          </p>

          <div style={{ padding: '0 20px' }}>
            {searchResults.map((sheet, index) => (
              <div
                key={sheet.id}
                onClick={() => {
                  navigate(`/acervo/${sheet.category.id}/${sheet.id}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                  animation: `fadeSlideIn 0.3s ease ${index * 0.03}s both`
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CategoryIcon categoryId={sheet.category.id} size={22} color="#D4AF37" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sheet.title}
                  </p>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    {sheet.composer} • <span style={{ color: '#D4AF37' }}>{sheet.category.name}</span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(sheet.id);
                  }}
                  style={{
                    background: favorites.includes(sheet.id) ? 'rgba(232,90,79,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: favorites.includes(sheet.id) ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <div style={{ width: '18px', height: '18px' }}>
                    <Icons.Heart filled={favorites.includes(sheet.id)} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
