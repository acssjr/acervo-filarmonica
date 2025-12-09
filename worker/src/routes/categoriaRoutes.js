// worker/src/routes/categoriaRoutes.js
import { adminMiddleware } from '../middleware/index.js';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  reorderCategorias
} from '../domain/categorias/index.js';

/**
 * Configurar rotas de categorias
 * @param {Router} router - Instância do router
 */
export function setupCategoriaRoutes(router) {
  // Rota pública
  router.get('/api/categorias', getCategorias);

  // Rotas admin
  router.post('/api/categorias', createCategoria, [adminMiddleware]);
  router.put('/api/categorias/:id', (req, env, params) => {
    const id = params.id;
    return updateCategoria(id, req, env);
  }, [adminMiddleware]);
  router.delete('/api/categorias/:id', (req, env, params) => {
    const id = params.id;
    return deleteCategoria(id, req, env);
  }, [adminMiddleware]);
  router.post('/api/categorias/reorder', reorderCategorias, [adminMiddleware]);
}
