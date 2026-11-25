import { timingSafeEqual } from 'node:crypto';
import { errorResponse } from '../infrastructure/response/helpers.js';
import { adminMiddleware } from './adminMiddleware.js';

export function scoreAccess(fallback = adminMiddleware) {
  return (request, env, next, context) => {
    const header = request.headers.get('X-Acervo-Import-Key');
    if (header === null) {
      return fallback(request, env, next, context);
    }

    const encoder = new TextEncoder();
    const supplied = encoder.encode(header);
    const expected = encoder.encode(env.ACERVO_IMPORT_KEY || '');
    if (expected.length < 32 || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return errorResponse('Credencial de importação inválida', 403, request);
    }
    if (request.method === 'DELETE' && request.headers.get('X-Acervo-Confirm-Delete') !== context.params.id) {
      return errorResponse('Confirme o ID do registro antes de excluir', 400, request);
    }

    context.user = { id: null };
    next();
  };
}

export const scoreImportMiddleware = scoreAccess();
