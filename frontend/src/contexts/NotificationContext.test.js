// ===== NOTIFICATION CONTEXT TESTS =====
// Testes de integracao para o contexto de notificacoes
// Agora busca da API (getAtividades), nao mais do localStorage

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ALL imports must be dynamic (except @jest/globals) for ESM compatibility
const { renderHook, act, waitFor } = await import('@testing-library/react');
const { createElement } = await import('react');
const { NotificationProvider, useNotifications } = await import('./NotificationContext.jsx');

// Wrapper com Provider (sem JSX)
const wrapper = ({ children }) => createElement(NotificationProvider, null, children);

describe('NotificationContext', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe('useNotifications() hook', () => {
    it('lanca erro quando usado fora do Provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useNotifications());
      }).toThrow('useNotifications must be used within NotificationProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Initial State', () => {
    it('inicia com loading true', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      // Loading inicia true enquanto busca da API
      expect(result.current.loading).toBeDefined();
    });

    it('carrega notificacoes da API', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      // Aguarda carregar da API (MSW retorna 2 notificacoes)
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(Array.isArray(result.current.notifications)).toBe(true);
      expect(result.current.notifications.length).toBe(2);
    });

    it('converte atividades em notificacoes corretamente', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verifica estrutura da notificacao convertida
      const notification = result.current.notifications[0];
      expect(notification).toHaveProperty('id');
      expect(notification).toHaveProperty('type', 'nova_partitura');
      expect(notification).toHaveProperty('title');
      expect(notification).toHaveProperty('composer');
      expect(notification).toHaveProperty('date');
      expect(notification).toHaveProperty('read');
    });
  });

  describe('markNotificationAsRead()', () => {
    it('marca notificacao especifica como lida', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const notificationId = result.current.notifications[0].id;

      act(() => {
        result.current.markNotificationAsRead(notificationId);
      });

      expect(result.current.notifications.find(n => n.id === notificationId).read).toBe(true);
    });

    it('persiste leitura no localStorage', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const notificationId = result.current.notifications[0].id;
      const activityId = notificationId.replace('activity-', '');

      act(() => {
        result.current.markNotificationAsRead(notificationId);
      });

      // Verifica se salvou no localStorage
      const stored = localStorage.getItem(`fil_notification-read-${activityId}`);
      expect(stored).toBe('true');
    });
  });

  describe('markAllNotificationsAsRead()', () => {
    it('marca todas notificacoes como lidas', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.markAllNotificationsAsRead();
      });

      expect(result.current.notifications.every(n => n.read)).toBe(true);
    });
  });

  describe('clearNotifications()', () => {
    it('limpa todas as notificacoes', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.notifications.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications.length).toBe(0);
    });
  });

  describe('refreshNotifications()', () => {
    it('recarrega notificacoes da API', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Limpa e depois recarrega
      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications.length).toBe(0);

      act(() => {
        result.current.refreshNotifications();
      });

      await waitFor(() => {
        expect(result.current.notifications.length).toBe(2);
      });
    });
  });

  describe('unreadCount', () => {
    it('conta notificacoes nao lidas', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Inicialmente todas nao lidas (MSW retorna 2)
      expect(result.current.unreadCount).toBe(2);
    });

    it('atualiza quando notificacao e marcada como lida', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.unreadCount).toBe(2);

      act(() => {
        result.current.markNotificationAsRead(result.current.notifications[0].id);
      });

      expect(result.current.unreadCount).toBe(1);
    });

    it('retorna 0 quando todas estao lidas', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.markAllNotificationsAsRead();
      });

      expect(result.current.unreadCount).toBe(0);
    });
  });
});
