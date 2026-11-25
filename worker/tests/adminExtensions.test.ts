import { env } from 'cloudflare:test';
import { zipSync, strToU8 } from 'fflate';
import { describe, expect, it } from 'vitest';
import { createRouter } from '../src/routes/index.js';

const router = createRouter();
const botKey = 'test-only-openbot-key-at-least-32-characters';
const admin = 'Bearer admin:1234';
const musician = 'Bearer musico:1234';
const bindings = { ...env, ACERVO_OPENBOT_KEY: botKey, ACERVO_OPENBOT_ADMIN_ID: '1' };
const editaveis = '/api/admin/editaveis';
const openbot = '/api/admin/openbot';

function call(path, { method = 'GET', token = '', key = '', origin = '', payload }: {
  method?: string; token?: string; key?: string; origin?: string; payload?: FormData | object;
} = {}) {
  const headers = new Headers();
  if (token) headers.set('Authorization', token);
  if (origin) headers.set('Origin', origin);
  if (key) headers.set('X-Acervo-OpenBot-Key', key);
  if (payload && !(payload instanceof FormData)) headers.set('Content-Type', 'application/json');
  return router.handle(new Request('https://test.local' + path, {
    method,
    headers,
    body: payload instanceof FormData ? payload : JSON.stringify(payload)
  }), bindings);
}

const finale = zipSync({
  mimetype: strToU8('application/vnd.makemusic.notation'),
  'NotationMetadata.xml': strToU8('<metadata version="18.0"><fileInfo><title>Hino &amp; Marcha</title><composer>Maestro</composer></fileInfo></metadata>')
});
const sib = Uint8Array.from([15, ...'SIBELIUS'.split('').map(letter => letter.charCodeAt(0)), 0, 1]);

function fileForm(data: Uint8Array, name: string) {
  const form = new FormData();
  form.set('arquivo', new Blob([Uint8Array.from(data)]), name);
  return form;
}

describe('originais editáveis', () => {
  it('guarda os originais, extrai os metadados, versiona e exige acesso administrativo', async () => {
    expect((await call(editaveis, { token: musician })).status).toBe(403);
    const first = await call(editaveis, { method: 'POST', token: admin, payload: fileForm(finale, 'Hino.musx') });
    expect(first.status).toBe(201);
    const initial = await first.json() as { id: string; versao_id: number };
    const versions = editaveis + '/' + initial.id + '/versoes';
    expect((await call(versions, { method: 'POST', token: admin, payload: fileForm(sib, 'Hino revisado.sib') })).status).toBe(201);
    expect((await call(versions, { method: 'POST', token: admin, payload: fileForm(sib, 'Hino duplicado.sib') })).status).toBe(409);
    const list = await call(editaveis, { token: admin });
    expect(await list.json()).toMatchObject([{
      id: initial.id, titulo: 'Hino & Marcha', versoes: [
        { formato: 'sib', metadados: { titulo: 'Hino revisado', fonte: 'nome do arquivo' } },
        { formato: 'musx', metadados: { titulo: 'Hino & Marcha', compositor: 'Maestro', versao_formato: '18.0' } }
      ]
    }]);
    expect((await call(versions + '/' + initial.versao_id, { token: musician })).status).toBe(403);
    const origin = 'https://acervo-filarmonica.pages.dev';
    const download = await call(versions + '/' + initial.versao_id, { token: admin, origin });
    expect(download.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(download.headers.get('Cache-Control')).toBe('private, no-store');
    expect(new Uint8Array(await download.arrayBuffer())).toEqual(finale);
  });
});

describe('operações do OpenBot', () => {
  it('consulta, cria e atualiza repertório após aprovação, uma vez por operação', async () => {
    const ops = openbot + '/operacoes';
    const consulta = await call(openbot + '/consulta', { method: 'POST', key: botKey, payload: { destino: '/api/repertorios' } });
    expect(consulta.status).toBe(200);
    const catalog = await call(openbot + '/consulta', { method: 'POST', key: botKey, payload: { destino: '/api/partituras?categoria=dobrados' } });
    expect(catalog.status).toBe(200);
    const scoreProposal = await call(ops, { method: 'POST', key: botKey, payload: {
      metodo: 'PUT', destino: '/api/partituras/123', dados: { titulo: 'Nova edição' }
    } });
    expect(scoreProposal.status).toBe(201);
    const proposed = { metodo: 'POST', destino: '/api/repertorios', dados: { nome: 'Repertório OpenBot' } };
    expect((await call(ops, { method: 'POST', key: 'invalida', payload: proposed })).status).toBe(403);
    const create = await call(ops, { method: 'POST', key: botKey, payload: proposed });
    expect(create.status).toBe(201);
    const { id } = await create.json() as { id: string };
    const lookup = () => env.DB.prepare('SELECT id, nome FROM repertorios WHERE nome LIKE ?').bind('Repertório OpenBot%').first();
    expect(await lookup()).toBeNull();

    const decision = { method: 'POST', payload: { acao: 'aprovar' } };
    expect((await call(ops + '/' + id + '/decisao', { ...decision, key: botKey })).status).toBe(403);
    expect((await call(ops + '/' + id + '/decisao', { ...decision, token: musician })).status).toBe(403);
    const approved = await call(ops + '/' + id + '/decisao', { ...decision, token: admin });
    expect(await approved.json()).toMatchObject({ estado: 'concluida', decidido_por: 1 });
    expect((await call(ops + '/' + id + '/decisao', { ...decision, token: admin })).status).toBe(409);
    const repertoire = await lookup();
    expect(repertoire?.nome).toBe('Repertório OpenBot');

    const changed = await call(ops, { method: 'POST', key: botKey, payload: {
      metodo: 'PUT', destino: '/api/repertorio/' + repertoire?.id, dados: { nome: 'Repertório OpenBot revisado' }
    } });
    const update = await changed.json() as { id: string };
    expect(await lookup()).toMatchObject({ nome: 'Repertório OpenBot' });
    await call(ops + '/' + update.id + '/decisao', { ...decision, token: admin });
    expect(await lookup()).toMatchObject({ nome: 'Repertório OpenBot revisado' });
  });
});
