// worker/src/infrastructure/ratelimit/rateLimiter.js
import {
  CHECK_USER_RATE_LIMIT_WINDOW_SECONDS,
  MAX_LOGIN_ATTEMPTS,
  RATE_LIMIT_WINDOW_SECONDS,
  TRACKING_RATE_LIMIT_WINDOW_SECONDS
} from '../../config/index.js';

const CHECK_USER_BINDING = 'CHECK_USER_RATE_LIMITER';
const LOGIN_BINDING = 'LOGIN_RATE_LIMITER';
const TRACKING_BINDING = 'TRACKING_RATE_LIMITER';
const LOGIN_GLOBAL_WINDOW_SECONDS = 60;

const warnedBindings = new Set();

function unavailableResult(env, bindingName, retryAfter) {
  const production = env?.ENVIRONMENT === 'production';

  if (!warnedBindings.has(bindingName)) {
    const level = production ? 'error' : 'warn';
    console[level](`${bindingName} não configurado; proteção ${production ? 'bloqueada em produção' : 'desativada fora de produção'}`);
    warnedBindings.add(bindingName);
  }

  if (production) {
    return {
      allowed: false,
      retryAfter,
      configurationError: true
    };
  }

  return { allowed: true, degraded: true };
}

async function checkBinding(env, bindingName, key, retryAfter) {
  const limiter = env?.[bindingName];
  if (!limiter || typeof limiter.limit !== 'function') {
    return unavailableResult(env, bindingName, retryAfter);
  }

  try {
    const result = await limiter.limit({ key });
    return result.success
      ? { allowed: true }
      : { allowed: false, retryAfter };
  } catch (error) {
    console.error(`Erro no rate limiting ${bindingName}:`, error);
    return unavailableResult(env, bindingName, retryAfter);
  }
}

export async function checkRateLimit(env, key, globalKey = key) {
  const globalLimit = await checkBinding(
    env,
    LOGIN_BINDING,
    globalKey,
    LOGIN_GLOBAL_WINDOW_SECONDS
  );
  if (!globalLimit.allowed) return globalLimit;

  if (!env?.DB) {
    return unavailableResult(env, 'DB_LOGIN_RATE_LIMIT', RATE_LIMIT_WINDOW_SECONDS);
  }

  const now = Math.floor(Date.now() / 1000);
  const expiredBefore = now - RATE_LIMIT_WINDOW_SECONDS;

  try {
    // Impede crescimento permanente da tabela por nomes aleatórios.
    await env.DB.prepare(`
      DELETE FROM login_rate_limits
      WHERE atualizado_em < datetime('now', '-5 minutes')
    `).run();

    const result = await env.DB.prepare(`
      INSERT INTO login_rate_limits (chave, tentativas, janela_inicio, atualizado_em)
      VALUES (?, 1, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(chave) DO UPDATE SET
        tentativas = CASE
          WHEN login_rate_limits.janela_inicio <= ? THEN 1
          ELSE login_rate_limits.tentativas + 1
        END,
        janela_inicio = CASE
          WHEN login_rate_limits.janela_inicio <= ? THEN excluded.janela_inicio
          ELSE login_rate_limits.janela_inicio
        END,
        atualizado_em = CURRENT_TIMESTAMP
      RETURNING tentativas, janela_inicio
    `).bind(key, now, expiredBefore, expiredBefore).first();

    if (!result) {
      return unavailableResult(env, 'DB_LOGIN_RATE_LIMIT', RATE_LIMIT_WINDOW_SECONDS);
    }

    const allowed = result.tentativas <= MAX_LOGIN_ATTEMPTS;
    const retryAfter = Math.max(
      1,
      Number(result.janela_inicio) + RATE_LIMIT_WINDOW_SECONDS - now
    );

    return allowed ? { allowed: true } : { allowed: false, retryAfter };
  } catch (error) {
    console.error('Erro no rate limiting de login:', error);
    return unavailableResult(env, 'DB_LOGIN_RATE_LIMIT', RATE_LIMIT_WINDOW_SECONDS);
  }
}

export async function resetRateLimit(env, key) {
  if (!env?.DB) return;

  try {
    await env.DB.prepare('DELETE FROM login_rate_limits WHERE chave = ?')
      .bind(key)
      .run();
  } catch (error) {
    console.error('Erro ao limpar rate limiting de login:', error);
  }
}

export function checkUserRateLimit(env, key) {
  return checkBinding(
    env,
    CHECK_USER_BINDING,
    key,
    CHECK_USER_RATE_LIMIT_WINDOW_SECONDS
  );
}

export function checkTrackingRateLimit(env, userId, ip) {
  const identifier = userId ? `user:${userId}` : `ip:${ip}`;
  return checkBinding(
    env,
    TRACKING_BINDING,
    `tracking:${identifier}`,
    TRACKING_RATE_LIMIT_WINDOW_SECONDS
  );
}
