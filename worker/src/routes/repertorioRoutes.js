// worker/src/routes/repertorioRoutes.js
import {
  getRepertorioAtivo,
  getRepertorio,
  listRepertorios,
  createRepertorio,
  updateRepertorio,
  deleteRepertorio,
  addPartituraToRepertorio,
  removePartituraFromRepertorio,
  reorderPartiturasRepertorio,
  duplicarRepertorio,
  isPartituraInRepertorioAtivo,
  downloadRepertorio,
  getRepertorioInstrumentos
} from '../domain/repertorios/repertorioService.js';
import { authMiddleware, adminMiddleware } from '../middleware/index.js';

/**
 * Configura rotas de repertorios
 * @param {Router} router - Instancia do Router
 */
export function setupRepertorioRoutes(router) {
  // ============ ROTAS PUBLICAS (AUTENTICADAS) ============

  // GET /api/repertorio/ativo - Obter repertorio ativo
  router.get('/api/repertorio/ativo', async (request, env, params, context) => {
    return await getRepertorioAtivo(request, env);
  }, [authMiddleware]);

  // GET /api/repertorio/:id - Obter repertorio por ID
  router.get('/api/repertorio/:id', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await getRepertorio(id, request, env);
  }, [authMiddleware]);

  // GET /api/repertorio/:id/download - Download em lote
  router.get('/api/repertorio/:id/download', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await downloadRepertorio(id, request, env, context.user);
  }, [authMiddleware]);

  // GET /api/repertorio/:id/instrumentos - Listar instrumentos disponíveis no repertório
  router.get('/api/repertorio/:id/instrumentos', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await getRepertorioInstrumentos(id, request, env);
  }, [authMiddleware]);

  // GET /api/partituras/:id/in-repertorio - Verificar se partitura esta no repertorio
  router.get('/api/partituras/:id/in-repertorio', async (request, env, params, context) => {
    const partituraId = parseInt(params.id, 10);
    return await isPartituraInRepertorioAtivo(partituraId, request, env);
  }, [authMiddleware]);

  // ============ ROTAS ADMIN ============

  // GET /api/repertorios - Listar todos (historico)
  router.get('/api/repertorios', async (request, env, params, context) => {
    return await listRepertorios(request, env);
  }, [adminMiddleware]);

  // POST /api/repertorios - Criar novo repertorio
  router.post('/api/repertorios', async (request, env, params, context) => {
    return await createRepertorio(request, env, context.user);
  }, [adminMiddleware]);

  // PUT /api/repertorio/:id - Atualizar repertorio
  router.put('/api/repertorio/:id', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await updateRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // DELETE /api/repertorio/:id - Deletar repertorio
  router.delete('/api/repertorio/:id', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await deleteRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // POST /api/repertorio/:id/partituras - Adicionar partitura
  router.post('/api/repertorio/:id/partituras', async (request, env, params, context) => {
    const repertorioId = parseInt(params.id, 10);
    return await addPartituraToRepertorio(repertorioId, request, env, context.user);
  }, [adminMiddleware]);

  // DELETE /api/repertorio/:repertorioId/partituras/:partituraId - Remover partitura
  router.delete('/api/repertorio/:repertorioId/partituras/:partituraId', async (request, env, params, context) => {
    const repertorioId = parseInt(params.repertorioId, 10);
    const partituraId = parseInt(params.partituraId, 10);
    return await removePartituraFromRepertorio(repertorioId, partituraId, request, env, context.user);
  }, [adminMiddleware]);

  // PUT /api/repertorio/:id/reorder - Reordenar partituras
  router.put('/api/repertorio/:id/reorder', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await reorderPartiturasRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // POST /api/repertorio/:id/duplicar - Duplicar repertorio
  router.post('/api/repertorio/:id/duplicar', async (request, env, params, context) => {
    const id = parseInt(params.id, 10);
    return await duplicarRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);
}
