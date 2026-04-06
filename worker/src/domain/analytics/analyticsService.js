// worker/src/domain/analytics/analyticsService.js
import { jsonResponse } from '../../infrastructure/index.js';

const NAIPES_VALIDOS = ['Madeiras', 'Metais', 'Percussão'];

const emptyResults = (result) => result?.results || [];

function getPeriod(url) {
  const now = new Date();
  const startDefault = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endDefault = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const start = url.searchParams.get('inicio') || startDefault.toISOString().slice(0, 10);
  const end = url.searchParams.get('fim') || endDefault.toISOString().slice(0, 10);
  return { start, end };
}

function getPositiveStreak(userId, ensaiosDesc, presencasSet) {
  let streak = 0;
  for (const data of ensaiosDesc) {
    if (!presencasSet.has(`${userId}:${data}`)) {
      break;
    }
    streak += 1;
  }
  return streak;
}

async function getUsoAcervo(env, start, end) {
  const resumo = await env.DB.prepare(`
    SELECT
      SUM(CASE WHEN tipo = 'partitura_aberta' THEN 1 ELSE 0 END) as partituras_abertas,
      SUM(CASE WHEN tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') THEN 1 ELSE 0 END) as pdfs_visualizados,
      SUM(CASE WHEN tipo IN ('download_grade', 'download_parte') THEN 1 ELSE 0 END) as downloads_reais,
      SUM(CASE WHEN tipo IN ('busca_realizada', 'busca_digitada') AND resultados_count = 0 THEN 1 ELSE 0 END) as buscas_sem_resultado
    FROM tracking_events
    WHERE criado_em >= ? AND criado_em < ?
  `).bind(start, end).first();

  const partiturasAbertas = resumo?.partituras_abertas || 0;
  const pdfsVisualizados = resumo?.pdfs_visualizados || 0;
  const downloadsReais = resumo?.downloads_reais || 0;

  const topPartituras = await env.DB.prepare(`
    SELECT
      p.id,
      p.titulo,
      p.compositor,
      SUM(CASE WHEN te.tipo = 'partitura_aberta' THEN 1 ELSE 0 END) as aberturas,
      SUM(CASE WHEN te.tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') THEN 1 ELSE 0 END) as visualizacoes,
      SUM(CASE WHEN te.tipo IN ('download_grade', 'download_parte') THEN 1 ELSE 0 END) as downloads
    FROM tracking_events te
    JOIN partituras p ON p.id = te.partitura_id
    WHERE te.criado_em >= ? AND te.criado_em < ?
      AND te.partitura_id IS NOT NULL
    GROUP BY p.id, p.titulo, p.compositor
    ORDER BY (aberturas + visualizacoes + downloads) DESC
    LIMIT 10
  `).bind(start, end).all();

  const topPartes = await env.DB.prepare(`
    SELECT
      pa.id,
      pa.instrumento,
      p.titulo as partitura_titulo,
      SUM(CASE WHEN te.tipo = 'pdf_visualizado_parte' THEN 1 ELSE 0 END) as visualizacoes,
      SUM(CASE WHEN te.tipo = 'download_parte' THEN 1 ELSE 0 END) as downloads
    FROM tracking_events te
    JOIN partes pa ON pa.id = te.parte_id
    JOIN partituras p ON p.id = pa.partitura_id
    WHERE te.criado_em >= ? AND te.criado_em < ?
      AND te.parte_id IS NOT NULL
    GROUP BY pa.id, pa.instrumento, p.titulo
    ORDER BY (visualizacoes + downloads) DESC
    LIMIT 10
  `).bind(start, end).all();

  const buscasSemResultado = await env.DB.prepare(`
    SELECT termo_normalizado as termo, COUNT(*) as tentativas
    FROM tracking_events
    WHERE criado_em >= ? AND criado_em < ?
      AND tipo IN ('busca_realizada', 'busca_digitada')
      AND resultados_count = 0
      AND termo_normalizado IS NOT NULL
    GROUP BY termo_normalizado
    ORDER BY tentativas DESC
    LIMIT 5
  `).bind(start, end).all();

  const insights = emptyResults(buscasSemResultado).map((item) => ({
    tipo: 'busca_sem_resultado',
    titulo: 'Busca sem resultado',
    descricao: `${item.termo}: ${item.tentativas} tentativa${item.tentativas === 1 ? '' : 's'}`
  }));

  return {
    resumo: {
      partituras_abertas: partiturasAbertas,
      pdfs_visualizados: pdfsVisualizados,
      downloads_reais: downloadsReais,
      buscas_sem_resultado: resumo?.buscas_sem_resultado || 0,
      conversao_visualizacao: partiturasAbertas ? Math.round((pdfsVisualizados / partiturasAbertas) * 100) : 0,
      conversao_download: partiturasAbertas ? Math.round((downloadsReais / partiturasAbertas) * 100) : 0
    },
    funil: [
      { etapa: 'Partituras abertas', total: partiturasAbertas },
      { etapa: 'PDFs visualizados', total: pdfsVisualizados },
      { etapa: 'Downloads reais', total: downloadsReais }
    ],
    top_partituras: emptyResults(topPartituras),
    top_partes: emptyResults(topPartes),
    insights
  };
}

async function getPessoas(env, url, start, end) {
  const selectedUserId = url.searchParams.get('usuario_id');
  const rawLimit = Number.parseInt(url.searchParams.get('timeline_limit') ?? '', 10);
  const rawOffset = Number.parseInt(url.searchParams.get('timeline_offset') ?? '', 10);
  const timelineLimit = Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 30, 100);
  const timelineOffset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;

  const usuarios = await env.DB.prepare(`
    SELECT DISTINCT u.id, u.nome, u.foto_url, i.nome as instrumento
    FROM tracking_events te
    JOIN usuarios u ON u.id = te.usuario_id
    LEFT JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE te.criado_em >= ? AND te.criado_em < ?
    ORDER BY u.nome ASC
  `).bind(start, end).all();

  if (!selectedUserId) {
    return {
      usuarios: emptyResults(usuarios),
      resumo_usuario: null,
      timeline: [],
      total_timeline: 0
    };
  }

  const resumoUsuario = await env.DB.prepare(`
    SELECT
      SUM(CASE WHEN tipo = 'partitura_aberta' THEN 1 ELSE 0 END) as partituras_abertas,
      SUM(CASE WHEN tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') THEN 1 ELSE 0 END) as pdfs_visualizados,
      SUM(CASE WHEN tipo IN ('download_grade', 'download_parte') THEN 1 ELSE 0 END) as downloads_reais,
      SUM(CASE WHEN tipo IN ('busca_realizada', 'busca_digitada') THEN 1 ELSE 0 END) as buscas,
      SUM(CASE WHEN tipo = 'favorito_adicionado' THEN 1 ELSE 0 END) as favoritos
    FROM tracking_events
    WHERE usuario_id = ? AND criado_em >= ? AND criado_em < ?
  `).bind(selectedUserId, start, end).first();

  const timeline = await env.DB.prepare(`
    SELECT
      te.id,
      te.session_id,
      te.tipo,
      te.origem,
      te.partitura_id,
      te.parte_id,
      te.repertorio_id,
      te.termo_original,
      te.termo_normalizado,
      te.resultados_count,
      te.metadata_json,
      te.criado_em,
      p.titulo as partitura_titulo,
      pa.instrumento as parte_instrumento
    FROM tracking_events te
    LEFT JOIN partituras p ON p.id = te.partitura_id
    LEFT JOIN partes pa ON pa.id = te.parte_id
    WHERE te.usuario_id = ? AND te.criado_em >= ? AND te.criado_em < ?
    ORDER BY te.criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(selectedUserId, start, end, timelineLimit, timelineOffset).all();

  const totalTimeline = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM tracking_events
    WHERE usuario_id = ? AND criado_em >= ? AND criado_em < ?
  `).bind(selectedUserId, start, end).first();

  return {
    usuarios: emptyResults(usuarios),
    resumo_usuario: resumoUsuario || null,
    timeline: emptyResults(timeline),
    total_timeline: totalTimeline?.total || 0
  };
}

async function getEnsaios(env, start, end) {
  const ensaios = await env.DB.prepare(`
    SELECT DISTINCT data_ensaio
    FROM presencas
    WHERE data_ensaio >= ? AND data_ensaio < ?
    ORDER BY data_ensaio DESC
  `).bind(start, end).all();

  const ensaiosDesc = emptyResults(ensaios).map((row) => row.data_ensaio);
  const totalEnsaios = ensaiosDesc.length;

  const musicos = await env.DB.prepare(`
    SELECT u.id, u.nome, i.nome as instrumento, i.familia
    FROM usuarios u
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE u.ativo = 1
      AND u.admin = 0
      AND i.familia IN ('Madeiras', 'Metais', 'Percussão')
    ORDER BY u.nome ASC
  `).all();

  const presencas = await env.DB.prepare(`
    SELECT p.usuario_id, p.data_ensaio
    FROM presencas p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE p.data_ensaio >= ? AND p.data_ensaio < ?
      AND u.ativo = 1
      AND u.admin = 0
      AND i.familia IN ('Madeiras', 'Metais', 'Percussão')
  `).bind(start, end).all();

  const presencasRows = emptyResults(presencas);
  const presencasSet = new Set(presencasRows.map((row) => `${row.usuario_id}:${row.data_ensaio}`));
  const musicosRows = emptyResults(musicos);

  const assiduidade = musicosRows.map((musico) => {
    const presencasRegistradas = presencasRows.filter((row) => row.usuario_id === musico.id).length;
    return {
      ...musico,
      presencas: presencasRegistradas,
      ensaios: totalEnsaios,
      taxa: totalEnsaios ? Math.round((presencasRegistradas / totalEnsaios) * 100) : 0,
      streak: getPositiveStreak(musico.id, ensaiosDesc, presencasSet)
    };
  });

  const presencaNaipes = NAIPES_VALIDOS.map((familia) => {
    const musicosFamilia = musicosRows.filter((musico) => musico.familia === familia);
    const registradas = presencasRows.filter((row) => {
      const musico = musicosRows.find((item) => item.id === row.usuario_id);
      return musico?.familia === familia;
    }).length;
    const esperadas = musicosFamilia.length * totalEnsaios;

    return {
      familia,
      musicos: musicosFamilia.length,
      ensaios: totalEnsaios,
      registradas,
      esperadas,
      taxa: esperadas ? Math.round((registradas / esperadas) * 100) : 0
    };
  });

  const maiorStreak = assiduidade.reduce((max, item) => Math.max(max, item.streak), 0);
  const presencasEsperadas = musicosRows.length * totalEnsaios;

  return {
    mes: start.slice(0, 7),
    empty_state: totalEnsaios === 0 ? 'Nenhum ensaio registrado neste mês' : null,
    resumo: {
      presenca_media: presencasEsperadas ? Math.round((presencasRows.length / presencasEsperadas) * 100) : 0,
      maior_streak_ativo: maiorStreak,
      musicos_presenca_perfeita: assiduidade.filter((item) => totalEnsaios > 0 && item.presencas === totalEnsaios).length,
      ensaios_registrados: totalEnsaios
    },
    streaks: [...assiduidade].sort((a, b) => b.streak - a.streak).slice(0, 15),
    assiduidade_musicos: assiduidade,
    presenca_naipes: presencaNaipes
  };
}

async function getAlteracoes(env, start, end, url) {
  const usuarioId = url.searchParams.get('atividade_usuario_id');
  const rawLimit = Number.parseInt(url.searchParams.get('atividades_limit') ?? '', 10);
  const rawOffset = Number.parseInt(url.searchParams.get('atividades_offset') ?? '', 10);
  const limit = Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 15, 100);
  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;
  const params = [start, end];
  const usuarioFilter = usuarioId ? 'AND a.usuario_id = ?' : '';
  if (usuarioId) params.push(usuarioId);

  const atividades = await env.DB.prepare(`
    SELECT
      a.id,
      a.tipo,
      a.titulo,
      a.detalhes,
      a.criado_em,
      u.nome as usuario_nome,
      u.id as usuario_id
    FROM atividades a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.criado_em >= ? AND a.criado_em < ?
      ${usuarioFilter}
    ORDER BY a.criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all();

  const total = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM atividades a
    WHERE a.criado_em >= ? AND a.criado_em < ?
      ${usuarioFilter}
  `).bind(...params).first();

  const usuarios = await env.DB.prepare(`
    SELECT DISTINCT u.id, u.nome
    FROM atividades a
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.criado_em >= ? AND a.criado_em < ?
    ORDER BY u.nome ASC
  `).bind(start, end).all();

  return {
    usuarios: emptyResults(usuarios),
    atividades: emptyResults(atividades),
    total: total?.total || 0
  };
}

export async function getAnalyticsDashboard(request, env, _params, _context) {
  try {
    const url = new URL(request.url);
    const { start, end } = getPeriod(url);

    // Chaves legadas mantidas temporariamente para rollout seguro.
    const resumo = await env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM usuarios WHERE ativo = 1 AND admin = 0) as musicos_ativos,
        (SELECT COUNT(*) FROM partituras WHERE ativo = 1) as total_partituras,
        (SELECT COALESCE(SUM(downloads), 0) FROM partituras) as total_downloads,
        (SELECT COUNT(DISTINCT usuario_id) FROM presencas WHERE data_ensaio >= date('now', '-30 days')) as presentes_ultimo_mes,
        (SELECT COUNT(DISTINCT data_ensaio) FROM presencas WHERE data_ensaio >= date('now', '-30 days')) as ensaios_ultimo_mes
    `).first();

    const downloadsTimeline = await env.DB.prepare(`
      SELECT strftime('%Y-%m-%d', data) as data, COUNT(*) as total
      FROM logs_download
      WHERE data >= date('now', '-30 days')
      GROUP BY strftime('%Y-%m-%d', data)
      ORDER BY data ASC
    `).all();

    const topPartituras = await env.DB.prepare(`
      SELECT titulo, compositor, downloads
      FROM partituras
      WHERE ativo = 1
      ORDER BY downloads DESC
      LIMIT 10
    `).all();

    const instrumentosDist = await env.DB.prepare(`
      SELECT i.nome as instrumento, i.familia, COUNT(u.id) as total
      FROM usuarios u
      JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1 AND u.admin = 0
      GROUP BY i.nome, i.familia
      ORDER BY total DESC
    `).all();

    const presencasFamilia = await env.DB.prepare(`
      SELECT i.familia, COUNT(p.id) as total_presencas
      FROM presencas p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE p.data_ensaio >= date('now', '-90 days')
        AND u.admin = 0
        AND i.familia IN ('Madeiras', 'Metais', 'Percussão')
      GROUP BY i.familia
      ORDER BY total_presencas DESC
    `).all();

    const musicosMaisAtivos = await env.DB.prepare(`
      SELECT u.id, u.nome, u.foto_url, i.nome as instrumento, COUNT(a.id) as total_downloads, MAX(a.criado_em) as ultimo_download
      FROM atividades a
      JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1 AND a.tipo = 'download'
      GROUP BY u.id
      ORDER BY total_downloads DESC
      LIMIT 15
    `).all();

    const ultimoAcesso = await env.DB.prepare(`
      SELECT u.id, u.nome, u.foto_url, u.ultimo_acesso, i.nome as instrumento
      FROM usuarios u
      LEFT JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1
      ORDER BY u.ultimo_acesso DESC
    `).all();

    const tendenciaPresenca = await env.DB.prepare(`
      SELECT p.data_ensaio as data, COUNT(p.id) as presentes
      FROM presencas p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.data_ensaio >= date('now', '-90 days') AND u.admin = 0
      GROUP BY p.data_ensaio
      ORDER BY p.data_ensaio DESC
      LIMIT 10
    `).all();

    const termosSemResultado = await env.DB.prepare(`
      SELECT termo, COUNT(*) as tentativas
      FROM logs_buscas
      WHERE resultados_count = 0
      GROUP BY termo
      ORDER BY tentativas DESC
      LIMIT 10
    `).all();

    const topTermos = await env.DB.prepare(`
      SELECT termo, COUNT(*) as total
      FROM logs_buscas
      GROUP BY termo
      ORDER BY total DESC
      LIMIT 10
    `).all();

    const usoAcervo = await getUsoAcervo(env, start, end);
    const pessoas = await getPessoas(env, url, start, end);
    const ensaios = await getEnsaios(env, start, end);
    const alteracoes = await getAlteracoes(env, start, end, url);

    return jsonResponse({
      periodo: { inicio: start, fim: end },
      uso_acervo: usoAcervo,
      pessoas,
      ensaios,
      alteracoes,
      resumo: resumo || {},
      downloads_timeline: emptyResults(downloadsTimeline),
      top_partituras: emptyResults(topPartituras),
      instrumentos_dist: emptyResults(instrumentosDist),
      presencas_familia: emptyResults(presencasFamilia),
      musicos_mais_ativos: emptyResults(musicosMaisAtivos),
      ultimo_acesso: emptyResults(ultimoAcesso),
      tendencia_presenca: emptyResults(tendenciaPresenca).reverse(),
      top_search_terms: emptyResults(topTermos),
      failed_search_terms: emptyResults(termosSemResultado),
      atividade_recente: alteracoes.atividades,
      total_atividades: alteracoes.total
    }, 200, request);

  } catch (error) {
    console.error('Analytics error:', error);
    return jsonResponse({ error: 'Erro ao carregar analytics', details: error.message }, 500, request);
  }
}
