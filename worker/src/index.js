/**
 * ACERVO DIGITAL - API (Versão Modular)
 * Sociedade Filarmônica 25 de Março
 *
 * Cloudflare Worker para gerenciar partituras
 *
 * ARQUITETURA:
 * - Monólito Modular com Arquitetura Hexagonal
 * - Separação clara entre Infrastructure e Domain
 * - Router com suporte a middleware pipeline
 *
 * SEGURANÇA:
 * - JWT com HMAC SHA-256 (Web Crypto API)
 * - Hash de PIN com PBKDF2 (100.000 iterações)
 * - CORS com whitelist de domínios
 * - Rate limiting no login
 */

import { createRouter } from './routes/index.js';
import { getCorsHeaders } from './infrastructure/security/cors.js';
import { jsonResponse } from './infrastructure/response/helpers.js';

// Criar router uma única vez (singleton)
let router = null;

function getRouter() {
  if (!router) {
    router = createRouter();
  }
  return router;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    // Handle OPTIONS (preflight)
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    }

    // Usar o router modular
    const appRouter = getRouter();

    try {
      const response = await appRouter.handle(request, env, ctx);
      return response;
    } catch (error) {
      console.error('Erro não tratado:', error);
      return jsonResponse(
        { error: 'Erro interno do servidor', message: error.message },
        500,
        request
      );
    }
  },
};
