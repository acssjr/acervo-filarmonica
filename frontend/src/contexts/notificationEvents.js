export const NOTIFICATIONS_UPDATED_EVENT = 'fil-notifications-updated';

/**
 * Dispara um evento global para forçar recarga das notificações em aberto.
 */
export function notifyNotificationsChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
}
