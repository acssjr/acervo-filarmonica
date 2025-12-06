// ===== USE IS TOUCH DEVICE TESTS =====
// Testes unitarios para o hook de deteccao de touch

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useIsTouchDevice } from './useIsTouchDevice';

describe('useIsTouchDevice', () => {
  let originalOntouchstart;
  let originalMaxTouchPoints;
  let listeners = [];

  const createMockMatchMedia = (matches) => {
    return jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      addEventListener: jest.fn((event, callback) => {
        listeners.push({ event, callback });
      }),
      removeEventListener: jest.fn(),
    }));
  };

  beforeEach(() => {
    listeners = [];
    originalOntouchstart = window.ontouchstart;
    originalMaxTouchPoints = navigator.maxTouchPoints;

    // Remove propriedades touch por padrao
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      writable: true,
      configurable: true
    });

    window.matchMedia = createMockMatchMedia(false);
  });

  afterEach(() => {
    if (originalOntouchstart !== undefined) {
      window.ontouchstart = originalOntouchstart;
    }
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      writable: true,
      configurable: true
    });
    jest.restoreAllMocks();
  });

  it('retorna false em dispositivos sem touch', () => {
    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(false);
  });

  it('retorna true quando ontouchstart existe', () => {
    window.ontouchstart = () => {};

    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(true);
  });

  it('retorna true quando maxTouchPoints > 0', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      writable: true,
      configurable: true
    });

    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(true);
  });

  it('retorna true quando pointer e coarse', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() => useIsTouchDevice());

    // O hook verifica ontouchstart primeiro, entao podemos precisar simular o evento
    act(() => {
      listeners.forEach(l => l.callback({ matches: true }));
    });

    expect(result.current).toBe(true);
  });

  it('registra listener para mudancas de pointer', () => {
    renderHook(() => useIsTouchDevice());

    expect(listeners.length).toBe(1);
    expect(listeners[0].event).toBe('change');
  });

  it('atualiza quando pointer muda', () => {
    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(false);

    // Simula mudanca para touch
    window.ontouchstart = () => {};
    act(() => {
      listeners.forEach(l => l.callback({ matches: true }));
    });

    expect(result.current).toBe(true);
  });
});
