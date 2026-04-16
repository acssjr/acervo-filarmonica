// worker/src/domain/analytics/analyticsService.js
import { jsonResponse } from '../../infrastructure/index.js';

const NAIPES_VALIDOS = ['Madeiras', 'Metais', 'Percussão'];

const AUDIT_ACTIVITY_TYPES = [
  'nova_partitura',
  'novo_repertorio',
  'update_repertorio',
  'delete_repertorio',
  'add_repertorio',
  'remove_repertorio',
  'reorder_repertorio',
  'update_partitura',
  'delete_partitura',
  'nova_parte',
  'update_parte',
  'delete_parte',
  'aviso_criado',
  'aviso_atualizado',
  'aviso_ativado',
  'aviso_desativado',
  'aviso_excluido'
];
const AUDIT_ACTIVITY_PLACEHOLDERS = AUDIT_ACTIVITY_TYPES.map(() => '?').join(', ');

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

function withCompetitionRanking(items, tieKey) {
  let lastKey = null;
  let lastPosition = 0;

  return items.map((item, index) => {
    const key = tieKey(item);
    const position = key === lastKey ? lastPosition : index + 1;
    lastKey = key;
    lastPosition = position;
    return { ...item, posicao: position };
  });
}

async function getUsoAcervo(env, start, end) {
  const resumo = await env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM tracking_events WHERE tipo = 'partitura_aberta' AND criado_em >= ? AND criado_em < ?) as partituras_abertas,
      (SELECT COUNT(*) FROM tracking_events WHERE tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') AND criado_em >= ? AND criado_em < ?) as pdfs_visualizados,
      (SELECT COUNT(*) FROM logs_download WHERE data >= ? AND data < ?) as downloads_reais,
      (
        (SELECT COUNT(*) FROM logs_buscas WHERE resultados_count = 0 AND data >= ? AND data < ?) +
        (SELECT COUNT(*) FROM tracking_events WHERE tipo = 'busca_realizada' AND resultados_count = 0 AND criado_em >= ? AND criado_em < ?)
      ) as buscas_sem_resultado
  `).bind(start, end, start, end, start, end, start, end, start, end).first();

  const partiturasAbertas = resumo?.partituras_abertas || 0;
  const pdfsVisualizados = resumo?.pdfs_visualizados || 0;
  const downloadsReais = resumo?.downloads_reais || 0;

  const topPartituras = await env.DB.prepare(`
    WITH uso_partituras AS (
      SELECT
        partitura_id,
        SUM(CASE WHEN tipo = 'partitura_aberta' THEN 1 ELSE 0 END) as aberturas,
        SUM(CASE WHEN tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') THEN 1 ELSE 0 END) as visualizacoes,
        0 as downloads
      FROM tracking_events
      WHERE criado_em >= ? AND criado_em < ?
        AND partitura_id IS NOT NULL
      GROUP BY partitura_id

      UNION ALL

      SELECT
        partitura_id,
        0 as aberturas,
        0 as visualizacoes,
        COUNT(*) as downloads
      FROM logs_download
      WHERE data >= ? AND data < ?
      GROUP BY partitura_id
    )
    SELECT
      p.id,
      p.titulo,
      p.compositor,
      SUM(up.aberturas) as aberturas,
      SUM(up.visualizacoes) as visualizacoes,
      SUM(up.downloads) as downloads
    FROM uso_partituras up
    JOIN partituras p ON p.id = up.partitura_id
    GROUP BY p.id, p.titulo, p.compositor
    ORDER BY (SUM(up.aberturas) + SUM(up.visualizacoes) + SUM(up.downloads)) DESC
    LIMIT 10
  `).bind(start, end, start, end).all();

  const topPartes = await env.DB.prepare(`
    WITH uso_partes AS (
      SELECT
        pa.id,
        pa.instrumento,
        p.titulo as partitura_titulo,
        COUNT(*) as visualizacoes,
        0 as downloads
      FROM tracking_events te
      JOIN partes pa ON pa.id = te.parte_id
      JOIN partituras p ON p.id = pa.partitura_id
      WHERE te.criado_em >= ? AND te.criado_em < ?
        AND te.tipo = 'pdf_visualizado_parte'
        AND te.parte_id IS NOT NULL
      GROUP BY pa.id, pa.instrumento, p.titulo

      UNION ALL

      SELECT
        pa.id,
        COALESCE(pa.instrumento, ld.instrumento_id, 'Parte não identificada') as instrumento,
        p.titulo as partitura_titulo,
        0 as visualizacoes,
        COUNT(*) as downloads
      FROM logs_download ld
      JOIN partituras p ON p.id = ld.partitura_id
      LEFT JOIN partes pa ON pa.partitura_id = ld.partitura_id AND pa.instrumento = ld.instrumento_id
      WHERE ld.data >= ? AND ld.data < ?
        AND ld.instrumento_id IS NOT NULL
      GROUP BY pa.id, pa.instrumento, ld.instrumento_id, p.titulo
    )
    SELECT
      id,
      instrumento,
      partitura_titulo,
      SUM(visualizacoes) as visualizacoes,
      SUM(downloads) as downloads
    FROM uso_partes
    GROUP BY id, instrumento, partitura_titulo
    ORDER BY (visualizacoes + downloads) DESC
    LIMIT 10
  `).bind(start, end, start, end).all();

  const buscasSemResultado = await env.DB.prepare(`
    SELECT termo, COUNT(*) as tentativas
    FROM (
      SELECT termo_normalizado as termo
      FROM tracking_events
      WHERE criado_em >= ? AND criado_em < ?
        AND tipo = 'busca_realizada'
        AND resultados_count = 0
        AND termo_normalizado IS NOT NULL

      UNION ALL

      SELECT termo
      FROM logs_buscas
      WHERE data >= ? AND data < ?
        AND resultados_count = 0
        AND termo IS NOT NULL
    )
    GROUP BY termo
    ORDER BY tentativas DESC
    LIMIT 5
  `).bind(start, end, start, end).all();

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
    SELECT u.id, u.nome, u.foto_url, i.nome as instrumento
    FROM usuarios u
    LEFT JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE u.ativo = 1
      AND u.admin = 0
      AND COALESCE(u.convidado, 0) = 0
    ORDER BY u.nome ASC
  `).all();

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
      (SELECT COUNT(*) FROM tracking_events WHERE usuario_id = ? AND tipo = 'partitura_aberta' AND criado_em >= ? AND criado_em < ?) as partituras_abertas,
      (SELECT COUNT(*) FROM tracking_events WHERE usuario_id = ? AND tipo IN ('pdf_visualizado_grade', 'pdf_visualizado_parte') AND criado_em >= ? AND criado_em < ?) as pdfs_visualizados,
      (SELECT COUNT(*) FROM logs_download WHERE usuario_id = ? AND data >= ? AND data < ?) as downloads_reais,
      (
        (SELECT COUNT(*) FROM logs_buscas WHERE usuario_id = ? AND data >= ? AND data < ?) +
        (SELECT COUNT(*) FROM tracking_events WHERE usuario_id = ? AND tipo = 'busca_digitada' AND criado_em >= ? AND criado_em < ?)
      ) as buscas,
      (SELECT COUNT(*) FROM tracking_events WHERE usuario_id = ? AND tipo = 'favorito_adicionado' AND criado_em >= ? AND criado_em < ?) as favoritos
  `).bind(
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end
  ).first();

  const timeline = await env.DB.prepare(`
    SELECT *
    FROM (
      SELECT
        'tracking_' || te.id as id,
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

      UNION ALL

      SELECT
        'download_' || ld.id as id,
        NULL as session_id,
        'download_historico' as tipo,
        'historico' as origem,
        ld.partitura_id,
        NULL as parte_id,
        NULL as repertorio_id,
        NULL as termo_original,
        NULL as termo_normalizado,
        NULL as resultados_count,
        NULL as metadata_json,
        ld.data as criado_em,
        p.titulo as partitura_titulo,
        COALESCE(ld.instrumento_id, 'Arquivo completo') as parte_instrumento
      FROM logs_download ld
      JOIN partituras p ON p.id = ld.partitura_id
      WHERE ld.usuario_id = ? AND ld.data >= ? AND ld.data < ?

      UNION ALL

      SELECT
        'busca_' || lb.id as id,
        NULL as session_id,
        'busca_historica' as tipo,
        'historico' as origem,
        NULL as partitura_id,
        NULL as parte_id,
        NULL as repertorio_id,
        lb.termo as termo_original,
        lb.termo as termo_normalizado,
        lb.resultados_count,
        NULL as metadata_json,
        lb.data as criado_em,
        NULL as partitura_titulo,
        NULL as parte_instrumento
      FROM logs_buscas lb
      WHERE lb.usuario_id = ? AND lb.data >= ? AND lb.data < ?
    )
    ORDER BY criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end,
    timelineLimit, timelineOffset
  ).all();

  const totalTimeline = await env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM tracking_events WHERE usuario_id = ? AND criado_em >= ? AND criado_em < ?) +
      (SELECT COUNT(*) FROM logs_download WHERE usuario_id = ? AND data >= ? AND data < ?) +
      (SELECT COUNT(*) FROM logs_buscas WHERE usuario_id = ? AND data >= ? AND data < ?) as total
  `).bind(
    selectedUserId, start, end,
    selectedUserId, start, end,
    selectedUserId, start, end
  ).first();

  return {
    usuarios: emptyResults(usuarios),
    resumo_usuario: resumoUsuario || null,
    timeline: emptyResults(timeline),
    total_timeline: totalTimeline?.total || 0
  };
}

async function getEnsaios(env, start, end) {
  const ensaios = await env.DB.prepare(`
    SELECT DISTINCT p.data_ensaio
    FROM presencas p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE p.data_ensaio >= ? AND p.data_ensaio < ?
      AND u.ativo = 1
      AND u.admin = 0
      AND COALESCE(u.convidado, 0) = 0
      AND i.familia IN ('Madeiras', 'Metais', 'Percussão')
    ORDER BY p.data_ensaio DESC
  `).bind(start, end).all();

  const ensaiosDesc = emptyResults(ensaios).map((row) => row.data_ensaio);
  const totalEnsaios = ensaiosDesc.length;

  const musicos = await env.DB.prepare(`
    SELECT u.id, u.nome, i.nome as instrumento, i.familia
    FROM usuarios u
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE u.ativo = 1
      AND u.admin = 0
      AND COALESCE(u.convidado, 0) = 0
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
      AND COALESCE(u.convidado, 0) = 0
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
  const streaks = withCompetitionRanking(
    [...assiduidade].sort((a, b) => {
      if (b.streak !== a.streak) return b.streak - a.streak;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    }),
    (item) => item.streak
  );

  const assiduidadeRankeada = withCompetitionRanking(
    [...assiduidade].sort((a, b) => {
      if (b.taxa !== a.taxa) return b.taxa - a.taxa;
      if (b.presencas !== a.presencas) return b.presencas - a.presencas;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    }),
    (item) => `${item.taxa}:${item.presencas}`
  );

  return {
    mes: start.slice(0, 7),
    empty_state: totalEnsaios === 0 ? 'Nenhum ensaio registrado neste mês' : null,
    resumo: {
      presenca_media: presencasEsperadas ? Math.round((presencasRows.length / presencasEsperadas) * 100) : 0,
      maior_streak_ativo: maiorStreak,
      musicos_presenca_perfeita: assiduidade.filter((item) => totalEnsaios > 0 && item.presencas === totalEnsaios).length,
      ensaios_registrados: totalEnsaios
    },
    streaks,
    assiduidade_musicos: assiduidadeRankeada,
    presenca_naipes: presencaNaipes
  };
}

async function getAlteracoes(env, start, end, url) {
  const usuarioId = url.searchParams.get('atividade_usuario_id');
  const rawLimit = Number.parseInt(url.searchParams.get('atividades_limit') ?? '', 10);
  const rawOffset = Number.parseInt(url.searchParams.get('atividades_offset') ?? '', 10);
  const limit = Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 15, 100);
  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;
  const params = [start, end, ...AUDIT_ACTIVITY_TYPES];
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
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      ${usuarioFilter}
    ORDER BY a.criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all();

  const total = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM atividades a
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      ${usuarioFilter}
  `).bind(...params).first();

  const usuarios = await env.DB.prepare(`
    SELECT DISTINCT u.id, u.nome
    FROM atividades a
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      AND u.admin = 1
    ORDER BY u.nome ASC
  `).bind(start, end, ...AUDIT_ACTIVITY_TYPES).all();

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
    const section = url.searchParams.get('section') || 'all';
    const base = { periodo: { inicio: start, fim: end } };

    if (section === 'acervo') {
      return jsonResponse({
        ...base,
        uso_acervo: await getUsoAcervo(env, start, end)
      }, 200, request);
    }

    if (section === 'pessoas') {
      return jsonResponse({
        ...base,
        pessoas: await getPessoas(env, url, start, end)
      }, 200, request);
    }

    if (section === 'ensaios') {
      return jsonResponse({
        ...base,
        ensaios: await getEnsaios(env, start, end)
      }, 200, request);
    }

    if (section === 'alteracoes') {
      const alteracoes = await getAlteracoes(env, start, end, url);
      return jsonResponse({
        ...base,
        alteracoes,
        atividade_recente: alteracoes.atividades,
        total_atividades: alteracoes.total
      }, 200, request);
    }

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
