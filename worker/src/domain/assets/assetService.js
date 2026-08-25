// worker/src/domain/assets/assetService.js
import {
    STORAGE_PREFIXES,
    buildAssetKey,
    errorResponse,
    isAssetKey,
    jsonResponse,
    normalizeAssetSubpath
} from '../../infrastructure/index.js';

/**
 * Listar arquivos no bucket R2 filtrados por prefixo
 * @param {Request} request - Request
 * @param {Object} env - Environment bindings
 */
export async function listAssets(request, env) {
    try {
        const url = new URL(request.url);
        const requestedPrefix = normalizeAssetSubpath(url.searchParams.get('prefix') || '');
        const prefix = `${STORAGE_PREFIXES.assets}${requestedPrefix}${requestedPrefix ? '/' : ''}`;
        const cursor = url.searchParams.get('cursor') || undefined;

        // Listar objetos no bucket
        const options = { prefix };
        if (cursor) {
            options.cursor = cursor;
        }
        let listed = await env.BUCKET.list(options);

        // Compatibilidade de leitura para backgrounds gravados antes do namespace.
        // A exceção é limitada à pasta pública conhecida e não habilita exclusão.
        if (!cursor && requestedPrefix === 'backgrounds' && listed.objects.length === 0) {
            listed = await env.BUCKET.list({ prefix: 'backgrounds/' });
        }

        const assets = listed.objects.map(obj => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded,
            httpMetadata: obj.httpMetadata,
            customMetadata: obj.customMetadata,
            url: `/api/assets/${obj.key.startsWith(STORAGE_PREFIXES.assets)
                ? obj.key.slice(STORAGE_PREFIXES.assets.length)
                : obj.key}`
        }));

        const response = {
            assets,
            truncated: listed.truncated
        };

        if (listed.cursor) {
            response.cursor = listed.cursor;
        }

        return jsonResponse(response, 200, request);
    } catch (error) {
        console.error('Erro ao listar assets:', error);
        return errorResponse('Erro ao listar arquivos', 500, request);
    }
}

/**
 * Upload de arquivo para o bucket R2
 * @param {Request} request - Request
 * @param {Object} env - Environment bindings
 */
export async function uploadAsset(request, env) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        let folder = formData.get('folder') || 'general'; // pasta de destino (prefixo)
        const customName = formData.get('name');

        if (!file) {
            return errorResponse('Nenhum arquivo enviado', 400, request);
        }

        const arrayBuffer = await file.arrayBuffer();
        let fileName = customName || file.name;
        const key = buildAssetKey(folder, fileName);

        // Fazer upload para o R2
        await env.BUCKET.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type || 'application/octet-stream',
                cacheControl: 'public, max-age=31536000'
            }
        });

        return jsonResponse({
            success: true,
            key,
            url: `/api/assets/${key}`,
            message: 'Arquivo enviado com sucesso!'
        }, 201, request);
    } catch (error) {
        console.error('Erro no upload de asset:', error);
        return errorResponse('Erro ao realizar upload', 500, request);
    }
}

/**
 * Deletar arquivo do bucket R2
 * @param {Request} request - Request
 * @param {Object} env - Environment bindings
 */
export async function deleteAsset(request, env) {
    try {
        const url = new URL(request.url);
        const key = url.searchParams.get('key');

        if (!key) {
            return errorResponse('Chave do arquivo não fornecida', 400, request);
        }

        if (!isAssetKey(key)) {
            return errorResponse('Chave fora do namespace de assets', 400, request);
        }

        await env.BUCKET.delete(key);

        return jsonResponse({ success: true, message: 'Arquivo excluído com sucesso!' }, 200, request);
    } catch (error) {
        console.error('Erro ao excluir asset:', error);
        return errorResponse('Erro ao excluir arquivo', 500, request);
    }
}

/**
 * Servir um asset publicamente com os cabeçalhos corretos
 * @param {string} key - Chave do asset
 * @param {Request} request - Request
 * @param {Object} env - Environment bindings
 */
export async function serveAsset(key, request, env) {
    try {
        const normalizedKey = normalizeAssetSubpath(key);
        const assetKey = key.startsWith(STORAGE_PREFIXES.assets)
            ? key
            : `${STORAGE_PREFIXES.assets}${normalizedKey}`;
        if (!isAssetKey(assetKey)) {
            return errorResponse('Chave de asset inválida', 400, request);
        }
        // Novas gravações ficam isoladas em assets/. A segunda leitura mantém
        // somente URLs históricas de backgrounds, sem expor outros namespaces.
        let object = await env.BUCKET.get(assetKey);
        if (!object && normalizedKey.startsWith('backgrounds/')) {
            object = await env.BUCKET.get(normalizedKey);
        }

        if (!object) {
            return errorResponse('Arquivo não encontrado', 404, request);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        // Adicionar cabeçalhos de CORS
        headers.set('Access-Control-Allow-Origin', '*');

        return new Response(object.body, {
            headers
        });
    } catch (error) {
        console.error('Erro ao servir asset:', error);
        return errorResponse('Erro ao carregar arquivo', 500, request);
    }
}
