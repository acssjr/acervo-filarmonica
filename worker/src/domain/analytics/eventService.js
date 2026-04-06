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

class TrackingValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TrackingValidationError';
  }
}

function isValidationError(error) {
  return error instanceof TrackingValidationError || error?.name === 'TrackingValidationError';
}

function assertTrackingUserId(user) {
  if (user?.id === null || user?.id === undefined || user?.id === '') {
    throw new TrackingValidationError('Usuário inválido para tracking');
  }
}

function coerceMetadata(inputMetadata) {
  if (inputMetadata === undefined || inputMetadata === null) {
    return null;
  }

  try {
    const serialized = JSON.stringify(inputMetadata);
    if (typeof serialized !== 'string') {
      throw new TrackingValidationError('Metadata invalida');
    }

    if (serialized.length > 2000) {
      throw new TrackingValidationError('Metadata muito grande');
    }

    return serialized;
  } catch (error) {
    if (isValidationError(error)) {
      throw error;
    }

    throw new TrackingValidationError('Metadata invalida');
  }
}

export function buildTrackingEventPayload(input) {
  if (!ALLOWED_EVENT_TYPES.has(input?.tipo)) {
    throw new TrackingValidationError('Tipo de evento invalido');
  }

  const hasTerm = typeof input.termo_original === 'string';
  const rawTerm = hasTerm ? input.termo_original.trim() : null;
  const hasMeaningfulTerm = typeof rawTerm === 'string' && rawTerm.length > 0;

  const termoOriginal = hasMeaningfulTerm
    ? maskSensitiveSearchTerm(rawTerm)
    : null;

  const termoNormalizado = hasMeaningfulTerm
    ? (termoOriginal === '[termo ocultado]' ? termoOriginal : normalizeSearchTerm(rawTerm))
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
    metadata_json: coerceMetadata(input.metadata)
  };
}

export async function registrarTrackingEvent(env, user, sessionId, input) {
  assertTrackingUserId(user);
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
    user.id,
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

  try {
    await touchTrackingSession(env, sessionId);
  } catch (error) {
    console.error('Erro ao atualizar sessao de tracking:', error);
  }
}

export async function handleTrackingEvent(request, env, user) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      throw new TrackingValidationError('JSON invalido');
    }

    const sessionId = request.headers.get('X-Tracking-Session') || body?.session_id || null;

    await registrarTrackingEvent(env, user, sessionId, body);

    return jsonResponse({ success: true }, 200, request);
  } catch (error) {
    if (isValidationError(error)) {
      return errorResponse(error.message, 400, request);
    }

    console.error('Erro ao registrar evento de tracking:', error);
    return errorResponse('Erro ao registrar evento de tracking', 500, request);
  }
}
