// worker/src/domain/atividades/atividadeService.js
import { jsonResponse } from '../../infrastructure/index.js';

/**
 * Helper: Registrar atividade
 *
 * Extraido de: worker/index.js linhas 308-319
 */
export async function registrarAtividade(env, tipo, titulo, detalhes = null, usuarioId = null) {
  try {
    await env.DB.prepare(`
      INSERT INTO atividades (tipo, titulo, detalhes, usuario_id)
      VALUES (?, ?, ?, ?)
    `).bind(tipo, titulo, detalhes, usuarioId).run();
  } catch (e) {
    console.error('Erro ao registrar atividade:', e);
  }
}

/**
 * Buscar atividades recentes
 *
 * Extraido de: worker/index.js linhas 1106-1121
 */
export async function getAtividades(request, env, limit = 20) {
  try {
    const result = await env.DB.prepare(`
      SELECT a.*, u.nome as usuario_nome
      FROM atividades a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
      LIMIT ?
    `).bind(limit).all();

    return jsonResponse(result.results, 200, request);
  } catch (e) {
    return jsonResponse([], 200, request);
  }
}

/**
 * Buscar atividades de um usuário específico
 *
 * Extraido de: worker/index.js linhas 1123-1144
 */
export async function getAtividadesUsuario(request, env, user) {
  try {
    const result = await env.DB.prepare(`
      SELECT a.*, u.nome as usuario_nome
      FROM atividades a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = ? OR a.tipo = 'nova_partitura'
      ORDER BY a.criado_em DESC
      LIMIT 20
    `).bind(user.id).all();

    return jsonResponse(result.results, 200, request);
  } catch (e) {
    return jsonResponse([], 200, request);
  }
}
