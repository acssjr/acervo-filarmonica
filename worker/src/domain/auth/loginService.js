// worker/src/domain/auth/loginService.js
import {
  createJwt,
  verifyJwt,
  hashPin,
  verifyPin,
  generateSalt,
  checkRateLimit,
  resetRateLimit,
  jsonResponse,
  errorResponse,
  getJwtSecret
} from '../../infrastructure/index.js';
import { JWT_EXPIRY_HOURS } from '../../config/index.js';

/**
 * Verificar se usuário existe (para o tick verde no login)
 * Rate limiting para evitar enumeração de usuários
 *
 * Extraido de: worker/index.js linhas 1146-1192
 */
export async function checkUser(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting - 10 tentativas por minuto (mais permissivo que login)
  const rateLimit = await checkRateLimit(env, `checkuser:${ip}`);
  if (!rateLimit.allowed) {
    return jsonResponse({
      exists: false,
      error: 'Muitas tentativas. Aguarde um momento.'
    }, 429, request);
  }

  const { username } = await request.json();

  if (!username || username.length < 2) {
    return jsonResponse({ exists: false }, 200, request);
  }

  const user = await env.DB.prepare(
    'SELECT username, nome, instrumento_id FROM usuarios WHERE username = ? AND ativo = 1'
  ).bind(username.toLowerCase()).first();

  if (!user) {
    return jsonResponse({ exists: false }, 200, request);
  }

  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  // Super admin sempre mostra nome generico
  const nomeExibido = user.username === 'admin' ? 'Administrador' : user.nome;

  return jsonResponse({
    exists: true,
    nome: nomeExibido,
    instrumento: instrumentoNome || 'Músico'
  }, 200, request);
}

/**
 * Login com JWT
 *
 * Extraido de: worker/index.js linhas 1194-1289
 */
export async function login(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { username, pin } = await request.json();

  // Validação básica
  if (!username || !pin) {
    return errorResponse('Usuário e PIN são obrigatórios', 400, request);
  }

  // Rate limiting por IP
  const rateLimit = await checkRateLimit(env, `login:${ip}`);
  if (!rateLimit.allowed) {
    return jsonResponse({
      error: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfter} segundos.`,
      retryAfter: rateLimit.retryAfter
    }, 429, request);
  }

  // Busca usuário
  const user = await env.DB.prepare(
    'SELECT id, username, nome, admin, instrumento_id, foto_url, pin_hash, pin_salt FROM usuarios WHERE username = ? AND ativo = 1'
  ).bind(username.toLowerCase()).first();

  if (!user) {
    return errorResponse('Usuário ou PIN inválido', 401, request);
  }

  // Verifica PIN
  let pinValid = false;

  if (user.pin_salt) {
    // Novo formato: PBKDF2 hash
    pinValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
  } else {
    // Formato legado: plaintext (para migração)
    pinValid = user.pin_hash === pin;

    // Se PIN válido no formato antigo, migra para o novo
    if (pinValid) {
      const newSalt = generateSalt();
      const newHash = await hashPin(pin, newSalt);

      await env.DB.prepare(
        'UPDATE usuarios SET pin_hash = ?, pin_salt = ? WHERE id = ?'
      ).bind(newHash, newSalt, user.id).run();

      console.log(`Migrated PIN hash for user ${user.username}`);
    }
  }

  if (!pinValid) {
    return errorResponse('Usuário ou PIN inválido', 401, request);
  }

  // Login bem-sucedido - reseta rate limit
  await resetRateLimit(env, `login:${ip}`);

  // Atualiza último acesso
  await env.DB.prepare(
    'UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(user.id).run();

  // Buscar nome do instrumento
  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  // Gera JWT
  const token = await createJwt({
    userId: user.id,
    username: user.username,
    isAdmin: user.admin === 1
  }, getJwtSecret(env));

  // Super admin sempre mostra nome generico
  const nomeExibido = user.username === 'admin' ? 'Administrador' : user.nome;

  return jsonResponse({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      nome: nomeExibido,
      admin: user.admin === 1,
      instrumento_id: user.instrumento_id,
      instrumento_nome: instrumentoNome,
      foto_url: user.foto_url,
    },
    token,
    expiresIn: JWT_EXPIRY_HOURS * 60 * 60
  }, 200, request);
}

/**
 * Alterar PIN do usuário
 *
 * Extraido de: worker/index.js linhas 1291-1349
 */
export async function changePin(request, env, user) {
  const { currentPin, newPin } = await request.json();

  if (!currentPin || !newPin) {
    return errorResponse('PIN atual e novo PIN são obrigatórios', 400, request);
  }

  if (!/^\d{4}$/.test(newPin)) {
    return errorResponse('O novo PIN deve ter exatamente 4 dígitos', 400, request);
  }

  // PINs óbvios não permitidos
  const obviousPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '3210'];
  if (obviousPins.includes(newPin)) {
    return errorResponse('Este PIN é muito fácil de adivinhar. Escolha outro.', 400, request);
  }

  // Verifica PIN atual
  let currentPinValid = false;
  if (user.pin_salt) {
    currentPinValid = await verifyPin(currentPin, user.pin_hash, user.pin_salt);
  } else {
    currentPinValid = user.pin_hash === currentPin;
  }

  if (!currentPinValid) {
    return errorResponse('PIN atual incorreto', 401, request);
  }

  if (currentPin === newPin) {
    return errorResponse('O novo PIN deve ser diferente do atual', 400, request);
  }

  // Gera novo hash
  const newSalt = generateSalt();
  const newHash = await hashPin(newPin, newSalt);

  await env.DB.prepare(
    'UPDATE usuarios SET pin_hash = ?, pin_salt = ? WHERE id = ?'
  ).bind(newHash, newSalt, user.id).run();

  // Gera novo token
  const newToken = await createJwt({
    userId: user.id,
    username: user.username,
    isAdmin: user.admin === 1
  }, getJwtSecret(env));

  return jsonResponse({
    success: true,
    message: 'PIN alterado com sucesso!',
    token: newToken
  }, 200, request);
}
