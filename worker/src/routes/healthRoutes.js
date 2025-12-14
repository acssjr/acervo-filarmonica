// worker/src/routes/healthRoutes.js
import { jsonResponse } from '../infrastructure/response/helpers.js';

// Versão atual da aplicação - atualizar a cada release
const APP_VERSION = '2.8.0';

/**
 * Configura rotas de health check
 * @param {Router} router - Instância do Router
 */
export function setupHealthRoutes(router) {
  // GET /api/health - Health check
  router.get('/api/health', async (request, env) => {
    return jsonResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      security: {
        jwt: true,
        pbkdf2: true,
        cors: 'whitelist',
        rateLimit: !!env.RATE_LIMIT
      }
    }, 200, request);
  });

  // GET /api/version - Retorna versão atual da aplicação
  router.get('/api/version', async (request) => {
    return jsonResponse({
      version: APP_VERSION,
      timestamp: new Date().toISOString()
    }, 200, request);
  });
}
