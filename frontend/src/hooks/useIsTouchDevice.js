// ===== USE IS TOUCH DEVICE HOOK =====
// Detecta se o dispositivo suporta touch
// Util para ajustar interacoes (hover vs tap)

import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivos touch
 * @returns {boolean} - true se o dispositivo suporta touch
 *
 * @example
 * const isTouch = useIsTouchDevice();
 * const hoverStyle = isTouch ? {} : { ':hover': { background: '#ccc' } };
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detecta touch de varias formas para maior compatibilidade
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - msMaxTouchPoints existe em navegadores antigos
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouch(checkTouch());

    // Listener para mudancas (ex: tablet com teclado conectado)
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (e) => setIsTouch(e.matches || checkTouch());

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isTouch;
};

export default useIsTouchDevice;
