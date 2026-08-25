import { describe, expect, it, vi } from 'vitest';
import {
  findMatchingPart,
  getRepertorioDownloadAvailability,
  getRepertorioInstrumentos
} from '../src/domain/repertorios/repertorioService.js';
import {
  canonicalizeInstrumentName,
  parseBombardinoInstrument
} from '../src/domain/instrumentos/instrumentUtils.js';

type Parte = {
  id: number;
  partitura_id: number;
  instrumento: string;
  arquivo_nome: string;
};

function matchingEnv(partes: Parte[]) {
  return {
    DB: {
      prepare: vi.fn(() => ({
        bind: vi.fn(() => ({
          all: vi.fn(async () => ({ results: partes }))
        }))
      }))
    }
  } as any;
}

describe('regra de tonalidade do Bombardino', () => {
  it('interpreta o nome legado Bombardino como Bombardino C', () => {
    expect(canonicalizeInstrumentName('Bombardino')).toBe('Bombardino C');
    expect(canonicalizeInstrumentName('Euphonium')).toBe('Bombardino C');
    expect(canonicalizeInstrumentName('Bombardino Sib')).toBe('Bombardino Bb');
    expect(canonicalizeInstrumentName('Eufônio Si bemol')).toBe('Bombardino Bb');
    expect(canonicalizeInstrumentName('Bombardino 1 e 2')).toBe('Bombardino C 1 e 2');
    expect(parseBombardinoInstrument('Bombardino Bb')).toMatchObject({
      isBombardino: true,
      tonality: 'bb'
    });
  });

  it('seleciona C quando existem C e Bb', async () => {
    const env = matchingEnv([
      { id: 1, partitura_id: 10, instrumento: 'Bombardino Bb', arquivo_nome: 'bb.pdf' },
      { id: 2, partitura_id: 10, instrumento: 'Bombardino C', arquivo_nome: 'c.pdf' }
    ]);

    const parte = await findMatchingPart(env, 10, 'Bombardino C');

    expect(parte?.id).toBe(2);
  });

  it('aceita o cadastro legado genérico somente como C', async () => {
    const env = matchingEnv([
      { id: 1, partitura_id: 10, instrumento: 'Bombardino', arquivo_nome: 'c.pdf' }
    ]);

    expect((await findMatchingPart(env, 10, 'Bombardino C'))?.id).toBe(1);
    expect(await findMatchingPart(env, 10, 'Bombardino Bb')).toBeNull();
  });

  it('nunca usa Bb como substituto de C nem C como substituto de Bb', async () => {
    const onlyBb = matchingEnv([
      { id: 1, partitura_id: 10, instrumento: 'Bombardino Bb', arquivo_nome: 'bb.pdf' }
    ]);
    const onlyC = matchingEnv([
      { id: 2, partitura_id: 10, instrumento: 'Bombardino C', arquivo_nome: 'c.pdf' }
    ]);

    expect(await findMatchingPart(onlyBb, 10, 'Bombardino C')).toBeNull();
    expect(await findMatchingPart(onlyC, 10, 'Bombardino Bb')).toBeNull();
  });

  it('reproduz o repertório do incidente sem puxar nenhuma parte Bb para C', async () => {
    const partesPorPartitura = [
      [{ id: 1202, partitura_id: 59, instrumento: 'Bombardino Bb', arquivo_nome: 'rubino.pdf' }],
      [{ id: 1599, partitura_id: 15, instrumento: 'Bombardino Bb', arquivo_nome: 'marchas-1.pdf' }],
      [
        { id: 1597, partitura_id: 16, instrumento: 'Bombardino C', arquivo_nome: 'marchas-2-c.pdf' },
        { id: 1598, partitura_id: 16, instrumento: 'Bombardino Bb', arquivo_nome: 'marchas-2-bb.pdf' }
      ],
      [{ id: 1624, partitura_id: 31, instrumento: 'Bombardino Bb', arquivo_nome: 'therezinha.pdf' }],
      [{ id: 1567, partitura_id: 58, instrumento: 'Bombardino Bb', arquivo_nome: 'antonio.pdf' }],
      [{ id: 1608, partitura_id: 14, instrumento: 'Bombardino Bb', arquivo_nome: 'nossa-senhora.pdf' }],
      [
        { id: 1616, partitura_id: 12, instrumento: 'Bombardino C', arquivo_nome: 'quem-e-c.pdf' },
        { id: 1617, partitura_id: 12, instrumento: 'Bombardino Bb', arquivo_nome: 'quem-e-bb.pdf' }
      ],
      [
        { id: 1611, partitura_id: 34, instrumento: 'Bombardino C', arquivo_nome: 'oliveira-c.pdf' },
        { id: 1612, partitura_id: 34, instrumento: 'Bombardino Bb', arquivo_nome: 'oliveira-bb.pdf' }
      ],
      [
        { id: 1609, partitura_id: 35, instrumento: 'Bombardino C', arquivo_nome: 'nupcia-c.pdf' },
        { id: 1610, partitura_id: 35, instrumento: 'Bombardino Bb', arquivo_nome: 'nupcia-bb.pdf' }
      ]
    ];

    const encontrados = [];
    for (const partes of partesPorPartitura) {
      encontrados.push(await findMatchingPart(
        matchingEnv(partes),
        partes[0].partitura_id,
        'Bombardino C'
      ));
    }

    expect(encontrados.filter(Boolean)).toHaveLength(4);
    expect(encontrados.filter(Boolean).every(parte => parte?.instrumento === 'Bombardino C')).toBe(true);
    expect(encontrados.filter(parte => parte?.instrumento === 'Bombardino Bb')).toEqual([]);
  });
});

describe('disponibilidade do download do repertório', () => {
  it('sempre oferece as escolhas C e Bb quando há Bombardino no repertório', async () => {
    const env = matchingEnv([
      { id: 1, partitura_id: 10, instrumento: 'Bombardino Bb', arquivo_nome: 'bb.pdf' }
    ]);
    const request = new Request('https://test.local/api/repertorio/1/instrumentos');

    const response = await getRepertorioInstrumentos(1, request, env);

    expect(await response.json()).toEqual(['Bombardino Bb', 'Bombardino C']);
  });

  it('lista separadamente parte ausente e arquivo ausente', async () => {
    const scores = [
      { id: 10, titulo: 'Com arquivo', ordem: 1 },
      { id: 11, titulo: 'Sem parte C', ordem: 2 },
      { id: 12, titulo: 'Sem arquivo', ordem: 3 }
    ];
    const partsByScore = new Map<number, Parte[]>([
      [10, [{ id: 1, partitura_id: 10, instrumento: 'Bombardino C', arquivo_nome: 'ok.pdf' }]],
      [11, [{ id: 2, partitura_id: 11, instrumento: 'Bombardino Bb', arquivo_nome: 'bb.pdf' }]],
      [12, [{ id: 3, partitura_id: 12, instrumento: 'Bombardino', arquivo_nome: 'missing.pdf' }]]
    ]);

    const env = {
      DB: {
        prepare: vi.fn((sql: string) => ({
          bind: vi.fn((value: number) => ({
            first: vi.fn(async () => ({ id: value, nome: 'Apresentação' })),
            all: vi.fn(async () => ({
              results: sql.includes('FROM partes')
                ? (partsByScore.get(value) || [])
                : scores
            }))
          }))
        }))
      },
      BUCKET: {
        head: vi.fn(async (key: string) => key === 'ok.pdf' ? { key } : null)
      }
    } as any;
    const request = new Request(
      'https://test.local/api/repertorio/1/disponibilidade-download?instrumento=Bombardino%20C'
    );

    const response = await getRepertorioDownloadAvailability(
      1,
      request,
      env,
      { id: 1 }
    );
    const body = await response.json() as any;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      instrumento: 'Bombardino C',
      total: 3,
      disponiveis_count: 1,
      ausentes_count: 2,
      completo: false
    });
    expect(body.disponiveis.map((item: any) => item.titulo)).toEqual(['Com arquivo']);
    expect(body.ausentes).toEqual([
      expect.objectContaining({ id: 11, motivo: 'parte_ausente' }),
      expect.objectContaining({ id: 12, motivo: 'arquivo_ausente' })
    ]);
  });
});
