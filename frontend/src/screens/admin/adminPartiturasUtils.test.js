import { describe, expect, test } from '@jest/globals';
import { formatPartiturasResult, sortPartiturasByTitle } from './adminPartiturasUtils';

describe('adminPartiturasUtils', () => {
  test('ordena partituras sem alterar a lista recebida', () => {
    const original = [{ titulo: 'Zabumba' }, { titulo: 'Águas' }];
    const result = sortPartiturasByTitle(original);

    expect(result.map(item => item.titulo)).toEqual(['Águas', 'Zabumba']);
    expect(original.map(item => item.titulo)).toEqual(['Zabumba', 'Águas']);
  });

  test('mostra quantidade no singular e inclui a busca', () => {
    expect(formatPartiturasResult(1, 'Santana')).toBe('1 partitura encontrada para “Santana”');
  });

  test('mostra quantidade no plural', () => {
    expect(formatPartiturasResult(89)).toBe('89 partituras encontradas');
  });
});
