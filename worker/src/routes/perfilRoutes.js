// worker/src/routes/perfilRoutes.js
import { authMiddleware } from '../middleware/index.js';
import {
  getPerfil,
  updatePerfil,
  uploadFotoPerfil
} from '../domain/perfil/index.js';

/**
 * Configurar rotas de perfil (usuário logado)
 * @param {Router} router - Instância do router
 */
export function setupPerfilRoutes(router) {
  // Todas as rotas requerem autenticação
  router.get('/api/perfil', (req, env, params, context) => {
    // User já foi verificado pelo middleware e está em context.user
    return getPerfil(req, env, context.user);
  }, [authMiddleware]);
  router.put('/api/perfil', (req, env, params, context) => {
    return updatePerfil(req, env, context.user);
  }, [authMiddleware]);
  router.post('/api/perfil/foto', (req, env, params, context) => {
    return uploadFotoPerfil(req, env, context.user);
  }, [authMiddleware]);
}
