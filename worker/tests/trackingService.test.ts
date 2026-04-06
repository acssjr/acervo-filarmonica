import { describe, expect, it, vi } from 'vitest';
import {
  maskSensitiveSearchTerm,
  normalizeSearchTerm
} from '../src/domain/analytics/eventSanitizer.js';
import { buildTrackingEventPayload } from '../src/domain/analytics/eventService.js';
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
    expect(maskSensitiveSearchTerm('123.456.789-09')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('1234')).toBe('[termo ocultado]');
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
});
