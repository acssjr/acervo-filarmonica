// worker/src/middleware/corsMiddleware.js
import { getCorsHeaders } from '../infrastructure/security/cors.js';

/**
 * Middleware para adicionar CORS headers a todas as respostas
 *
 * Este middleware deve ser usado como middleware global para garantir
 * que todas as respostas incluam os headers CORS apropriados
 */
export function corsMiddleware(request, env, next, context) {
  // Armazenar CORS headers no contexto para uso posterior
  context.corsHeaders = getCorsHeaders(request);

  // Continuar para próximo middleware/handler
  next();
}
