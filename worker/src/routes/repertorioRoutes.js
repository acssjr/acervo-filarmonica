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
  getRepertorioDownloadAvailability,
  getRepertorioInstrumentos
} from '../domain/repertorios/repertorioService.js';
import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import { errorResponse, parsePositiveId } from '../infrastructure/index.js';

function routeId(value, request) {
  const id = parsePositiveId(value);
  return id || errorResponse('ID inválido', 400, request);
}

/**
 * Configura rotas de repertorios
 * @param {Router} router - Instancia do Router
 */
export function setupRepertorioRoutes(router) {
  // ============ ROTAS PUBLICAS (AUTENTICADAS) ============

  // GET /api/repertorio/ativo - Obter repertorio ativo (público — usado no countdown)
  router.get('/api/repertorio/ativo', async (request, env, _params, _context) => {
    return await getRepertorioAtivo(request, env);
  });

  // GET /api/repertorio/:id - Obter repertorio por ID
  router.get('/api/repertorio/:id', async (request, env, params, _context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await getRepertorio(id, request, env);
  }, [authMiddleware]);

  // GET /api/repertorio/:id/download - Download em lote
  router.get('/api/repertorio/:id/download', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await downloadRepertorio(id, request, env, context.user);
  }, [authMiddleware]);

  // GET /api/repertorio/:id/disponibilidade-download - Conferir partes e arquivos
  router.get('/api/repertorio/:id/disponibilidade-download', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await getRepertorioDownloadAvailability(id, request, env, context.user);
  }, [authMiddleware]);

  // GET /api/repertorio/:id/instrumentos - Listar instrumentos disponíveis no repertório
  router.get('/api/repertorio/:id/instrumentos', async (request, env, params, _context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await getRepertorioInstrumentos(id, request, env);
  }, [authMiddleware]);

  // GET /api/partituras/:id/in-repertorio - Verificar se partitura esta no repertorio
  router.get('/api/partituras/:id/in-repertorio', async (request, env, params, _context) => {
    const partituraId = routeId(params.id, request);
    if (partituraId instanceof Response) return partituraId;
    return await isPartituraInRepertorioAtivo(partituraId, request, env);
  }, [authMiddleware]);

  // ============ ROTAS ADMIN ============

  // GET /api/repertorios - Listar todos (historico)
  router.get('/api/repertorios', async (request, env, _params, _context) => {
    return await listRepertorios(request, env);
  }, [adminMiddleware]);

  // POST /api/repertorios - Criar novo repertorio
  router.post('/api/repertorios', async (request, env, _params, context) => {
    return await createRepertorio(request, env, context.user);
  }, [adminMiddleware]);

  // PUT /api/repertorio/:id - Atualizar repertorio
  router.put('/api/repertorio/:id', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await updateRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // DELETE /api/repertorio/:id - Deletar repertorio
  router.delete('/api/repertorio/:id', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await deleteRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // POST /api/repertorio/:id/partituras - Adicionar partitura
  router.post('/api/repertorio/:id/partituras', async (request, env, params, context) => {
    const repertorioId = routeId(params.id, request);
    if (repertorioId instanceof Response) return repertorioId;
    return await addPartituraToRepertorio(repertorioId, request, env, context.user);
  }, [adminMiddleware]);

  // DELETE /api/repertorio/:repertorioId/partituras/:partituraId - Remover partitura
  router.delete('/api/repertorio/:repertorioId/partituras/:partituraId', async (request, env, params, context) => {
    const repertorioId = routeId(params.repertorioId, request);
    const partituraId = routeId(params.partituraId, request);
    if (repertorioId instanceof Response) return repertorioId;
    if (partituraId instanceof Response) return partituraId;
    return await removePartituraFromRepertorio(repertorioId, partituraId, request, env, context.user);
  }, [adminMiddleware]);

  // PUT /api/repertorio/:id/reorder - Reordenar partituras
  router.put('/api/repertorio/:id/reorder', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await reorderPartiturasRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);

  // POST /api/repertorio/:id/duplicar - Duplicar repertorio
  router.post('/api/repertorio/:id/duplicar', async (request, env, params, context) => {
    const id = routeId(params.id, request);
    if (id instanceof Response) return id;
    return await duplicarRepertorio(id, request, env, context.user);
  }, [adminMiddleware]);
}
