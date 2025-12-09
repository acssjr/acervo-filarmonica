// worker/src/infrastructure/response/helpers.js
import { getCorsHeaders } from '../security/cors.js';

// Resposta JSON padronizada
export function jsonResponse(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(request),
    },
  });
}

// Resposta de erro padronizada
export function errorResponse(message, status = 400, request) {
  return jsonResponse({ error: message }, status, request);
}

// Obter JWT secret do ambiente
export function getJwtSecret(env) {
  // Usa variavel de ambiente ou gera baseado no database_id
  return env.JWT_SECRET || `acervo-jwt-secret-${env.DB?.databaseId || 'default'}`;
}
