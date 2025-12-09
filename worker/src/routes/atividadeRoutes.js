// worker/src/routes/atividadeRoutes.js
import { getAtividades, getAtividadesUsuario } from '../domain/atividades/atividadeService.js';
import { authMiddleware } from '../middleware/index.js';

/**
 * Configura rotas de atividades
 * @param {Router} router - Instância do Router
 */
export function setupAtividadeRoutes(router) {
  // GET /api/atividades - Listar atividades recentes (público)
  router.get('/api/atividades', async (request, env) => {
    return await getAtividades(request, env, 20);
  });

  // GET /api/minhas-atividades - Listar atividades do usuário autenticado
  router.get('/api/minhas-atividades', async (request, env, params, context) => {
    return await getAtividadesUsuario(request, env, context.user);
  }, [authMiddleware]);
}
