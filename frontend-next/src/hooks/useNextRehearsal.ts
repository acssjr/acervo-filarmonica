interface RehearsalInfo {
  isNow: boolean;
  minutesLeft?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  dayName?: string;
}

export const getNextRehearsal = (): RehearsalInfo => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const rehearsalDays = [1, 3];
  const rehearsalHour = 19;
  const rehearsalEndHour = 21;

  const isRehearsalDay = rehearsalDays.includes(currentDay);
  const isDuringRehearsal = isRehearsalDay && currentHour >= rehearsalHour && currentHour < rehearsalEndHour;

  if (isDuringRehearsal) {
    const minutesLeft = (rehearsalEndHour - currentHour - 1) * 60 + (60 - currentMinute);
    return { isNow: true, minutesLeft };
  }

  let daysUntil = 0;
  let nextDay = currentDay;

  if (isRehearsalDay && currentHour >= rehearsalHour) {
    nextDay = (currentDay + 1) % 7;
    daysUntil = 1;
  }

  while (!rehearsalDays.includes(nextDay)) {
    nextDay = (nextDay + 1) % 7;
    daysUntil++;
  }

  const nextRehearsal = new Date(now);
  nextRehearsal.setDate(now.getDate() + daysUntil);
  nextRehearsal.setHours(rehearsalHour, 0, 0, 0);

  const diff = nextRehearsal.getTime() - now.getTime();
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const dayName = nextDay === 1 ? "segunda" : "quarta";

  return { isNow: false, days, hours, minutes, dayName };
};

export default getNextRehearsal;
