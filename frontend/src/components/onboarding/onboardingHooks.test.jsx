import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

let tutoriaisAtivos = false;

jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, isAdmin: true } })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: [{ id: '1', title: 'Partitura' }],
    isLoading: false,
    tutoriaisAtivos
  })
}));

jest.unstable_mockModule('@services/storage', () => ({
  default: {
    get: jest.fn(() => false),
    set: jest.fn()
  }
}));

const { useUserWalkthrough } = await import('./useUserWalkthrough.js');
const { useTutorial } = await import('./TutorialOverlay.jsx');

describe('bloqueio global dos tutoriais', () => {
  beforeEach(() => {
    tutoriaisAtivos = false;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('não abre o passo a passo dos músicos quando está desativado', () => {
    const { result } = renderHook(() => useUserWalkthrough());

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(false);
    expect(result.current[2]).toBe(false);
  });

  test('não abre o tutorial administrativo quando está desativado', () => {
    const { result } = renderHook(() => useTutorial([{ id: 1 }], false, false));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(false);
    expect(result.current[2]).toBe(false);
  });
});
