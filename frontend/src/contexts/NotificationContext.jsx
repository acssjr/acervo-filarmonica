// ===== NOTIFICATION CONTEXT =====
// Gerencia notificacoes de novas partituras e avisos
// Separado para evitar re-renders em outros componentes

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Storage from '@services/storage';
import { API } from '@services/api';
import { NOTIFICATIONS_UPDATED_EVENT } from './notificationEvents.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Mapa de tipos de atividade para labels e icones
const NOTIFICATION_MAP = {
  nova_partitura: { label: 'Nova partitura', iconName: 'Music' },
  novo_repertorio: { label: 'Novo repert\u00f3rio', iconName: 'Repertorio' },
  repertorio_atualizado: { label: 'Repert\u00f3rio atualizado', iconName: 'Repertorio' },
  update_repertorio: { label: 'Repert\u00f3rio atualizado', iconName: 'Repertorio' },
  nova_parte: { label: 'Nova parte', iconName: 'Music' },
};

const EXCLUDED_TYPES = new Set(['login', 'download', 'busca', 'visualizacao']);

const buildNotificationDescription = (activity) => {
  const details = activity.detalhes?.trim();
  const actor = activity.usuario_nome?.trim();
  const attribution = actor ? ` por ${actor}` : '';

  switch (activity.tipo) {
    case 'nova_parte':
      return `Parte ${details || 'instrumental'} adicionada${attribution}.`;
    case 'nova_partitura':
      return `Adicionada ao acervo${details ? ` · ${details}` : ''}${attribution}.`;
    case 'novo_repertorio':
      return `Novo repertório disponibilizado${attribution}.`;
    case 'update_repertorio':
    case 'repertorio_atualizado':
      return `Repertório atualizado${details ? ` · ${details}` : ''}${attribution}.`;
    default:
      return details ? `${details}${attribution}.` : actor ? `Alteração realizada por ${actor}.` : 'Alteração realizada.';
  }
};

// Converte atividade para notificacao
export const activityToNotification = (activity) => {
  const mapping = NOTIFICATION_MAP[activity.tipo];
  const entityId = Number(activity.entidade_id);
  return {
    id: `activity-${activity.id}`,
    type: activity.tipo,
    title: activity.titulo,
    details: activity.detalhes || null,
    description: buildNotificationDescription(activity),
    entityType: activity.entidade_tipo || null,
    entityId: Number.isInteger(entityId) && entityId > 0 ? entityId : null,
    label: mapping?.label || activity.tipo,
    iconName: mapping?.iconName || 'Music',
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
        const relevant = activities
          .filter(a => !EXCLUDED_TYPES.has(a.tipo) && NOTIFICATION_MAP[a.tipo])
          .slice(0, 30)
          .map(activityToNotification);

        setNotifications(relevant);
      }
    } catch {
      // Silencioso - notificacoes serao carregadas depois
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega notificacoes ao montar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated);
    };
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
