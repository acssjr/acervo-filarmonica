import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  getEngagementAnalytics,
  REPERTOIRE_ACTION_WEIGHT,
} from '../src/domain/analytics/engagementAnalytics.js';
import { getSheetAnalytics } from '../src/domain/analytics/sheetAnalytics.js';
import { getAttendanceAnalytics } from '../src/domain/analytics/attendanceAnalytics.js';
import { buildAnalyticsInsights } from '../src/domain/analytics/insightService.js';

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
      env.DB.prepare(`
        INSERT OR IGNORE INTO presencas (usuario_id, data_ensaio, criado_por)
        VALUES
          (210, '2099-01-10', 1),
          (210, '2099-01-17', 1),
          (210, '2099-01-24', 1),
          (211, '2099-01-10', 1)
      `),
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

  it('calcula percentual de presença e ordena por taxa e presenças', async () => {
    const data = await getAttendanceAnalytics(env, period);

    expect(data.resumo).toMatchObject({
      ensaios_realizados: 3,
      taxa_media: 67,
    });
    expect(data.ranking[0]).toMatchObject({
      nome: 'Músico Ativo Analytics',
      taxa: 100,
      presencas: 3,
      ensaios: 3,
      estado: 'com_dados',
    });
    expect(data.ranking.some((item) => item.nome.includes('Admin'))).toBe(false);
    expect(data.ranking.some((item) => item.nome.includes('Convidado'))).toBe(false);
  });

  it('retorna estado explícito quando o período não tem ensaios', async () => {
    const data = await getAttendanceAnalytics(env, {
      atual: { inicio: '2099-03-01', fim: '2099-04-01' },
      comparacao: { inicio: '2099-02-01', fim: '2099-03-01' },
    });

    expect(data.resumo).toMatchObject({ ensaios_realizados: 0, sem_ensaios: true });
    expect(data.ranking[0]).toMatchObject({ taxa: null, estado: 'sem_ensaios' });
  });

  it('gera alerta de queda de presença com evidências e amostra mínima', () => {
    const insights = buildAnalyticsInsights({
      atual: {
        attendance: {
          resumo: { taxa_media: 62, ensaios_realizados: 3 },
        },
      },
      comparacao: {
        attendance: {
          resumo: { taxa_media: 84, ensaios_realizados: 3 },
        },
      },
      amostras: { ensaios_atual: 3, ensaios_comparacao: 3 },
    });

    expect(insights).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'queda_presenca', tipo: 'alerta' }),
    ]));
    expect(insights.find((item) => item.id === 'queda_presenca')).toMatchObject({
      evidencias: expect.objectContaining({ atual: 62, comparacao: 84, delta: -22 }),
    });
  });
});
