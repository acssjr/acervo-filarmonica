import { jest, describe, expect, test } from '@jest/globals';
import {
  buildMusicianCountdownItems,
  computeNextRehearsalDate,
  getPresentationDate
} from './musicianCountdown';

describe('musicianCountdown utils', () => {
  test('ignora valores inválidos e strings ao calcular o próximo ensaio', () => {
    const now = new Date(2026, 3, 3, 12, 0, 0, 0);

    const nextRehearsal = computeNextRehearsalDate([9, 2, '6'], 19, now);

    expect(nextRehearsal.getDate()).toBe(7);
    expect(nextRehearsal.getHours()).toBe(19);
  });

  test('usa os dias padrão quando nenhuma opção válida de ensaio é informada', () => {
    const now = new Date(2026, 3, 3, 12, 0, 0, 0);

    const nextRehearsal = computeNextRehearsalDate([9, -1, '2', null], 19, now);

    expect(nextRehearsal.getDate()).toBe(6);
    expect(nextRehearsal.getHours()).toBe(19);
  });

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

  test('usa fallback quando a apresentação ativa não tem nome preenchido', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-03T12:00:00-03:00'));

    const { items } = buildMusicianCountdownItems(
      { dias: [1], hora: 19 },
      { nome: '', data_apresentacao: '2026-04-07' }
    );

    const presentationItem = items.find((item) => item.id === 'presentation');

    expect(presentationItem?.name).toBe('Apresentação');

    jest.useRealTimers();
  });
});
