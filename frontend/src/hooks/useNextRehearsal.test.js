// ===== USE NEXT REHEARSAL TESTS =====
// Testes unitarios para o hook de proximo ensaio
// Ensaios: Segunda e Quarta, das 19h as 21h

import { jest, describe, it, expect, afterEach } from '@jest/globals';
import { getNextRehearsal } from './useNextRehearsal';

describe('getNextRehearsal', () => {
  // Helper para criar mock de Date
  const mockDate = (dayOfWeek, hour, minute = 0) => {
    // Dias: 0=dom, 1=seg, 2=ter, 3=qua, 4=qui, 5=sex, 6=sab
    const RealDate = global.Date;
    const baseDate = new Date('2024-01-01T00:00:00Z'); // Segunda-feira

    // Ajusta para o dia da semana desejado
    const daysToAdd = (dayOfWeek - baseDate.getDay() + 7) % 7;
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    baseDate.setHours(hour, minute, 0, 0);

    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        return new RealDate(baseDate);
      }
      return new RealDate(...args);
    });

    return () => {
      jest.restoreAllMocks();
    };
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Durante ensaio (isNow=true)', () => {
    it('retorna isNow=true quando e segunda as 19h', () => {
      const restore = mockDate(1, 19, 0); // Segunda 19:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(true);
      restore();
    });

    it('retorna isNow=true quando e quarta as 20h', () => {
      const restore = mockDate(3, 20, 0); // Quarta 20:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(true);
      restore();
    });

    it('calcula minutesLeft corretamente no inicio do ensaio', () => {
      const restore = mockDate(1, 19, 0); // Segunda 19:00

      const result = getNextRehearsal();

      // Das 19:00 as 21:00 = 120 minutos
      expect(result.minutesLeft).toBe(120);
      restore();
    });

    it('calcula minutesLeft corretamente no meio do ensaio', () => {
      const restore = mockDate(1, 20, 30); // Segunda 20:30

      const result = getNextRehearsal();

      // Das 20:30 as 21:00 = 30 minutos
      expect(result.minutesLeft).toBe(30);
      restore();
    });

    it('retorna isNow=false quando ensaio terminou (21h)', () => {
      const restore = mockDate(1, 21, 0); // Segunda 21:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      restore();
    });
  });

  describe('Antes do ensaio (mesmo dia)', () => {
    it('calcula tempo ate ensaio de segunda de manha', () => {
      const restore = mockDate(1, 10, 0); // Segunda 10:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(0);
      expect(result.hours).toBe(9); // 10h -> 19h = 9 horas
      expect(result.minutes).toBe(0);
      restore();
    });

    it('calcula tempo ate ensaio de quarta de manha', () => {
      const restore = mockDate(3, 12, 30); // Quarta 12:30

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('quarta');
      expect(result.days).toBe(0);
      expect(result.hours).toBe(6); // 12:30 -> 19:00 = 6h30m
      expect(result.minutes).toBe(30);
      restore();
    });
  });

  describe('Apos horario de ensaio', () => {
    it('retorna proximo ensaio (quarta) quando e segunda apos 21h', () => {
      const restore = mockDate(1, 22, 0); // Segunda 22:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('quarta');
      expect(result.days).toBe(1); // Terca + parte de quarta
      restore();
    });

    it('retorna proximo ensaio (segunda) quando e quarta apos 21h', () => {
      const restore = mockDate(3, 22, 0); // Quarta 22:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      restore();
    });
  });

  describe('Dias sem ensaio', () => {
    it('calcula corretamente de domingo para segunda', () => {
      const restore = mockDate(0, 14, 0); // Domingo 14:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(1); // Amanha e segunda
      restore();
    });

    it('calcula corretamente de terca para quarta', () => {
      const restore = mockDate(2, 10, 0); // Terca 10:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('quarta');
      expect(result.days).toBe(1);
      restore();
    });

    it('calcula corretamente de quinta para segunda', () => {
      const restore = mockDate(4, 10, 0); // Quinta 10:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(4); // Qui->Sex->Sab->Dom->Seg
      restore();
    });

    it('calcula corretamente de sexta para segunda', () => {
      const restore = mockDate(5, 15, 0); // Sexta 15:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(3); // Sex->Sab->Dom->Seg
      restore();
    });

    it('calcula corretamente de sabado para segunda', () => {
      const restore = mockDate(6, 12, 0); // Sabado 12:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(2); // Sab->Dom->Seg
      restore();
    });
  });

  describe('Edge cases', () => {
    it('calcula corretamente a meia-noite de segunda', () => {
      const restore = mockDate(1, 0, 0); // Segunda 00:00

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(0);
      expect(result.hours).toBe(19);
      restore();
    });

    it('calcula corretamente as 18:59 de dia de ensaio', () => {
      const restore = mockDate(1, 18, 59); // Segunda 18:59

      const result = getNextRehearsal();

      expect(result.isNow).toBe(false);
      expect(result.dayName).toBe('segunda');
      expect(result.days).toBe(0);
      expect(result.minutes).toBe(1);
      restore();
    });

    it('calcula corretamente as 20:59 (ultimo minuto do ensaio)', () => {
      const restore = mockDate(1, 20, 59); // Segunda 20:59

      const result = getNextRehearsal();

      expect(result.isNow).toBe(true);
      expect(result.minutesLeft).toBe(1);
      restore();
    });
  });

  describe('Estrutura do retorno', () => {
    it('retorna objeto com isNow e minutesLeft durante ensaio', () => {
      const restore = mockDate(1, 19, 30);

      const result = getNextRehearsal();

      expect(result).toHaveProperty('isNow', true);
      expect(result).toHaveProperty('minutesLeft');
      expect(typeof result.minutesLeft).toBe('number');
      restore();
    });

    it('retorna objeto com todas propriedades fora do ensaio', () => {
      const restore = mockDate(0, 12, 0);

      const result = getNextRehearsal();

      expect(result).toHaveProperty('isNow', false);
      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('hours');
      expect(result).toHaveProperty('minutes');
      expect(result).toHaveProperty('dayName');
      expect(['segunda', 'quarta']).toContain(result.dayName);
      restore();
    });
  });
});
