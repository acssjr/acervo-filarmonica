// worker/src/domain/analytics/trackingService.js
import { jsonResponse } from '../../infrastructure/index.js';

export async function trackSearch(request, env, _params, context) {
    try {
        const data = await request.json().catch(() => ({}));
        const termo = String(data.termo || '').trim();
        const resultadosCount = parseInt(data.resultados_count, 10);

        if (!termo) {
            return jsonResponse({ success: false, error: 'Termo obrigatório' }, 200, request);
        }

        const safeCount = isNaN(resultadosCount) ? 0 : Math.max(0, resultadosCount);
        const user = context?.user;

        await env.DB.prepare(
            'INSERT INTO logs_buscas (termo, resultados_count, usuario_id) VALUES (?, ?, ?)'
        ).bind(termo, safeCount, user?.id || null).run();

        return jsonResponse({ success: true }, 200, request);
    } catch (error) {
        console.error('Erro ao registrar busca:', error);
        // Tracking silencioso - não travar a UI
        return jsonResponse({ success: false }, 200, request);
    }
}
