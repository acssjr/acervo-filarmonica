// ===== PRESENCA ROUTES =====
// Rotas para controle de presença em ensaios

import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import * as PresencaService from '../domain/presenca/presencaService.js';

/**
 * Configura rotas de presença
 * @param {Router} router - Router instance
 */
export function setupPresencaRoutes(router) {
  // GET /api/presenca/minhas - Buscar presença do usuário logado (autenticado)
  router.get('/api/presenca/minhas', async (request, env, params, context) => {
    try {
      const data = await PresencaService.getPresencaUsuario(env, context.user.id);
      return Response.json(data);
    } catch (error) {
      console.error('Erro ao buscar presença:', error);
      return Response.json(
        { erro: 'Erro ao buscar presença' },
        { status: 500 }
      );
    }
  }, [authMiddleware]);

  // POST /api/presenca - Registrar presenças em batch (admin apenas)
  router.post('/api/presenca', async (request, env, params, context) => {
    try {
      const { data_ensaio, usuarios_ids } = await request.json();

      // Validações
      if (!data_ensaio) {
        return Response.json(
          { erro: 'Data do ensaio é obrigatória' },
          { status: 400 }
        );
      }

      if (!usuarios_ids || !Array.isArray(usuarios_ids) || usuarios_ids.length === 0) {
        return Response.json(
          { erro: 'Lista de usuários é obrigatória' },
          { status: 400 }
        );
      }

      const result = await PresencaService.registrarPresencas(
        env,
        data_ensaio,
        usuarios_ids,
        context.user.id
      );

      return Response.json(result);
    } catch (error) {
      console.error('Erro ao registrar presenças:', error);

      // Se erro de validação (data futura), retornar 400
      if (error.message.includes('Data não pode ser futura')) {
        return Response.json(
          { erro: error.message },
          { status: 400 }
        );
      }

      return Response.json(
        { erro: 'Erro ao registrar presenças' },
        { status: 500 }
      );
    }
  }, [authMiddleware, adminMiddleware]);

  // GET /api/presenca/todas - Listar todos os ensaios com presenças (admin apenas)
  router.get('/api/presenca/todas', async (request, env, _params, _context) => {
    try {
      const data = await PresencaService.getTodasPresencas(env);
      return Response.json(data);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      return Response.json(
        { erro: 'Erro ao buscar presenças' },
        { status: 500 }
      );
    }
  }, [authMiddleware, adminMiddleware]);
}
