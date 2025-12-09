// worker/src/routes/usuarioRoutes.js
import { adminMiddleware } from '../middleware/index.js';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../domain/usuarios/index.js';

/**
 * Configurar rotas de usuários (Admin)
 * @param {Router} router - Instância do router
 */
export function setupUsuarioRoutes(router) {
  // Todas as rotas requerem admin
  router.get('/api/usuarios', getUsuarios, [adminMiddleware]);
  router.get('/api/usuarios/:id', (req, env, params) => {
    const id = params.id;
    return getUsuario(id, req, env);
  }, [adminMiddleware]);
  router.post('/api/usuarios', createUsuario, [adminMiddleware]);
  router.put('/api/usuarios/:id', async (req, env, params, context) => {
    const id = params.id;
    // Admin já foi verificado pelo middleware e está em context.user
    return updateUsuario(id, req, env, context.user);
  }, [adminMiddleware]);
  router.delete('/api/usuarios/:id', async (req, env, params, context) => {
    const id = params.id;
    // Admin já foi verificado pelo middleware e está em context.user
    return deleteUsuario(id, req, env, context.user);
  }, [adminMiddleware]);
}
