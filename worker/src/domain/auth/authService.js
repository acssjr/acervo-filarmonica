// worker/src/domain/auth/authService.js
import { verifyJwt } from '../../infrastructure/index.js';
import { getJwtSecret } from '../../infrastructure/index.js';
import { verifyPin } from '../../infrastructure/index.js';

/**
 * Verificar usuario a partir do JWT (formato novo) ou username:pin (formato legado)
 *
 * Extraido de: worker/index.js linhas 328-379
 */
export async function verifyUserFromJwt(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // Tenta verificar como JWT primeiro
  const payload = await verifyJwt(token, getJwtSecret(env));

  if (payload && payload.userId) {
    // Token JWT válido - busca usuário
    const user = await env.DB.prepare(
      'SELECT * FROM usuarios WHERE id = ? AND ativo = 1'
    ).bind(payload.userId).first();

    if (user) {
      user._isAdmin = payload.isAdmin || false;
    }

    return user;
  }

  // Fallback: tenta o formato antigo (username:pin) para compatibilidade
  // TODO: Remover após migração completa
  if (token.includes(':')) {
    const [username, pin] = token.split(':');

    // Busca usuário
    const user = await env.DB.prepare(
      'SELECT * FROM usuarios WHERE username = ? AND ativo = 1'
    ).bind(username).first();

    if (!user) return null;

    // Verifica PIN
    // Se pin_salt existe, usa PBKDF2; senão, compara direto (legado)
    if (user.pin_salt) {
      const isValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
      if (!isValid) return null;
    } else {
      // Formato legado (plaintext) - ainda suporta para migração
      if (user.pin_hash !== pin) return null;
    }

    return user;
  }

  return null;
}

/**
 * Verificar se usuário é admin
 *
 * Extraido de: worker/index.js linhas 381-387
 */
export async function verifyAdmin(request, env) {
  const user = await verifyUserFromJwt(request, env);
  if (!user) return null;
  if (user.admin !== 1 && !user._isAdmin) return null;
  return user;
}

/**
 * Verificar se é usuário autenticado (qualquer usuário logado)
 *
 * Extraido de: worker/index.js linhas 389-392
 */
export async function verifyUser(request, env) {
  return await verifyUserFromJwt(request, env);
}
