const normalizeTitle = (value) => String(value ?? '')
  .trim()
  .toLocaleLowerCase('pt-BR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const getSheetDestination = (sheet) => `/acervo/${sheet.category}/${sheet.id}`;

const isRepertorioNotification = (notification) => (
  notification.entityType === 'repertorio'
  || ['novo_repertorio', 'update_repertorio', 'repertorio_atualizado'].includes(notification.type)
);

export const resolveNotificationDestination = (notification, sheets = []) => {
  if (isRepertorioNotification(notification)) return '/repertorio';

  if (notification.entityType === 'partitura' && notification.entityId != null) {
    const exactSheet = sheets.find(sheet => String(sheet.id) === String(notification.entityId));
    return exactSheet ? getSheetDestination(exactSheet) : '/acervo';
  }

  const normalizedTitle = normalizeTitle(notification.title);
  if (!normalizedTitle) return '/acervo';

  const matches = sheets.filter(sheet => normalizeTitle(sheet.title) === normalizedTitle);
  return matches.length === 1 ? getSheetDestination(matches[0]) : '/acervo';
};
