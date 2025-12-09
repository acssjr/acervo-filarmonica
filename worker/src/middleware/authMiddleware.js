// worker/src/middleware/authMiddleware.js
import { verifyUser } from '../domain/auth/authService.js';
import { errorResponse } from '../infrastructure/response/helpers.js';

/**
 * Middleware para verificar autenticação do usuário
 *
 * Verifica se há um token JWT válido no header Authorization.
 * Se válido, adiciona o objeto user ao contexto e chama next().
 * Se inválido, retorna erro 401.
 *
 * @param {Request} request
 * @param {Object} env - Environment bindings
 * @param {Function} next - Função para continuar pipeline
 * @param {Object} context - Contexto compartilhado
 * @returns {Response|void}
 */
export async function authMiddleware(request, env, next, context) {
  const user = await verifyUser(request, env);

  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  // Adicionar user ao contexto para uso nos handlers
  context.user = user;

  // Continuar para próximo middleware/handler
  next();
}
