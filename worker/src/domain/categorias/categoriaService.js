// worker/src/domain/categorias/categoriaService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';

/**
 * Listar todas as categorias com contagem de partituras
 *
 * Extraido de: worker/index.js linhas 926-935
 */
export async function getCategorias(request, env) {
  const result = await env.DB.prepare(`
    SELECT c.*, COUNT(p.id) as total_partituras
    FROM categorias c
    LEFT JOIN partituras p ON c.id = p.categoria_id AND p.ativo = 1
    GROUP BY c.id
    ORDER BY c.ordem ASC
  `).all();
  return jsonResponse(result.results, 200, request);
}

/**
 * Criar nova categoria (Admin)
 *
 * Extraido de: worker/index.js linhas 937-975
 */
export async function createCategoria(request, env) {
  const { id, nome, emoji, cor, descricao } = await request.json();

  if (!id || !nome || !emoji || !cor) {
    return errorResponse('Campos obrigatórios: id, nome, emoji, cor', 400, request);
  }

  if (!/^[a-z0-9-]+$/.test(id)) {
    return errorResponse('ID deve conter apenas letras minúsculas, números e hífen', 400, request);
  }

  const exists = await env.DB.prepare(
    'SELECT id FROM categorias WHERE id = ?'
  ).bind(id).first();

  if (exists) {
    return errorResponse('Este ID de categoria já existe', 400, request);
  }

  const maxOrdem = await env.DB.prepare(
    'SELECT MAX(ordem) as max FROM categorias'
  ).first();
  const novaOrdem = (maxOrdem?.max || 0) + 1;

  await env.DB.prepare(`
    INSERT INTO categorias (id, nome, emoji, cor, descricao, ordem)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, nome, emoji, cor, descricao || null, novaOrdem).run();

  return jsonResponse({
    success: true,
    message: 'Categoria criada com sucesso!'
  }, 201, request);
}

/**
 * Atualizar categoria (Admin)
 *
 * Extraido de: worker/index.js linhas 977-1020
 */
export async function updateCategoria(id, request, env) {
  const { nome, emoji, cor, descricao, ordem } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined) {
    updates.push('nome = ?');
    params.push(nome);
  }
  if (emoji !== undefined) {
    updates.push('emoji = ?');
    params.push(emoji);
  }
  if (cor !== undefined) {
    updates.push('cor = ?');
    params.push(cor);
  }
  if (descricao !== undefined) {
    updates.push('descricao = ?');
    params.push(descricao || null);
  }
  if (ordem !== undefined) {
    updates.push('ordem = ?');
    params.push(ordem);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(id);

  await env.DB.prepare(`
    UPDATE categorias SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Categoria atualizada!' }, 200, request);
}

/**
 * Deletar categoria (Admin)
 *
 * Extraido de: worker/index.js linhas 1022-1039
 */
export async function deleteCategoria(id, request, env) {
  const partituras = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM partituras WHERE categoria_id = ? AND ativo = 1'
  ).bind(id).first();

  if (partituras.count > 0) {
    return errorResponse(`Não é possível remover: ${partituras.count} partitura(s) vinculada(s)`, 400, request);
  }

  await env.DB.prepare('DELETE FROM categorias WHERE id = ?').bind(id).run();

  return jsonResponse({ success: true, message: 'Categoria removida!' }, 200, request);
}

/**
 * Reordenar categorias (Admin)
 *
 * Extraido de: worker/index.js linhas 1041-1060
 */
export async function reorderCategorias(request, env) {
  const { ordens } = await request.json();

  if (!ordens || !Array.isArray(ordens)) {
    return errorResponse('Formato inválido', 400, request);
  }

  for (const item of ordens) {
    await env.DB.prepare(
      'UPDATE categorias SET ordem = ? WHERE id = ?'
    ).bind(item.ordem, item.id).run();
  }

  return jsonResponse({ success: true, message: 'Ordem atualizada!' }, 200, request);
}
