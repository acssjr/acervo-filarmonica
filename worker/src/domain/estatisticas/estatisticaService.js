// worker/src/domain/estatisticas/estatisticaService.js
import { jsonResponse } from '../../infrastructure/index.js';

/**
 * Obter estatísticas gerais (público)
 *
 * Extraido de: worker/index.js linhas 1069-1072
 */
export async function getEstatisticas(request, env) {
  const result = await env.DB.prepare('SELECT * FROM v_estatisticas').first();
  return jsonResponse(result, 200, request);
}

/**
 * Obter estatísticas detalhadas (Admin)
 *
 * Extraido de: worker/index.js linhas 1074-1104
 */
export async function getEstatisticasAdmin(request, env) {
  const basico = await env.DB.prepare('SELECT * FROM v_estatisticas').first();

  const usuariosAtivos = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM usuarios WHERE ativo = 1 AND admin = 0'
  ).first();

  const ultimosDownloads = await env.DB.prepare(`
    SELECT l.*, p.titulo, u.nome as usuario_nome
    FROM logs_download l
    JOIN partituras p ON l.partitura_id = p.id
    LEFT JOIN usuarios u ON l.ip = u.username
    ORDER BY l.data DESC
    LIMIT 10
  `).all();

  const topPartituras = await env.DB.prepare(`
    SELECT id, titulo, compositor, downloads
    FROM partituras
    WHERE ativo = 1
    ORDER BY downloads DESC
    LIMIT 5
  `).all();

  return jsonResponse({
    ...basico,
    musicos_ativos: usuariosAtivos.count,
    ultimos_downloads: ultimosDownloads.results,
    top_partituras: topPartituras.results
  }, 200, request);
}

/**
 * Obter lista de instrumentos
 *
 * Extraido de: worker/index.js linhas 1062-1067
 */
export async function getInstrumentos(request, env) {
  const result = await env.DB.prepare(
    'SELECT * FROM instrumentos ORDER BY ordem ASC'
  ).all();
  return jsonResponse(result.results, 200, request);
}
