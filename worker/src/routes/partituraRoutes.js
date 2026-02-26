// worker/src/routes/partituraRoutes.js
import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import {
  getPartituras,
  getPartitura,
  createPartitura,
  uploadPastaPartitura,
  updatePartitura,
  deletePartitura,
  downloadPartitura,
  downloadParte,
  getPartesPartitura,
  addParte,
  substituirParte,
  renomearParte,
  deleteParte,
  corrigirBombardinosPartitura
} from '../domain/partituras/index.js';

/**
 * Configurar rotas de partituras
 * @param {Router} router - Instância do router
 */
export function setupPartituraRoutes(router) {
  // Rotas públicas (listagem)
  router.get('/api/partituras', getPartituras);
  router.get('/api/partituras/:id', (req, env, params) => {
    const id = params.id;
    return getPartitura(id, req, env);
  });

  // Rotas autenticadas (downloads)
  // IMPORTANTE: rota mais específica (/parte/:id) deve vir ANTES da genérica (/:id)
  // para evitar que o router capture "parte" como parâmetro de /api/download/:id
  router.get('/api/download/parte/:id', (req, env, params, context) => {
    const id = params.id;
    return downloadParte(id, req, env, context.user);
  }, [authMiddleware]);
  router.get('/api/download/:id', (req, env, params, context) => {
    const id = params.id;
    return downloadPartitura(id, req, env, context.user);
  }, [authMiddleware]);

  // Rotas admin - partituras
  router.post('/api/partituras/upload-pasta', (req, env, params, context) => {
    return uploadPastaPartitura(req, env, context.user);
  }, [adminMiddleware]);
  router.post('/api/partituras/:id/corrigir-bombardinos', (req, env, params) => {
    const id = params.id;
    return corrigirBombardinosPartitura(id, req, env);
  }, [adminMiddleware]);
  router.post('/api/partituras', (req, env, params, context) => {
    return createPartitura(req, env, context.user);
  }, [adminMiddleware]);
  router.put('/api/partituras/:id', (req, env, params, context) => {
    const id = params.id;
    return updatePartitura(id, req, env, context.user);
  }, [adminMiddleware]);
  router.delete('/api/partituras/:id', (req, env, params, context) => {
    const id = params.id;
    return deletePartitura(id, req, env, context.user);
  }, [adminMiddleware]);

  // Rota autenticada - listar partes (qualquer usuário logado pode ver para download)
  router.get('/api/partituras/:id/partes', (req, env, params) => {
    const id = params.id;
    return getPartesPartitura(id, req, env);
  }, [authMiddleware]);

  // Rotas admin - gerenciar partes
  router.post('/api/partituras/:id/partes', (req, env, params) => {
    const id = params.id;
    return addParte(id, req, env);
  }, [adminMiddleware]);
  router.put('/api/partes/:id/substituir', (req, env, params) => {
    const id = params.id;
    return substituirParte(id, req, env);
  }, [adminMiddleware]);
  router.put('/api/partes/:id/renomear', (req, env, params) => {
    const id = params.id;
    return renomearParte(id, req, env);
  }, [adminMiddleware]);
  router.delete('/api/partes/:id', (req, env, params) => {
    const id = params.id;
    return deleteParte(id, req, env);
  }, [adminMiddleware]);
}
