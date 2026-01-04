// ===== DESKTOP HEADER =====
// Header para desktop com busca, data e notificações

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import CategoryIcon from '@components/common/CategoryIcon';
import ThemeSelector from '@components/common/ThemeSelector';
import AdminToggle from '@components/common/AdminToggle';
import { getNextRehearsal } from '@hooks/useNextRehearsal';
import { levenshtein } from '@utils/search';
import { API } from '@services/api';

// Normaliza texto para busca (estilo YouTube)
const normalize = (str) => {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[ºª°]/g, '') // Remove indicadores ordinais
    .replace(/n[°º.]?\s*/gi, 'n') // "nº ", "n° " → "n"
    .replace(/\./g, ' ') // Pontos viram espaços
    .replace(/\s+/g, ' ') // Colapsa espaços múltiplos
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
    .replace(/ff/g, 'f');     // affecto -> afeto
};

const DesktopHeader = () => {
  const navigate = useNavigate();
  const { setShowNotifications } = useUI();
  const { sheets, favorites, toggleFavorite, categoriesMap } = useData();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [modoRecesso, setModoRecesso] = useState(false);

  useEffect(() => {
    API.getModoRecesso().then(res => setModoRecesso(res.ativo));
  }, []);

  // Busca fuzzy nos sheets com transliteracao - TODAS as palavras devem ser encontradas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = normalize(searchQuery);
    const queryTranslit = transliterate(query);
    const queryWords = query.split(/\s+/).filter(w => w.length > 0);
    const queryWordsTranslit = queryWords.map(w => transliterate(w));

    return sheets
      .map(sheet => {
        const titleNorm = normalize(sheet.title);
        const titleTranslit = transliterate(titleNorm);
        const composerNorm = normalize(sheet.composer);
        const composerTranslit = transliterate(composerNorm);
        const category = categoriesMap.get(sheet.category);
        const categoryNorm = normalize(category?.name || '');

        let score = 0;

        // Match pela query completa (maior peso)
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

        // Busca por palavras individuais - TODAS devem ser encontradas
        const searchText = `${titleNorm} ${composerNorm} ${categoryNorm}`;
        const wordMatches = queryWords.map((word, idx) => {
          if (word.length < 1) return { found: true, score: 0 };
          const wordTranslit = queryWordsTranslit[idx];
          let wordScore = 0;
          let found = false;

          if (titleNorm.includes(word)) {
            wordScore += 25;
            found = true;
          } else if (titleTranslit.includes(wordTranslit)) {
            wordScore += 22;
            found = true;
          } else if (composerNorm.includes(word)) {
            wordScore += 20;
            found = true;
          } else if (composerTranslit.includes(wordTranslit)) {
            wordScore += 18;
            found = true;
          } else if (categoryNorm.includes(word)) {
            wordScore += 15;
            found = true;
          }

          // Fuzzy match se não encontrou
          if (!found) {
            for (const tw of searchText.split(/\s+/)) {
              if (levenshtein(word, tw) <= 1) {
                wordScore += 5;
                found = true;
                break;
              }
            }
          }

          return { found, score: wordScore };
        });

        // TODAS as palavras devem ser encontradas
        if (!wordMatches.every(m => m.found)) {
          return { ...sheet, score: 0, category };
        }

        wordMatches.forEach(m => { score += m.score; });
        if (queryWords.length > 1) score += 30;

        return { ...sheet, score, category };
      })
      .filter(sheet => sheet.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [searchQuery, sheets, categoriesMap]);

  // Controla exibição dos resultados com delay para animação
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowResults(true);
    } else {
      const timeout = setTimeout(() => setShowResults(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery]);

  // Usa a função global getNextRehearsal
  const rehearsalInfo = getNextRehearsal();

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--border)'
    }}>
      {/* Linha superior: data/ensaio + busca + ícones */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Data e próximo ensaio */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '200px',
          alignItems: 'flex-start'
        }}>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap'
          }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>

          {/* Contador do próximo ensaio ou badge de recesso */}
          {modoRecesso ? (
            <div style={{
              background: '#D4AF37',
              color: '#3D1518',
              fontSize: '10px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '700',
              padding: '5px 10px',
              borderRadius: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}>
              EM RECESSO
            </div>
          ) : rehearsalInfo.isNow ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22C55E',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '700',
                color: '#22C55E'
              }}>
                Ensaio agora!
              </span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-muted)'
              }}>
                Próximo ensaio:
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212, 175, 55, 0.15)',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                {rehearsalInfo.days > 0 && (
                  <span style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#D4AF37'
                  }}>
                    {rehearsalInfo.days}d
                  </span>
                )}
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#D4AF37'
                }}>
                  {rehearsalInfo.hours}h{rehearsalInfo.minutes > 0 ? ` ${rehearsalInfo.minutes}m` : ''}
                </span>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontWeight: '500'
                }}>
                  ({rehearsalInfo.dayName})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Espaçador flexível */}
        <div style={{ flex: 1 }} />

        {/* Barra de busca centralizada */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative'
        }}>
          <div data-walkthrough="search" className="search-bar" role="search" style={{ padding: '10px 16px' }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar partituras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar partituras"
              autoComplete="off"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')} aria-label="Limpar busca">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Espaçador flexível */}
        <div style={{ flex: 1 }} />

        {/* Ícones */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Seletor de tema inline */}
          <ThemeSelector inline />

          {/* Sininho de notificações */}
          <button
            onClick={() => setShowNotifications(true)}
            aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>
              <Icons.Bell />
            </div>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                padding: '0 5px',
                borderRadius: '9px',
                background: '#E74C3C',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: 'Outfit, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>

          {/* Toggle Admin (só para admins) - à direita das notificações */}
          <AdminToggle />
        </div>
      </div>

      {/* Resultados da busca */}
      <div style={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxHeight: showResults && searchResults.length > 0 ? '400px' : '0',
        opacity: showResults && searchResults.length > 0 ? 1 : 0,
        marginTop: showResults && searchResults.length > 0 ? '0' : '-20px'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {searchResults.map((sheet, index) => (
              <div
                key={sheet.id}
                onClick={() => {
                  navigate(`/acervo/${sheet.category.id}/${sheet.id}`);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: `fadeSlideIn 0.3s ease ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CategoryIcon categoryId={sheet.category.id} size={20} color="#D4AF37" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sheet.title}
                  </p>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {sheet.composer} • {sheet.category.name}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(sheet.id);
                  }}
                  aria-label={favorites.includes(sheet.id) ? `Remover ${sheet.title} dos favoritos` : `Adicionar ${sheet.title} aos favoritos`}
                  style={{
                    background: favorites.includes(sheet.id) ? 'rgba(232,90,79,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: favorites.includes(sheet.id) ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '16px', height: '16px' }}>
                    <Icons.Heart filled={favorites.includes(sheet.id)} />
                  </div>
                </button>
              </div>
            ))}
          </div>

          {searchQuery && searchResults.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: 'var(--text-muted)'
            }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px' }}>
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
