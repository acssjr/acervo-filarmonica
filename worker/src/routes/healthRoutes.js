// worker/src/routes/healthRoutes.js
import { jsonResponse } from '../infrastructure/response/helpers.js';

// Versão atual da aplicação - atualizar a cada release
const APP_VERSION = '3.1.0';

export async function checkReadiness(env) {
  const checks = {
    database: 'ok',
    storage: env?.BUCKET ? 'configured' : 'missing',
    rateLimit: env?.DB
      && env?.LOGIN_RATE_LIMITER
      && env?.CHECK_USER_RATE_LIMITER
      && env?.TRACKING_RATE_LIMITER
      ? 'configured'
      : 'missing',
    authentication: typeof env?.JWT_SECRET === 'string' && env.JWT_SECRET.trim()
      ? 'configured'
      : 'missing'
  };

  if (!env?.DB) {
    checks.database = 'missing';
  } else {
    try {
      await env.DB.prepare('SELECT 1 FROM login_rate_limits LIMIT 1').first();
    } catch {
      checks.database = 'unavailable';
      checks.rateLimit = 'unavailable';
    }
  }

  const ready = Object.values(checks).every(value => (
    value === 'ok' || value === 'configured'
  ));

  return { ready, checks };
}

/**
 * Configura rotas de health check
 * @param {Router} router - Instância do Router
 */
export function setupHealthRoutes(router) {
  // GET /api/health - Health check
  router.get('/api/health', async (request, env) => {
    const readiness = await checkReadiness(env);

    return jsonResponse({
      status: readiness.ready ? 'ok' : 'unavailable',
      checks: readiness.checks,
      timestamp: new Date().toISOString()
    }, readiness.ready ? 200 : 503, request);
  });

  // GET /api/version - Retorna versão atual da aplicação
  router.get('/api/version', async (request) => {
    return jsonResponse({
      version: APP_VERSION,
      timestamp: new Date().toISOString()
    }, 200, request);
  });
}
