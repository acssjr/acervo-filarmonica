// ===== ENSAIO ROUTES =====
// Rotas para gestão de partituras tocadas em ensaios

import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import { errorResponse, isIsoDate, jsonResponse, parsePositiveId } from '../infrastructure/index.js';
import * as EnsaioService from '../domain/ensaio/ensaioService.js';

function validateDate(value, request) {
  return isIsoDate(value) ? null : errorResponse('Data de ensaio inválida', 400, request);
}

/**
 * Configura rotas de ensaios
 * @param {Router} router - Router instance
 */
export function setupEnsaioRoutes(router) {
  // GET /api/ensaios/:data/partituras - Listar partituras de um ensaio (público)
  router.get('/api/ensaios/:data/partituras', async (request, env, params) => {
    try {
      const dateError = validateDate(params.data, request);
      if (dateError) return dateError;
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
      const dateError = validateDate(params.data, request);
      if (dateError) return dateError;
      const { partitura_id } = await request.json();
      const partituraId = parsePositiveId(partitura_id);
      if (!partituraId) {
        return errorResponse('ID da partitura é obrigatório', 400, request);
      }

      const result = await EnsaioService.addPartituraEnsaio(
        env,
        params.data,
        partituraId,
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
      const dateError = validateDate(params.data, request);
      if (dateError) return dateError;
      const partituraId = parsePositiveId(params.partituraId);
      if (!partituraId) return errorResponse('ID da partitura inválido', 400, request);
      const result = await EnsaioService.removePartituraEnsaio(env, params.data, partituraId);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao remover partitura do ensaio:', error);
      return errorResponse('Erro ao remover partitura', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // PUT /api/ensaios/:data/partituras/reorder - Reordenar partituras (admin)
  router.put('/api/ensaios/:data/partituras/reorder', async (request, env, params) => {
    try {
      const dateError = validateDate(params.data, request);
      if (dateError) return dateError;
      const { ordens } = await request.json();

      if (!ordens || !Array.isArray(ordens)) {
        return errorResponse('Array de ordens é obrigatório', 400, request);
      }

      const result = await EnsaioService.reorderPartiturasEnsaio(env, params.data, ordens);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao reordenar partituras:', error);
      if (error.message.includes('inválida')) return errorResponse(error.message, 400, request);
      return errorResponse('Erro ao reordenar partituras', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // PATCH /api/ensaios/:data/config - Atualizar config do ensaio (admin)
  router.patch('/api/ensaios/:data/config', async (request, env, params) => {
    try {
      const dateError = validateDate(params.data, request);
      if (dateError) return dateError;
      const { youtube_url } = await request.json();
      const result = await EnsaioService.updateEnsaioConfig(env, params.data, youtube_url);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao atualizar config do ensaio:', error);
      if (error.message.includes('URL')) return errorResponse(error.message, 400, request);
      return errorResponse('Erro interno', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);
}
