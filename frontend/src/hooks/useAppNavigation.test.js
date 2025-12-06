// ===== USE APP NAVIGATION TESTS =====
// Testes unitarios para o hook de navegacao

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock do DataContext
const mockSetSelectedCategory = jest.fn();
const mockSetSelectedComposer = jest.fn();

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    setSelectedCategory: mockSetSelectedCategory,
    setSelectedComposer: mockSetSelectedComposer
  })
}));

// Mock do slugify
jest.unstable_mockModule('@utils/slugify', () => ({
  slugify: (str) => str.toLowerCase().replace(/\s+/g, '-')
}));

const { default: useAppNavigation } = await import('./useAppNavigation');

// Wrapper com Router
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('useAppNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('goToTab()', () => {
    it('navega para home quando tab e home', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToTab('home');
      });

      expect(window.location.pathname).toBe('/');
    });

    it('navega para /acervo quando tab e library', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToTab('library');
      });

      expect(window.location.pathname).toBe('/acervo');
    });

    it('navega para /buscar quando tab e search', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToTab('search');
      });

      expect(window.location.pathname).toBe('/buscar');
    });

    it('navega para /favoritos quando tab e favorites', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToTab('favorites');
      });

      expect(window.location.pathname).toBe('/favoritos');
    });

    it('navega para / quando tab e desconhecida', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToTab('unknown');
      });

      expect(window.location.pathname).toBe('/');
    });
  });

  describe('goToCategory()', () => {
    it('navega para /acervo/{categoria}', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToCategory('dobrados');
      });

      expect(window.location.pathname).toBe('/acervo/dobrados');
    });

    it('limpa categoria e compositor selecionados', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToCategory('marchas');
      });

      expect(mockSetSelectedCategory).toHaveBeenCalledWith(null);
      expect(mockSetSelectedComposer).toHaveBeenCalledWith(null);
    });
  });

  describe('goToComposer()', () => {
    it('navega para /acervo e seta compositor', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToComposer('Estevam Moura');
      });

      expect(window.location.pathname).toBe('/acervo');
      expect(mockSetSelectedComposer).toHaveBeenCalledWith('Estevam Moura');
      expect(mockSetSelectedCategory).toHaveBeenCalledWith(null);
    });
  });

  describe('goToLibrary()', () => {
    it('navega para /acervo limpo', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      act(() => {
        result.current.goToLibrary();
      });

      expect(window.location.pathname).toBe('/acervo');
      expect(mockSetSelectedCategory).toHaveBeenCalledWith(null);
      expect(mockSetSelectedComposer).toHaveBeenCalledWith(null);
    });
  });

  describe('navigate()', () => {
    it('expoe navigate do React Router', () => {
      const { result } = renderHook(() => useAppNavigation(), { wrapper });

      expect(result.current.navigate).toBeDefined();
      expect(typeof result.current.navigate).toBe('function');
    });
  });
});
