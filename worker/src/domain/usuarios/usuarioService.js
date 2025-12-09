// worker/src/domain/usuarios/usuarioService.js
import { jsonResponse, errorResponse, generateSalt, hashPin } from '../../infrastructure/index.js';

/**
 * Listar todos os usuários (Admin)
 *
 * Extraido de: worker/index.js linhas 1353-1368
 */
export async function getUsuarios(request, env) {
  const result = await env.DB.prepare(`
    SELECT u.id, u.username, u.nome, u.admin, u.ativo, u.instrumento_id, u.foto_url, u.criado_em, u.ultimo_acesso,
           i.nome as instrumento_nome
    FROM usuarios u
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    ORDER BY u.nome ASC
  `).all();

  return jsonResponse(result.results, 200, request);
}

/**
 * Obter um usuário específico (Admin)
 *
 * Extraido de: worker/index.js linhas 1370-1389
 */
export async function getUsuario(id, request, env) {
  const user = await env.DB.prepare(`
    SELECT u.id, u.username, u.nome, u.admin, u.ativo, u.instrumento_id, u.foto_url, u.criado_em, u.ultimo_acesso,
           i.nome as instrumento_nome
    FROM usuarios u
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    WHERE u.id = ?
  `).bind(id).first();

  if (!user) {
    return errorResponse('Usuário não encontrado', 404, request);
  }

  return jsonResponse(user, 200, request);
}

/**
 * Criar novo usuário (Admin)
 *
 * Extraido de: worker/index.js linhas 1391-1440
 */
export async function createUsuario(request, env) {
  const { username, nome, pin, instrumento_id, admin: isAdmin } = await request.json();

  if (!username || !nome || !pin) {
    return errorResponse('Campos obrigatórios: username, nome, pin', 400, request);
  }

  if (!/^[a-z0-9]+$/.test(username)) {
    return errorResponse('Username deve conter apenas letras minúsculas e números, sem espaços', 400, request);
  }

  if (!/^\d{4}$/.test(pin)) {
    return errorResponse('PIN deve ter exatamente 4 dígitos', 400, request);
  }

  const exists = await env.DB.prepare(
    'SELECT id FROM usuarios WHERE username = ?'
  ).bind(username).first();

  if (exists) {
    return errorResponse('Este username já está em uso', 400, request);
  }

  // Hash do PIN
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);

  const result = await env.DB.prepare(`
    INSERT INTO usuarios (username, nome, pin_hash, pin_salt, instrumento_id, admin)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    username,
    nome,
    hash,
    salt,
    instrumento_id || null,
    isAdmin ? 1 : 0
  ).run();

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Usuário criado com sucesso!'
  }, 201, request);
}

/**
 * Atualizar usuário (Admin)
 *
 * Extraido de: worker/index.js linhas 1442-1506
 */
export async function updateUsuario(id, request, env, admin) {
  // Verifica se está tentando alterar o super admin (@admin)
  const targetUser = await env.DB.prepare(
    'SELECT username FROM usuarios WHERE id = ?'
  ).bind(id).first();

  if (targetUser && targetUser.username === 'admin') {
    // Apenas o próprio super admin pode se alterar
    if (admin.username !== 'admin') {
      return errorResponse('Não é permitido alterar o super admin', 403, request);
    }
  }

  const { nome, pin, instrumento_id, admin: isAdmin, ativo } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined) {
    updates.push('nome = ?');
    params.push(nome);
  }

  if (pin !== undefined) {
    if (!/^\d{4}$/.test(pin)) {
      return errorResponse('PIN deve ter exatamente 4 dígitos', 400, request);
    }
    const salt = generateSalt();
    const hash = await hashPin(pin, salt);
    updates.push('pin_hash = ?', 'pin_salt = ?');
    params.push(hash, salt);
  }

  if (instrumento_id !== undefined) {
    updates.push('instrumento_id = ?');
    params.push(instrumento_id || null);
  }

  if (isAdmin !== undefined) {
    updates.push('admin = ?');
    params.push(isAdmin ? 1 : 0);
  }

  if (ativo !== undefined) {
    updates.push('ativo = ?');
    params.push(ativo ? 1 : 0);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(id);

  await env.DB.prepare(`
    UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Usuário atualizado!' }, 200, request);
}

/**
 * Desativar usuário (Admin)
 *
 * Extraido de: worker/index.js linhas 1568-1592
 */
export async function deleteUsuario(id, request, env, admin) {
  if (admin.id === parseInt(id)) {
    return errorResponse('Você não pode desativar sua própria conta', 400, request);
  }

  // Verifica se está tentando desativar o super admin (@admin)
  const targetUser = await env.DB.prepare(
    'SELECT username FROM usuarios WHERE id = ?'
  ).bind(id).first();

  if (targetUser && targetUser.username === 'admin') {
    return errorResponse('Não é permitido desativar o super admin', 403, request);
  }

  await env.DB.prepare(
    'UPDATE usuarios SET ativo = 0 WHERE id = ?'
  ).bind(id).run();

  return jsonResponse({ success: true, message: 'Usuário desativado!' }, 200, request);
}
