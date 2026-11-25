import { timingSafeEqual } from 'node:crypto';
import { adminMiddleware, authMiddleware } from '../middleware/index.js';
import { scoreImportMiddleware } from '../middleware/scoreImportMiddleware.js';
import { errorResponse, jsonResponse } from '../infrastructure/index.js';

const PREFIX = '/api/admin/openbot';
const MAX_AGE = 24 * 60 * 60 * 1000;
const MAX_JSON = 64 * 1024;
const encode = new TextEncoder();

function serviceKey(request, env, next) {
  const actual = encode.encode(request.headers.get('X-Acervo-OpenBot-Key') || '');
  const expected = encode.encode(env.ACERVO_OPENBOT_KEY || '');
  if (expected.length < 32 || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return errorResponse('Credencial do OpenBot inválida', 403, request);
  }
  next();
}

function targetRoute(router, request, method, path) {
  if (typeof path !== 'string' || !path.startsWith('/api/') || path.length > 2048 || /[\r\n\\#]/.test(path)) return null;
  const url = new URL(path, request.url);
  if (url.origin !== new URL(request.url).origin || url.pathname.startsWith(PREFIX + '/')) return null;
  const route = router.routes.find(item => item.method === method && item.regex.test(url.pathname));
  if (!route) return null;
  // Credenciais e uploads multipart continuam nos fluxos administrativos próprios.
  if (method !== 'GET' && (/^\/api\/usuarios(?:\/|$)/.test(route.path) || route.middleware.includes(scoreImportMiddleware))) return null;
  if (method !== 'GET' && /\/upload$|\/audio$|\/partes$|\/editaveis(?:\/|$)/.test(route.path) && method === 'POST') return null;
  if (method === 'PUT' && /\/audio$/.test(route.path)) return null;
  if (route.middleware.includes(adminMiddleware) || route.middleware.includes(scoreImportMiddleware)) return url;
  if (method === 'GET' && route.middleware.includes(authMiddleware)) return url;
  return null;
}

async function jsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Dados ausentes');
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_JSON) {
        await reader.cancel();
        throw new Error('Dados excedem 64 KB');
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

function view(row) {
  const { dados, resultado, ...plain } = row;
  const expired = plain.estado === 'pendente' && plain.criado_em <= Date.now() - MAX_AGE;
  return { ...plain, estado: expired ? 'expirada' : plain.estado, dados: JSON.parse(dados), resultado: JSON.parse(resultado) };
}

async function decide(router, request, env, id, context) {
  let action;
  try {
    action = (await jsonBody(request)).acao;
  } catch {
    return errorResponse('Informe aprovar ou recusar', 400, request);
  }
  if (!['aprovar', 'recusar'].includes(action)) return errorResponse('Informe aprovar ou recusar', 400, request);
  const row = await env.DB.prepare(
    'UPDATE openbot_operacoes SET estado = ?, decidido_por = ?, decidido_em = ? WHERE id = ? AND estado = ? AND criado_em > ? RETURNING *'
  ).bind(action === 'aprovar' ? 'executando' : 'recusada', context.user.id, Date.now(), id, 'pendente', Date.now() - MAX_AGE).first();
  if (!row) return errorResponse('Operação indisponível, expirada ou já decidida', 409, request);
  if (action === 'recusar') return jsonResponse(view(row), 200, request);

  const url = targetRoute(router, request, row.metodo, row.destino);
  let result;
  let httpStatus = 404;
  let state = 'falhou';
  try {
    if (url) {
      const response = await router.handle(new Request(url, {
        method: row.metodo,
        headers: { 'Content-Type': 'application/json' },
        body: row.dados
      }), env, context.executionCtx, context.user);
      httpStatus = response.status;
      result = await response.json().catch(() => null);
      state = response.ok ? 'concluida' : httpStatus >= 500 ? 'incerta' : 'falhou';
    } else {
      result = { error: 'Operação deixou de estar disponível' };
    }
  } catch {
    state = 'incerta';
    httpStatus = 500;
    result = { error: 'Confira o resultado no painel antes de repetir a operação' };
  }
  const resultJson = JSON.stringify(result ?? null);
  const saved = await env.DB.prepare(
    'UPDATE openbot_operacoes SET estado = ?, http_status = ?, resultado = ? WHERE id = ? RETURNING *'
  ).bind(state, httpStatus, resultJson.length <= MAX_JSON ? resultJson : 'null', id).first();
  return jsonResponse(view(saved), 200, request);
}

export function setupOpenBotRoutes(router) {
  router.post('/api/admin/openbot/consulta', async (request, env, _params, context) => {
    let path;
    try {
      path = (await jsonBody(request)).destino;
    } catch {
      return errorResponse('Destino inválido', 400, request);
    }
    const url = targetRoute(router, request, 'GET', path);
    if (!url) return errorResponse('Consulta indisponível', 400, request);
    const operatorId = Number(env.ACERVO_OPENBOT_ADMIN_ID);
    const operator = Number.isSafeInteger(operatorId) && operatorId > 0 && await env.DB.prepare(
      'SELECT id, username, admin FROM usuarios WHERE id = ? AND ativo = 1 AND admin = 1'
    ).bind(operatorId).first();
    if (!operator) return errorResponse('Conta administrativa de integração indisponível', 503, request);
    const response = await router.handle(new Request(url), env, context.executionCtx, operator);
    if (!response.headers.get('Content-Type')?.includes('application/json')) {
      await response.body?.cancel();
      return errorResponse('Consulta disponível apenas para respostas JSON', 415, request);
    }
    return jsonResponse(await response.json(), response.status, request);
  }, [serviceKey]);

  router.post('/api/admin/openbot/operacoes', async (request, env) => {
    let proposal;
    try {
      proposal = await jsonBody(request);
      if (!proposal || typeof proposal !== 'object') throw new Error();
    } catch {
      return errorResponse('Operação inválida', 400, request);
    }
    const { metodo, destino, dados = null } = proposal;
    const url = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo) && targetRoute(router, request, metodo, destino);
    if (!url) return errorResponse('Alteração indisponível', 400, request);
    const id = crypto.randomUUID();
    const row = await env.DB.prepare(
      'INSERT INTO openbot_operacoes (id, metodo, destino, dados, criado_em) VALUES (?, ?, ?, ?, ?) RETURNING *'
    ).bind(id, metodo, url.pathname + url.search, JSON.stringify(dados), Date.now()).first();
    return jsonResponse(view(row), 201, request);
  }, [serviceKey]);

  router.get('/api/admin/openbot/operacoes/:id', async (request, env, { id }) => {
    const row = await env.DB.prepare('SELECT * FROM openbot_operacoes WHERE id = ?').bind(id).first();
    return row ? jsonResponse(view(row), 200, request) : errorResponse('Operação não encontrada', 404, request);
  }, [serviceKey]);

  router.get('/api/admin/openbot/operacoes', async (request, env) => {
    const { results } = await env.DB.prepare(
      'SELECT * FROM openbot_operacoes ORDER BY CASE WHEN estado = ? AND criado_em > ? THEN 0 ELSE 1 END, criado_em DESC LIMIT 100'
    ).bind('pendente', Date.now() - MAX_AGE).all();
    return jsonResponse(results.map(view), 200, request);
  }, [adminMiddleware]);

  router.post('/api/admin/openbot/operacoes/:id/decisao',
    (request, env, { id }, context) => decide(router, request, env, id, context), [adminMiddleware]);
}
