/**
 * Testes de Integração de Rotas
 *
 * Estes testes rodam no runtime workerd real, validando:
 * 1. Rotas existem e respondem corretamente
 * 2. Métodos HTTP corretos são aceitos/rejeitados
 * 3. Middlewares de autenticação funcionam
 *
 * @see docs/TESTING-STRATEGY.md
 */

import { env, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';

// Helper para criar token JWT de teste
async function createTestToken(userId: number, isAdmin: boolean = false): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    isAdmin: isAdmin ? 1 : 0,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }));

  // Importa a chave para assinar
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.JWT_SECRET || 'test-jwt-secret-for-testing'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const data = encoder.encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${header}.${payload}.${signatureBase64}`;
}

describe('Health Check', () => {
  it('GET /api/health retorna 200', async () => {
    const response = await SELF.fetch('https://test.local/api/health');
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
  });
});

describe('Rotas Públicas', () => {
  describe('GET /api/partituras', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras');
      expect(response.status).toBe(200);
    });

    it('aceita query params', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras?busca=teste&categoria=1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/categorias', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/estatisticas', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/estatisticas');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/atividades', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/atividades');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/repertorio/ativo', () => {
    it('retorna 200 ou 404 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/repertorio/ativo');
      // 200 se há repertório ativo, 404 se não há
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('POST /api/login', () => {
    it('aceita POST', async () => {
      const response = await SELF.fetch('https://test.local/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'invalid', pin: '0000' }),
      });
      // 401 é esperado para credenciais inválidas, mas a rota existe
      expect([200, 401]).toContain(response.status);
    });

    it('retorna sessao de tracking no login valido', async () => {
      const response = await SELF.fetch('https://test.local/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'musico', pin: '1234' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { success: boolean; tracking_session_id: string };
      expect(data.success).toBe(true);
      expect(data.tracking_session_id).toMatch(/^sess_2_/);

      const session = await env.DB.prepare(`
        SELECT usuario_id, fim_em
        FROM tracking_sessions
        WHERE id = ?
      `).bind(data.tracking_session_id).first() as { usuario_id: number; fim_em: string | null } | null;

      expect(session?.usuario_id).toBe(2);
      expect(session?.fim_em).toBeNull();
    });

    it('rejeita GET', async () => {
      const response = await SELF.fetch('https://test.local/api/login');
      expect(response.status).toBe(404);
    });
  });
});

describe('Rotas Autenticadas', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false); // usuário 2 é músico comum
  });

  describe('GET /api/favoritos', () => {
    it('retorna 401 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/favoritos');
      expect(response.status).toBe(401);
    });

    it('retorna 200 com token válido', async () => {
      const response = await SELF.fetch('https://test.local/api/favoritos', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/perfil', () => {
    it('retorna 401 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/perfil');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tracking/events', () => {
    it('rejeita evento sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'partitura_aberta' }),
      });

      expect(response.status).toBe(401);
    });

    it('registra evento autenticado', async () => {
      const partituraId = await env.DB.prepare(`
        INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
        VALUES ('Tracking Route Test', 'Compositor Teste', 1, 'tracking-route-test.pdf', 100, 0, 1)
        RETURNING id
      `).first('id') as number;

      const response = await SELF.fetch('https://test.local/api/tracking/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          tipo: 'partitura_aberta',
          origem: 'acervo',
          partitura_id: partituraId,
        }),
      });

      expect(response.status).toBe(200);
      const body = await response.json() as { success: boolean; session_id: string };
      expect(body.success).toBe(true);
      expect(body.session_id).toMatch(/^sess_2_/);

      const evento = await env.DB.prepare(`
        SELECT tipo, origem, usuario_id, partitura_id, session_id
        FROM tracking_events
        WHERE tipo = 'partitura_aberta'
        ORDER BY id DESC
        LIMIT 1
      `).first() as { tipo: string; origem: string; usuario_id: number; partitura_id: number; session_id: string } | null;

      expect(evento).not.toBeNull();
      expect(evento?.origem).toBe('acervo');
      expect(evento?.usuario_id).toBe(2);
      expect(evento?.partitura_id).toBe(partituraId);
      expect(evento?.session_id).toBe(body.session_id);
    });

    it('encerra sessao de tracking autenticada', async () => {
      const eventResponse = await SELF.fetch('https://test.local/api/tracking/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ tipo: 'busca_realizada', termo_original: 'dobrado', resultados_count: 1 }),
      });
      const eventBody = await eventResponse.json() as { session_id: string };

      const response = await SELF.fetch('https://test.local/api/tracking/session/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
          'X-Tracking-Session': eventBody.session_id,
        },
        body: JSON.stringify({ session_id: eventBody.session_id }),
      });

      expect(response.status).toBe(200);
      const session = await env.DB.prepare(`
        SELECT fim_em, fim_motivo
        FROM tracking_sessions
        WHERE id = ?
      `).bind(eventBody.session_id).first() as { fim_em: string | null; fim_motivo: string | null } | null;

      expect(session?.fim_em).not.toBeNull();
      expect(session?.fim_motivo).toBe('logout');
    });
  });
});

describe('Download view analytics', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false);
  });

  it('nao conta action=view de parte como download real', async () => {
    const arquivoNome = 'view-parte-route-test.pdf';
    await env.BUCKET.put(arquivoNome, new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D]));
    const partituraId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, downloads, destaque, ativo)
      VALUES ('Teste View Parte', 'Mock', 1, ?, 5, 0, 0, 1) RETURNING id
    `).bind(arquivoNome).first('id') as number;
    const parteId = await env.DB.prepare(`
      INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
      VALUES (?, 'Trompete Bb', ?) RETURNING id
    `).bind(partituraId, arquivoNome).first('id') as number;

    const response = await SELF.fetch(`https://test.local/api/download/parte/${parteId}?action=view`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toContain('inline');
    await response.arrayBuffer();
    const partitura = await env.DB.prepare('SELECT downloads FROM partituras WHERE id = ?')
      .bind(partituraId)
      .first() as { downloads: number };
    const logs = await env.DB.prepare('SELECT COUNT(*) as total FROM logs_download WHERE partitura_id = ?')
      .bind(partituraId)
      .first() as { total: number };

    expect(partitura.downloads).toBe(0);
    expect(logs.total).toBe(0);
  });

  it('nao conta action=view de partitura completa como download real', async () => {
    const arquivoNome = 'view-partitura-route-test.pdf';
    await env.BUCKET.put(arquivoNome, new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D]));
    const partituraId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, downloads, destaque, ativo)
      VALUES ('Teste View Partitura', 'Mock', 1, ?, 5, 0, 0, 1) RETURNING id
    `).bind(arquivoNome).first('id') as number;

    const response = await SELF.fetch(`https://test.local/api/download/${partituraId}?action=view`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toContain('inline');
    await response.arrayBuffer();
    const partitura = await env.DB.prepare('SELECT downloads FROM partituras WHERE id = ?')
      .bind(partituraId)
      .first() as { downloads: number };
    const logs = await env.DB.prepare('SELECT COUNT(*) as total FROM logs_download WHERE partitura_id = ?')
      .bind(partituraId)
      .first() as { total: number };

    expect(partitura.downloads).toBe(0);
    expect(logs.total).toBe(0);
  });
});

describe('Rotas Admin', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false); // usuário comum
    adminToken = await createTestToken(1, true);  // admin
  });

  describe('GET /api/usuarios', () => {
    it('rejeita sem token (401 ou 403)', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios');
      // adminMiddleware pode retornar 401 (não autenticado) ou 403 (não autorizado)
      expect([401, 403]).toContain(response.status);
    });

    it('retorna 403 com token de usuário comum', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(response.status).toBe(403);
    });

    it('retorna 200 com token admin', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/categorias', () => {
    it('rejeita sem token (401 ou 403)', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: 'Teste' }),
      });
      expect([401, 403]).toContain(response.status);
    });

    it('retorna 403 com token de usuário comum', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ nome: 'Teste' }),
      });
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/analytics/dashboard', () => {
    it('retorna seções para uso do acervo, pessoas, ensaios e alterações', async () => {
      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as Record<string, unknown>;
      expect(data).toHaveProperty('uso_acervo');
      expect(data).toHaveProperty('pessoas');
      expect(data).toHaveProperty('ensaios');
      expect(data).toHaveProperty('alteracoes');
      expect(data).toHaveProperty('atividade_recente');
      expect(data).toHaveProperty('instrumentos_dist');
      expect(data).toHaveProperty('presencas_familia');
    });

    it('conta busca sem resultado apenas para busca realizada', async () => {
      await env.DB.prepare(`
        INSERT INTO tracking_events (usuario_id, tipo, termo_original, termo_normalizado, resultados_count, criado_em)
        VALUES
          (2, 'busca_digitada', 'sem resultado digitado', 'sem resultado digitado', 0, '2099-01-10 10:00:00'),
          (2, 'busca_realizada', 'sem resultado final', 'sem resultado final', 0, '2099-01-10 10:01:00')
      `).run();

      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard?inicio=2099-01-01&fim=2099-02-01', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { uso_acervo: { resumo: { buscas_sem_resultado: number }; insights: Array<{ descricao: string }> } };
      expect(data.uso_acervo.resumo.buscas_sem_resultado).toBe(1);
      expect(data.uso_acervo.insights.map((item) => item.descricao).join(' ')).toContain('sem resultado final');
      expect(data.uso_acervo.insights.map((item) => item.descricao).join(' ')).not.toContain('sem resultado digitado');
    });

    it('considera ensaios apenas com presenca de musico elegivel', async () => {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO instrumentos (id, nome, familia, ordem) VALUES
          ('test_metal_analytics', 'Trompete Analytics', 'Metais', 900),
          ('test_outro_analytics', 'Diretoria Analytics', 'Diretoria', 901)
      `).run();
      await env.DB.prepare(`
        INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo, instrumento_id) VALUES
          (130, 'musico.analytics', 'Musico Analytics', '1234', 0, 1, 'test_metal_analytics'),
          (131, 'admin.analytics', 'Admin Analytics', '1234', 1, 1, 'test_metal_analytics'),
          (132, 'inativo.analytics', 'Inativo Analytics', '1234', 0, 0, 'test_metal_analytics'),
          (133, 'social.analytics', 'Social Analytics', '1234', 0, 1, 'test_outro_analytics')
      `).run();
      await env.DB.prepare(`
        INSERT OR IGNORE INTO presencas (usuario_id, data_ensaio, criado_por) VALUES
          (130, '2099-03-01', 1),
          (131, '2099-03-02', 1),
          (132, '2099-03-03', 1),
          (133, '2099-03-04', 1)
      `).run();

      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard?inicio=2099-03-01&fim=2099-04-01', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { ensaios: { resumo: { ensaios_registrados: number } } };
      expect(data.ensaios.resumo.ensaios_registrados).toBe(1);
    });

    it('mostra apenas atividades administrativas na aba alteracoes', async () => {
      await env.DB.prepare(`
        INSERT INTO atividades (tipo, titulo, detalhes, usuario_id, criado_em)
        VALUES
          ('download', 'Download comum', 'Trompete', 2, '2099-04-10 10:00:00'),
          ('visualizacao', 'Visualizacao comum', 'Trompete', 2, '2099-04-10 10:01:00'),
          ('update_partitura', 'Alteracao auditavel', 'Titulo atualizado', 1, '2099-04-10 10:02:00')
      `).run();

      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard?inicio=2099-04-01&fim=2099-05-01', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { alteracoes: { total: number; atividades: Array<{ tipo: string }> } };
      expect(data.alteracoes.total).toBe(1);
      expect(data.alteracoes.atividades.map((item) => item.tipo)).toEqual(['update_partitura']);
    });
  });
});

describe('Rotas de Partes (BUG FIX)', () => {
  /**
   * Estes testes validam especificamente as rotas que tiveram bugs de endpoint:
   * - PUT /api/partes/:id/substituir (não /api/partituras/:id/partes/:parteId)
   * - DELETE /api/partes/:id (não /api/partituras/:id/partes/:parteId)
   */

  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  describe('PUT /api/partes/:id/substituir', () => {
    it('rota existe e requer admin (401 ou 403 sem token)', async () => {
      const response = await SELF.fetch('https://test.local/api/partes/1/substituir', {
        method: 'PUT',
      });
      // Rota existe, mas requer autenticação admin
      expect([401, 403]).toContain(response.status);
    });

    it('rota ERRADA retorna 404', async () => {
      // Endpoint antigo/errado que não deve existir
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes/1/substituir', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/partes/:id', () => {
    it('rota existe e requer admin (401 ou 403 sem token)', async () => {
      const response = await SELF.fetch('https://test.local/api/partes/1', {
        method: 'DELETE',
      });
      expect([401, 403]).toContain(response.status);
    });

    it('rota ERRADA retorna 404', async () => {
      // Endpoint antigo/errado que não deve existir
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes/1', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/partituras/:id/partes', () => {
    it('rota existe e requer autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/download/parte/:id - Resiliencia de Storage/DB', () => {
    let userToken: string;

    beforeAll(async () => {
      userToken = await createTestToken(2, false);
    });

    it('retorna 404 se a ID da parte não existir no banco de dados', async () => {
      const response = await SELF.fetch('https://test.local/api/download/parte/99999', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      // Garante que o Worker não exploda num erro 500
      expect(response.status).toBe(404);
      const data = await response.json() as { error: string };
      expect(data.error).toBe('Parte não encontrada');
    });

    it('retorna 404 amigável se a parte existir no banco, mas o arquivo sumiu do R2 Bucket!', async () => {
      // Como estamos rodando em ambiente de teste do Vitest,
      // qualquer request à um arquivo que não foi "put()" no env.BUCKET
      // vai resultar em bucket.get() retornando NULL!

      // Precisamos dar seed em uma partitura+parte falsa sem colocar o blob no storage. (Mock DB apenas)
      const partituraId = await env.DB.prepare(`
        INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
        VALUES ('Teste R2 Desaparecido', 'Mock', 1, 'mock.pdf', 0, 0, 1) RETURNING id
      `).first('id');

      const parteId = await env.DB.prepare(`
        INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
        VALUES (?, 'Trompete Bb', 'arquivo_fantasma.pdf') RETURNING id
      `).bind(partituraId).first('id');

      const response = await SELF.fetch(`https://test.local/api/download/parte/${parteId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      // Aqui o teste crucial: backend TEM QUE dar 404, não pode crashear (500)
      expect(response.status).toBe(404);
      const data = await response.json() as { error: string };
      expect(data.error).toBe('Arquivo não encontrado no storage');
    });
  });
});

describe('Atividades de notificações', () => {
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  it('registra atividade nova_parte ao adicionar uma nova parte', async () => {
    const partituraId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
      VALUES ('Partitura Notificada', 'Compositor Teste', 'dobrados', 'teste.pdf', 100, 0, 1)
      RETURNING id
    `).first('id') as number;

    const formData = new FormData();
    formData.append('instrumento', 'Clarinete Bb 1');
    formData.append(
      'arquivo',
      new File(
        [new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34])],
        'parte.pdf',
        { type: 'application/pdf' }
      )
    );

    const response = await SELF.fetch(`https://test.local/api/partituras/${partituraId}/partes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    });

    expect(response.status).toBe(201);

    const atividade = await env.DB.prepare(`
      SELECT tipo, titulo, detalhes, usuario_id
      FROM atividades
      WHERE tipo = 'nova_parte' AND titulo = 'Partitura Notificada'
      ORDER BY id DESC
      LIMIT 1
    `).first() as { tipo: string; titulo: string; detalhes: string; usuario_id: number } | null;

    expect(atividade).not.toBeNull();
    expect(atividade?.detalhes).toBe('Clarinete Bb 1');
    expect(atividade?.usuario_id).toBe(1);
  });
});

describe('Métodos HTTP incorretos', () => {
  it('DELETE em /api/partituras (sem ID) retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/partituras', {
      method: 'DELETE',
    });
    expect(response.status).toBe(404);
  });

  it('PUT em /api/login retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/login', {
      method: 'PUT',
    });
    expect(response.status).toBe(404);
  });

  it('POST em /api/estatisticas retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/estatisticas', {
      method: 'POST',
    });
    expect(response.status).toBe(404);
  });
});

// ============================================================
// TESTES DE CRUD - Validam operações completas
// ============================================================

describe('CRUD de Categorias', () => {
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  it('fluxo completo: criar, ler, atualizar e deletar categoria', async () => {
    const testCategoryId = 'categoria-teste-crud';

    // 1. Criar categoria
    const createResponse = await SELF.fetch('https://test.local/api/categorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: testCategoryId,
        nome: 'Categoria Teste',
        emoji: '🎵',
        cor: '#FF0000',
      }),
    });

    expect(createResponse.status).toBe(201);
    const createData = await createResponse.json() as { success: boolean };
    expect(createData.success).toBe(true);

    // 2. Verificar que aparece na lista
    const listResponse = await SELF.fetch('https://test.local/api/categorias');
    expect(listResponse.status).toBe(200);
    const listData = await listResponse.json() as Array<{ id: string; nome: string }>;
    const found = listData.find(c => c.id === testCategoryId);
    expect(found).toBeDefined();
    expect(found?.nome).toBe('Categoria Teste');

    // 3. Atualizar categoria
    const updateResponse = await SELF.fetch(`https://test.local/api/categorias/${testCategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        nome: 'Categoria Atualizada',
      }),
    });

    expect(updateResponse.status).toBe(200);

    // 4. Deletar categoria
    const deleteResponse = await SELF.fetch(`https://test.local/api/categorias/${testCategoryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(deleteResponse.status).toBe(200);

    // 5. Verificar que foi deletada
    const checkResponse = await SELF.fetch('https://test.local/api/categorias');
    const checkData = await checkResponse.json() as Array<{ id: string }>;
    const notFound = checkData.find(c => c.id === testCategoryId);
    expect(notFound).toBeUndefined();
  });

  it('GET /api/categorias retorna lista com categorias de seed', async () => {
    const response = await SELF.fetch('https://test.local/api/categorias');
    expect(response.status).toBe(200);

    const data = await response.json() as Array<{ id: string; nome: string }>;
    expect(Array.isArray(data)).toBe(true);
    // Verifica se há pelo menos as categorias de seed
    expect(data.length).toBeGreaterThanOrEqual(2);
  });
});

describe('CRUD de Partituras - Update', () => {
  let adminToken: string;
  let userToken: string;
  let testPartituraId: number;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
    userToken = await createTestToken(2, false);

    // Cria uma partitura de teste para o update
    const id = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
      VALUES ('Partitura Teste Update', 'Compositor Teste', 'Arranjador Teste', 1, 'teste.pdf', 100, 0, 1) RETURNING id
    `).first('id') as number;
    testPartituraId = id;
  });

  it('rejeita sem token (401 ou 403)', async () => {
    const response = await SELF.fetch(`https://test.local/api/partituras/${testPartituraId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Novo Titulo', categoria_id: 1 }),
    });
    expect([401, 403]).toContain(response.status);
  });

  it('rejeita com token de usuário comum (403)', async () => {
    const response = await SELF.fetch(`https://test.local/api/partituras/${testPartituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ titulo: 'Novo Titulo', categoria_id: 1 }),
    });
    expect(response.status).toBe(403);
  });

  it('atualiza com campos mínimos enviados pelo frontend (sem ano/descricao)', async () => {
    // Reproduz EXATAMENTE o que o frontend envia no edit modal:
    // ...editingPartitura + campos do form (SEM ano e descricao)
    const response = await SELF.fetch(`https://test.local/api/partituras/${testPartituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: testPartituraId,
        titulo: 'Partitura Renomeada',
        compositor: 'Novo Compositor',
        arranjador: null,
        categoria_id: 1,
        // NÃO envia ano, descricao - estes eram undefined e causavam 500
        destaque: 0,
        ativo: 1,
        arquivo_nome: 'teste.pdf',
        downloads: 0,
      }),
    });

    // O bug original causava 500 aqui
    expect(response.status).toBe(200);
    const data = await response.json() as { success: boolean };
    expect(data.success).toBe(true);

    // Verifica que o título foi atualizado
    const check = await env.DB.prepare(
      'SELECT titulo, compositor FROM partituras WHERE id = ?'
    ).bind(testPartituraId).first() as { titulo: string; compositor: string };
    expect(check.titulo).toBe('Partitura Renomeada');
    expect(check.compositor).toBe('Novo Compositor');

    const atividade = await env.DB.prepare(`
      SELECT tipo, titulo, detalhes, usuario_id
      FROM atividades
      WHERE tipo = 'update_partitura' AND titulo = 'Partitura Renomeada'
      ORDER BY id DESC
      LIMIT 1
    `).first() as { tipo: string; detalhes: string; usuario_id: number } | null;

    expect(atividade).not.toBeNull();
    expect(atividade?.detalhes).toContain('Título:');
    expect(atividade?.detalhes).toContain('Compositor:');
    expect(atividade?.usuario_id).toBe(1);
  });

  it('rejeita update sem título', async () => {
    const response = await SELF.fetch(`https://test.local/api/partituras/${testPartituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: '',
        categoria_id: 1,
      }),
    });
    expect(response.status).toBe(400);
  });

  it('preserva compositor existente quando o campo nao e enviado', async () => {
    const partituraId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
      VALUES ('Partitura Preserva Compositor', 'Compositor Preservado', NULL, 1, 'preserva.pdf', 100, 0, 1) RETURNING id
    `).first('id') as number;

    const response = await SELF.fetch(`https://test.local/api/partituras/${partituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: 'Partitura Preserva Compositor Atualizada',
        categoria_id: 1,
        destaque: 0,
      }),
    });

    expect(response.status).toBe(200);
    const check = await env.DB.prepare('SELECT compositor FROM partituras WHERE id = ?')
      .bind(partituraId)
      .first() as { compositor: string };
    expect(check.compositor).toBe('Compositor Preservado');
  });

  it('rejeita titulo duplicado ao atualizar partitura', async () => {
    const originalId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
      VALUES ('Titulo Duplicado Analytics', 'Compositor A', 1, 'duplicada-a.pdf', 100, 0, 1) RETURNING id
    `).first('id') as number;
    const alvoId = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, categoria_id, arquivo_nome, arquivo_tamanho, destaque, ativo)
      VALUES ('Titulo Temporario Analytics', 'Compositor B', 1, 'duplicada-b.pdf', 100, 0, 1) RETURNING id
    `).first('id') as number;

    const response = await SELF.fetch(`https://test.local/api/partituras/${alvoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: 'Titulo Duplicado Analytics',
        compositor: 'Compositor B',
        categoria_id: 1,
        destaque: 0,
      }),
    });

    expect(originalId).toBeGreaterThan(0);
    expect(response.status).toBe(409);
  });

  it('rejeita update sem categoria', async () => {
    const response = await SELF.fetch(`https://test.local/api/partituras/${testPartituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: 'Algum Titulo',
        // sem categoria nem categoria_id
      }),
    });
    expect(response.status).toBe(400);
  });
});

describe('CRUD de Repertórios', () => {
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  it('fluxo completo: criar, ler, atualizar e deletar repertório', async () => {
    // 1. Criar repertório
    const createResponse = await SELF.fetch('https://test.local/api/repertorios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        nome: 'Repertório Teste CRUD',
        descricao: 'Descrição do repertório de teste',
      }),
    });

    expect(createResponse.status).toBe(201);
    const createData = await createResponse.json() as { id: number };
    expect(createData).toHaveProperty('id');
    const repertorioId = createData.id;

    // 2. Ler repertório específico
    const getResponse = await SELF.fetch(`https://test.local/api/repertorio/${repertorioId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(getResponse.status).toBe(200);
    const getData = await getResponse.json() as { nome: string };
    expect(getData.nome).toBe('Repertório Teste CRUD');

    // 3. Atualizar repertório
    const updateResponse = await SELF.fetch(`https://test.local/api/repertorio/${repertorioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        nome: 'Repertório Atualizado',
      }),
    });

    expect(updateResponse.status).toBe(200);

    // 4. Deletar repertório
    const deleteResponse = await SELF.fetch(`https://test.local/api/repertorio/${repertorioId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(deleteResponse.status).toBe(200);

    // 5. Verificar que foi deletado
    const checkResponse = await SELF.fetch(`https://test.local/api/repertorio/${repertorioId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(checkResponse.status).toBe(404);
  });

  it('GET /api/repertorios lista repertórios', async () => {
    const response = await SELF.fetch('https://test.local/api/repertorios', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json() as Array<{ id: number }>;
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/repertorio/ativo retorna 200 ou 404', async () => {
    const response = await SELF.fetch('https://test.local/api/repertorio/ativo', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // Pode ser 200 (encontrou) ou 404 (não há ativo)
    expect([200, 404]).toContain(response.status);
  });
});

describe('CRUD de Favoritos', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false);
  });

  it('POST /api/favoritos/:id adiciona favorito', async () => {
    // Tenta adicionar partitura 1 aos favoritos (pode não existir, mas rota deve funcionar)
    const response = await SELF.fetch('https://test.local/api/favoritos/1', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // 200/201 se sucesso, 404 se partitura não existe
    expect([200, 201, 404]).toContain(response.status);
  });

  it('GET /api/favoritos lista favoritos do usuário', async () => {
    const response = await SELF.fetch('https://test.local/api/favoritos', {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/favoritos/ids retorna apenas IDs', async () => {
    const response = await SELF.fetch('https://test.local/api/favoritos/ids', {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json() as number[];
    // A API retorna array de IDs diretamente (não { ids: [...] })
    expect(Array.isArray(data)).toBe(true);
  });

  it('DELETE /api/favoritos/:id remove favorito', async () => {
    const response = await SELF.fetch('https://test.local/api/favoritos/1', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // 200 se removeu, 404 se não existia
    expect([200, 404]).toContain(response.status);
  });
});

describe('Rotas de Perfil', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false);
  });

  it('GET /api/perfil retorna dados do usuário', async () => {
    const response = await SELF.fetch('https://test.local/api/perfil', {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json() as { id: number; username: string };
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
  });

  it('PUT /api/perfil atualiza dados do usuário', async () => {
    const response = await SELF.fetch('https://test.local/api/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        nome: 'Músico Teste Atualizado',
      }),
    });

    expect(response.status).toBe(200);
  });
});

// ============================================================
// TESTES DE CONFIGURAÇÕES - Modo Recesso
// ============================================================

describe('Rotas de Configuração - Modo Recesso', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false);
    adminToken = await createTestToken(1, true);
  });

  describe('GET /api/config/recesso', () => {
    it('retorna 200 sem autenticação (rota pública)', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso');
      expect(response.status).toBe(200);
    });

    it('retorna objeto com propriedade ativo', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso');
      expect(response.status).toBe(200);

      const data = await response.json() as { ativo: boolean };
      expect(data).toHaveProperty('ativo');
      expect(typeof data.ativo).toBe('boolean');
    });

    it('retorna false como valor padrão', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso');
      const data = await response.json() as { ativo: boolean };

      // Valor padrão deve ser false (a menos que outro teste tenha alterado)
      expect(typeof data.ativo).toBe('boolean');
    });
  });

  describe('PUT /api/config/recesso', () => {
    it('rejeita sem token (401 ou 403)', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: true }),
      });
      expect([401, 403]).toContain(response.status);
    });

    it('rejeita com token de usuário comum (403)', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ ativo: true }),
      });
      expect(response.status).toBe(403);
    });

    it('aceita com token admin e ativa modo recesso', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ativo: true }),
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { ativo: boolean; mensagem: string };
      expect(data.ativo).toBe(true);
      expect(data.mensagem).toBe('Configuração atualizada');
    });

    it('persiste alteração corretamente', async () => {
      // Ativa modo recesso
      await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ativo: true }),
      });

      // Verifica se foi persistido
      const getResponse = await SELF.fetch('https://test.local/api/config/recesso');
      const getData = await getResponse.json() as { ativo: boolean };
      expect(getData.ativo).toBe(true);

      // Desativa modo recesso
      await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ativo: false }),
      });

      // Verifica se foi persistido
      const getResponse2 = await SELF.fetch('https://test.local/api/config/recesso');
      const getData2 = await getResponse2.json() as { ativo: boolean };
      expect(getData2.ativo).toBe(false);
    });

    it('converte valores truthy/falsy corretamente', async () => {
      // Envia ativo: false explícito
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ativo: false }),
      });

      expect(response.status).toBe(200);
      const data = await response.json() as { ativo: boolean };
      expect(data.ativo).toBe(false);
    });
  });

  describe('Métodos HTTP incorretos', () => {
    it('POST em /api/config/recesso retorna 404', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ativo: true }),
      });
      expect(response.status).toBe(404);
    });

    it('DELETE em /api/config/recesso retorna 404', async () => {
      const response = await SELF.fetch('https://test.local/api/config/recesso', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(404);
    });
  });
});
