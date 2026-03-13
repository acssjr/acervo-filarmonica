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

  // GET /api/config/dias-ensaio - Retorna dias de ensaio configurados (público)
  router.get('/api/config/dias-ensaio', async (request, env) => {
    try {
      const result = await env.DB.prepare(
        "SELECT valor FROM configuracoes WHERE chave = 'dias_ensaio'"
      ).first();
      const horaResult = await env.DB.prepare(
        "SELECT valor FROM configuracoes WHERE chave = 'hora_ensaio'"
      ).first();

      // Default: segunda (1) e quarta (3), 19h
      const dias = result?.valor ? JSON.parse(result.valor) : [1, 3];
      const hora = horaResult?.valor ? parseInt(horaResult.valor) : 19;

      return jsonResponse({ dias, hora }, 200, request);
    } catch {
      return jsonResponse({ dias: [1, 3], hora: 19 }, 200, request);
    }
  });

  // PUT /api/config/dias-ensaio - Atualiza dias de ensaio (admin)
  router.put('/api/config/dias-ensaio', async (request, env) => {
    try {
      const { dias, hora } = await request.json();

      // Validate: dias must be array of 0-6, hora 0-23
      if (!Array.isArray(dias) || dias.some(d => !Number.isInteger(d) || d < 0 || d > 6)) {
        return errorResponse('Dias inválidos', 400, request);
      }

      await env.DB.prepare(
        "INSERT OR REPLACE INTO configuracoes (chave, valor, atualizado_em) VALUES ('dias_ensaio', ?, CURRENT_TIMESTAMP)"
      ).bind(JSON.stringify(dias)).run();

      if (hora !== undefined && hora >= 0 && hora <= 23) {
        await env.DB.prepare(
          "INSERT OR REPLACE INTO configuracoes (chave, valor, atualizado_em) VALUES ('hora_ensaio', ?, CURRENT_TIMESTAMP)"
        ).bind(String(hora)).run();
      }

      return jsonResponse({ dias, hora, mensagem: 'Dias de ensaio atualizados' }, 200, request);
    } catch (error) {
      return errorResponse('Erro ao atualizar: ' + error.message, 500, request);
    }
  }, [adminMiddleware]);
}
