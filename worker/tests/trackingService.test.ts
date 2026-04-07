import { describe, expect, it, vi } from 'vitest';
import {
  maskSensitiveSearchTerm,
  normalizeSearchTerm
} from '../src/domain/analytics/eventSanitizer.js';
import {
  buildTrackingEventPayload,
  handleTrackingEvent,
  registrarTrackingEvent
} from '../src/domain/analytics/eventService.js';
import {
  SESSION_IDLE_MINUTES,
  createSessionId,
  getSessionExpiryDate,
  startTrackingSession,
  touchTrackingSession,
  endTrackingSession
} from '../src/domain/analytics/sessionService.js';

describe('tracking helpers', () => {
  it('normalizes search terms by trimming, lowercasing, removing accents and collapsing whitespace', () => {
    expect(normalizeSearchTerm('  Verde X Branco  ')).toBe('verde x branco');
    expect(normalizeSearchTerm('Cora\u00e7\u00e3o')).toBe('coracao');
  });

  it('masks sensitive search terms', () => {
    expect(maskSensitiveSearchTerm('contato@exemplo.com')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('(11) 91234-5678')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('+55 84 99999-9999')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('123.456.789-09')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('1234')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('1234567890123')).toBe('1234567890123');
    expect(maskSensitiveSearchTerm('Verde X Branco')).toBe('Verde X Branco');
  });

  it('builds a tracking event payload with masked search terms and preserved result count', () => {
    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        termo_original: '1234',
        resultados_count: 0
      })
    ).toEqual({
      tipo: 'busca_realizada',
      origem: null,
      partitura_id: null,
      parte_id: null,
      repertorio_id: null,
      termo_original: '[termo ocultado]',
      termo_normalizado: '[termo ocultado]',
      resultados_count: 0,
      metadata_json: null
    });
  });

  it('coerces numeric string search counts and rejects empty or invalid values', () => {
    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        resultados_count: '0'
      })
    ).toEqual(expect.objectContaining({ resultados_count: 0 }));

    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        resultados_count: '12'
      })
    ).toEqual(expect.objectContaining({ resultados_count: 12 }));

    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        resultados_count: ''
      })
    ).toEqual(expect.objectContaining({ resultados_count: null }));

    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        resultados_count: 'abc'
      })
    ).toEqual(expect.objectContaining({ resultados_count: null }));
  });

  it('treats empty or whitespace search terms as absent', () => {
    expect(
      buildTrackingEventPayload({
        tipo: 'busca_realizada',
        termo_original: '   '
      })
    ).toEqual({
      tipo: 'busca_realizada',
      origem: null,
      partitura_id: null,
      parte_id: null,
      repertorio_id: null,
      termo_original: null,
      termo_normalizado: null,
      resultados_count: null,
      metadata_json: null
    });
  });

  it('prefers a valid body session id when the header is whitespace', async () => {
    let insertedSessionId = null;
    const first = vi.fn().mockResolvedValue({ usuario_id: 1 });
    const insertRun = vi.fn().mockResolvedValue({ success: true });
    const touchRun = vi.fn().mockResolvedValue({ success: true });
    const prepare = vi.fn((sql) => {
      if (String(sql).includes('SELECT usuario_id')) {
        return { bind: vi.fn(() => ({ first })) };
      }
      if (String(sql).includes('UPDATE tracking_sessions')) {
        return { bind: vi.fn(() => ({ run: touchRun })) };
      }
      return {
        bind: vi.fn((sessionId) => {
          insertedSessionId = sessionId;
          return { run: insertRun };
        })
      };
    });
    const env = { DB: { prepare } } as any;

    await expect(
      handleTrackingEvent(
        new Request('https://example.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tracking-Session': '   '
          },
          body: JSON.stringify({ tipo: 'download_parte', session_id: 'sess_1_test' })
        }),
        env,
        { id: 1 } as any
      )
    ).resolves.toMatchObject({ status: 200 });

    expect(insertedSessionId).toBe('sess_1_test');
  });

  it('rejects invalid event types', () => {
    expect(() => buildTrackingEventPayload({ tipo: 'nao_existente' as any })).toThrow(
      'Tipo de evento invalido'
    );
  });

  it('rejects oversized metadata before serialization', () => {
    expect(() =>
      buildTrackingEventPayload({
        tipo: 'download_parte',
        metadata: { texto: 'x'.repeat(2001) }
      })
    ).toThrow('Metadata muito grande');
  });

  it('serializes metadata for download events', () => {
    expect(
      buildTrackingEventPayload({
        tipo: 'download_parte',
        metadata: { instrumento: 'Trompete Bb 1' }
      })
    ).toEqual({
      tipo: 'download_parte',
      origem: null,
      partitura_id: null,
      parte_id: null,
      repertorio_id: null,
      termo_original: null,
      termo_normalizado: null,
      resultados_count: null,
      metadata_json: JSON.stringify({ instrumento: 'Trompete Bb 1' })
    });
  });

  it('exposes the session idle window and expiry helper', () => {
    expect(SESSION_IDLE_MINUTES).toBe(30);
    expect(createSessionId(7)).toMatch(/^sess_7_/);
    expect(getSessionExpiryDate(new Date('2026-04-06T12:00:00.000Z')).toISOString()).toBe(
      '2026-04-06T12:30:00.000Z'
    );
  });

  it('starts, touches and ends tracking sessions using the expected SQL', async () => {
    const run = vi.fn().mockResolvedValue({ success: true });
    const bind = vi.fn(() => ({ run }));
    const prepare = vi.fn(() => ({ bind }));
    const env = { DB: { prepare } } as unknown as Parameters<typeof startTrackingSession>[0];

    const sessionId = await startTrackingSession(env, { id: 42 } as any);

    expect(sessionId).toMatch(/^sess_42_/);
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO tracking_sessions'));
    expect(bind).toHaveBeenCalledWith(sessionId, 42);
    expect(run).toHaveBeenCalled();

    await touchTrackingSession(env, sessionId);
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE tracking_sessions'));

    await endTrackingSession(env, sessionId, 'logout');
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('fim_motivo'));
  });

  it('fails fast when createSessionId receives a missing user id', async () => {
    expect(() => createSessionId(undefined)).toThrow('Usu\u00e1rio inv\u00e1lido para tracking');

    const env = { DB: { prepare: vi.fn() } } as unknown as Parameters<typeof startTrackingSession>[0];

    await expect(startTrackingSession(env, {} as any)).rejects.toThrow(
      'Usu\u00e1rio inv\u00e1lido para tracking'
    );
  });

  it('rejects missing user id before insert in registrarTrackingEvent', async () => {
    const prepare = vi.fn();
    const env = { DB: { prepare } } as any;

    await expect(
      registrarTrackingEvent(env, {}, 'sess_1_test', {
        tipo: 'download_parte'
      })
    ).rejects.toThrow('Usu\u00e1rio inv\u00e1lido para tracking');

    expect(prepare).not.toHaveBeenCalled();
  });

  it('starts a tracking session when an authenticated event has no session id', async () => {
    let sessionInsertId: string | null = null;
    let eventSessionId: string | null = null;

    const prepare = vi.fn((sql) => {
      const text = String(sql);

      if (text.includes('INSERT INTO tracking_sessions')) {
        return {
          bind: vi.fn((sessionId) => {
            sessionInsertId = sessionId;
            return { run: vi.fn().mockResolvedValue({ success: true }) };
          })
        };
      }

      if (text.includes('INSERT INTO tracking_events')) {
        return {
          bind: vi.fn((sessionId) => {
            eventSessionId = sessionId;
            return { run: vi.fn().mockResolvedValue({ success: true }) };
          })
        };
      }

      if (text.includes('UPDATE tracking_sessions')) {
        return { bind: vi.fn(() => ({ run: vi.fn().mockResolvedValue({ meta: { changes: 1 } }) })) };
      }

      throw new Error(`Unexpected SQL: ${text}`);
    });
    const env = { DB: { prepare } } as any;

    const response = await handleTrackingEvent(
      new Request('https://example.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'partitura_aberta' })
      }),
      env,
      { id: 1 } as any
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      session_id: expect.stringMatching(/^sess_1_/)
    });
    expect(sessionInsertId).toBe(eventSessionId);
    expect(eventSessionId).toMatch(/^sess_1_/);
  });

  it('starts a new session instead of reusing an unknown session header', async () => {
    let eventSessionId: string | null = null;

    const prepare = vi.fn((sql) => {
      const text = String(sql);

      if (text.includes('SELECT usuario_id')) {
        return { bind: vi.fn(() => ({ first: vi.fn().mockResolvedValue(null) })) };
      }

      if (text.includes('INSERT INTO tracking_sessions')) {
        return { bind: vi.fn(() => ({ run: vi.fn().mockResolvedValue({ success: true }) })) };
      }

      if (text.includes('INSERT INTO tracking_events')) {
        return {
          bind: vi.fn((sessionId) => {
            eventSessionId = sessionId;
            return { run: vi.fn().mockResolvedValue({ success: true }) };
          })
        };
      }

      if (text.includes('UPDATE tracking_sessions')) {
        return { bind: vi.fn(() => ({ run: vi.fn().mockResolvedValue({ meta: { changes: 1 } }) })) };
      }

      throw new Error(`Unexpected SQL: ${text}`);
    });
    const env = { DB: { prepare } } as any;

    const response = await handleTrackingEvent(
      new Request('https://example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tracking-Session': 'sess_1_old'
        },
        body: JSON.stringify({ tipo: 'download_parte' })
      }),
      env,
      { id: 1 } as any
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      session_id: expect.stringMatching(/^sess_1_/)
    });
    expect(eventSessionId).not.toBe('sess_1_old');
    expect(eventSessionId).toMatch(/^sess_1_/);
  });

  it('rejects sessions that do not belong to the current user before insert', async () => {
    const first = vi.fn().mockResolvedValue({ usuario_id: 2 });
    const prepare = vi.fn(() => ({ bind: vi.fn(() => ({ first })) }));
    const env = { DB: { prepare } } as any;

    await expect(
      registrarTrackingEvent(env, { id: 1 }, 'sess_1_test', {
        tipo: 'download_parte'
      })
    ).rejects.toThrow('Sess\u00e3o inv\u00e1lida ou n\u00e3o pertence ao usu\u00e1rio');

    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it('keeps successful event inserts successful even if session touch fails', async () => {
    const insertRun = vi.fn().mockResolvedValue({ success: true });
    const touchRun = vi.fn().mockRejectedValue(new Error('touch failed'));

    const prepare = vi.fn((sql) => {
      if (String(sql).includes('SELECT usuario_id')) {
        return { bind: vi.fn(() => ({ first: vi.fn().mockResolvedValue({ usuario_id: 1 }) })) };
      }
      if (String(sql).includes('UPDATE tracking_sessions')) {
        return { bind: vi.fn(() => ({ run: touchRun })) };
      }
      return { bind: vi.fn(() => ({ run: insertRun })) };
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const env = { DB: { prepare } } as any;

    await expect(
      handleTrackingEvent(
        new Request('https://example.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tracking-Session': 'sess_1_test'
          },
          body: JSON.stringify({ tipo: 'download_parte' })
        }),
        env,
        { id: 1 } as any
      )
    ).resolves.toMatchObject({ status: 200 });

    expect(errorSpy).toHaveBeenCalledWith(
      'Erro ao atualizar sessao de tracking:',
      expect.any(Error)
    );
    errorSpy.mockRestore();
  });

  it('returns 400 for validation errors and 500 for runtime failures in handleTrackingEvent', async () => {
    const validationRequest = new Request('https://example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'nao_existente' })
    });

    const validationResponse = await handleTrackingEvent(validationRequest, {} as any, { id: 1 } as any);
    expect(validationResponse.status).toBe(400);
    await expect(validationResponse.json()).resolves.toEqual({ error: 'Tipo de evento invalido' });

    const runtimeEnv = {
      DB: {
        prepare: vi.fn(() => ({
          bind: vi.fn(() => ({
            run: vi.fn().mockRejectedValue(new Error('DB offline'))
          }))
        }))
      }
    } as any;

    const runtimeRequest = new Request('https://example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'download_parte' })
    });

    const runtimeResponse = await handleTrackingEvent(runtimeRequest, runtimeEnv, { id: 1 } as any);
    expect(runtimeResponse.status).toBe(500);
    await expect(runtimeResponse.json()).resolves.toEqual({ error: 'Erro ao registrar evento de tracking' });
  });
});
