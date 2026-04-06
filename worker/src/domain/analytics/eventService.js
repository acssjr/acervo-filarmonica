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

function normalizeTrackingSessionId(sessionId) {
  if (typeof sessionId !== 'string') {
    return null;
  }

  const normalized = sessionId.trim();
  return normalized.length > 0 ? normalized : null;
}

function coerceResultCount(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

async function assertSessionOwnership(env, user, sessionId) {
  if (!sessionId) {
    return;
  }

  const session = await env.DB.prepare(`
    SELECT usuario_id
    FROM tracking_sessions
    WHERE id = ? AND fim_em IS NULL
    LIMIT 1
  `).bind(sessionId).first();

  if (!session || session.usuario_id !== user.id) {
    throw new TrackingValidationError('Sessão inválida ou não pertence ao usuário');
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
    resultados_count: coerceResultCount(input.resultados_count),
    metadata_json: coerceMetadata(input.metadata)
  };
}

export async function registrarTrackingEvent(env, user, sessionId, input) {
  assertTrackingUserId(user);
  const normalizedSessionId = normalizeTrackingSessionId(sessionId);
  await assertSessionOwnership(env, user, normalizedSessionId);

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
    normalizedSessionId,
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
    await touchTrackingSession(env, normalizedSessionId);
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

    const sessionId = normalizeTrackingSessionId(request.headers.get('X-Tracking-Session') || body?.session_id || null);

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
