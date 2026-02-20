// worker/src/routes/avisoRoutes.js
import { adminMiddleware, authMiddleware } from '../middleware/index.js';
import {
    getAvisos,
    criarAviso,
    atualizarAviso,
    excluirAviso,
    getAvisosNaoLidos,
    marcarAvisoLido
} from '../domain/avisos/index.js';

/**
 * Configurar rotas de avisos
 * @param {Router} router - Instância do router
 */
export function setupAvisoRoutes(router) {
    // Rotas admin - CRUD de avisos
    router.get('/api/admin/avisos', getAvisos, [adminMiddleware]);
    router.post('/api/admin/avisos', criarAviso, [adminMiddleware]);
    router.put('/api/admin/avisos/:id', atualizarAviso, [adminMiddleware]);
    router.delete('/api/admin/avisos/:id', excluirAviso, [adminMiddleware]);

    // Rotas de usuário autenticado
    router.get('/api/avisos/nao-lidos', getAvisosNaoLidos, [authMiddleware]);
    router.post('/api/avisos/:id/lido', marcarAvisoLido, [authMiddleware]);
}
