// worker/src/infrastructure/ratelimit/rateLimiter.js
import {
  MAX_LOGIN_ATTEMPTS,
  MAX_TRACKING_ATTEMPTS,
  RATE_LIMIT_WINDOW_SECONDS,
  TRACKING_RATE_LIMIT_WINDOW_SECONDS
} from '../../config/index.js';

let missingBindingWarned = false;

function missingRateLimitResult(env, remaining, retryAfter = RATE_LIMIT_WINDOW_SECONDS) {
  const production = env?.ENVIRONMENT === 'production';

  if (!missingBindingWarned) {
    const level = production ? 'error' : 'warn';
    console[level](`RATE_LIMIT não configurado; proteção ${production ? 'bloqueada em produção' : 'desativada fora de produção'}`);
    missingBindingWarned = true;
  }

  if (production) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      configurationError: true
    };
  }

  return { allowed: true, remaining, degraded: true };
}

function rateLimitUnavailableResult(env, remaining, retryAfter) {
  if (env?.ENVIRONMENT === 'production') {
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      configurationError: true
    };
  }

  return { allowed: true, remaining, degraded: true };
}

// Verificar rate limit
export async function checkRateLimit(env, key, options = {}) {
  const maxAttempts = options.maxAttempts ?? MAX_LOGIN_ATTEMPTS;
  const windowSeconds = options.windowSeconds ?? RATE_LIMIT_WINDOW_SECONDS;

  if (!env.RATE_LIMIT) {
    return missingRateLimitResult(env, maxAttempts, windowSeconds);
  }

  const now = Date.now();
  const windowKey = `ratelimit:${key}`;

  try {
    const data = await env.RATE_LIMIT.get(windowKey, { type: 'json' });

    if (!data) {
      // Primeira tentativa
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: windowSeconds });

      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Verifica se janela expirou
    if (now - data.firstAttempt > windowSeconds * 1000) {
      // Nova janela
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: windowSeconds });

      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Dentro da janela
    if (data.count >= maxAttempts) {
      const retryAfter = Math.ceil((data.firstAttempt + windowSeconds * 1000 - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    // Incrementa contador
    await env.RATE_LIMIT.put(windowKey, JSON.stringify({
      count: data.count + 1,
      firstAttempt: data.firstAttempt
    }), { expirationTtl: windowSeconds });

    return { allowed: true, remaining: maxAttempts - data.count - 1 };

  } catch (e) {
    console.error('Erro no rate limiting:', e);
    return rateLimitUnavailableResult(
      env,
      maxAttempts,
      windowSeconds
    );
  }
}

// Resetar rate limit (apos login bem sucedido)
export async function resetRateLimit(env, key) {
  if (!env.RATE_LIMIT) return;

  try {
    await env.RATE_LIMIT.delete(`ratelimit:${key}`);
  } catch (e) {
    // Ignora erro
  }
}

// Verificar rate limit para tracking (limites mais altos)
export async function checkTrackingRateLimit(env, userId, ip) {
  if (!env.RATE_LIMIT) {
    return missingRateLimitResult(env, MAX_TRACKING_ATTEMPTS);
  }

  // Prefere user ID se disponível, senão usa IP
  const identifier = userId ? `user:${userId}` : `ip:${ip}`;
  const key = `tracking:${identifier}`;

  const now = Date.now();
  const windowKey = `ratelimit:${key}`;

  try {
    const data = await env.RATE_LIMIT.get(windowKey, { type: 'json' });

    if (!data) {
      // Primeira tentativa
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: TRACKING_RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_TRACKING_ATTEMPTS - 1 };
    }

    // Verifica se janela expirou
    if (now - data.firstAttempt > TRACKING_RATE_LIMIT_WINDOW_SECONDS * 1000) {
      // Nova janela
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: TRACKING_RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_TRACKING_ATTEMPTS - 1 };
    }

    // Dentro da janela
    if (data.count >= MAX_TRACKING_ATTEMPTS) {
      const retryAfter = Math.ceil((data.firstAttempt + TRACKING_RATE_LIMIT_WINDOW_SECONDS * 1000 - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    // Incrementa contador
    await env.RATE_LIMIT.put(windowKey, JSON.stringify({
      count: data.count + 1,
      firstAttempt: data.firstAttempt
    }), { expirationTtl: TRACKING_RATE_LIMIT_WINDOW_SECONDS });

    return { allowed: true, remaining: MAX_TRACKING_ATTEMPTS - data.count - 1 };

  } catch (e) {
    console.error('Erro no tracking rate limiting:', e);
    return rateLimitUnavailableResult(
      env,
      MAX_TRACKING_ATTEMPTS,
      TRACKING_RATE_LIMIT_WINDOW_SECONDS
    );
  }
}
