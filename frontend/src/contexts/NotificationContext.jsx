// ===== NOTIFICATION CONTEXT =====
// Gerencia notificacoes do usuario
// Separado para evitar re-renders em outros componentes

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Storage from '@services/storage';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Gera notificacoes iniciais
const generateInitialNotifications = () => {
  const now = new Date();
  return [
    { id: '1', type: 'new_sheet', sheetId: '1', title: 'Cisne Branco', message: 'Nova partitura adicionada', date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false },
    { id: '2', type: 'new_sheet', sheetId: '3', title: 'Saudades', message: 'Nova partitura adicionada', date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  ];
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() =>
    Storage.get('notifications', generateInitialNotifications())
  );

  // Persiste notificacoes
  useEffect(() => {
    Storage.set('notifications', notifications);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
