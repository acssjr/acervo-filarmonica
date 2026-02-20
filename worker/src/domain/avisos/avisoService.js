// worker/src/domain/avisos/avisoService.js
import { jsonResponse } from '../../infrastructure/index.js';

/**
 * Listar todos os avisos (admin)
 */
export async function getAvisos(request, env) {
    const result = await env.DB.prepare(`
    SELECT a.*, u.nome as criado_por_nome
    FROM avisos a
    LEFT JOIN usuarios u ON a.criado_por = u.id
    ORDER BY a.criado_em DESC
  `).all();

    return jsonResponse(result.results, 200, request);
}

/**
 * Criar novo aviso (admin)
 */
export async function criarAviso(request, env, params, context) {
    const body = await request.json();
    const { titulo, mensagem } = body;

    if (!titulo || !mensagem) {
        return jsonResponse({ error: 'Título e mensagem são obrigatórios' }, 400, request);
    }

    const user = context?.user;

    const result = await env.DB.prepare(
        'INSERT INTO avisos (titulo, mensagem, criado_por) VALUES (?, ?, ?)'
    ).bind(titulo, mensagem, user?.id || null).run();

    return jsonResponse({
        id: result.meta?.last_row_id,
        titulo,
        mensagem,
        ativo: 1
    }, 201, request);
}

/**
 * Atualizar aviso (admin) - editar ou ativar/desativar
 */
export async function atualizarAviso(request, env, params) {
    const id = params.id;
    const body = await request.json();
    const { titulo, mensagem, ativo } = body;

    const aviso = await env.DB.prepare('SELECT * FROM avisos WHERE id = ?').bind(id).first();
    if (!aviso) {
        return jsonResponse({ error: 'Aviso não encontrado' }, 404, request);
    }

    await env.DB.prepare(
        'UPDATE avisos SET titulo = ?, mensagem = ?, ativo = ? WHERE id = ?'
    ).bind(
        titulo !== undefined ? titulo : aviso.titulo,
        mensagem !== undefined ? mensagem : aviso.mensagem,
        ativo !== undefined ? (ativo ? 1 : 0) : aviso.ativo,
        id
    ).run();

    return jsonResponse({ success: true }, 200, request);
}

/**
 * Excluir aviso (admin)
 */
export async function excluirAviso(request, env, params) {
    const id = params.id;
    await env.DB.prepare('DELETE FROM avisos WHERE id = ?').bind(id).run();
    return jsonResponse({ success: true }, 200, request);
}

/**
 * Buscar avisos não lidos do usuário autenticado
 */
export async function getAvisosNaoLidos(request, env, params, context) {
    const user = context?.user;
    if (!user) {
        return jsonResponse([], 200, request);
    }

    const result = await env.DB.prepare(`
    SELECT a.id, a.titulo, a.mensagem, a.criado_em
    FROM avisos a
    WHERE a.ativo = 1
      AND a.id NOT IN (
        SELECT aviso_id FROM avisos_lidos WHERE usuario_id = ?
      )
    ORDER BY a.criado_em DESC
  `).bind(user.id).all();

    return jsonResponse(result.results, 200, request);
}

/**
 * Marcar aviso como lido pelo usuário autenticado
 */
export async function marcarAvisoLido(request, env, params, context) {
    const user = context?.user;
    if (!user) {
        return jsonResponse({ error: 'Não autenticado' }, 401, request);
    }

    const avisoId = params.id;

    await env.DB.prepare(
        'INSERT OR IGNORE INTO avisos_lidos (aviso_id, usuario_id) VALUES (?, ?)'
    ).bind(avisoId, user.id).run();

    return jsonResponse({ success: true }, 200, request);
}
