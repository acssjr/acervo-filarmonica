// worker/src/domain/favoritos/favoritoService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';

/**
 * Listar favoritos do usuário
 *
 * Extraido de: worker/index.js linhas 1728-1744
 */
export async function getFavoritos(request, env, user) {
  const result = await env.DB.prepare(`
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor
    FROM favoritos f
    JOIN partituras p ON f.partitura_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    WHERE f.usuario_id = ? AND p.ativo = 1
    ORDER BY f.criado_em DESC
  `).bind(user.id).all();

  return jsonResponse(result.results, 200, request);
}

/**
 * Listar apenas IDs dos favoritos (para checagem rápida)
 *
 * Extraido de: worker/index.js linhas 1746-1757
 */
export async function getFavoritosIds(request, env, user) {
  const result = await env.DB.prepare(
    'SELECT partitura_id FROM favoritos WHERE usuario_id = ?'
  ).bind(user.id).all();

  return jsonResponse(result.results.map(f => f.partitura_id), 200, request);
}

/**
 * Adicionar favorito
 *
 * Extraido de: worker/index.js linhas 1759-1784
 */
export async function addFavorito(partituraId, request, env, user) {
  const partitura = await env.DB.prepare(
    'SELECT id, titulo FROM partituras WHERE id = ? AND ativo = 1'
  ).bind(partituraId).first();

  if (!partitura) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  try {
    await env.DB.prepare(
      'INSERT INTO favoritos (usuario_id, partitura_id) VALUES (?, ?)'
    ).bind(user.id, partituraId).run();

    await registrarAtividade(env, 'favorito', partitura.titulo, null, user.id);
  } catch (e) {
    // Já é favorito
  }

  return jsonResponse({ success: true, message: 'Adicionado aos favoritos!' }, 200, request);
}

/**
 * Remover favorito
 *
 * Extraido de: worker/index.js linhas 1786-1797
 */
export async function removeFavorito(partituraId, request, env, user) {
  await env.DB.prepare(
    'DELETE FROM favoritos WHERE usuario_id = ? AND partitura_id = ?'
  ).bind(user.id, partituraId).run();

  return jsonResponse({ success: true, message: 'Removido dos favoritos!' }, 200, request);
}
