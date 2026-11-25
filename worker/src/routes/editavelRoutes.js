import { unzipSync, strFromU8 } from 'fflate';
import { adminMiddleware } from '../middleware/index.js';
import { errorResponse, jsonResponse, parsePositiveId } from '../infrastructure/index.js';
import { getCorsHeaders } from '../infrastructure/security/cors.js';
import { deleteBestEffort } from '../infrastructure/storage/storageOperations.js';

const MAX_BYTES = 25 * 1024 * 1024;
const MAX_XML_BYTES = 256 * 1024;
const SIB_HEADER = [15, 83, 73, 66, 69, 76, 73, 85, 83];
const XML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function xmlText(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_match, entity) => {
    if (!entity.startsWith('#')) return XML_ENTITIES[entity] || _match;
    const code = entity[1].toLowerCase() === 'x'
      ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : _match;
  }).trim();
}

export function lerMetadadosEditavel(bytes, filename, formato) {
  const [titulo, ...creditos] = filename.replace(/\.(?:sib|musx)$/i, '').split(' - ');
  const fallback = { titulo: titulo.trim(), creditos: creditos.join(' - '), fonte: 'nome do arquivo' };
  if (formato === 'sib') {
    if (!SIB_HEADER.every((value, index) => bytes[index] === value)) throw new Error('Arquivo Sibelius inválido');
    return fallback;
  }

  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error('Arquivo Finale inválido');
  const files = unzipSync(bytes, {
    filter: file => ['mimetype', 'NotationMetadata.xml'].includes(file.name) && file.originalSize <= MAX_XML_BYTES
  });
  if (!files.mimetype || !strFromU8(files.mimetype).trim().startsWith('application/vnd.makemusic.notation')) {
    throw new Error('Arquivo Finale inválido');
  }
  if (!files['NotationMetadata.xml']) return fallback;

  const xml = strFromU8(files['NotationMetadata.xml']);
  const info = xml.match(/<fileInfo\b[^>]*>([\s\S]*?)<\/fileInfo>/)?.[1] || '';
  const campos = {};
  for (const [tag, field] of [['title', 'titulo'], ['composer', 'compositor'], ['arranger', 'arranjador']]) {
    const value = info.match(new RegExp('<' + tag + '\\b[^>]*>([^<]*)</' + tag + '>'))?.[1];
    if (value?.trim()) campos[field] = xmlText(value).slice(0, 500);
  }
  const versao = xml.match(/<metadata\b[^>]*\bversion="([\d.]+)"/)?.[1];
  return { ...fallback, ...campos, versao_formato: versao, fonte: Object.keys(campos).length ? 'Finale' : fallback.fonte };
}

async function list(request, env) {
  const { results } = await env.DB.prepare(
    'SELECT e.id AS editavel_id, e.titulo, v.id, v.arquivo_nome, v.formato, v.tamanho, v.metadados, v.criado_em FROM partitura_editaveis e JOIN partitura_editavel_versoes v ON v.editavel_id = e.id ORDER BY e.titulo COLLATE NOCASE, e.id, v.id DESC'
  ).all();
  const obras = new Map();
  for (const { editavel_id, titulo, metadados, ...versao } of results) {
    if (!obras.has(editavel_id)) obras.set(editavel_id, { id: editavel_id, titulo, versoes: [] });
    obras.get(editavel_id).versoes.push({ ...versao, metadados: JSON.parse(metadados) });
  }
  return jsonResponse([...obras.values()], 200, request);
}

async function upload(request, env, user, id) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return errorResponse('Envie o arquivo como formulário', 400, request);
  }
  const file = form.get('arquivo');
  const formato = typeof file?.name === 'string' && file.name.match(/\.(sib|musx)$/i)?.[1].toLowerCase();
  if (!formato || !file.size || file.size > MAX_BYTES) {
    return errorResponse('Envie um arquivo .sib ou .musx de até 25 MB', 400, request);
  }
  // Remove controles e separadores antes de usar o nome na resposta de download.
  // eslint-disable-next-line no-control-regex
  const filename = file.name.replace(/[/\\\u0000-\u001f\u007f]/g, '_');
  const original = id && await env.DB.prepare('SELECT id FROM partitura_editaveis WHERE id = ?').bind(id).first();
  if (id && !original) return errorResponse('Arquivo editável não encontrado', 404, request);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let metadados;
  try {
    metadados = lerMetadadosEditavel(bytes, filename, formato);
  } catch {
    return errorResponse('O conteúdo não corresponde a um arquivo Sibelius ou Finale válido', 400, request);
  }
  const titulo = String(form.get('titulo') || metadados.titulo).trim();
  if (!id && (!titulo || titulo.length > 250)) return errorResponse('Informe um título de até 250 caracteres', 400, request);
  const sha = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
  const editavelId = id || crypto.randomUUID();
  const key = 'editaveis/' + editavelId + '/' + crypto.randomUUID() + '.' + formato;
  const insert = env.DB.prepare(
    'INSERT INTO partitura_editavel_versoes (editavel_id, arquivo_chave, arquivo_nome, formato, tamanho, sha256, metadados, criado_por) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(editavel_id, sha256) DO NOTHING RETURNING id'
  ).bind(editavelId, key, filename, formato, file.size, sha, JSON.stringify(metadados), user.id);
  await env.BUCKET.put(key, bytes);
  let version;
  try {
    if (id) {
      version = await insert.first();
    } else {
      const [, result] = await env.DB.batch([
        env.DB.prepare('INSERT INTO partitura_editaveis (id, titulo) VALUES (?, ?)').bind(editavelId, titulo),
        insert
      ]);
      version = result.results[0];
    }
  } catch (error) {
    await deleteBestEffort(env.BUCKET, key);
    throw error;
  }
  if (!version) {
    await deleteBestEffort(env.BUCKET, key);
    return errorResponse('Este arquivo já consta no histórico da obra', 409, request);
  }
  return jsonResponse({ id: editavelId, versao_id: version.id }, 201, request);
}

async function download(request, env, id, versionId) {
  const version = parsePositiveId(versionId);
  if (!version) return errorResponse('Versão inválida', 400, request);
  const row = await env.DB.prepare(
    'SELECT arquivo_chave, arquivo_nome FROM partitura_editavel_versoes WHERE editavel_id = ? AND id = ?'
  ).bind(id, version).first();
  if (!row) return errorResponse('Versão não encontrada', 404, request);
  const object = await env.BUCKET.get(row.arquivo_chave);
  if (!object) return errorResponse('Arquivo não encontrado', 404, request);
  const name = encodeURIComponent(row.arquivo_nome).replace(/['()*]/g, char => '%' + char.charCodeAt(0).toString(16));
  return new Response(object.body, {
    headers: {
      ...getCorsHeaders(request, env),
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': "attachment; filename*=UTF-8''" + name,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export function setupEditavelRoutes(router) {
  router.get('/api/admin/editaveis', list, [adminMiddleware]);
  router.post('/api/admin/editaveis', (request, env, _params, context) => upload(request, env, context.user), [adminMiddleware]);
  router.post('/api/admin/editaveis/:id/versoes', (request, env, { id }, context) => upload(request, env, context.user, id), [adminMiddleware]);
  router.get('/api/admin/editaveis/:id/versoes/:versao', (request, env, { id, versao }) => download(request, env, id, versao), [adminMiddleware]);
}
