"use client";

import { useMediaQuery } from "./useMediaQuery";
import { BREAKPOINTS } from "@constants/config";

export const useResponsive = () => {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);

  return { isMobile, isTablet, isDesktop };
};

export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
};

export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
};

export default useResponsive;
