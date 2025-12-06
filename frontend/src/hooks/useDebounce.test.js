// ===== USE DEBOUNCE TESTS =====
// Testes unitarios para o hook de debounce

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retorna valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('nao atualiza valor antes do delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Avanca apenas 100ms (menos que 300ms)
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('initial');
  });

  it('atualiza valor apos o delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('cancela timer anterior quando valor muda rapidamente', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    // Primeira mudanca
    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Segunda mudanca antes do delay
    rerender({ value: 'third' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Ainda nao deve ter atualizado
    expect(result.current).toBe('first');

    // Completa o delay da ultima mudanca
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Deve pular direto para o ultimo valor
    expect(result.current).toBe('third');
  });

  it('usa delay padrao de 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('funciona com diferentes tipos de valores', () => {
    // Objeto
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: { a: 1 } } }
    );

    objRerender({ value: { b: 2 } });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(objResult.current).toEqual({ b: 2 });

    // Numero
    const { result: numResult, rerender: numRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    );

    numRerender({ value: 42 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(numResult.current).toBe(42);
  });
});
