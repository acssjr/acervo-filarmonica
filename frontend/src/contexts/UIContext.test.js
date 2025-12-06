// ===== UI CONTEXT TESTS =====
// Testes de integracao para o contexto de UI
// Usa dynamic imports para compatibilidade ESM

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ALL imports must be dynamic (except @jest/globals) for ESM compatibility
const { renderHook, act } = await import('@testing-library/react');
const { createElement } = await import('react');
const { UIProvider, useUI } = await import('./UIContext.jsx');

// Wrapper com Provider (sem JSX)
const wrapper = ({ children }) => createElement(UIProvider, null, children);

describe('UIContext', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe('useUI() hook', () => {
    it('lanca erro quando usado fora do Provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useUI());
      }).toThrow('useUI must be used within UIProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Theme', () => {
    it('inicia com tema system por padrao', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.themeMode).toBe('system');
    });

    it('carrega tema do storage', () => {
      // Pre-configura o localStorage com tema dark
      localStorage.setItem('fil_themeMode', JSON.stringify('dark'));

      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.themeMode).toBe('dark');
    });

    it('setThemeMode atualiza tema', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setThemeMode('dark');
      });

      expect(result.current.themeMode).toBe('dark');
    });

    it('persiste tema no storage', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setThemeMode('light');
      });

      const stored = JSON.parse(localStorage.getItem('fil_themeMode'));
      expect(stored).toBe('light');
    });
  });

  describe('Toast', () => {
    it('inicia sem toast', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.toast).toBeNull();
    });

    it('showToast define mensagem e tipo', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.showToast('Mensagem de teste', 'success');
      });

      expect(result.current.toast).toEqual({
        message: 'Mensagem de teste',
        type: 'success'
      });
    });

    it('showToast usa success como tipo padrao', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.showToast('Mensagem');
      });

      expect(result.current.toast.type).toBe('success');
    });

    it('clearToast remove toast', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.showToast('Mensagem');
      });
      expect(result.current.toast).not.toBeNull();

      act(() => {
        result.current.clearToast();
      });
      expect(result.current.toast).toBeNull();
    });
  });

  describe('Sidebar', () => {
    it('inicia com sidebar expandida', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it('setSidebarCollapsed atualiza estado', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });
  });

  describe('Selected Sheet', () => {
    it('inicia sem partitura selecionada', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.selectedSheet).toBeNull();
    });

    it('setSelectedSheet atualiza partitura', () => {
      const { result } = renderHook(() => useUI(), { wrapper });
      const mockSheet = { id: 1, title: 'Dobrado' };

      act(() => {
        result.current.setSelectedSheet(mockSheet);
      });

      expect(result.current.selectedSheet).toEqual(mockSheet);
    });
  });

  describe('Notifications Panel', () => {
    it('inicia com painel fechado', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.showNotifications).toBe(false);
    });

    it('setShowNotifications abre/fecha painel', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setShowNotifications(true);
      });

      expect(result.current.showNotifications).toBe(true);
    });
  });
});
