import { describe, expect, test } from '@jest/globals';
import { computeNextRehearsalDate, getPresentationDate } from './musicianCountdown';

describe('musicianCountdown utils', () => {
  test.each([-1, 24, '24'])(
    'usa a hora padrão quando o horário do ensaio está fora da faixa válida: %p',
    (invalidHour) => {
      const now = new Date(2026, 3, 3, 12, 0, 0, 0);

      const nextRehearsal = computeNextRehearsalDate([1], invalidHour, now);

      expect(nextRehearsal.getDate()).toBe(6);
      expect(nextRehearsal.getHours()).toBe(19);
    }
  );

  test('retorna null para data de apresentação inválida que transborda no Date', () => {
    const presentationDate = getPresentationDate({
      data_apresentacao: '2026-02-31'
    }, 19);

    expect(presentationDate).toBeNull();
  });
});
