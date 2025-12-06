// ===== USE RESPONSIVE TESTS =====
// Testes unitarios para o hook de responsividade

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useResponsive, useIsMobile, useIsDesktop } from './useResponsive';

describe('useResponsive', () => {
  const createMockMatchMedia = (matchesMap) => {
    return jest.fn().mockImplementation((query) => ({
      matches: matchesMap[query] || false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  };

  describe('useResponsive()', () => {
    it('retorna isMobile=true em telas pequenas', () => {
      window.matchMedia = createMockMatchMedia({
        '(max-width: 767px)': true,
        '(min-width: 768px) and (max-width: 1023px)': false,
        '(min-width: 1024px)': false
      });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    it('retorna isTablet=true em telas medias', () => {
      window.matchMedia = createMockMatchMedia({
        '(max-width: 767px)': false,
        '(min-width: 768px) and (max-width: 1023px)': true,
        '(min-width: 1024px)': false
      });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it('retorna isDesktop=true em telas grandes', () => {
      window.matchMedia = createMockMatchMedia({
        '(max-width: 767px)': false,
        '(min-width: 768px) and (max-width: 1023px)': false,
        '(min-width: 1024px)': true
      });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('useIsMobile()', () => {
    it('retorna true em telas mobile', () => {
      window.matchMedia = createMockMatchMedia({
        '(max-width: 767px)': true
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it('retorna false em telas maiores', () => {
      window.matchMedia = createMockMatchMedia({
        '(max-width: 767px)': false
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });
  });

  describe('useIsDesktop()', () => {
    it('retorna true em telas desktop', () => {
      window.matchMedia = createMockMatchMedia({
        '(min-width: 1024px)': true
      });

      const { result } = renderHook(() => useIsDesktop());

      expect(result.current).toBe(true);
    });

    it('retorna false em telas menores', () => {
      window.matchMedia = createMockMatchMedia({
        '(min-width: 1024px)': false
      });

      const { result } = renderHook(() => useIsDesktop());

      expect(result.current).toBe(false);
    });
  });
});
