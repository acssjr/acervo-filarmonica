// ===== DESKTOP HEADER =====
// Header premium para desktop: busca glass, countdown pill, acoes liquid glass

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useAuth } from '@contexts/AuthContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import { useBellAnimation } from '@hooks/useBellAnimation';
import CategoryIcon from '@components/common/CategoryIcon';
import MusicianCountdown from '@components/common/MusicianCountdown';
import ThemePill from '@components/common/ThemePill';
import { levenshtein } from '@utils/search';

// Normalizacao e transliteracao
const normalize = (str) =>
  str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[ºª°]/g, '').replace(/n[°º.]?\s*/gi, 'n')
    .replace(/\./g, ' ').replace(/\s+/g, ' ').trim();

const transliterate = (str) =>
  str.replace(/mph/g, 'nf').replace(/ph/g, 'f').replace(/th/g, 't')
    .replace(/y/g, 'i').replace(/ch(?=[aeiou])/g, 'c').replace(/rh/g, 'r')
    .replace(/ll/g, 'l').replace(/mm/g, 'm').replace(/nn/g, 'n')
    .replace(/pp/g, 'p').replace(/ss(?!$)/g, 's').replace(/tt/g, 't')
    .replace(/cc/g, 'c').replace(/ff/g, 'f');

// Countdown helpers
// ThemePill importado de @components/common/ThemePill

// GlassActionBtn
const GlassActionBtn = ({ onClick, label, children, badge, isDark, childRef }) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      width: '44px', height: '44px',
      borderRadius: '14px',
      background: isDark
        ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
        : 'linear-gradient(145deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)',
      backdropFilter: 'blur(20px) saturate(200%)',
      WebkitBackdropFilter: 'blur(20px) saturate(200%)',
      border: isDark
        ? '1px solid rgba(255,255,255,0.12)'
        : '1px solid rgba(255,255,255,0.9)',
      boxShadow: isDark
        ? '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(0,0,0,0.05)',
      color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      transition: 'all 0.2s ease',
    }}
  >
    <div ref={childRef} style={{ width: '18px', height: '18px' }}>{children}</div>
    {badge > 0 && (
      <div style={{
        position: 'absolute', top: '-5px', right: '-5px',
        minWidth: '18px', height: '18px', padding: '0 4px',
        borderRadius: '9px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#fff', fontSize: '10px', fontWeight: '700',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(239,68,68,0.5)',
        border: '1.5px solid rgba(255,255,255,0.2)',
      }}>
        {badge > 99 ? '99+' : badge}
      </div>
    )}
  </button>
);

// AdminGlassBtn
const AdminGlassBtn = ({ isDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isInAdmin = location.pathname.startsWith('/admin');

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    document.body.classList.add('admin-transition-out');
    setTimeout(() => {
      navigate(isInAdmin ? '/' : '/admin');
      document.body.classList.remove('admin-transition-out');
      document.body.classList.add('admin-transition-in');
      setTimeout(() => {
        document.body.classList.remove('admin-transition-in');
        setIsTransitioning(false);
      }, 200);
    }, 150);
  }, [isInAdmin, isTransitioning, navigate]);

  if (!user?.isAdmin) return null;

  const isGold = isInAdmin;

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      title={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      aria-label={isInAdmin ? 'Voltar ao Acervo' : 'Ir para Admin'}
      style={{
        width: '44px', height: '44px',
        borderRadius: '14px',
        background: isGold
          ? 'linear-gradient(145deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.1) 100%)'
          : isDark
            ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)',
        backdropFilter: 'blur(20px) saturate(200%)',
        WebkitBackdropFilter: 'blur(20px) saturate(200%)',
        border: isGold
          ? '1px solid rgba(212,175,55,0.45)'
          : isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)',
        boxShadow: isGold
          ? '0 4px 16px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
          : isDark
            ? '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        color: isGold ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)',
        cursor: isTransitioning ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        width: '18px', height: '18px',
        transition: 'transform 0.3s ease',
        transform: isInAdmin ? 'rotate(45deg)' : 'rotate(0deg)',
      }}>
        <Icons.Key />
      </div>
    </button>
  );
};

// Sugestoes dinamicas calculadas dentro do componente via useMemo

// Main Component
const DesktopHeader = () => {
  const navigate = useNavigate();
  const { setShowNotifications, theme } = useUI();
  const { sheets, favoritesSet, toggleFavorite, categoriesMap, diasEnsaio, modoRecesso, repertorioAtivo } = useData();
  const { unreadCount } = useNotifications();
  const isDark = theme === 'dark';
  const bellRef = useRef(null);
  useBellAnimation(bellRef, unreadCount > 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Sugestoes dinamicas: pecas em destaque (em estudo), max 3
  const searchSuggestions = useMemo(() => {
    const featured = sheets.filter(s => s.featured);
    const pool = featured.length >= 3 ? featured : [...featured, ...sheets.filter(s => !s.featured)];
    return pool.slice(0, 3);
  }, [sheets]);

  // Busca fuzzy - logica identica a versao original
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = normalize(searchQuery);
    const queryTranslit = transliterate(query);
    const queryWords = query.split(/\s+/).filter(w => w.length > 0);
    const queryWordsTranslit = queryWords.map(w => transliterate(w));

    return sheets.map(sheet => {
      const titleNorm = normalize(sheet.title);
      const titleTranslit = transliterate(titleNorm);
      const composerNorm = normalize(sheet.composer);
      const composerTranslit = transliterate(composerNorm);
      const category = categoriesMap.get(sheet.category);
      const categoryNorm = normalize(category?.name || '');
      let score = 0;

      if (titleNorm.startsWith(query)) score += 100;
      else if (titleNorm.includes(query)) score += 50;
      else if (titleTranslit.startsWith(queryTranslit)) score += 95;
      else if (titleTranslit.includes(queryTranslit)) score += 45;
      if (composerNorm.startsWith(query)) score += 80;
      else if (composerNorm.includes(query)) score += 40;
      else if (composerTranslit.startsWith(queryTranslit)) score += 75;
      else if (composerTranslit.includes(queryTranslit)) score += 35;
      if (categoryNorm.startsWith(query)) score += 60;
      else if (categoryNorm.includes(query)) score += 30;

      const searchText = `${titleNorm} ${composerNorm} ${categoryNorm}`;
      const wordMatches = queryWords.map((word, idx) => {
        if (word.length < 1) return { found: true, score: 0 };
        const wordTranslit = queryWordsTranslit[idx];
        let wordScore = 0; let found = false;
        if (titleNorm.includes(word)) { wordScore += 25; found = true; }
        else if (titleTranslit.includes(wordTranslit)) { wordScore += 22; found = true; }
        else if (composerNorm.includes(word)) { wordScore += 20; found = true; }
        else if (composerTranslit.includes(wordTranslit)) { wordScore += 18; found = true; }
        else if (categoryNorm.includes(word)) { wordScore += 15; found = true; }
        if (!found) {
          for (const tw of searchText.split(/\s+/)) {
            if (levenshtein(word, tw) <= 1) { wordScore += 5; found = true; break; }
          }
        }
        return { found, score: wordScore };
      });

      if (!wordMatches.every(m => m.found)) return { ...sheet, score: 0, category };
      wordMatches.forEach(m => { score += m.score; });
      if (queryWords.length > 1) score += 30;
      return { ...sheet, score, category };
    })
      .filter(sheet => sheet.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [searchQuery, sheets, categoriesMap]);

  // Controla exibicao dos resultados
  useEffect(() => {
    if (searchQuery.trim()) setShowResults(true);
    else {
      const t = setTimeout(() => setShowResults(false), 200);
      return () => clearTimeout(t);
    }
  }, [searchQuery]);

  // Fecha suggestions ao clicar fora
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const showSuggestions = searchFocused && !searchQuery.trim();

  return (
    <header style={{
      display: 'flex', flexDirection: 'column', gap: '16px',
      marginBottom: '24px', paddingBottom: '16px',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    }}>
      {/* Linha principal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Countdown pill (esquerda) */}
        <div style={{ flexShrink: 0 }}>
          <MusicianCountdown
            diasEnsaio={diasEnsaio}
            repertorioAtivo={repertorioAtivo}
            modoRecesso={modoRecesso}
            isDark={isDark}
            variant="desktop"
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Barra de busca premium */}
        <div ref={searchRef} style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
          <div
            data-walkthrough="search"
            role="search"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0 16px',
              height: '46px',
              borderRadius: '14px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(114,47,55,0.2) 0%, rgba(25,6,6,0.35) 100%)'
                : 'linear-gradient(135deg, rgba(114,47,55,0.06) 0%, rgba(212,175,55,0.04) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: searchFocused
                ? `1px solid ${isDark ? 'rgba(212,175,55,0.45)' : 'rgba(114,47,55,0.35)'}`
                : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: searchFocused
                ? isDark
                  ? '0 0 0 3px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.25)'
                  : '0 0 0 3px rgba(114,47,55,0.06), 0 4px 20px rgba(0,0,0,0.08)'
                : isDark
                  ? '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Icone de busca */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={isDark ? 'rgba(212,175,55,0.6)' : 'rgba(114,47,55,0.45)'}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Buscar partituras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              aria-label="Buscar partituras"
              autoComplete="off"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', fontWeight: '500',
                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,26,0.85)',
                caretColor: isDark ? '#D4AF37' : '#722F37',
              }}
            />

            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); }}
                aria-label="Limpar busca"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.45)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Sugestoes - aparece quando focado e vazio */}
          {showSuggestions && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 200,
              background: isDark
                ? 'linear-gradient(145deg, rgba(30,10,10,0.92) 0%, rgba(20,6,6,0.96) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,245,240,0.98) 100%)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: `1px solid ${isDark ? 'rgba(212,175,55,0.15)' : 'rgba(114,47,55,0.1)'}`,
              borderRadius: '14px',
              padding: '10px',
              boxShadow: isDark
                ? '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 16px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
              animation: 'fadeIn 0.15s ease',
            }}>
              <p style={{
                fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: isDark ? 'rgba(212,175,55,0.45)' : 'rgba(114,47,55,0.45)',
                padding: '4px 8px 8px', margin: 0,
              }}>
                Em estudo
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {searchSuggestions.map((sheet) => {
                  const cat = categoriesMap.get(sheet.category);
                  return (
                    <button
                      key={sheet.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigate(`/acervo/${sheet.category}/${sheet.id}`);
                        setSearchFocused(false);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '9px 10px', borderRadius: '10px', border: 'none',
                        background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark
                          ? 'rgba(212,175,55,0.07)'
                          : 'rgba(114,47,55,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                        background: isDark
                          ? 'linear-gradient(145deg, rgba(114,47,55,0.3), rgba(61,16,17,0.5))'
                          : 'linear-gradient(145deg, rgba(114,47,55,0.08), rgba(212,175,55,0.06))',
                        border: `1px solid ${isDark ? 'rgba(212,175,55,0.15)' : 'rgba(114,47,55,0.12)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CategoryIcon categoryId={sheet.category} size={16} color="#D4AF37" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '13px', fontWeight: '600', margin: 0,
                          color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(26,26,26,0.88)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {sheet.title}
                        </p>
                        <p style={{
                          fontSize: '11px', margin: 0, marginTop: '1px',
                          color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {sheet.composer}{cat ? ` · ${cat.name}` : ''}
                        </p>
                      </div>
                      <svg style={{ flexShrink: 0, opacity: 0.3 }}
                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Espacador */}
        <div style={{ flex: 1 }} />

        {/* Acoes premium */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ThemePill />

          <GlassActionBtn
            onClick={() => setShowNotifications(true)}
            label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações'}
            badge={unreadCount}
            isDark={isDark}
            childRef={bellRef}
          >
            <Icons.Bell />
          </GlassActionBtn>

          <AdminGlassBtn isDark={isDark} />
        </div>
      </div>

      {/* Resultados da busca */}
      <div style={{
        overflow: 'hidden', transition: 'all 0.3s ease',
        maxHeight: showResults && searchResults.length > 0 ? '420px' : '0',
        opacity: showResults && searchResults.length > 0 ? 1 : 0,
        marginTop: showResults && searchResults.length > 0 ? '0' : '-16px',
      }}>
        <div style={{
          background: isDark
            ? 'linear-gradient(145deg, rgba(20,6,6,0.9) 0%, rgba(10,3,3,0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,245,240,0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          padding: '16px',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.08)',
        }}>
          <p style={{
            fontSize: '11px', color: isDark ? 'rgba(212,175,55,0.5)' : 'rgba(114,47,55,0.5)',
            marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px',
            fontWeight: '700',
          }}>
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {searchResults.map((sheet, index) => (
              <div
                key={sheet.id}
                onClick={() => {
                  navigate(`/acervo/${sheet.category.id}/${sheet.id}`);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px',
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '12px', cursor: 'pointer',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                  transition: 'all 0.2s ease',
                  animation: `fadeSlideIn 0.3s ease ${index * 0.05}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.background = isDark ? 'rgba(212,175,55,0.06)' : 'rgba(114,47,55,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(114,47,55,0.3) 0%, rgba(61,16,17,0.5) 100%)'
                    : 'linear-gradient(145deg, rgba(114,47,55,0.1) 0%, rgba(212,175,55,0.08) 100%)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CategoryIcon categoryId={sheet.category.id} size={20} color="#D4AF37" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '14px', fontWeight: '600',
                    color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,26,0.9)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    margin: 0,
                  }}>
                    {sheet.title}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                    margin: 0,
                  }}>
                    {sheet.composer} • {sheet.category.name}
                  </p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(sheet.id); }}
                  aria-label={favoritesSet.has(sheet.id) ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`}
                  style={{
                    background: favoritesSet.has(sheet.id) ? 'rgba(232,90,79,0.12)' : 'transparent',
                    border: 'none', borderRadius: '8px', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: favoritesSet.has(sheet.id) ? 'var(--primary)' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ width: '16px', height: '16px' }}>
                    <Icons.Heart filled={favoritesSet.has(sheet.id)} />
                  </div>
                </button>
              </div>
            ))}
          </div>

          {searchQuery && searchResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
              <p style={{ fontSize: '14px' }}>
                Nenhuma partitura encontrada para &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;

