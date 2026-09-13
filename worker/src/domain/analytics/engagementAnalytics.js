export const REPERTOIRE_ACTION_WEIGHT = 0.5;

const ELIGIBLE_USER_FILTER = `
  u.ativo = 1
  AND u.admin = 0
  AND COALESCE(u.convidado, 0) = 0
`;

const emptyResults = (result) => result?.results || [];

function toNumber(value) {
  return Number(value || 0);
}

function summarizeRanking(ranking) {
  return ranking.reduce((summary, item) => ({
    total_acoes: summary.total_acoes + toNumber(item.total_acoes),
    visualizacoes: summary.visualizacoes + toNumber(item.visualizacoes),
    downloads: summary.downloads + toNumber(item.downloads),
    buscas: summary.buscas + toNumber(item.buscas),
    favoritos: summary.favoritos + toNumber(item.favoritos),
    repertorios: summary.repertorios + toNumber(item.repertorios),
    usuarios_com_acao: summary.usuarios_com_acao + 1,
  }), {
    total_acoes: 0,
    visualizacoes: 0,
    downloads: 0,
    buscas: 0,
    favoritos: 0,
    repertorios: 0,
    usuarios_com_acao: 0,
  });
}

async function queryRanking(env, start, end) {
  const result = await env.DB.prepare(`
    WITH acoes AS (
      SELECT
        te.usuario_id,
        CASE WHEN te.tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') THEN 1 ELSE 0 END as visualizacoes,
        CASE WHEN te.tipo IN ('favorito_adicionado', 'favorito_removido') THEN 1 ELSE 0 END as favoritos,
        CASE WHEN te.tipo = 'busca_realizada' THEN 1 ELSE 0 END as buscas,
        CASE WHEN te.tipo = 'repertorio_aberto' THEN 1 ELSE 0 END as repertorios,
        0 as downloads,
        date(te.criado_em) as dia_ativo,
        te.session_id as sessao
      FROM tracking_events te
      JOIN usuarios u ON u.id = te.usuario_id
      WHERE te.criado_em >= ? AND te.criado_em < ?
        AND te.tipo IN (
          'pdf_visualizado_grade', 'pdf_visualizado_parte',
          'favorito_adicionado', 'favorito_removido',
          'busca_realizada', 'repertorio_aberto'
        )
        AND ${ELIGIBLE_USER_FILTER}

      UNION ALL

      SELECT
        ld.usuario_id,
        0 as visualizacoes,
        0 as favoritos,
        0 as buscas,
        0 as repertorios,
        1 as downloads,
        date(ld.data) as dia_ativo,
        NULL as sessao
      FROM logs_download ld
      JOIN usuarios u ON u.id = ld.usuario_id
      WHERE ld.data >= ? AND ld.data < ?
        AND ld.usuario_id IS NOT NULL
        AND ${ELIGIBLE_USER_FILTER}
    )
    SELECT
      u.id,
      u.nome,
      i.nome as instrumento,
      u.foto_url,
      SUM(a.visualizacoes) as visualizacoes,
      SUM(a.downloads) as downloads,
      SUM(a.buscas) as buscas,
      SUM(a.favoritos) as favoritos,
      SUM(a.repertorios) as repertorios,
      COUNT(DISTINCT a.dia_ativo) as dias_ativos,
      COUNT(DISTINCT a.sessao) as sessoes,
      ROUND(
        SUM(a.visualizacoes) + SUM(a.downloads) + SUM(a.buscas) + SUM(a.favoritos) +
        (SUM(a.repertorios) * ${REPERTOIRE_ACTION_WEIGHT}),
        2
      ) as total_acoes
    FROM acoes a
    JOIN usuarios u ON u.id = a.usuario_id
    LEFT JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE ${ELIGIBLE_USER_FILTER}
    GROUP BY u.id, u.nome, i.nome, u.foto_url
    ORDER BY total_acoes DESC, dias_ativos DESC, u.nome COLLATE NOCASE ASC
    LIMIT 100
  `).bind(start, end, start, end).all();

  return emptyResults(result).map((item) => ({
    ...item,
    visualizacoes: toNumber(item.visualizacoes),
    downloads: toNumber(item.downloads),
    buscas: toNumber(item.buscas),
    favoritos: toNumber(item.favoritos),
    repertorios: toNumber(item.repertorios),
    dias_ativos: toNumber(item.dias_ativos),
    sessoes: toNumber(item.sessoes),
    total_acoes: toNumber(item.total_acoes),
  }));
}

async function queryTrend(env, start, end) {
  const result = await env.DB.prepare(`
    SELECT data, SUM(total) as total
    FROM (
      SELECT date(te.criado_em) as data, COUNT(*) as total
      FROM tracking_events te
      JOIN usuarios u ON u.id = te.usuario_id
      WHERE te.criado_em >= ? AND te.criado_em < ?
        AND te.tipo IN (
          'pdf_visualizado_grade', 'pdf_visualizado_parte',
          'favorito_adicionado', 'favorito_removido',
          'busca_realizada', 'repertorio_aberto'
        )
        AND ${ELIGIBLE_USER_FILTER}
      GROUP BY date(te.criado_em)

      UNION ALL

      SELECT date(ld.data) as data, COUNT(*) as total
      FROM logs_download ld
      JOIN usuarios u ON u.id = ld.usuario_id
      WHERE ld.data >= ? AND ld.data < ?
        AND ld.usuario_id IS NOT NULL
        AND ${ELIGIBLE_USER_FILTER}
      GROUP BY date(ld.data)
    )
    GROUP BY data
    ORDER BY data ASC
  `).bind(start, end, start, end).all();

  return emptyResults(result).map((item) => ({ data: item.data, total: toNumber(item.total) }));
}

async function getEligibleUserCount(env) {
  const result = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM usuarios u
    WHERE ${ELIGIBLE_USER_FILTER}
  `).first();
  return toNumber(result?.total);
}

export async function getEngagementAnalytics(env, period) {
  const currentRanking = await queryRanking(env, period.atual.inicio, period.atual.fim);
  const previousRanking = await queryRanking(env, period.comparacao.inicio, period.comparacao.fim);
  const resumo = summarizeRanking(currentRanking);
  const resumoAnterior = summarizeRanking(previousRanking);

  return {
    resumo: {
      ...resumo,
      usuarios_elegiveis: await getEligibleUserCount(env),
      variacao_acoes: resumoAnterior.total_acoes
        ? Math.round(((resumo.total_acoes - resumoAnterior.total_acoes) / resumoAnterior.total_acoes) * 100)
        : null,
    },
    ranking: currentRanking,
    tendencia: await queryTrend(env, period.atual.inicio, period.atual.fim),
    amostras: {
      usuarios_com_acao: resumo.usuarios_com_acao,
      usuarios_com_acao_anterior: resumoAnterior.usuarios_com_acao,
    },
  };
}
