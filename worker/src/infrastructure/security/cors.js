// worker/src/infrastructure/security/cors.js
import { ALLOWED_ORIGINS, PAGES_SUBDOMAIN_PATTERN } from '../../config/index.js';

// Verifica se origem é permitida
export function isOriginAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (PAGES_SUBDOMAIN_PATTERN.test(origin)) return true;
  return false;
}

// Gera CORS headers baseado na origem
export function getCorsHeaders(request, env = null) {
  const origin = request.headers.get('Origin');
  const allowNoOriginWildcard = env?.ENVIRONMENT === 'development';
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Tracking-Session',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!origin && allowNoOriginWildcard) {
    // Requisições sem origin (ex: curl, postman) - permite apenas fora de produção
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}
