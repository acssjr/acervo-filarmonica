// ===== MOBILE SEARCH OVERLAY =====
// Busca flutuante centralizada — animações puras com GSAP

import { useState, useRef, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useScrollLock } from '@hooks/useScrollLock';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';
import useDebounce from '@hooks/useDebounce';
import { levenshtein } from '@utils/search';
import { API } from '@services/api';

const WHITESPACE_REGEX = /\s+/;

const normalize = (str) =>
  str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[ºª°]/g, '').replace(/n[°º.]?\s*/gi, 'n')
    .replace(/\./g, ' ').replace(WHITESPACE_REGEX, ' ').trim();

const transliterate = (str) =>
  str.replace(/mph/g, 'nf').replace(/ph/g, 'f').replace(/th/g, 't')
    .replace(/y/g, 'i').replace(/ch(?=[aeiou])/g, 'c').replace(/rh/g, 'r')
    .replace(/ll/g, 'l').replace(/mm/g, 'm').replace(/nn/g, 'n')
    .replace(/pp/g, 'p').replace(/ss(?!$)/g, 's').replace(/tt/g, 't')
    .replace(/cc/g, 'c').replace(/ff/g, 'f').replace(/ct/g, 't')
    .replace(/pt/g, 't').replace(/mn/g, 'n').replace(/gn/g, 'n')
    .replace(/ão$/g, 'am').replace(/ção$/g, 'ssao');

const MobileSearchOverlay = () => {
  const { mobileSearchOpen, setMobileSearchOpen, theme } = useUI();
  const { sheets, categoriesMap, setActiveTab, setSearchQuery: setGlobalSearch } = useData();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null); // backdrop full-screen
  const cardRef = useRef(null);      // glass card
  const heightRef = useRef(null);    // última altura estável para transição
  const lastTrackedRef = useRef('');
  const debouncedQuery = useDebounce(query, 300);

  // Scroll lock (iOS Safari safe)
  useScrollLock(mobileSearchOpen);

  // ── Estado inicial oculto ────────────────────────────────────────────
  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    gsap.set(cardRef.current, { y: 20, scale: 0.97 });
  }, { scope: containerRef });

  // ── Animação de abertura / fechamento ────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    if (mobileSearchOpen) {
      setQuery('');
      heightRef.current = null;

      gsap.set(container, { pointerEvents: 'auto' });

      // Backdrop fade in
      gsap.to(container, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });

      // Card entra com spring suave — expo.out dá sensação de física
      gsap.fromTo(card,
        { autoAlpha: 0, y: 32, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.55, ease: 'expo.out',
          onComplete: () => {
            // Captura altura estável após entrada para transições futuras
            if (cardRef.current) heightRef.current = cardRef.current.scrollHeight;
            setTimeout(() => inputRef.current?.focus(), 40);
          },
        }
      );
    } else {
      // Sair: mais rápido que entrar (UX padrão)
      gsap.to(container, {
        autoAlpha: 0, duration: 0.22, ease: 'power2.in',
        onComplete: () => gsap.set(container, { pointerEvents: 'none' }),
      });
      gsap.to(card, {
        autoAlpha: 0, y: 14, scale: 0.97,
        duration: 0.2, ease: 'power2.in',
      });
    }
  }, [mobileSearchOpen]);

  // ── Transição suave de altura quando conteúdo muda ───────────────────
  // useLayoutEffect garante que o estado anterior é travado ANTES do browser pintar
  useLayoutEffect(() => {
    if (!cardRef.current || !mobileSearchOpen || heightRef.current === null) return;
    const card = cardRef.current;

    // Matar animação de altura em andamento, se houver
    gsap.killTweensOf(card, 'height');

    // Medir altura natural do novo conteúdo (com auto)
    card.style.height = 'auto';
    const naturalHeight = card.scrollHeight;
    const prevHeight = heightRef.current;

    if (Math.abs(prevHeight - naturalHeight) < 4) {
      // Diferença mínima — só atualiza ref
      heightRef.current = naturalHeight;
      return;
    }

    // Travar na altura anterior antes do browser pintar (evita salto)
    gsap.set(card, { height: prevHeight });

    // Animar para a nova altura
    gsap.to(card, {
      height: naturalHeight,
      duration: 0.42,
      ease: 'power3.inOut',
      onComplete: () => {
        if (!cardRef.current) return;
        gsap.set(cardRef.current, { clearProps: 'height' });
        heightRef.current = cardRef.current.scrollHeight;
      },
    });
  }, [debouncedQuery, mobileSearchOpen]);

  // ── Sugestões (3 em destaque, igual ao desktop) ──────────────────────
  const suggestions = useMemo(() => {
    const featured = sheets.filter(s => s.featured);
    const pool = featured.length >= 3 ? featured : [...featured, ...sheets.filter(s => !s.featured)];
    return pool.slice(0, 3);
  }, [sheets]);

  // ── Busca fuzzy (idêntica ao SearchScreen.jsx) ───────────────────────
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = normalize(debouncedQuery);
    const qT = transliterate(q);
    const qWords = q.split(WHITESPACE_REGEX).filter(w => w.length > 0);
    const qWordsT = qWords.map(w => transliterate(w));
    const results = [];

    for (const sheet of sheets) {
      const tN = normalize(sheet.title);
      const tT = transliterate(tN);
      const cN = normalize(sheet.composer);
      const cT = transliterate(cN);
      const cat = categoriesMap.get(sheet.category);
      const catN = normalize(cat?.name || '');

      let score = 0;
      if (tN.startsWith(q)) score += 100;
      else if (tN.includes(q)) score += 50;
      else if (tT.startsWith(qT)) score += 95;
      else if (tT.includes(qT)) score += 45;
      if (cN.startsWith(q)) score += 80;
      else if (cN.includes(q)) score += 40;
      else if (cT.startsWith(qT)) score += 75;
      else if (cT.includes(qT)) score += 35;
      if (catN.startsWith(q)) score += 60;
      else if (catN.includes(q)) score += 30;

      let allFound = true, wordSum = 0;
      for (let i = 0; i < qWords.length; i++) {
        const w = qWords[i], wT = qWordsT[i];
        if (w.length < 1) continue;
        let ws = 0, found = false;
        if (tN.includes(w)) { ws += 25; found = true; }
        else if (tT.includes(wT)) { ws += 22; found = true; }
        else if (cN.includes(w)) { ws += 20; found = true; }
        else if (cT.includes(wT)) { ws += 18; found = true; }
        else if (catN.includes(w)) { ws += 15; found = true; }
        if (!found) {
          for (const tw of `${tN} ${cN} ${catN}`.split(WHITESPACE_REGEX)) {
            if (levenshtein(w, tw) <= 1) { ws += 5; found = true; break; }
          }
        }
        if (!found) { allFound = false; break; }
        wordSum += ws;
      }
      if (!allFound) continue;
      score += wordSum;
      if (qWords.length > 1) score += 30;
      const tDist = levenshtein(q, tN.slice(0, q.length));
      const cDist = levenshtein(q, cN.slice(0, q.length));
      if (tDist <= 2) score += (20 - tDist * 5);
      if (cDist <= 2) score += (15 - cDist * 5);
      if (score > 0) results.push({ ...sheet, score, category: cat });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 8);
  }, [debouncedQuery, sheets, categoriesMap]);

  // ── Tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 3) return;
    if (lastTrackedRef.current === debouncedQuery.trim()) return;
    const timer = setTimeout(() => {
      lastTrackedRef.current = debouncedQuery.trim();
      API.trackSearch(debouncedQuery.trim(), searchResults.length).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [debouncedQuery, searchResults.length]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setMobileSearchOpen(false);
    setQuery('');
  }, [setMobileSearchOpen]);

  const handleSelectSheet = useCallback((sheet) => {
    const categoryId = typeof sheet.category === 'string'
      ? sheet.category
      : sheet.category?.slug || sheet.category?.id || '';

    handleClose();
    setGlobalSearch(sheet.title);
    setActiveTab('library');
    navigate(categoryId ? `/acervo/${encodeURIComponent(categoryId)}/${sheet.id}` : '/acervo');
  }, [handleClose, setGlobalSearch, setActiveTab, navigate]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleClose();
    setGlobalSearch(query.trim());
    setActiveTab('home');
    navigate('/buscar?q=' + encodeURIComponent(query.trim()));
  }, [query, handleClose, setGlobalSearch, setActiveTab, navigate]);

  // ── Estilos ───────────────────────────────────────────────────────────
  const goldColor = isDark ? '#D4AF37' : '#8B6914';
  const mutedColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const subColor = isDark ? 'rgba(255,255,255,0.52)' : 'rgba(0,0,0,0.55)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';

  const iconBoxStyle = {
    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
    background: isDark
      ? 'linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.07) 100%)'
      : 'linear-gradient(135deg, rgba(114,47,55,0.14) 0%, rgba(114,47,55,0.07) 100%)',
    border: `1px solid ${isDark ? 'rgba(212,175,55,0.22)' : 'rgba(114,47,55,0.22)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: isDark ? '#D4AF37' : '#722F37',
  };

  const cardStyle = {
    width: '100%', maxWidth: '440px',
    borderRadius: '24px',
    background: isDark
      ? 'linear-gradient(145deg, rgba(28,18,8,0.92) 0%, rgba(18,12,4,0.96) 100%)'
      : 'linear-gradient(145deg, rgba(255,253,248,0.96) 0%, rgba(248,243,232,0.98) 100%)',
    backdropFilter: 'blur(48px) saturate(200%)',
    WebkitBackdropFilter: 'blur(48px) saturate(200%)',
    border: isDark
      ? '1px solid rgba(212,175,55,0.18)'
      : '1px solid rgba(114,47,55,0.15)',
    boxShadow: isDark
      ? '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07)'
      : '0 32px 80px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,1)',
    overflow: 'hidden',
  };

  const SearchIcon = Icons.Search;
  const CloseIcon = Icons.Close;

  const renderItem = (sheet, i, cat) => {
    const categoryId = cat?.id ?? sheet.category;
    return (
    <button
      key={sheet.id}
      onClick={() => handleSelectSheet(sheet)}
      style={{
        width: '100%', background: 'none', border: 'none',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px',
        borderTop: i > 0 ? `1px solid ${dividerColor}` : 'none',
      }}
    >
      <div style={iconBoxStyle}>
        <CategoryIcon categoryId={categoryId} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '14px', fontWeight: '600', margin: '0 0 2px',
          color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {sheet.title}
        </p>
        <p style={{ fontSize: '12px', color: subColor, margin: 0 }}>
          {sheet.composer}{cat ? ` · ${cat.name}` : ''}
        </p>
      </div>
      <div style={{ width: '14px', height: '14px', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
        <Icons.ChevronRight />
      </div>
    </button>
  );
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    // Container full-screen — sempre no DOM, visibilidade controlada por GSAP (autoAlpha)
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 12px',
        background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15,8,3,0.38)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={handleClose}
    >
      {/* Card — clique não fecha */}
      <div
        ref={cardRef}
        style={cardStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 16px',
            borderBottom: `1px solid ${isDark ? 'rgba(212,175,55,0.1)' : 'rgba(114,47,55,0.1)'}`,
          }}>
            <div style={{ width: '20px', height: '20px', color: goldColor, flexShrink: 0 }}>
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar partituras, compositores..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '16px', fontWeight: '500',
                color: textColor, caretColor: goldColor,
              }}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  border: 'none', cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: mutedColor,
                }}
              >
                <div style={{ width: '13px', height: '13px' }}><CloseIcon /></div>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', color: goldColor,
                  padding: '4px 2px', flexShrink: 0,
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(75vh - 56px)' }}>
          {!debouncedQuery.trim() ? (
            <div style={{ padding: '6px 0 8px' }}>
              <p style={{
                fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                textTransform: 'uppercase', color: mutedColor,
                padding: '8px 16px 4px', margin: 0,
              }}>
                Sugestões
              </p>
              {suggestions.map((sheet, i) => renderItem(sheet, i, categoriesMap.get(sheet.category)))}
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ padding: '4px 0 8px' }}>
              <p style={{
                fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                textTransform: 'uppercase', color: mutedColor,
                padding: '8px 16px 4px', margin: 0,
              }}>
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map((sheet, i) => renderItem(sheet, i, sheet.category))}
            </div>
          ) : (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: mutedColor, margin: 0 }}>
                Nenhuma partitura para &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
