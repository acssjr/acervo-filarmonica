// ===== INSTRUMENTS CONSTANTS =====
// Lista de instrumentos padrao para fallback quando API nao disponivel
// FONTE UNICA DE VERDADE: API /api/instrumentos
// Este arquivo serve apenas como fallback local

// Fallback local de instrumentos (usado quando API indisponivel)
export const DEFAULT_INSTRUMENTS = [
  { id: 1, nome: 'Grade' },
  { id: 2, nome: 'Flautim' },
  { id: 3, nome: 'Flauta' },
  { id: 4, nome: 'Requinta' },
  { id: 5, nome: 'Clarinete Bb' },
  { id: 6, nome: 'Clarinete Bb 1' },
  { id: 7, nome: 'Clarinete Bb 2' },
  { id: 8, nome: 'Sax. Soprano' },
  { id: 9, nome: 'Sax. Alto' },
  { id: 10, nome: 'Sax. Alto 1' },
  { id: 11, nome: 'Sax. Alto 2' },
  { id: 12, nome: 'Sax. Tenor' },
  { id: 13, nome: 'Sax. Tenor 1' },
  { id: 14, nome: 'Sax. Tenor 2' },
  { id: 15, nome: 'Sax. Baritono' },
  { id: 16, nome: 'Trompete Bb' },
  { id: 17, nome: 'Trompete Bb 1' },
  { id: 18, nome: 'Trompete Bb 2' },
  { id: 19, nome: 'Trompa F' },
  { id: 20, nome: 'Trompa Eb' },
  { id: 21, nome: 'Trompa Eb 1' },
  { id: 22, nome: 'Trompa Eb 2' },
  { id: 23, nome: 'Baritono Bb' },
  { id: 24, nome: 'Baritono Bb 1' },
  { id: 25, nome: 'Baritono Bb 2' },
  { id: 26, nome: 'Trombone' },
  { id: 27, nome: 'Trombone 1' },
  { id: 28, nome: 'Trombone 2' },
  { id: 29, nome: 'Bombardino' },
  { id: 30, nome: 'Bombardino Bb' },
  { id: 31, nome: 'Baixo Eb' },
  { id: 32, nome: 'Baixo Bb' },
  { id: 33, nome: 'Caixa' },
  { id: 34, nome: 'Bombo' },
  { id: 35, nome: 'Pratos' }
];

// Lista de nomes de instrumentos para compatibilidade
export const DEFAULT_INSTRUMENT_NAMES = DEFAULT_INSTRUMENTS.map(i => i.nome);

// Cria mapa de instrumentos por nome (para lookup rapido)
export const createInstrumentsMap = (instruments) => {
  const map = new Map();
  instruments.forEach(inst => {
    map.set(inst.nome.toLowerCase(), inst);
  });
  return map;
};

// Mapa padrao para fallback
export const DEFAULT_INSTRUMENTS_MAP = createInstrumentsMap(DEFAULT_INSTRUMENTS);
