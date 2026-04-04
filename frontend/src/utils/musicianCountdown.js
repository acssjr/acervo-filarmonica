import { getNextRehearsal } from '@utils/rehearsal';

export const COUNTDOWN_ROTATION_MS = 6000;

const DEFAULT_REHEARSAL_DAYS = [1, 3];
const DEFAULT_REHEARSAL_HOUR = 19;

const normalizeRehearsalDays = (rehearsalDays) => (
  Array.isArray(rehearsalDays) && rehearsalDays.length > 0
    ? rehearsalDays
    : DEFAULT_REHEARSAL_DAYS
);

const normalizeRehearsalHour = (rehearsalHour) => {
  const parsedHour = typeof rehearsalHour === 'number'
    ? rehearsalHour
    : parseInt(rehearsalHour ?? DEFAULT_REHEARSAL_HOUR, 10);

  return Number.isFinite(parsedHour) ? parsedHour : DEFAULT_REHEARSAL_HOUR;
};

/**
 * Calcula a próxima data de ensaio a partir dos dias e horário configurados.
 */
export const computeNextRehearsalDate = (
  rehearsalDays = DEFAULT_REHEARSAL_DAYS,
  rehearsalHour = DEFAULT_REHEARSAL_HOUR,
  now = new Date()
) => {
  const normalizedDays = normalizeRehearsalDays(rehearsalDays);
  const normalizedHour = normalizeRehearsalHour(rehearsalHour);
  const today = now.getDay();
  let minDaysAhead = 8;

  for (const day of normalizedDays) {
    let daysAhead = (day - today + 7) % 7;
    if (daysAhead === 0 && now.getHours() >= normalizedHour) {
      daysAhead = 7;
    }
    if (daysAhead < minDaysAhead) {
      minDaysAhead = daysAhead;
    }
  }

  const target = new Date(now);
  target.setDate(now.getDate() + minDaysAhead);
  target.setHours(normalizedHour, 0, 0, 0);
  return target;
};

/**
 * Converte a data da apresentação ativa em um objeto Date no horário do ensaio.
 */
export const getPresentationDate = (
  repertorioAtivo,
  rehearsalHour = DEFAULT_REHEARSAL_HOUR
) => {
  if (!repertorioAtivo?.data_apresentacao) {
    return null;
  }

  const [year, month, day] = repertorioAtivo.data_apresentacao
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const presentationDate = new Date(
    year,
    month - 1,
    day,
    normalizeRehearsalHour(rehearsalHour),
    0,
    0,
    0
  );

  return Number.isNaN(presentationDate.getTime()) ? null : presentationDate;
};

/**
 * Monta a fila de contagens do músico respeitando a prioridade do ensaio.
 */
export const buildMusicianCountdownItems = (
  diasEnsaio = { dias: DEFAULT_REHEARSAL_DAYS, hora: DEFAULT_REHEARSAL_HOUR },
  repertorioAtivo
) => {
  const rehearsalDays = normalizeRehearsalDays(diasEnsaio?.dias);
  const rehearsalHour = normalizeRehearsalHour(diasEnsaio?.hora);
  const now = new Date();
  const rehearsalInfo = getNextRehearsal(rehearsalDays, rehearsalHour);

  const items = [{
    id: 'rehearsal',
    type: 'rehearsal',
    label: 'Próximo ensaio',
    name: rehearsalInfo.dayName,
    date: computeNextRehearsalDate(rehearsalDays, rehearsalHour, now)
  }];

  const presentationDate = getPresentationDate(repertorioAtivo, rehearsalHour);
  if (presentationDate && presentationDate > now) {
    items.push({
      id: 'presentation',
      type: 'presentation',
      label: 'Próxima apresentação',
      name: repertorioAtivo.nome,
      date: presentationDate
    });
  }

  return { items, rehearsalInfo };
};

/**
 * Quebra a diferença entre agora e a data alvo em dias, horas, minutos e segundos.
 */
export const getCountdownParts = (targetDate, now = Date.now()) => {
  const diff = Math.max(0, targetDate - now);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
};
