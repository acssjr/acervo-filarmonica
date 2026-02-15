"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import Storage from "@lib/storage";
import { API } from "@lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  composer: string;
  date: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

const activityToNotification = (activity: any): Notification => {
  return {
    id: `activity-${activity.id}`,
    type: "nova_partitura",
    title: activity.titulo,
    composer: activity.detalhes,
    date: activity.criado_em,
    read: Storage.get<boolean>(`notification-read-${activity.id}`, false),
  };
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const activities = await API.getAtividades();
      if (activities && Array.isArray(activities)) {
        const newSheets = activities
          .filter((a: any) => a.tipo === "nova_partitura")
          .slice(0, 30)
          .map(activityToNotification);
        setNotifications(newSheets);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const activityId = id.replace("activity-", "");
          Storage.set(`notification-read-${activityId}`, true);
          return { ...n, read: true };
        }
        return n;
      })
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => {
        const activityId = n.id.replace("activity-", "");
        Storage.set(`notification-read-${activityId}`, true);
        return { ...n, read: true };
      })
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        refreshNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
