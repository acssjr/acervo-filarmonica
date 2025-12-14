// worker/src/routes/authRoutes.js
import { login, checkUser } from '../domain/auth/loginService.js';
import { authMiddleware } from '../middleware/index.js';

/**
 * Configura rotas de autenticação
 * @param {Router} router - Instância do Router
 */
export function setupAuthRoutes(router) {
  // POST /api/login - Login do usuário
  router.post('/api/login', async (request, env) => {
    return await login(request, env);
  });

  // POST /api/check-user - Verifica se usuário existe
  router.post('/api/check-user', async (request, env) => {
    return await checkUser(request, env);
  });

  // POST /api/change-pin - Alterar PIN (requer autenticação)
  router.post('/api/change-pin', async (request, env, params, context) => {
    // User vem do authMiddleware
    const { changePin } = await import('../domain/auth/loginService.js');
    return await changePin(request, env, context.user);
  }, [authMiddleware]);
}
