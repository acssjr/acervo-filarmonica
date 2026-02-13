// ===== PRESENCA ROUTES =====
// Rotas para controle de presença em ensaios

import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import * as PresencaService from '../domain/presenca/presencaService.js';
import { jsonResponse, errorResponse } from '../infrastructure/response/helpers.js';

/**
 * Configura rotas de presença
 * @param {Router} router - Router instance
 */
export function setupPresencaRoutes(router) {
  // GET /api/presenca/minhas - Buscar presença do usuário logado (autenticado)
  router.get('/api/presenca/minhas', async (request, env, params, context) => {
    try {
      const data = await PresencaService.getPresencaUsuario(env, context.user.id);
      return jsonResponse(data, 200, request);
    } catch (error) {
      console.error('Erro ao buscar presença:', error);
      return errorResponse('Erro ao buscar presença', 500, request);
    }
  }, [authMiddleware]);

  // POST /api/presenca - Registrar presenças em batch (admin apenas)
  router.post('/api/presenca', async (request, env, params, context) => {
    try {
      const { data_ensaio, usuarios_ids } = await request.json();

      // Validações
      if (!data_ensaio) {
        return errorResponse('Data do ensaio é obrigatória', 400, request);
      }

      if (!usuarios_ids || !Array.isArray(usuarios_ids) || usuarios_ids.length === 0) {
        return errorResponse('Lista de usuários é obrigatória', 400, request);
      }

      const result = await PresencaService.registrarPresencas(
        env,
        data_ensaio,
        usuarios_ids,
        context.user.id
      );

      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error('Erro ao registrar presenças:', error);

      // Se erro de validação (data futura), retornar 400
      if (error.message.includes('Data não pode ser futura')) {
        return errorResponse(error.message, 400, request);
      }

      return errorResponse('Erro ao registrar presenças', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // GET /api/presenca/todas - Listar todos os ensaios com presenças (admin apenas)
  router.get('/api/presenca/todas', async (request, env, _params, _context) => {
    try {
      const data = await PresencaService.getTodasPresencas(env);
      return jsonResponse(data, 200, request);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      return errorResponse('Erro ao buscar presenças', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // GET /api/presenca/:data - Detalhe de um ensaio específico (admin apenas)
  router.get('/api/presenca/:data', async (request, env, params, _context) => {
    try {
      const resultado = await PresencaService.getDetalheEnsaio(env, params.data);
      return jsonResponse(resultado, 200, request);
    } catch (error) {
      console.error('Erro ao buscar detalhe do ensaio:', error);
      return errorResponse('Erro ao buscar detalhe do ensaio', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // DELETE /api/presenca/:data/usuario/:usuarioId - Remover presença individual (admin apenas)
  router.delete('/api/presenca/:data/usuario/:usuarioId', async (request, env, params, _context) => {
    try {
      const resultado = await PresencaService.removerPresenca(env, params.data, parseInt(params.usuarioId));
      if (!resultado.sucesso) {
        return errorResponse('Presença não encontrada', 404, request);
      }
      return jsonResponse(resultado, 200, request);
    } catch (error) {
      console.error('Erro ao remover presença:', error);
      return errorResponse('Erro ao remover presença', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);

  // DELETE /api/presenca/:data - Excluir ensaio completo (admin apenas)
  router.delete('/api/presenca/:data', async (request, env, params, _context) => {
    try {
      const resultado = await PresencaService.excluirEnsaio(env, params.data);
      return jsonResponse(resultado, 200, request);
    } catch (error) {
      console.error('Erro ao excluir ensaio:', error);
      return errorResponse('Erro ao excluir ensaio', 500, request);
    }
  }, [authMiddleware, adminMiddleware]);
}
