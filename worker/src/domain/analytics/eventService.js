import { errorResponse, jsonResponse } from '../../infrastructure/index.js';
import { maskSensitiveSearchTerm, normalizeSearchTerm } from './eventSanitizer.js';
import { touchTrackingSession } from './sessionService.js';

const ALLOWED_EVENT_TYPES = new Set([
  'partitura_aberta',
  'pdf_visualizado_grade',
  'pdf_visualizado_parte',
  'download_grade',
  'download_parte',
  'busca_digitada',
  'busca_realizada',
  'favorito_adicionado',
  'favorito_removido',
  'sessao_iniciada',
  'sessao_encerrada'
]);

export function buildTrackingEventPayload(input) {
  if (!ALLOWED_EVENT_TYPES.has(input?.tipo)) {
    throw new Error('Tipo de evento invalido');
  }

  const termoOriginal = typeof input.termo_original === 'string'
    ? maskSensitiveSearchTerm(input.termo_original)
    : null;

  const termoNormalizado = typeof input.termo_original === 'string'
    ? (termoOriginal === '[termo ocultado]' ? termoOriginal : normalizeSearchTerm(termoOriginal))
    : null;

  const hasMetadata = input.metadata !== undefined && input.metadata !== null;
  const metadataJson = hasMetadata
    ? JSON.stringify(input.metadata)?.slice(0, 2000) ?? null
    : null;

  return {
    tipo: input.tipo,
    origem: input.origem ?? null,
    partitura_id: input.partitura_id ?? null,
    parte_id: input.parte_id ?? null,
    repertorio_id: input.repertorio_id ?? null,
    termo_original: termoOriginal,
    termo_normalizado: termoNormalizado,
    resultados_count: Number.isFinite(input.resultados_count) ? input.resultados_count : null,
    metadata_json: metadataJson
  };
}

export async function registrarTrackingEvent(env, user, sessionId, input) {
  const payload = buildTrackingEventPayload(input);

  await env.DB.prepare(`
    INSERT INTO tracking_events (
      session_id,
      usuario_id,
      tipo,
      origem,
      partitura_id,
      parte_id,
      repertorio_id,
      termo_original,
      termo_normalizado,
      resultados_count,
      metadata_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    sessionId ?? null,
    user?.id ?? null,
    payload.tipo,
    payload.origem,
    payload.partitura_id,
    payload.parte_id,
    payload.repertorio_id,
    payload.termo_original,
    payload.termo_normalizado,
    payload.resultados_count,
    payload.metadata_json
  ).run();

  await touchTrackingSession(env, sessionId);
}

export async function handleTrackingEvent(request, env, user) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('X-Tracking-Session') || body?.session_id || null;

    await registrarTrackingEvent(env, user, sessionId, body);

    return jsonResponse({ success: true }, 200, request);
  } catch (error) {
    return errorResponse(error.message, 400, request);
  }
}