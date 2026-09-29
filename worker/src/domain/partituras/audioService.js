import { errorResponse, getJwtSecret, jsonResponse } from '../../infrastructure/response/helpers.js';
import { deleteBestEffort } from '../../infrastructure/storage/storageOperations.js';
import { getCorsHeaders } from '../../infrastructure/security/cors.js';

export const MAX_AUDIO_SIZE = 80 * 1024 * 1024;
const FORMATS = {
  mp3: { mime: 'audio/mpeg', types: ['audio/mpeg', 'audio/mp3'] },
  wav: { mime: 'audio/wav', types: ['audio/wav', 'audio/x-wav', 'audio/wave'] },
  m4a: { mime: 'audio/mp4', types: ['audio/mp4', 'audio/x-m4a'] },
  ogg: { mime: 'audio/ogg', types: ['audio/ogg'] },
  webm: { mime: 'audio/webm', types: ['audio/webm'] },
};

export function normalizeYoutubeUrl(value) {
  if (value == null || String(value).trim() === '') return null;
  let url;
  try { url = new URL(String(value).trim()); } catch { throw new Error('Informe um link válido do YouTube'); }
  if (url.protocol !== 'https:' || !['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be'].includes(url.hostname) || url.username || url.password) {
    throw new Error('Informe um link HTTPS do YouTube');
  }
  return url.toString();
}

export async function validateAudio(file) {
  if (!file || typeof file.slice !== 'function' || !file.name || file.size === 0) throw new Error('Selecione um arquivo de áudio');
  if (file.size > MAX_AUDIO_SIZE) throw new Error('O áudio deve ter no máximo 80 MiB');
  const extension = file.name.split('.').pop()?.toLowerCase();
  const format = FORMATS[extension];
  if (!format || (file.type && file.type !== 'application/octet-stream' && !format.types.includes(file.type.toLowerCase()))) {
    throw new Error('Formato inválido. Use MP3, WAV, M4A, OGG ou WebM de áudio');
  }
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const chars = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  const valid = extension === 'mp3' ? (chars(0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0))
    : extension === 'wav' ? chars(0, 4) === 'RIFF' && chars(8, 12) === 'WAVE'
      : extension === 'm4a' ? chars(4, 8) === 'ftyp'
        : extension === 'ogg' ? chars(0, 4) === 'OggS'
          : bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  if (!valid) throw new Error('O conteúdo não corresponde ao formato de áudio informado');
  return format.mime;
}

async function activeSheet(env, id) {
  return env.DB.prepare('SELECT id, audio_key, audio_mime, audio_name, audio_size, youtube_url FROM partituras WHERE id = ? AND ativo = 1').bind(id).first();
}

export async function uploadAudio(id, request, env) {
  const sheet = await activeSheet(env, id);
  if (!sheet) return errorResponse('Partitura não encontrada', 404, request);
  const form = await request.formData();
  const file = form.get('audio');
  let mime;
  try { mime = await validateAudio(file); } catch (error) { return errorResponse(error.message, 400, request); }
  const extension = file.name.split('.').pop().toLowerCase();
  const key = `audios/${id}/${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, file, { httpMetadata: { contentType: mime } });
  try {
    const result = await env.DB.prepare('UPDATE partituras SET audio_key = ?, audio_mime = ?, audio_name = ?, audio_size = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ? AND ativo = 1 AND audio_key IS ?')
      .bind(key, mime, file.name, file.size, id, sheet.audio_key).run();
    if (result.meta?.changes !== 1) {
      await deleteBestEffort(env.BUCKET, key);
      return errorResponse('Partitura alterada durante o envio do áudio; tente novamente', 409, request);
    }
  } catch (error) {
    await deleteBestEffort(env.BUCKET, key);
    throw error;
  }
  await deleteBestEffort(env.BUCKET, sheet.audio_key);
  return jsonResponse({ success: true, has_audio: true, audio_name: file.name, audio_mime: mime, audio_size: file.size }, 200, request);
}

export async function removeAudio(id, request, env) {
  const sheet = await activeSheet(env, id);
  if (!sheet) return errorResponse('Partitura não encontrada', 404, request);
  const result = await env.DB.prepare('UPDATE partituras SET audio_key = NULL, audio_mime = NULL, audio_name = NULL, audio_size = NULL, atualizado_em = CURRENT_TIMESTAMP WHERE id = ? AND audio_key IS ?').bind(id, sheet.audio_key).run();
  if (result.meta?.changes !== 1) return errorResponse('Partitura alterada; tente novamente', 409, request);
  await deleteBestEffort(env.BUCKET, sheet.audio_key);
  return jsonResponse({ success: true, has_audio: false }, 200, request);
}

export async function updateYoutubeUrl(id, request, env) {
  const sheet = await activeSheet(env, id);
  if (!sheet) return errorResponse('Partitura não encontrada', 404, request);
  let youtubeUrl;
  try { youtubeUrl = normalizeYoutubeUrl((await request.json()).youtube_url); }
  catch (error) { return errorResponse(error.message, 400, request); }
  const result = await env.DB.prepare('UPDATE partituras SET youtube_url = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ? AND ativo = 1').bind(youtubeUrl, id).run();
  if (result.meta?.changes !== 1) return errorResponse('Partitura não encontrada', 404, request);
  return jsonResponse({ success: true, youtube_url: youtubeUrl }, 200, request);
}

async function hmacKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(getJwtSecret(env)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(env, value) {
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(env), new TextEncoder().encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function getAudioAccess(id, request, env) {
  const sheet = await activeSheet(env, id);
  if (!sheet?.audio_key) return errorResponse('Áudio não encontrado', 404, request);
  const exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  const sig = await sign(env, `${id}:${sheet.audio_key}:${exp}`);
  const url = new URL(`/api/partituras/${id}/audio/stream`, request.url);
  url.search = new URLSearchParams({ exp: String(exp), sig }).toString();
  return jsonResponse({ url: url.toString(), expires_at: exp }, 200, request);
}

export function parseAudioRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2]) || !size) return false;
  let start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!match[1]) end = size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return false;
  end = Math.min(end, size - 1);
  return { start, end, length: end - start + 1 };
}

export async function streamAudio(id, request, env) {
  const sheet = await activeSheet(env, id);
  if (!sheet?.audio_key) return errorResponse('Áudio não encontrado', 404, request);
  const url = new URL(request.url);
  const exp = Number(url.searchParams.get('exp'));
  const sig = url.searchParams.get('sig');
  if (!Number.isSafeInteger(exp) || exp < Date.now() / 1000 || exp > Date.now() / 1000 + 2 * 60 * 60 || !/^[a-f0-9]{64}$/.test(sig || '')) {
    return errorResponse('Acesso ao áudio expirado', 403, request);
  }
  const supplied = Uint8Array.from(sig.match(/../g), x => parseInt(x, 16));
  if (!await crypto.subtle.verify('HMAC', await hmacKey(env), supplied, new TextEncoder().encode(`${id}:${sheet.audio_key}:${exp}`))) {
    return errorResponse('Acesso ao áudio inválido', 403, request);
  }
  const size = sheet.audio_size;
  const range = parseAudioRange(request.headers.get('Range'), size);
  const common = { ...getCorsHeaders(request, env), 'Accept-Ranges': 'bytes', 'Content-Type': sheet.audio_mime, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
  if (range === false) return new Response(null, { status: 416, headers: { ...common, 'Content-Range': `bytes */${size}` } });
  const headers = { ...common, 'Content-Length': String(range ? range.length : size), ...(range ? { 'Content-Range': `bytes ${range.start}-${range.end}/${size}` } : {}) };
  if (request.method === 'HEAD') {
    const object = await env.BUCKET.head(sheet.audio_key);
    if (!object) return errorResponse('Arquivo de áudio indisponível', 404, request);
    return new Response(null, { status: range ? 206 : 200, headers });
  }
  const object = await env.BUCKET.get(sheet.audio_key, range ? { range: { offset: range.start, length: range.length } } : undefined);
  if (!object) return errorResponse('Arquivo de áudio indisponível', 404, request);
  return new Response(object.body, {
    status: range ? 206 : 200,
    headers
  });
}
