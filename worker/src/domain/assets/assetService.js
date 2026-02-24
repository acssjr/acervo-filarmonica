// worker/src/domain/assets/assetService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';

/**
 * Listar arquivos no bucket R2 filtrados por prefixo
 * @param {Request} request - Request
 * @param {Object} env - Environment bindings
 */
export async function listAssets(request, env) {
    try {
        const url = new URL(request.url);
        const prefix = url.searchParams.get('prefix') || '';

        // Listar objetos no bucket
        const options = { prefix };
        const listed = await env.BUCKET.list(options);

        const assets = listed.objects.map(obj => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded,
            httpMetadata: obj.httpMetadata,
            customMetadata: obj.customMetadata,
            url: `/api/assets/${obj.key}`
        }));

        return jsonResponse({ assets, truncated: listed.truncated }, 200, request);
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
        const folder = formData.get('folder') || 'general'; // pasta de destino (prefixo)
        const customName = formData.get('name');

        if (!file) {
            return errorResponse('Nenhum arquivo enviado', 400, request);
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileName = customName || file.name;
        const key = `${folder}/${fileName}`.replace(/\/+/g, '/'); // evitar barras duplas

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
        const object = await env.BUCKET.get(key);

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
