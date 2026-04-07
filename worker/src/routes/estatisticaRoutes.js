// worker/src/routes/estatisticaRoutes.js
import { adminMiddleware, authMiddleware } from '../middleware/index.js';
import { errorResponse, jsonResponse } from '../infrastructure/index.js';
import {
  getEstatisticas,
  getEstatisticasAdmin,
  getInstrumentos
} from '../domain/estatisticas/estatisticaService.js';
import { getAnalyticsDashboard } from '../domain/analytics/analyticsService.js';
import {
  isTrackingValidationError,
  normalizeTrackingSessionId,
  registrarTrackingEvent
} from '../domain/analytics/eventService.js';
import { endTrackingSession } from '../domain/analytics/sessionService.js';
import { trackSearch } from '../domain/analytics/trackingService.js';
import { checkTrackingRateLimit } from '../infrastructure/ratelimit/rateLimiter.js';

export async function trackingRateLimitMiddleware(request, env, next, _params, context) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const userId = context?.user?.id || null;

  const rateLimit = await checkTrackingRateLimit(env, userId, ip);
  if (!rateLimit.allowed) {
    return errorResponse(`Muitas tentativas. Tente novamente em ${rateLimit.retryAfter} segundos.`, 429, request);
  }

  next();
  return null;
}

/**
 * Configurar rotas de estatísticas e analytics
 * @param {Router} router - Instância do router
 */
export function setupEstatisticaRoutes(router) {
  // Rotas públicas
  router.get('/api/estatisticas', getEstatisticas);
  router.get('/api/instrumentos', getInstrumentos);

  // Rota de tracking (requer auth para vincular ao usuário)
  router.post('/api/tracking/search', trackSearch, [trackingRateLimitMiddleware, authMiddleware]);
  router.post('/api/tracking/events', async (request, env, _params, context) => {
    try {
      let body;
      try {
        body = await request.json();
      } catch {
        return errorResponse('JSON inválido', 400, request);
      }

      const headerSessionId = normalizeTrackingSessionId(request.headers.get('X-Tracking-Session'));
      const bodySessionId = normalizeTrackingSessionId(body?.session_id);
      const sessionId = headerSessionId || bodySessionId;
      const result = await registrarTrackingEvent(env, context.user, sessionId, body);

      return jsonResponse({ success: true, session_id: result.session_id }, 200, request);
    } catch (error) {
      if (isTrackingValidationError(error)) {
        return errorResponse(error.message, 400, request);
      }

      console.error('Erro ao registrar evento de tracking:', error);
      return errorResponse('Erro ao registrar evento de tracking', 500, request);
    }
  }, [trackingRateLimitMiddleware, authMiddleware]);

  router.post('/api/tracking/session/end', async (request, env, _params, context) => {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const headerSessionId = normalizeTrackingSessionId(request.headers.get('X-Tracking-Session'));
    const bodySessionId = normalizeTrackingSessionId(body?.session_id);
    const sessionId = headerSessionId || bodySessionId;
    if (!sessionId) {
      return errorResponse('Sessão inválida', 400, request);
    }

    await endTrackingSession(env, sessionId, 'logout', context.user.id);
    return jsonResponse({ success: true }, 200, request);
  }, [trackingRateLimitMiddleware, authMiddleware]);

  // Rotas admin
  router.get('/api/admin/estatisticas', getEstatisticasAdmin, [adminMiddleware]);

  // Dashboard de Analytics (Admin)
  router.get('/api/admin/analytics/dashboard', getAnalyticsDashboard, [adminMiddleware]);
}