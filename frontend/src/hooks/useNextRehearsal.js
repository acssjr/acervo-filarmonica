// ===== HOOK: PRÓXIMO ENSAIO =====
// Calcula tempo restante para o próximo ensaio
// Usa sempre hora local (nunca UTC) para evitar problemas de timezone

const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/**
 * Calcula quando é o próximo ensaio
 * @param {number[]} rehearsalDays - Dias da semana com ensaio (0=dom...6=sab). Default: [1,3]
 * @param {number} rehearsalHour - Hora de início do ensaio (local). Default: 19
 * @param {number} rehearsalEndHour - Hora de fim do ensaio (local). Default: 21
 */
export const getNextRehearsal = (rehearsalDays = [1, 3], rehearsalHour = 19, rehearsalEndHour = 21) => {
  if (!rehearsalDays || rehearsalDays.length === 0) {
    rehearsalDays = [1, 3];
  }

  const now = new Date();
  const currentDay = now.getDay();     // local day of week
  const currentHour = now.getHours();  // local hour
  const currentMinute = now.getMinutes();

  // Verifica se está em ensaio agora
  const isRehearsalDay = rehearsalDays.includes(currentDay);
  const isDuringRehearsal = isRehearsalDay && currentHour >= rehearsalHour && currentHour < rehearsalEndHour;

  if (isDuringRehearsal) {
    const minutesLeft = (rehearsalEndHour - currentHour - 1) * 60 + (60 - currentMinute);
    return { isNow: true, minutesLeft };
  }

  // Determina ponto de partida: se hoje é dia de ensaio mas já passou a hora, avança
  let daysUntil = 0;
  let nextDay = currentDay;

  if (isRehearsalDay && currentHour >= rehearsalHour) {
    nextDay = (currentDay + 1) % 7;
    daysUntil = 1;
  }

  // Encontra o próximo dia de ensaio (máximo 7 iterações)
  let iterations = 0;
  while (!rehearsalDays.includes(nextDay) && iterations < 7) {
    nextDay = (nextDay + 1) % 7;
    daysUntil++;
    iterations++;
  }

  // Calcula timestamp do próximo ensaio (hora local)
  const nextRehearsal = new Date(now);
  nextRehearsal.setDate(now.getDate() + daysUntil);
  nextRehearsal.setHours(rehearsalHour, 0, 0, 0);

  const diff = nextRehearsal - now;
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const dayName = DAY_NAMES[nextDay] ?? 'próximo dia';

  return { isNow: false, days, hours, minutes, dayName };
};

export default getNextRehearsal;
