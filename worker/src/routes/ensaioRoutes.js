// ===== ENSAIO ROUTES =====
// Rotas para gestão de partituras tocadas em ensaios

import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import { jsonResponse, errorResponse } from '../infrastructure/response/helpers.js';
import * as EnsaioService from '../domain/ensaio/ensaioService.js';

/**
 * Configura rotas de ensaios
 * @param {Router} router - Router instance
 */
export function setupEnsaioRoutes(router) {
  // GET /api/ensaios/:data/partituras - Listar partituras de um ensaio (público)
  router.get('/api/ensaios/:data/partituras', async (request, env, params) => {
    try {
      const data = await EnsaioService.getPartiturasEnsaio(env, params.data);
      return jsonResponse(data, 200, request);
    } catch (error) {
      console.error('Erro ao buscar partituras do ensaio:', error);
      return errorResponse('Erro ao buscar partituras', 500, request);
    }
  });

  // POST /api/ensaios/:data/partituras - Adicionar partitura ao ensaio (admin)
  router.post('/api/ensaios/:data/partituras', async (request, env, params, context) => {
    try {
      const { partitura_id } = await request.json();

      if (!partitura_id) {
        return errorResponse('ID da partitura é obrigatório', 400, request);
      }

      const result = await EnsaioService.addPartituraEnsaio(
        env,
        params.data,
        partitura_id,
        context.user.id
      );

      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao adicionar partitura ao ensaio:', error);

      if (error.message.includes('já foi adicionada')) {
        return errorResponse(error.message, 400, request);
      }

      return errorResponse('Erro ao adicionar partitura', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // DELETE /api/ensaios/:data/partituras/:partituraId - Remover partitura do ensaio (admin)
  router.delete('/api/ensaios/:data/partituras/:partituraId', async (request, env, params) => {
    try {
      const result = await EnsaioService.removePartituraEnsaio(env, params.data, parseInt(params.partituraId, 10));
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao remover partitura do ensaio:', error);
      return errorResponse('Erro ao remover partitura', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // PUT /api/ensaios/:data/partituras/reorder - Reordenar partituras (admin)
  router.put('/api/ensaios/:data/partituras/reorder', async (request, env, params) => {
    try {
      const { ordens } = await request.json();

      if (!ordens || !Array.isArray(ordens)) {
        return errorResponse('Array de ordens é obrigatório', 400, request);
      }

      const result = await EnsaioService.reorderPartiturasEnsaio(env, params.data, ordens);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao reordenar partituras:', error);
      return errorResponse('Erro ao reordenar partituras', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);
}
