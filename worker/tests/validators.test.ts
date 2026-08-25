import { describe, expect, it } from 'vitest';
import {
  isIsoDate,
  normalizeHttpUrl,
  parsePagination,
  parsePositiveId,
  sanitizeHeaderFilename,
  validateOrderItems
} from '../src/infrastructure/validation/index.js';

describe('validadores de fronteira da API', () => {
  it('aceita somente IDs inteiros positivos', () => {
    expect(parsePositiveId('42')).toBe(42);
    expect(parsePositiveId('1.2')).toBeNull();
    expect(parsePositiveId('abc')).toBeNull();
    expect(parsePositiveId(0)).toBeNull();
  });

  it('rejeita datas ISO inexistentes', () => {
    expect(isIsoDate('2026-02-28')).toBe(true);
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('24/08/2026')).toBe(false);
  });

  it('limita paginação e normaliza URLs HTTP', () => {
    const params = new URLSearchParams('limit=999&offset=4');
    expect(parsePagination(params)).toEqual({ limit: 100, offset: 4 });
    expect(normalizeHttpUrl('https://youtu.be/exemplo')).toBe('https://youtu.be/exemplo');
    expect(() => normalizeHttpUrl('javascript:alert(1)')).toThrow('HTTP ou HTTPS');
  });

  it('remove caracteres capazes de injetar cabeçalhos em filenames', () => {
    expect(sanitizeHeaderFilename('Obra\r\nX-Evil: sim; teste.pdf'))
      .toBe('Obra__X-Evil: sim_ teste.pdf');
  });

  it('valida IDs, posições e duplicidade em reordenações', () => {
    expect(validateOrderItems([{ id: 1, ordem: 0 }, { id: 2, ordem: 1 }])).toBe(true);
    expect(validateOrderItems([{ id: 1, ordem: 0 }, { id: 1, ordem: 1 }])).toBe(false);
    expect(validateOrderItems([{ id: -1, ordem: 0 }])).toBe(false);
  });
});

