// ===== SEARCH SCREEN =====
// Tela de busca com fuzzy search

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@contexts/DataContext';
import { CATEGORIES_MAP } from '@constants/categories';
import { Icons } from '@constants/icons';
import Header from '@components/common/Header';
import CategoryIcon from '@components/common/CategoryIcon';
import useDebounce from '@hooks/useDebounce';
import { levenshtein } from '@utils/search';

const SearchScreen = () => {
  const navigate = useNavigate();
  const { sheets, favorites, toggleFavorite } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce de 300ms para evitar re-renders excessivos
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Normaliza texto removendo acentos
  const normalize = (str) => {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Transliteracoes de grafias antigas/alternativas para modernas
  // Permite que "ninfas" encontre "nymphas", "filosofia" encontre "philosophia", etc.
  const transliterate = (str) => {
    return str
      // Grafias gregas/latinas antigas (ordem importa!)
      .replace(/mph/g, 'nf')    // nymphas -> ninfas (nasal antes de ph)
      .replace(/ph/g, 'f')      // philosophia -> filosofia
      .replace(/th/g, 't')      // theatro -> teatro
      .replace(/y/g, 'i')       // nymphas -> ninfas, lyra -> lira
      .replace(/ch(?=[aeiou])/g, 'c')  // chronica -> cronica (antes de vogal)
      .replace(/rh/g, 'r')      // rhetorica -> retorica
      // Duplicacoes antigas
      .replace(/ll/g, 'l')      // belleza -> beleza
      .replace(/mm/g, 'm')      // commando -> comando
      .replace(/nn/g, 'n')      // anno -> ano
      .replace(/pp/g, 'p')      // appello -> apelo
      .replace(/ss(?!$)/g, 's') // passo -> paso (exceto final)
      .replace(/tt/g, 't')      // attender -> atender
      .replace(/cc/g, 'c')      // accento -> acento
      .replace(/ff/g, 'f')      // affecto -> afeto
      // Outras variacoes
      .replace(/ct/g, 't')      // facto -> fato
      .replace(/pt/g, 't')      // optimo -> otimo
      .replace(/mn/g, 'n')      // hymno -> hino
      .replace(/gn/g, 'n')      // signal -> sinal
      // Terminacoes
      .replace(/ão$/g, 'am')    // coração pode ser buscado como coracam
      .replace(/ção$/g, 'ssao');// nacao -> nassao (variante)
  };

  // Busca fuzzy nos sheets - agora com busca por palavras individuais e transliteracao
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const query = normalize(debouncedQuery);
    const queryTranslit = transliterate(query); // "ninfas" fica "ninfas"
    const queryWords = query.split(/\s+/).filter(w => w.length > 0);
    const queryWordsTranslit = queryWords.map(w => transliterate(w));

    return sheets
      .map(sheet => {
        const titleNorm = normalize(sheet.title);
        const titleTranslit = transliterate(titleNorm); // "nymphas" -> "ninfas"
        const composerNorm = normalize(sheet.composer);
        const composerTranslit = transliterate(composerNorm);
        const category = CATEGORIES_MAP.get(sheet.category);
        const categoryNorm = normalize(category?.name || '');

        let score = 0;

        // Busca pela query completa (normal e transliterada)
        if (titleNorm.startsWith(query)) score += 100;
        else if (titleNorm.includes(query)) score += 50;
        else if (titleTranslit.startsWith(queryTranslit)) score += 95; // Match transliterado
        else if (titleTranslit.includes(queryTranslit)) score += 45;

        if (composerNorm.startsWith(query)) score += 80;
        else if (composerNorm.includes(query)) score += 40;
        else if (composerTranslit.startsWith(queryTranslit)) score += 75;
        else if (composerTranslit.includes(queryTranslit)) score += 35;

        if (categoryNorm.startsWith(query)) score += 60;
        else if (categoryNorm.includes(query)) score += 30;

        // Busca por palavras individuais (para queries como "ninfas amor")
        let matchedWords = 0;
        queryWords.forEach((word, idx) => {
          if (word.length < 2) return;
          const wordTranslit = queryWordsTranslit[idx];

          // Match normal
          if (titleNorm.includes(word)) {
            score += 25;
            matchedWords++;
          } else if (titleTranslit.includes(wordTranslit)) {
            // Match transliterado (ninfas encontra nymphas)
            score += 22;
            matchedWords++;
          }

          if (composerNorm.includes(word)) {
            score += 20;
            matchedWords++;
          } else if (composerTranslit.includes(wordTranslit)) {
            score += 18;
            matchedWords++;
          }

          if (categoryNorm.includes(word)) {
            score += 15;
            matchedWords++;
          }

          // Fuzzy match por palavra (normal e transliterado)
          const titleWords = titleNorm.split(/\s+/);
          const titleWordsTranslit = titleTranslit.split(/\s+/);

          titleWords.forEach((tw, twIdx) => {
            const dist = levenshtein(word, tw);
            if (dist <= 2 && dist > 0) {
              score += (10 - dist * 3);
            }
            // Fuzzy na versao transliterada
            if (titleWordsTranslit[twIdx]) {
              const distTranslit = levenshtein(wordTranslit, titleWordsTranslit[twIdx]);
              if (distTranslit <= 2 && distTranslit > 0) {
                score += (8 - distTranslit * 2);
              }
            }
          });
        });

        // Bonus se todas as palavras foram encontradas
        if (queryWords.length > 1 && matchedWords >= queryWords.length) {
          score += 30;
        }

        // Fuzzy match para query completa
        const titleDist = levenshtein(query, titleNorm.slice(0, query.length));
        const composerDist = levenshtein(query, composerNorm.slice(0, query.length));

        if (titleDist <= 2) score += (20 - titleDist * 5);
        if (composerDist <= 2) score += (15 - composerDist * 5);

        return { ...sheet, score, category };
      })
      .filter(sheet => sheet.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [debouncedQuery, sheets]);

  const handleClear = useCallback(() => setSearchQuery(''), []);

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
            autoComplete="off"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '15px',
              color: 'var(--text-primary)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={handleClear}
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
