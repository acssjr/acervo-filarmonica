// ===== HOOK: PRÓXIMO ENSAIO =====
// Calcula tempo restante para o próximo ensaio

export const getNextRehearsal = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0=dom, 1=seg, 2=ter, 3=qua, 4=qui, 5=sex, 6=sab
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Dias de ensaio: 1 (segunda) e 3 (quarta)
  const rehearsalDays = [1, 3];
  const rehearsalHour = 19;
  const rehearsalEndHour = 21;

  // Verifica se está em ensaio agora
  const isRehearsalDay = rehearsalDays.includes(currentDay);
  const isDuringRehearsal = isRehearsalDay && currentHour >= rehearsalHour && currentHour < rehearsalEndHour;

  if (isDuringRehearsal) {
    const minutesLeft = (rehearsalEndHour - currentHour - 1) * 60 + (60 - currentMinute);
    return { isNow: true, minutesLeft };
  }

  // Encontra próximo dia de ensaio
  let daysUntil = 0;
  let nextDay = currentDay;

  // Se hoje é dia de ensaio mas já passou das 19h, vai para o próximo
  if (isRehearsalDay && currentHour >= rehearsalHour) {
    nextDay = (currentDay + 1) % 7;
    daysUntil = 1;
  }

  // Encontra o próximo dia de ensaio
  while (!rehearsalDays.includes(nextDay)) {
    nextDay = (nextDay + 1) % 7;
    daysUntil++;
  }

  // Calcula tempo restante
  const nextRehearsal = new Date(now);
  nextRehearsal.setDate(now.getDate() + daysUntil);
  nextRehearsal.setHours(rehearsalHour, 0, 0, 0);

  const diff = nextRehearsal - now;
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const dayName = nextDay === 1 ? 'segunda' : 'quarta';

  return { isNow: false, days, hours, minutes, dayName };
};

export default getNextRehearsal;
