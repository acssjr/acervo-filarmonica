// ===== NOTIFICATION CONTEXT =====
// Gerencia notificacoes de novas partituras e avisos
// Separado para evitar re-renders em outros componentes

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Storage from '@services/storage';
import { API } from '@services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Converte atividade de nova partitura para notificacao
const activityToNotification = (activity) => {
  return {
    id: `activity-${activity.id}`,
    type: 'nova_partitura',
    title: activity.titulo,
    composer: activity.detalhes, // compositor vem no campo detalhes
    date: activity.criado_em,
    read: Storage.get(`notification-read-${activity.id}`, false)
  };
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega novas partituras do backend como notificacoes
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const activities = await API.getAtividades();

      if (activities && Array.isArray(activities)) {
        // Filtra apenas novas partituras (tipo = 'nova_partitura')
        const newSheets = activities
          .filter(a => a.tipo === 'nova_partitura')
          .slice(0, 30)
          .map(activityToNotification);

        setNotifications(newSheets);
      }
    } catch {
      console.log('Notificacoes: erro ao carregar');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega notificacoes ao montar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        const activityId = id.replace('activity-', '');
        Storage.set(`notification-read-${activityId}`, true);
        return { ...n, read: true };
      }
      return n;
    }));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => {
      const activityId = n.id.replace('activity-', '');
      Storage.set(`notification-read-${activityId}`, true);
      return { ...n, read: true };
    }));
  }, []);

  // Limpa notificacoes (para logout)
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Recarrega notificacoes (para refresh manual)
  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider value={{
      notifications,
      loading,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      refreshNotifications,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
