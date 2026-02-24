// worker/src/routes/assetRoutes.js
import { authMiddleware, adminMiddleware } from '../middleware/index.js';
import {
    listAssets,
    uploadAsset,
    deleteAsset,
    serveAsset
} from '../domain/assets/assetService.js';

/**
 * Configurar rotas de gerenciamento de ativos (assets)
 * @param {Router} router - Instância do router
 */
export function setupAssetRoutes(router) {
    // Rota pública para servir assets (como imagens de fundo, ícones, etc.)
    // O caminho usa o parâmetro catch-all simulado ou capturamos a key via params
    // No nosso router simplificado, vamos usar o params para a key.
    router.get('/api/assets/:folder/:filename', (req, env, params) => {
        const key = `${params.folder}/${params.filename}`;
        return serveAsset(key, req, env);
    });

    // Rota pública para listar backgrounds (usada na tela de login)
    router.get('/api/assets/list/backgrounds', (req, env) => {
        // Forçamos o prefixo para backgrounds
        const url = new URL(req.url);
        url.searchParams.set('prefix', 'backgrounds/');
        const modifiedReq = new Request(url, req);
        return listAssets(modifiedReq, env);
    });

    // Rotas administrativas para gerenciamento
    router.get('/api/admin/assets/list', (req, env, params, context) => {
        return listAssets(req, env);
    }, [adminMiddleware]);

    router.post('/api/admin/assets/upload', (req, env, params, context) => {
        return uploadAsset(req, env);
    }, [adminMiddleware]);

    router.delete('/api/admin/assets', (req, env, params, context) => {
        return deleteAsset(req, env);
    }, [adminMiddleware]);
}
