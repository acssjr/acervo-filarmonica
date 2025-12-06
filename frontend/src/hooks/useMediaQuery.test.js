// ===== USE MEDIA QUERY TESTS =====
// Testes unitarios para o hook de media query

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners = [];
  let mockMatches = false;

  const createMockMatchMedia = (matches) => {
    return jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      addEventListener: jest.fn((event, callback) => {
        listeners.push({ event, callback });
      }),
      removeEventListener: jest.fn((event, callback) => {
        listeners = listeners.filter(l => l.callback !== callback);
      }),
    }));
  };

  beforeEach(() => {
    listeners = [];
    mockMatches = false;
    window.matchMedia = createMockMatchMedia(mockMatches);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna false por padrao quando query nao corresponde', () => {
    window.matchMedia = createMockMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('retorna true quando query corresponde', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('registra listener de change', () => {
    renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(listeners.length).toBe(1);
    expect(listeners[0].event).toBe('change');
  });

  it('remove listener no cleanup', () => {
    let removeWasCalled = false;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((event, callback) => {
        listeners.push({ event, callback });
      }),
      removeEventListener: jest.fn(() => {
        removeWasCalled = true;
      }),
    }));

    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    unmount();

    expect(removeWasCalled).toBe(true);
  });

  it('registra listener para mudancas', () => {
    window.matchMedia = createMockMatchMedia(false);

    renderHook(() => useMediaQuery('(max-width: 768px)'));

    // Verifica que listener foi adicionado
    expect(listeners.some(l => l.event === 'change')).toBe(true);
  });

  it('funciona com diferentes queries', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result: mobileResult } = renderHook(() =>
      useMediaQuery('(max-width: 767px)')
    );
    const { result: darkResult } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)')
    );

    expect(mobileResult.current).toBe(true);
    expect(darkResult.current).toBe(true);
  });
});
