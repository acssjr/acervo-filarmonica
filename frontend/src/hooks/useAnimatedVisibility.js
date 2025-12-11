// ===== USE ANIMATED VISIBILITY =====
// Hook para gerenciar animações de entrada e saída de componentes
// Permite que o componente execute animação de saída antes de desmontar

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para controlar visibilidade com animações de entrada/saída
 * @param {boolean} isVisible - Estado de visibilidade desejado
 * @param {number} duration - Duração da animação de saída em ms (default: 200)
 * @returns {Object} { shouldRender, isAnimating, animationState }
 */
const useAnimatedVisibility = (isVisible, duration = 200) => {
  // shouldRender controla se o componente está no DOM
  const [shouldRender, setShouldRender] = useState(isVisible);
  // animationState: 'entering' | 'visible' | 'exiting' | 'hidden'
  const [animationState, setAnimationState] = useState(isVisible ? 'visible' : 'hidden');

  useEffect(() => {
    if (isVisible) {
      // Entrando: renderiza imediatamente e inicia animação
      setShouldRender(true);
      // Pequeno delay para garantir que o DOM atualizou
      requestAnimationFrame(() => {
        setAnimationState('entering');
        // Após a animação de entrada, marca como visível
        setTimeout(() => setAnimationState('visible'), duration);
      });
    } else if (shouldRender) {
      // Saindo: inicia animação de saída
      setAnimationState('exiting');
      // Aguarda animação terminar antes de desmontar
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimationState('hidden');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, shouldRender]);

  return {
    shouldRender,
    animationState,
    isEntering: animationState === 'entering',
    isExiting: animationState === 'exiting',
    isVisible: animationState === 'visible' || animationState === 'entering'
  };
};

export default useAnimatedVisibility;
