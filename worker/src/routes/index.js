// worker/src/routes/index.js
import { Router } from './router.js';
import { corsMiddleware } from '../middleware/index.js';

// Importar setup de rotas
import { setupHealthRoutes } from './healthRoutes.js';
import { setupAuthRoutes } from './authRoutes.js';
import { setupFavoritoRoutes } from './favoritoRoutes.js';
import { setupAtividadeRoutes } from './atividadeRoutes.js';
import { setupCategoriaRoutes } from './categoriaRoutes.js';
import { setupEstatisticaRoutes } from './estatisticaRoutes.js';
import { setupUsuarioRoutes } from './usuarioRoutes.js';
import { setupPerfilRoutes } from './perfilRoutes.js';
import { setupPartituraRoutes } from './partituraRoutes.js';
import { setupRepertorioRoutes } from './repertorioRoutes.js';
import { setupConfigRoutes } from './configRoutes.js';
import { setupPresencaRoutes } from './presencaRoutes.js';
import { setupEnsaioRoutes } from './ensaioRoutes.js';

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
  setupCategoriaRoutes(router);
  setupEstatisticaRoutes(router);
  setupUsuarioRoutes(router);
  setupPerfilRoutes(router);
  setupPartituraRoutes(router);
  setupRepertorioRoutes(router);
  setupConfigRoutes(router);
  setupPresencaRoutes(router);
  setupEnsaioRoutes(router);

  return router;
}
