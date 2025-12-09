// worker/src/routes/favoritoRoutes.js
import {
  getFavoritos,
  getFavoritosIds,
  addFavorito,
  removeFavorito
} from '../domain/favoritos/favoritoService.js';
import { authMiddleware } from '../middleware/index.js';

/**
 * Configura rotas de favoritos
 * @param {Router} router - Instância do Router
 */
export function setupFavoritoRoutes(router) {
  // GET /api/favoritos - Listar favoritos do usuário (com dados da partitura)
  router.get('/api/favoritos', async (request, env, params, context) => {
    return await getFavoritos(request, env, context.user);
  }, [authMiddleware]);

  // GET /api/favoritos/ids - Listar apenas IDs dos favoritos (para checagem rápida)
  router.get('/api/favoritos/ids', async (request, env, params, context) => {
    return await getFavoritosIds(request, env, context.user);
  }, [authMiddleware]);

  // POST /api/favoritos/:id - Adicionar favorito
  router.post('/api/favoritos/:id', async (request, env, params, context) => {
    const partituraId = parseInt(params.id, 10);
    return await addFavorito(partituraId, request, env, context.user);
  }, [authMiddleware]);

  // DELETE /api/favoritos/:id - Remover favorito
  router.delete('/api/favoritos/:id', async (request, env, params, context) => {
    const partituraId = parseInt(params.id, 10);
    return await removeFavorito(partituraId, request, env, context.user);
  }, [authMiddleware]);
}
