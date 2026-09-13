const ELIGIBLE_USER_FILTER = `
  u.ativo = 1
  AND u.admin = 0
  AND COALESCE(u.convidado, 0) = 0
`;

const emptyResults = (result) => result?.results || [];

function toNumber(value) {
  return Number(value || 0);
}

async function querySheetRanking(env, start, end) {
  const result = await env.DB.prepare(`
    WITH acessos AS (
      SELECT
        te.partitura_id,
        1 as visualizacoes,
        0 as downloads,
        te.usuario_id,
        CASE
          WHEN te.tipo = 'pdf_visualizado_parte' THEN pa.instrumento
          WHEN te.tipo = 'pdf_visualizado_grade' THEN 'Grade'
          ELSE NULL
        END as instrumento_explorado
      FROM tracking_events te
      JOIN usuarios u ON u.id = te.usuario_id
      LEFT JOIN partes pa ON pa.id = te.parte_id
      WHERE te.criado_em >= ? AND te.criado_em < ?
        AND te.partitura_id IS NOT NULL
        AND te.tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte')
        AND ${ELIGIBLE_USER_FILTER}

      UNION ALL

      SELECT
        ld.partitura_id,
        0 as visualizacoes,
        1 as downloads,
        ld.usuario_id,
        COALESCE(ld.instrumento_id, 'Grade') as instrumento_explorado
      FROM logs_download ld
      JOIN usuarios u ON u.id = ld.usuario_id
      WHERE ld.data >= ? AND ld.data < ?
        AND ld.usuario_id IS NOT NULL
        AND ${ELIGIBLE_USER_FILTER}
    )
    SELECT
      p.id,
      p.titulo,
      p.compositor,
      SUM(a.visualizacoes) as visualizacoes,
      SUM(a.downloads) as downloads,
      SUM(a.visualizacoes) + SUM(a.downloads) as acessos_pdf,
      COUNT(DISTINCT a.usuario_id) as usuarios,
      COUNT(DISTINCT a.instrumento_explorado) as instrumentos_explorados
    FROM acessos a
    JOIN partituras p ON p.id = a.partitura_id
    WHERE p.ativo = 1
    GROUP BY p.id, p.titulo, p.compositor
    ORDER BY acessos_pdf DESC, usuarios DESC, p.titulo COLLATE NOCASE ASC
    LIMIT 100
  `).bind(start, end, start, end).all();

  return emptyResults(result).map((item) => ({
    ...item,
    visualizacoes: toNumber(item.visualizacoes),
    downloads: toNumber(item.downloads),
    acessos_pdf: toNumber(item.acessos_pdf),
    usuarios: toNumber(item.usuarios),
    instrumentos_explorados: toNumber(item.instrumentos_explorados),
  }));
}

async function queryPartRanking(env, start, end) {
  const result = await env.DB.prepare(`
    WITH partes_uso AS (
      SELECT
        te.parte_id,
        COUNT(*) as visualizacoes,
        0 as downloads
      FROM tracking_events te
      JOIN usuarios u ON u.id = te.usuario_id
      WHERE te.criado_em >= ? AND te.criado_em < ?
        AND te.tipo = 'pdf_visualizado_parte'
        AND te.parte_id IS NOT NULL
        AND ${ELIGIBLE_USER_FILTER}
      GROUP BY te.parte_id

      UNION ALL

      SELECT
        pa.id as parte_id,
        0 as visualizacoes,
        COUNT(*) as downloads
      FROM logs_download ld
      JOIN usuarios u ON u.id = ld.usuario_id
      JOIN partes pa ON pa.partitura_id = ld.partitura_id AND pa.instrumento = ld.instrumento_id
      WHERE ld.data >= ? AND ld.data < ?
        AND ld.usuario_id IS NOT NULL
        AND ${ELIGIBLE_USER_FILTER}
      GROUP BY pa.id
    )
    SELECT
      pa.id,
      pa.instrumento,
      p.titulo as partitura_titulo,
      SUM(pu.visualizacoes) as visualizacoes,
      SUM(pu.downloads) as downloads,
      SUM(pu.visualizacoes) + SUM(pu.downloads) as acessos_pdf
    FROM partes_uso pu
    JOIN partes pa ON pa.id = pu.parte_id
    JOIN partituras p ON p.id = pa.partitura_id
    WHERE p.ativo = 1
    GROUP BY pa.id, pa.instrumento, p.titulo
    ORDER BY acessos_pdf DESC, pa.instrumento COLLATE NOCASE ASC
    LIMIT 100
  `).bind(start, end, start, end).all();

  return emptyResults(result).map((item) => ({
    ...item,
    visualizacoes: toNumber(item.visualizacoes),
    downloads: toNumber(item.downloads),
    acessos_pdf: toNumber(item.acessos_pdf),
  }));
}

function summarizeSheets(ranking) {
  return ranking.reduce((summary, item) => ({
    visualizacoes: summary.visualizacoes + item.visualizacoes,
    downloads: summary.downloads + item.downloads,
    acessos_pdf: summary.acessos_pdf + item.acessos_pdf,
    usuarios: summary.usuarios + item.usuarios,
    partituras_com_acao: summary.partituras_com_acao + 1,
  }), {
    visualizacoes: 0,
    downloads: 0,
    acessos_pdf: 0,
    usuarios: 0,
    partituras_com_acao: 0,
  });
}

export async function getSheetAnalytics(env, period) {
  const ranking = await querySheetRanking(env, period.atual.inicio, period.atual.fim);
  const previousRanking = await querySheetRanking(env, period.comparacao.inicio, period.comparacao.fim);
  const resumo = summarizeSheets(ranking);
  const resumoAnterior = summarizeSheets(previousRanking);

  return {
    resumo: {
      ...resumo,
      variacao_acessos: resumoAnterior.acessos_pdf
        ? Math.round(((resumo.acessos_pdf - resumoAnterior.acessos_pdf) / resumoAnterior.acessos_pdf) * 100)
        : null,
    },
    ranking,
    partes: await queryPartRanking(env, period.atual.inicio, period.atual.fim),
    tendencia: [],
    amostras: {
      partituras_com_acao: resumo.partituras_com_acao,
      partituras_com_acao_anterior: resumoAnterior.partituras_com_acao,
    },
  };
}
