// worker/src/domain/analytics/analyticsService.js
import { jsonResponse } from '../../infrastructure/index.js';

export async function getAnalyticsDashboard(request, env, _params, _context) {
  try {
    // === 1. RESUMO GERAL (KPIs) ===
    const resumo = await env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM usuarios WHERE ativo = 1 AND admin = 0) as musicos_ativos,
        (SELECT COUNT(*) FROM partituras WHERE ativo = 1) as total_partituras,
        (SELECT SUM(downloads) FROM partituras) as total_downloads,
        (SELECT COUNT(DISTINCT usuario_id) FROM presencas WHERE data_ensaio >= date('now', '-30 days')) as presentes_ultimo_mes,
        (SELECT COUNT(DISTINCT data_ensaio) FROM presencas WHERE data_ensaio >= date('now', '-30 days')) as ensaios_ultimo_mes
    `).first();

    // === 2. DOWNLOADS POR DIA (últimos 30 dias) ===
    const downloadsTimeline = await env.DB.prepare(`
      SELECT
        strftime('%Y-%m-%d', data) as data,
        COUNT(*) as total
      FROM logs_download
      WHERE data >= date('now', '-30 days')
      GROUP BY strftime('%Y-%m-%d', data)
      ORDER BY data ASC
    `).all();

    // === 3. TOP PARTITURAS ===
    const topPartituras = await env.DB.prepare(`
      SELECT titulo, compositor, downloads
      FROM partituras
      WHERE ativo = 1
      ORDER BY downloads DESC
      LIMIT 10
    `).all();

    // === 4. DISTRIBUIÇÃO POR INSTRUMENTO ===
    const instrumentosDist = await env.DB.prepare(`
      SELECT
        i.nome as instrumento,
        i.familia,
        COUNT(u.id) as total
      FROM usuarios u
      JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1 AND u.admin = 0
      GROUP BY i.nome, i.familia
      ORDER BY total DESC
    `).all();

    // === 5. PRESENÇAS POR FAMÍLIA (últimos 90 dias) ===
    const presencasFamilia = await env.DB.prepare(`
      SELECT
        i.familia,
        COUNT(p.id) as total_presencas
      FROM presencas p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE p.data_ensaio >= date('now', '-90 days')
      GROUP BY i.familia
      ORDER BY total_presencas DESC
    `).all();

    // === 6. MÚSICOS MAIS ATIVOS (quem mais baixou partituras) ===
    // Modificado para usar tabela 'atividades' pois ela já possui histórico de usuário
    const musicosMaisAtivos = await env.DB.prepare(`
      SELECT
        u.id,
        u.nome,
        u.foto_url,
        i.nome as instrumento,
        COUNT(a.id) as total_downloads,
        MAX(a.criado_em) as ultimo_download
      FROM atividades a
      JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1 
        AND a.tipo = 'download'
      GROUP BY u.id
      ORDER BY total_downloads DESC
      LIMIT 15
    `).all();

    // === 7. ÚLTIMO ACESSO DE CADA MÚSICO ===
    const ultimoAcesso = await env.DB.prepare(`
      SELECT
        u.id,
        u.nome,
        u.foto_url,
        u.ultimo_acesso,
        i.nome as instrumento
      FROM usuarios u
      LEFT JOIN instrumentos i ON u.instrumento_id = i.id
      WHERE u.ativo = 1
      ORDER BY u.ultimo_acesso DESC
    `).all();

    // === 8. TENDÊNCIA DE PRESENÇA (últimos 10 ensaios) ===
    // Filtra admins (maestro) para não contar na presença
    const tendenciaPresenca = await env.DB.prepare(`
      SELECT
        p.data_ensaio as data,
        COUNT(p.id) as presentes
      FROM presencas p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.data_ensaio >= date('now', '-90 days')
        AND u.admin = 0
      GROUP BY p.data_ensaio
      ORDER BY p.data_ensaio DESC
      LIMIT 10
    `).all();

    // === 9. BUSCA: TERMOS SEM RESULTADO ===
    const termosSemResultado = await env.DB.prepare(`
      SELECT termo, COUNT(*) as tentativas
      FROM logs_buscas
      WHERE resultados_count = 0
      GROUP BY termo
      ORDER BY tentativas DESC
      LIMIT 10
    `).all();

    // === 10. BUSCA: TERMOS MAIS BUSCADOS ===
    const topTermos = await env.DB.prepare(`
      SELECT termo, COUNT(*) as total
      FROM logs_buscas
      GROUP BY termo
      ORDER BY total DESC
      LIMIT 10
    `).all();

    // === 11. ATIVIDADE RECENTE (com nome do usuário) ===
    const atividadeRecente = await env.DB.prepare(`
      SELECT
        a.tipo,
        a.titulo,
        a.detalhes,
        a.criado_em,
        u.nome as usuario_nome
      FROM atividades a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
      LIMIT 15
    `).all();

    return jsonResponse({
      resumo: resumo || {},
      downloads_timeline: downloadsTimeline.results,
      top_partituras: topPartituras.results,
      instrumentos_dist: instrumentosDist.results,
      presencas_familia: presencasFamilia.results,
      musicos_mais_ativos: musicosMaisAtivos.results,
      ultimo_acesso: ultimoAcesso.results,
      tendencia_presenca: tendenciaPresenca.results?.reverse() || [],
      top_search_terms: topTermos.results,
      failed_search_terms: termosSemResultado.results,
      atividade_recente: atividadeRecente.results
    }, 200, request);

  } catch (error) {
    console.error('Analytics error:', error);
    return jsonResponse({ error: 'Erro ao carregar analytics', details: error.message }, 500, request);
  }
}
