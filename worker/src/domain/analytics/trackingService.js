// worker/src/domain/analytics/trackingService.js
import { jsonResponse } from '../../infrastructure/index.js';

export async function trackSearch(request, env, _params, context) {
    try {
        const { termo, resultados_count } = await request.json();

        if (!termo) return jsonResponse({ success: false }, 200, request);

        const user = context?.user;

        await env.DB.prepare(
            'INSERT INTO logs_buscas (termo, resultados_count, usuario_id) VALUES (?, ?, ?)'
        ).bind(termo, resultados_count || 0, user?.id || null).run();

        return jsonResponse({ success: true }, 200, request);
    } catch (error) {
        console.error('Erro ao registrar busca:', error);
        // Tracking silencioso - não travar a UI
        return jsonResponse({ success: false }, 200, request);
    }
}
