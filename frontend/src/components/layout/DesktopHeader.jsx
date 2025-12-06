// ===== DESKTOP HEADER =====
// Header para desktop com busca, data e notificações

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useNotifications } from '@contexts/NotificationContext';
import { Icons } from '@constants/icons';
import { CATEGORIES } from '@constants/categories';
import CategoryIcon from '@components/common/CategoryIcon';
import ThemeSelector from '@components/common/ThemeSelector';
import { getNextRehearsal } from '@hooks/useNextRehearsal';
import { levenshtein } from '@utils/search';

const DesktopHeader = () => {
  const navigate = useNavigate();
  const { setShowNotifications } = useUI();
  const { sheets, favorites, toggleFavorite, setSelectedCategory } = useData();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

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

        // Pontuação por diferentes critérios
        let score = 0;

        // Match exato no início (maior peso)
        if (titleLower.startsWith(query)) score += 100;
        else if (titleLower.includes(query)) score += 50;

        if (composerLower.startsWith(query)) score += 80;
        else if (composerLower.includes(query)) score += 40;

        if (categoryLower.startsWith(query)) score += 60;
        else if (categoryLower.includes(query)) score += 30;

        // Fuzzy match com Levenshtein
        const titleDist = levenshtein(query, titleLower.slice(0, query.length));
        const composerDist = levenshtein(query, composerLower.slice(0, query.length));

        if (titleDist <= 2) score += (20 - titleDist * 5);
        if (composerDist <= 2) score += (15 - composerDist * 5);

        return { ...sheet, score, category };
      })
      .filter(sheet => sheet.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [searchQuery, sheets]);

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
          minWidth: '200px'
        }}>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap'
          }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>

          {/* Contador do próximo ensaio */}
          {rehearsalInfo.isNow ? (
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
          <div className="search-bar" role="search" style={{ padding: '10px 16px' }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Buscar partituras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar partituras"
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
            aria-label={unreadCount > 0 ? `Notificacoes (${unreadCount} nao lidas)` : 'Notificacoes'}
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
                top: '6px',
                right: '6px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
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
                Nenhuma partitura encontrada para "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
