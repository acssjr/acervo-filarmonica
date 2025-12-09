// worker/src/infrastructure/ratelimit/rateLimiter.js
import { MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_SECONDS } from '../../config/index.js';

// Verificar rate limit
export async function checkRateLimit(env, key) {
  // Se nao tiver KV configurado, permite (para nao quebrar)
  if (!env.RATE_LIMIT) {
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
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
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Verifica se janela expirou
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW_SECONDS * 1000) {
      // Nova janela
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Dentro da janela
    if (data.count >= MAX_LOGIN_ATTEMPTS) {
      const retryAfter = Math.ceil((data.firstAttempt + RATE_LIMIT_WINDOW_SECONDS * 1000 - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    // Incrementa contador
    await env.RATE_LIMIT.put(windowKey, JSON.stringify({
      count: data.count + 1,
      firstAttempt: data.firstAttempt
    }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - data.count - 1 };

  } catch (e) {
    console.error('Erro no rate limiting:', e);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS }; // Em caso de erro, permite
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
