// ===== ENSAIO ROUTES =====
// Rotas para gestão de partituras tocadas em ensaios

import { authMiddleware, adminMiddleware } from '../middleware/index.js';
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
      return Response.json(data);
    } catch (error) {
      console.error('Erro ao buscar partituras do ensaio:', error);
      return Response.json(
        { erro: 'Erro ao buscar partituras' },
        { status: 500 }
      );
    }
  });

  // POST /api/ensaios/:data/partituras - Adicionar partitura ao ensaio (admin)
  router.post('/api/ensaios/:data/partituras', async (request, env, params, context) => {
    try {
      const { partitura_id } = await request.json();

      if (!partitura_id) {
        return Response.json(
          { erro: 'ID da partitura é obrigatório' },
          { status: 400 }
        );
      }

      const result = await EnsaioService.addPartituraEnsaio(
        env,
        params.data,
        partitura_id,
        context.user.id
      );

      return Response.json(result);
    } catch (error) {
      console.error('Erro ao adicionar partitura ao ensaio:', error);

      if (error.message.includes('já foi adicionada')) {
        return Response.json(
          { erro: error.message },
          { status: 400 }
        );
      }

      return Response.json(
        { erro: 'Erro ao adicionar partitura' },
        { status: 500 }
      );
    }
  }, [authMiddleware, adminMiddleware]);

  // DELETE /api/ensaios/:data/partituras/:id - Remover partitura do ensaio (admin)
  router.delete('/api/ensaios/:data/partituras/:id', async (request, env, params) => {
    try {
      const result = await EnsaioService.removePartituraEnsaio(env, parseInt(params.id, 10));
      return Response.json(result);
    } catch (error) {
      console.error('Erro ao remover partitura do ensaio:', error);
      return Response.json(
        { erro: 'Erro ao remover partitura' },
        { status: 500 }
      );
    }
  }, [authMiddleware, adminMiddleware]);

  // PUT /api/ensaios/:data/partituras/reorder - Reordenar partituras (admin)
  router.put('/api/ensaios/:data/partituras/reorder', async (request, env, params) => {
    try {
      const { ordens } = await request.json();

      if (!ordens || !Array.isArray(ordens)) {
        return Response.json(
          { erro: 'Array de ordens é obrigatório' },
          { status: 400 }
        );
      }

      const result = await EnsaioService.reorderPartiturasEnsaio(env, params.data, ordens);
      return Response.json(result);
    } catch (error) {
      console.error('Erro ao reordenar partituras:', error);
      return Response.json(
        { erro: 'Erro ao reordenar partituras' },
        { status: 500 }
      );
    }
  }, [authMiddleware, adminMiddleware]);
}
