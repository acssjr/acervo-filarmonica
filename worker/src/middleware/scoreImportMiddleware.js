import { timingSafeEqual } from 'node:crypto';
import { errorResponse } from '../infrastructure/response/helpers.js';
import { adminMiddleware } from './adminMiddleware.js';

export function scoreImportMiddleware(request, env, next, context) {
  const header = request.headers.get('X-Acervo-Import-Key');
  if (header === null) {
    return adminMiddleware(request, env, next, context);
  }

  const encoder = new TextEncoder();
  const supplied = encoder.encode(header);
  const expected = encoder.encode(env.ACERVO_IMPORT_KEY || '');
  if (expected.length < 32 || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return errorResponse('Credencial de importação inválida', 403, request);
  }

  context.user = { id: null };
  next();
}
