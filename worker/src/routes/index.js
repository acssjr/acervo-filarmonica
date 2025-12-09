// worker/src/routes/index.js
import { Router } from './router.js';
import { corsMiddleware } from '../middleware/index.js';

// Importar setup de rotas
import { setupHealthRoutes } from './healthRoutes.js';
import { setupAuthRoutes } from './authRoutes.js';
import { setupFavoritoRoutes } from './favoritoRoutes.js';
import { setupAtividadeRoutes } from './atividadeRoutes.js';

/**
 * Cria e configura o router com todas as rotas da aplicação
 * @returns {Router} - Router configurado
 */
export function createRouter() {
  const router = new Router();

  // Middleware global - CORS em todas as respostas
  router.use(corsMiddleware);

  // Configurar rotas por módulo
  setupHealthRoutes(router);
  setupAuthRoutes(router);
  setupFavoritoRoutes(router);
  setupAtividadeRoutes(router);

  // TODO: Adicionar outras rotas conforme forem implementadas
  // setupPartituraRoutes(router);
  // setupCategoriaRoutes(router);
  // setupUsuarioRoutes(router);
  // setupPerfilRoutes(router);
  // setupAdminRoutes(router);

  return router;
}
