// ===== USE MEDIA QUERY HOOK =====
// Hook reativo para media queries CSS
// Substitui multiplos resize listeners espalhados pelo codigo

import { useState, useEffect } from 'react';

/**
 * Hook para media queries reativas
 * @param {string} query - Media query CSS (ex: '(max-width: 768px)')
 * @returns {boolean} - true se a query corresponde
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export const useMediaQuery = (query) => {
  // Inicializa com o valor atual (SSR-safe)
  const getMatches = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Atualiza estado inicial
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener para mudancas
    const listener = (event) => setMatches(event.matches);

    // Usa addEventListener (compativel com navegadores modernos)
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query, matches]);

  return matches;
};

export default useMediaQuery;
