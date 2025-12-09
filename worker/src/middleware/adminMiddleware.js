// worker/src/middleware/adminMiddleware.js
import { verifyAdmin } from '../domain/auth/authService.js';
import { errorResponse } from '../infrastructure/response/helpers.js';

/**
 * Middleware para verificar se usuário é administrador
 *
 * Verifica se há um token JWT válido e se o usuário tem admin = 1.
 * Se válido, adiciona o objeto user ao contexto e chama next().
 * Se inválido ou não for admin, retorna erro 403.
 *
 * @param {Request} request
 * @param {Object} env - Environment bindings
 * @param {Function} next - Função para continuar pipeline
 * @param {Object} context - Contexto compartilhado
 * @returns {Response|void}
 */
export async function adminMiddleware(request, env, next, context) {
  const user = await verifyAdmin(request, env);

  if (!user) {
    return errorResponse('Acesso negado - requer privilégios de administrador', 403, request);
  }

  // Adicionar user ao contexto para uso nos handlers
  context.user = user;

  // Continuar para próximo middleware/handler
  next();
}
