export const NOTIFICATIONS_UPDATED_EVENT = 'fil-notifications-updated';

export function notifyNotificationsChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
}
