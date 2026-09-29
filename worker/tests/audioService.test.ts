import { describe, expect, it, vi } from 'vitest';
import { env, SELF } from 'cloudflare:test';
import { getAudioAccess, normalizeYoutubeUrl, parseAudioRange, streamAudio, uploadAudio, validateAudio } from '../src/domain/partituras/audioService.js';
import { getPartitura, getPartituraDeleteKeys } from '../src/domain/partituras/partituraService.js';

const mp3 = () => new File([new Uint8Array([0x49, 0x44, 0x33, 0, 0, 0])], 'oficial.mp3', { type: 'audio/mpeg' });
const sheet = { id: 7, audio_key: 'audios/7/one.mp3', audio_mime: 'audio/mpeg', audio_name: 'oficial.mp3', audio_size: 6, youtube_url: null };
const db = (current = sheet, run = vi.fn().mockResolvedValue({ meta: { changes: 1 } })) => ({ prepare: vi.fn(() => ({ bind: vi.fn(() => ({ first: vi.fn().mockResolvedValue(current), run })) })) });

describe('áudio oficial da partitura', () => {
  it('rejeita MIDI, vídeo, falsos MP3 e URL externa disfarçada', async () => {
    await expect(validateAudio(mp3())).resolves.toBe('audio/mpeg');
    const wavHeader = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45]);
    await expect(validateAudio(new File([wavHeader], 'oficial.wav', { type: 'audio/wav' }))).resolves.toBe('audio/wav');
    await expect(validateAudio(new File(['x'], 'partitura.mid', { type: 'audio/midi' }))).rejects.toThrow('Formato inválido');
    await expect(validateAudio(new File(['x'], 'video.mp4', { type: 'video/mp4' }))).rejects.toThrow('Formato inválido');
    await expect(validateAudio(new File(['nao e audio'], 'falso.mp3', { type: 'audio/mpeg' }))).rejects.toThrow('conteúdo');
    expect(() => normalizeYoutubeUrl('https://youtube.com.evil.test/watch?v=1')).toThrow('YouTube');
    expect(normalizeYoutubeUrl('https://youtu.be/abc')).toBe('https://youtu.be/abc');
  });

  it('interpreta faixas normais e sufixos e rejeita faixas fora do arquivo', () => {
    expect(parseAudioRange('bytes=2-4', 10)).toEqual({ start: 2, end: 4, length: 3 });
    expect(parseAudioRange('bytes=-3', 10)).toEqual({ start: 7, end: 9, length: 3 });
    expect(parseAudioRange('bytes=20-', 10)).toBe(false);
    expect(parseAudioRange('bytes=0-1,4-5', 10)).toBe(false);
  });

  it('mantém o objeto antigo até o banco confirmar a substituição', async () => {
    const events: string[] = [];
    const bucket = { put: vi.fn(async () => events.push('put')), delete: vi.fn(async () => events.push('delete')) };
    const form = new FormData();
    form.set('audio', mp3());
    const request = new Request('https://test.local/api/partituras/7/audio', { method: 'PUT', body: form });
    const result = await uploadAudio('7', request, { DB: db(sheet, vi.fn(async () => { events.push('db'); return { meta: { changes: 1 } }; })), BUCKET: bucket });
    expect(result.status).toBe(200);
    expect(events).toEqual(['put', 'db', 'delete']);
  });

  it('gera URL assinada e responde ao navegador com conteúdo parcial', async () => {
    const bucket = { get: vi.fn().mockResolvedValue({ body: new Response('abc').body }) };
    const testEnv = { DB: db(), BUCKET: bucket, JWT_SECRET: 'test-secret' };
    const access = await getAudioAccess('7', new Request('https://test.local/api/partituras/7/audio/access'), testEnv);
    const { url } = await access.json() as { url: string };
    const response = await streamAudio('7', new Request(url, { headers: { Range: 'bytes=1-3' } }), testEnv);
    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Range')).toBe('bytes 1-3/6');
    expect(bucket.get).toHaveBeenCalledWith(sheet.audio_key, { range: { offset: 1, length: 3 } });
    const invalid = await streamAudio('7', new Request(url.replace('sig=', 'sig=x')), testEnv);
    expect(invalid.status).toBe(403);
  });

  it('protege a emissão da URL com autenticação', async () => {
    const response = await SELF.fetch('https://test.local/api/partituras/7/audio/access');
    expect(response.status).toBe(401);
    const upload = await SELF.fetch('https://test.local/api/partituras/7/audio', { method: 'PUT' });
    expect([401, 403]).toContain(upload.status);
    expect(getPartituraDeleteKeys(sheet)).toContain(sheet.audio_key);
  });

  it('faz upload e entrega uma faixa real do R2 com D1', async () => {
    const id = 99887;
    await env.DB.prepare('INSERT INTO partituras (id, titulo, compositor, categoria_id, arquivo_nome) VALUES (?, ?, ?, ?, ?)')
      .bind(id, 'Teste de áudio', 'Compositor', 'dobrados', 'partituras/teste.pdf').run();
    let key: string | null = null;
    try {
      const form = new FormData();
      form.set('audio', mp3());
      const upload = await uploadAudio(String(id), new Request(`https://test.local/api/partituras/${id}/audio`, { method: 'PUT', body: form }), env);
      expect(upload.status).toBe(200);
      const row = await env.DB.prepare('SELECT audio_key FROM partituras WHERE id = ?').bind(id).first<{ audio_key: string }>();
      key = row?.audio_key || null;
      expect(key).toMatch(/^audios\/99887\//);
      const publicResponse = await getPartitura(String(id), new Request(`https://test.local/api/partituras/${id}`), env);
      const publicSheet = await publicResponse.json() as { has_audio: boolean; audio_key?: string };
      expect(publicSheet.has_audio).toBe(true);
      expect(publicSheet.audio_key).toBeUndefined();
      const access = await getAudioAccess(String(id), new Request(`https://test.local/api/partituras/${id}/audio/access`), env);
      const { url } = await access.json() as { url: string };
      const response = await streamAudio(String(id), new Request(url, { headers: { Range: 'bytes=0-2' } }), env);
      expect(response.status).toBe(206);
      expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([0x49, 0x44, 0x33]);
    } finally {
      await env.DB.prepare('DELETE FROM partituras WHERE id = ?').bind(id).run();
      if (key) await env.BUCKET.delete(key);
    }
  });
});
