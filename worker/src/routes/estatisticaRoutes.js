// worker/src/routes/estatisticaRoutes.js
import { adminMiddleware, authMiddleware } from '../middleware/index.js';
import {
  getEstatisticas,
  getEstatisticasAdmin,
  getInstrumentos
} from '../domain/estatisticas/estatisticaService.js';
import { getAnalyticsDashboard } from '../domain/analytics/analyticsService.js';
import { trackSearch } from '../domain/analytics/trackingService.js';

/**
 * Configurar rotas de estatísticas e analytics
 * @param {Router} router - Instância do router
 */
export function setupEstatisticaRoutes(router) {
  // Rotas públicas
  router.get('/api/estatisticas', getEstatisticas);
  router.get('/api/instrumentos', getInstrumentos);

  // Rota de tracking (requer auth para vincular ao usuário)
  router.post('/api/tracking/search', trackSearch, [authMiddleware]);

  // Rotas admin
  router.get('/api/admin/estatisticas', getEstatisticasAdmin, [adminMiddleware]);

  // Dashboard de Analytics (Admin)
  router.get('/api/admin/analytics/dashboard', getAnalyticsDashboard, [adminMiddleware]);
}
