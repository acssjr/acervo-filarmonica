import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  getEngagementAnalytics,
  REPERTOIRE_ACTION_WEIGHT,
} from '../src/domain/analytics/engagementAnalytics.js';
import { getSheetAnalytics } from '../src/domain/analytics/sheetAnalytics.js';

const period = {
  atual: {
    inicio: '2099-01-01',
    fim: '2099-02-01',
    diasDecorridos: 31,
    diasTotais: 31,
    incompleto: false,
  },
  comparacao: { inicio: '2098-12-01', fim: '2099-01-01' },
};

describe('analytics metric services', () => {
  let firstSheetId: number;
  let secondSheetId: number;

  beforeAll(async () => {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo, instrumento_id, convidado)
      VALUES
        (210, 'analytics.metric', 'Músico Ativo Analytics', '1234', 0, 1, 'clarinete-bb', 0),
        (211, 'analytics.metric.two', 'Músico Curioso Analytics', '1234', 0, 1, 'trompete', 0),
        (212, 'analytics.metric.admin', 'Admin Analytics Métricas', '1234', 1, 1, 'regente', 0),
        (213, 'analytics.metric.guest', 'Convidado Analytics Métricas', '1234', 0, 1, 'trompete', 1),
        (214, 'analytics.metric.inactive', 'Inativo Analytics Métricas', '1234', 0, 0, 'trompete', 0)
    `).run();

    firstSheetId = Number((await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, ativo)
      VALUES ('Partitura Mais Vista Analytics', 'Compositor Analytics', 'dobrados', 'analytics-a.pdf', 100, 1)
      RETURNING id
    `).first('id')));
    secondSheetId = Number((await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, ativo)
      VALUES ('Partitura Baixada Analytics', 'Compositor Analytics', 'dobrados', 'analytics-b.pdf', 100, 1)
      RETURNING id
    `).first('id')));

    const firstPartId = Number((await env.DB.prepare(`
      INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
      VALUES (?, 'Clarinete Bb', 'analytics-clarinete.pdf')
      RETURNING id
    `).bind(firstSheetId).first('id')));
    const secondPartId = Number((await env.DB.prepare(`
      INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
      VALUES (?, 'Trompete', 'analytics-trompete.pdf')
      RETURNING id
    `).bind(firstSheetId).first('id')));

    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO tracking_events (usuario_id, tipo, origem, partitura_id, parte_id, criado_em)
        VALUES
          (210, 'pdf_visualizado_grade', 'acervo', ?, NULL, '2099-01-02 10:00:00'),
          (210, 'pdf_visualizado_parte', 'acervo', ?, ?, '2099-01-03 10:00:00'),
          (210, 'favorito_adicionado', 'acervo', ?, NULL, '2099-01-04 10:00:00'),
          (210, 'busca_realizada', 'busca', NULL, NULL, '2099-01-05 10:00:00'),
          (211, 'pdf_visualizado_parte', 'acervo', ?, ?, '2099-01-02 10:00:00'),
          (211, 'repertorio_aberto', 'repertorio', NULL, NULL, '2099-01-03 10:00:00'),
          (211, 'repertorio_aberto', 'repertorio', NULL, NULL, '2099-01-04 10:00:00'),
          (212, 'pdf_visualizado_grade', 'admin', ?, NULL, '2099-01-02 10:00:00'),
          (213, 'pdf_visualizado_grade', 'acervo', ?, NULL, '2099-01-02 10:00:00'),
          (214, 'pdf_visualizado_grade', 'acervo', ?, NULL, '2099-01-02 10:00:00')
      `).bind(
        firstSheetId,
        firstSheetId, firstPartId,
        firstSheetId,
        firstSheetId, secondPartId,
        firstSheetId,
        firstSheetId,
        firstSheetId
      ),
      env.DB.prepare(`
        INSERT INTO logs_download (partitura_id, instrumento_id, usuario_id, data)
        VALUES (?, 'Trompete', 210, '2099-01-06 10:00:00')
      `).bind(secondSheetId),
    ]);
  });

  it('ranqueia ações úteis e exclui admin, convidado e inativo', async () => {
    const data = await getEngagementAnalytics(env, period);

    expect(REPERTOIRE_ACTION_WEIGHT).toBe(0.5);
    expect(data.ranking[0]).toMatchObject({
      nome: 'Músico Ativo Analytics',
      total_acoes: 5,
      visualizacoes: 2,
      downloads: 1,
      buscas: 1,
      favoritos: 1,
      repertorios: 0,
    });
    expect(data.ranking.some((item) => item.nome.includes('Admin'))).toBe(false);
    expect(data.ranking.some((item) => item.nome.includes('Convidado'))).toBe(false);
    expect(data.ranking.some((item) => item.nome.includes('Inativo'))).toBe(false);
  });

  it('ranqueia partituras por visualização e download de PDF com o mesmo peso', async () => {
    const data = await getSheetAnalytics(env, period);

    expect(data.ranking[0]).toMatchObject({
      titulo: 'Partitura Mais Vista Analytics',
      visualizacoes: 3,
      downloads: 0,
      acessos_pdf: 3,
    });
    expect(data.ranking.some((item) => item.titulo.includes('Admin'))).toBe(false);
  });
});
