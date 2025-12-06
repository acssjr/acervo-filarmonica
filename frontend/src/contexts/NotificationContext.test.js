// ===== NOTIFICATION CONTEXT TESTS =====
// Testes de integracao para o contexto de notificacoes
// Usa dynamic imports para compatibilidade ESM

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ALL imports must be dynamic (except @jest/globals) for ESM compatibility
const { renderHook, act } = await import('@testing-library/react');
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
    it('inicia com notificacoes padrao', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.notifications).toBeDefined();
      expect(Array.isArray(result.current.notifications)).toBe(true);
    });

    it('carrega notificacoes do storage', () => {
      const savedNotifications = [
        { id: '1', message: 'Saved', read: false }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(savedNotifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.notifications).toEqual(savedNotifications);
    });
  });

  describe('addNotification()', () => {
    it('adiciona notificacao no inicio da lista', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      const initialLength = result.current.notifications.length;

      act(() => {
        result.current.addNotification({
          type: 'new_sheet',
          title: 'Nova Partitura',
          message: 'Dobrado Teste'
        });
      });

      expect(result.current.notifications.length).toBe(initialLength + 1);
      expect(result.current.notifications[0].title).toBe('Nova Partitura');
    });

    it('gera ID automaticamente', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.addNotification({ message: 'Test' });
      });

      expect(result.current.notifications[0].id).toBeDefined();
    });

    it('define data automaticamente', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.addNotification({ message: 'Test' });
      });

      expect(result.current.notifications[0].date).toBeDefined();
    });

    it('define read=false por padrao', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.addNotification({ message: 'Test' });
      });

      expect(result.current.notifications[0].read).toBe(false);
    });
  });

  describe('markNotificationAsRead()', () => {
    it('marca notificacao especifica como lida', () => {
      const notifications = [
        { id: '1', message: 'Unread', read: false },
        { id: '2', message: 'Also unread', read: false }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(notifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.markNotificationAsRead('1');
      });

      expect(result.current.notifications.find(n => n.id === '1').read).toBe(true);
      expect(result.current.notifications.find(n => n.id === '2').read).toBe(false);
    });
  });

  describe('markAllNotificationsAsRead()', () => {
    it('marca todas notificacoes como lidas', () => {
      const notifications = [
        { id: '1', message: 'Unread 1', read: false },
        { id: '2', message: 'Unread 2', read: false },
        { id: '3', message: 'Unread 3', read: false }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(notifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.markAllNotificationsAsRead();
      });

      expect(result.current.notifications.every(n => n.read)).toBe(true);
    });
  });

  describe('unreadCount', () => {
    it('conta notificacoes nao lidas', () => {
      const notifications = [
        { id: '1', read: false },
        { id: '2', read: true },
        { id: '3', read: false }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(notifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.unreadCount).toBe(2);
    });

    it('atualiza quando notificacao e marcada como lida', () => {
      const notifications = [
        { id: '1', read: false },
        { id: '2', read: false }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(notifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.unreadCount).toBe(2);

      act(() => {
        result.current.markNotificationAsRead('1');
      });

      expect(result.current.unreadCount).toBe(1);
    });

    it('retorna 0 quando todas estao lidas', () => {
      const notifications = [
        { id: '1', read: true },
        { id: '2', read: true }
      ];
      localStorage.setItem('fil_notifications', JSON.stringify(notifications));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('Persistence', () => {
    it('persiste notificacoes no storage', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.addNotification({ message: 'Test' });
      });

      const stored = JSON.parse(localStorage.getItem('fil_notifications'));
      expect(Array.isArray(stored)).toBe(true);
      expect(stored.some(n => n.message === 'Test')).toBe(true);
    });
  });
});
