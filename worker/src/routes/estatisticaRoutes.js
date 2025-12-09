// worker/src/routes/estatisticaRoutes.js
import { adminMiddleware } from '../middleware/index.js';
import {
  getEstatisticas,
  getEstatisticasAdmin,
  getInstrumentos
} from '../domain/estatisticas/index.js';

/**
 * Configurar rotas de estatísticas e instrumentos
 * @param {Router} router - Instância do router
 */
export function setupEstatisticaRoutes(router) {
  // Rotas públicas
  router.get('/api/estatisticas', getEstatisticas);
  router.get('/api/instrumentos', getInstrumentos);

  // Rotas admin
  router.get('/api/admin/estatisticas', getEstatisticasAdmin, [adminMiddleware]);
}
