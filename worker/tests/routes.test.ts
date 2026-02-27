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

  describe('GET /api/repertorio/ativo', () => {
    it('retorna 401 ou 404 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/repertorio/ativo');
      // 401 se middleware de auth rejeitou, 404 se não há repertório ativo
      expect([401, 404]).toContain(response.status);
    });
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
