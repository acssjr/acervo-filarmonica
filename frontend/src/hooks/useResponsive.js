// ===== USE RESPONSIVE HOOK =====
// Hook com breakpoints prontos para uso
// Usa os breakpoints definidos em constants/config.js

import { useMediaQuery } from './useMediaQuery';
import { BREAKPOINTS } from '@constants/config';

/**
 * Hook com breakpoints prontos
 * @returns {{ isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 *
 * @example
 * const { isMobile, isDesktop } = useResponsive();
 * if (isMobile) return <MobileLayout />;
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);

  return { isMobile, isTablet, isDesktop };
};

/**
 * Hook simplificado - apenas isMobile
 * @returns {boolean}
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
};

/**
 * Hook simplificado - apenas isDesktop
 * @returns {boolean}
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
};

export default useResponsive;
