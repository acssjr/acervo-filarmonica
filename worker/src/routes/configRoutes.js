// worker/src/routes/configRoutes.js
import { jsonResponse, errorResponse } from '../infrastructure/response/helpers.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

/**
 * Configura rotas de configurações globais
 * @param {Router} router - Instância do Router
 */
export function setupConfigRoutes(router) {
  // GET /api/config/recesso - Retorna estado do modo recesso (público)
  router.get('/api/config/recesso', async (request, env) => {
    try {
      const result = await env.DB.prepare(
        "SELECT valor FROM configuracoes WHERE chave = 'modo_recesso'"
      ).first();

      const ativo = result?.valor === 'true';

      return jsonResponse({ ativo }, 200, request);
    } catch (error) {
      // Se tabela não existe, retorna false como padrão
      return jsonResponse({ ativo: false }, 200, request);
    }
  });

  // PUT /api/config/recesso - Atualiza estado do modo recesso (requer admin)
  router.put('/api/config/recesso', async (request, env) => {
    try {
      const body = await request.json();
      const ativo = body.ativo === true;

      await env.DB.prepare(
        "INSERT OR REPLACE INTO configuracoes (chave, valor, atualizado_em) VALUES ('modo_recesso', ?, CURRENT_TIMESTAMP)"
      ).bind(ativo ? 'true' : 'false').run();

      return jsonResponse({ ativo, mensagem: 'Configuração atualizada' }, 200, request);
    } catch (error) {
      return errorResponse('Erro ao atualizar configuração: ' + error.message, 500, request);
    }
  }, [adminMiddleware]);
}
