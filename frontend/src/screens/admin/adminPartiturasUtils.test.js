import { describe, expect, test } from '@jest/globals';
import {
  formatPartiturasResult,
  getScrollAdjustment,
  sortPartiturasByTitle
} from './adminPartiturasUtils';

describe('adminPartiturasUtils', () => {
  test('ordena partituras sem alterar a lista recebida', () => {
    const original = [{ titulo: 'Zabumba' }, { titulo: 'Águas' }];
    const result = sortPartiturasByTitle(original);

    expect(result.map(item => item.titulo)).toEqual(['Águas', 'Zabumba']);
    expect(original.map(item => item.titulo)).toEqual(['Zabumba', 'Águas']);
  });

  test('normaliza títulos ausentes durante a ordenação', () => {
    const original = [{ titulo: 'Banda' }, { titulo: null }, {}];
    const result = sortPartiturasByTitle(original);

    expect(result.map(item => item.titulo)).toEqual([null, undefined, 'Banda']);
    expect(original.map(item => item.titulo)).toEqual(['Banda', null, undefined]);
  });

  test('calcula quanto o scroll deve acompanhar a âncora visual', () => {
    expect(getScrollAdjustment({ previousTop: 120, nextTop: 170 })).toBe(50);
    expect(getScrollAdjustment({ previousTop: 170, nextTop: 120 })).toBe(-50);
  });

  test('mostra quantidade no singular e inclui a busca', () => {
    expect(formatPartiturasResult(1, 'Santana')).toBe('1 partitura encontrada para “Santana”');
  });

  test('mostra quantidade no plural', () => {
    expect(formatPartiturasResult(89)).toBe('89 partituras encontradas');
  });
});
