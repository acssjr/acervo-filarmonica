export const SESSION_IDLE_MINUTES = 30;

function createRandomSuffix() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function assertTrackingUserId(userId) {
  if (userId === null || userId === undefined || userId === '') {
    throw new Error('Usuário inválido para tracking');
  }
}

export function createSessionId(userId) {
  assertTrackingUserId(userId);
  return `sess_${userId}_${createRandomSuffix()}`;
}

export function getSessionExpiryDate(baseDate = new Date()) {
  return new Date(baseDate.getTime() + SESSION_IDLE_MINUTES * 60 * 1000);
}

export async function startTrackingSession(env, user) {
  assertTrackingUserId(user?.id);

  const sessionId = createSessionId(user.id);

  await env.DB.prepare(`
    INSERT INTO tracking_sessions (
      id,
      usuario_id,
      inicio_em,
      ultimo_evento_em
    ) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(sessionId, user.id).run();

  return sessionId;
}

export async function touchTrackingSession(env, sessionId) {
  if (!sessionId) {
    return;
  }

  await env.DB.prepare(`
    UPDATE tracking_sessions
    SET ultimo_evento_em = CURRENT_TIMESTAMP
    WHERE id = ? AND fim_em IS NULL
  `).bind(sessionId).run();
}

export async function endTrackingSession(env, sessionId, reason = 'logout') {
  if (!sessionId) {
    return;
  }

  await env.DB.prepare(`
    UPDATE tracking_sessions
    SET fim_em = CURRENT_TIMESTAMP,
        fim_motivo = ?
    WHERE id = ? AND fim_em IS NULL
  `).bind(reason, sessionId).run();
}
