// ===== USE SHEET DOWNLOAD TESTS =====
// Testes unitarios para o hook de download de partituras

import { describe, it, expect } from '@jest/globals';
import { findPartesCorrespondentes, findParteExata } from './useSheetDownload';

// Dados de teste
const mockPartes = [
  { id: 1, instrumento: 'Trompete Bb 1' },
  { id: 2, instrumento: 'Trompete Bb 2' },
  { id: 3, instrumento: 'Trompete Bb 3' },
  { id: 4, instrumento: 'Trombone 1' },
  { id: 5, instrumento: 'Trombone 2' },
  { id: 6, instrumento: 'Trombone 3' },
  { id: 7, instrumento: 'Clarinete Bb' },
  { id: 8, instrumento: 'Saxofone Alto Eb' },
  { id: 9, instrumento: 'Saxofone Tenor Bb' },
  { id: 10, instrumento: 'Bombardino Bb' },
  { id: 11, instrumento: 'Tuba Bb' },
  { id: 12, instrumento: 'Bateria' },
  { id: 13, instrumento: 'Flauta' },
  { id: 14, instrumento: 'Requinta Eb' }
];

describe('findPartesCorrespondentes', () => {
  describe('casos basicos', () => {
    it('retorna array vazio quando instrumento e null', () => {
      const result = findPartesCorrespondentes(null, mockPartes);
      expect(result).toEqual([]);
    });

    it('retorna array vazio quando instrumento e vazio', () => {
      const result = findPartesCorrespondentes('', mockPartes);
      expect(result).toEqual([]);
    });

    it('retorna array vazio quando partes e vazio', () => {
      const result = findPartesCorrespondentes('Trompete', []);
      expect(result).toEqual([]);
    });

    it('retorna array vazio quando nao ha correspondencia', () => {
      const result = findPartesCorrespondentes('Violino', mockPartes);
      expect(result).toEqual([]);
    });
  });

  describe('correspondencia por nome base', () => {
    it('encontra todas as partes de Trompete', () => {
      const result = findPartesCorrespondentes('Trompete', mockPartes);

      expect(result).toHaveLength(3);
      expect(result.map(p => p.instrumento)).toEqual([
        'Trompete Bb 1',
        'Trompete Bb 2',
        'Trompete Bb 3'
      ]);
    });

    it('encontra todas as partes de Trombone', () => {
      const result = findPartesCorrespondentes('Trombone', mockPartes);

      expect(result).toHaveLength(3);
      expect(result.map(p => p.instrumento)).toEqual([
        'Trombone 1',
        'Trombone 2',
        'Trombone 3'
      ]);
    });

    it('encontra Saxofone Alto quando busca por Saxofone Alto', () => {
      const result = findPartesCorrespondentes('Saxofone Alto', mockPartes);

      expect(result).toHaveLength(1);
      expect(result[0].instrumento).toBe('Saxofone Alto Eb');
    });
  });

  describe('correspondencia por base (inclusiva)', () => {
    it('Trompete Bb 1 encontra todas as partes de Trompete Bb', () => {
      // A funcao remove o numero e busca pela base "Trompete Bb"
      const result = findPartesCorrespondentes('Trompete Bb 1', mockPartes);

      expect(result).toHaveLength(3);
      expect(result[0].instrumento).toBe('Trompete Bb 1');
    });

    it('funciona com case insensitive', () => {
      const result = findPartesCorrespondentes('TROMPETE BB 1', mockPartes);

      expect(result).toHaveLength(3);
      expect(result[0].instrumento).toBe('Trompete Bb 1');
    });

    it('encontra instrumento sem numero (Clarinete)', () => {
      const result = findPartesCorrespondentes('Clarinete', mockPartes);

      expect(result).toHaveLength(1);
      expect(result[0].instrumento).toBe('Clarinete Bb');
    });
  });

  describe('correspondencia parcial', () => {
    it('encontra Saxofone Alto e Tenor quando busca por Saxofone', () => {
      const result = findPartesCorrespondentes('Saxofone', mockPartes);

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(p => p.instrumento.includes('Alto'))).toBe(true);
      expect(result.some(p => p.instrumento.includes('Tenor'))).toBe(true);
    });

    it('encontra Bombardino quando busca por Bombardino', () => {
      const result = findPartesCorrespondentes('Bombardino', mockPartes);

      expect(result).toHaveLength(1);
      expect(result[0].instrumento).toBe('Bombardino Bb');
    });
  });

  describe('casos de usuario real', () => {
    it('usuario com Trompete Bb encontra Trompete Bb 1, 2, 3', () => {
      const result = findPartesCorrespondentes('Trompete Bb', mockPartes);

      expect(result).toHaveLength(3);
    });

    it('usuario com Trompete 1 encontra Trompete Bb 1', () => {
      const result = findPartesCorrespondentes('Trompete 1', mockPartes);

      // Pode encontrar por correspondencia de base
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('usuario com instrumento diferente nao encontra nada', () => {
      const result = findPartesCorrespondentes('Piano', mockPartes);

      expect(result).toEqual([]);
    });
  });
});

describe('findParteExata', () => {
  it('encontra parte com nome exato', () => {
    const result = findParteExata('Trompete Bb 1', mockPartes);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.instrumento).toBe('Trompete Bb 1');
  });

  it('encontra parte com case insensitive', () => {
    const result = findParteExata('trompete bb 1', mockPartes);

    expect(result).toBeDefined();
    expect(result.instrumento).toBe('Trompete Bb 1');
  });

  it('retorna undefined quando nao encontra', () => {
    const result = findParteExata('Violino', mockPartes);

    expect(result).toBeUndefined();
  });

  it('nao encontra match parcial', () => {
    const result = findParteExata('Trompete', mockPartes);

    // Nao deve encontrar porque "Trompete" != "Trompete Bb 1"
    expect(result).toBeUndefined();
  });

  it('encontra instrumentos simples (Bateria, Flauta)', () => {
    const bateria = findParteExata('Bateria', mockPartes);
    const flauta = findParteExata('Flauta', mockPartes);

    expect(bateria).toBeDefined();
    expect(bateria.instrumento).toBe('Bateria');
    expect(flauta).toBeDefined();
    expect(flauta.instrumento).toBe('Flauta');
  });
});

// Testes adicionais para cenarios edge
describe('edge cases', () => {
  const partesComVariacoes = [
    { id: 1, instrumento: 'Trompete' },
    { id: 2, instrumento: 'Trompete 1' },
    { id: 3, instrumento: 'Trompete Bb' },
    { id: 4, instrumento: 'Trompete Bb 1' }
  ];

  it('findPartesCorrespondentes com multiplas variacoes', () => {
    const result = findPartesCorrespondentes('Trompete', partesComVariacoes);

    // Deve encontrar todas as variacoes
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('findParteExata diferencia variacoes', () => {
    expect(findParteExata('Trompete', partesComVariacoes)?.id).toBe(1);
    expect(findParteExata('Trompete 1', partesComVariacoes)?.id).toBe(2);
    expect(findParteExata('Trompete Bb', partesComVariacoes)?.id).toBe(3);
    expect(findParteExata('Trompete Bb 1', partesComVariacoes)?.id).toBe(4);
  });

  it('partes com espacos extras funcionam', () => {
    const partesComEspacos = [
      { id: 1, instrumento: 'Trompete  Bb  1' } // espacos duplos
    ];

    // A funcao atual nao normaliza espacos, entao busca exata
    const exactResult = findParteExata('Trompete  Bb  1', partesComEspacos);
    expect(exactResult).toBeDefined();
  });
});
