// ===== MSW HANDLERS =====
// Handlers para interceptar requisicoes de rede nos testes
// Seguindo o guia: MSW opera no nivel de rede, nao da aplicacao

import { http, HttpResponse } from 'msw';

// API_BASE pode ser vazio (localhost) ou a URL de producao
// MSW precisa interceptar ambos
const API_BASE_PROD = 'https://acervo-filarmonica-api.acssjr.workers.dev';

// Helper para criar handler para ambas URLs (relativa e absoluta)
const createHandler = (method, path, resolver) => {
  return [
    http[method](path, resolver),
    http[method](`${API_BASE_PROD}${path}`, resolver)
  ];
};

// Compat: manter API_BASE para handlers antigos
const API_BASE = API_BASE_PROD;

// ===== DADOS MOCK =====
export const mockUser = {
  id: 1,
  username: 'musico.teste',
  nome: 'Músico Teste',
  instrumento: 'Trompete Bb 1',
  isAdmin: false
};

export const mockAdminUser = {
  id: 2,
  username: 'admin',
  nome: 'Administrador',
  instrumento: null,
  isAdmin: true
};

export const mockSheets = [
  {
    id: 1,
    title: 'Dobrado Teste',
    composer: 'Compositor A',
    category: 'Dobrado',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Marcha Exemplo',
    composer: 'Compositor B',
    category: 'Marcha',
    createdAt: '2024-02-01T00:00:00Z'
  }
];

export const mockPartes = [
  { id: 1, partitura_id: 1, instrumento: 'Trompete Bb 1' },
  { id: 2, partitura_id: 1, instrumento: 'Trompete Bb 2' },
  { id: 3, partitura_id: 1, instrumento: 'Trombone 1' }
];

// ===== HANDLERS =====
// Handlers para URLs relativas (localhost/testes) e absolutas (producao)
export const handlers = [
  // ----- HEALTH CHECK (URLs relativas primeiro) -----
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: Date.now() });
  }),

  // ----- PARTITURAS (URLs relativas) -----
  http.get('/api/partituras', () => {
    return HttpResponse.json(mockSheets);
  }),

  http.get('/api/partituras/:id', ({ params }) => {
    const sheet = mockSheets.find(s => s.id === parseInt(params.id));
    if (sheet) {
      return HttpResponse.json(sheet);
    }
    return HttpResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }),

  http.get('/api/partituras/:id/partes', ({ params }) => {
    const partes = mockPartes.filter(p => p.partitura_id === parseInt(params.id));
    return HttpResponse.json(partes);
  }),

  // ----- FAVORITOS (URLs relativas) -----
  http.get('/api/favoritos', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([{ partitura_id: 1 }]);
  }),

  http.post('/api/favoritos/:id', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true, partitura_id: parseInt(params.id) });
  }),

  http.delete('/api/favoritos/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ----- AUTH (URLs relativas) -----
  http.post('/api/check-user', async ({ request }) => {
    const { username } = await request.json();
    if (username === 'musico.teste') {
      return HttpResponse.json({
        exists: true,
        user: { nome: mockUser.nome, instrumento: mockUser.instrumento }
      });
    }
    if (username === 'admin') {
      return HttpResponse.json({
        exists: true,
        user: { nome: mockAdminUser.nome, instrumento: null }
      });
    }
    return HttpResponse.json({ exists: false });
  }),

  http.post('/api/login', async ({ request }) => {
    const { username, pin } = await request.json();
    if (username === 'musico.teste' && pin === '1234') {
      return HttpResponse.json({
        token: 'mock-jwt-token-user',
        user: mockUser,
        expiresIn: 86400
      });
    }
    if (username === 'admin' && pin === '0000') {
      return HttpResponse.json({
        token: 'mock-jwt-token-admin',
        user: mockAdminUser,
        expiresIn: 86400
      });
    }
    return HttpResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }),

  // ----- DOWNLOAD (URLs relativas) -----
  http.get('/api/download/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    return new HttpResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="partitura.pdf"'
      }
    });
  }),

  http.get('/api/download/parte/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    return new HttpResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="parte.pdf"'
      }
    });
  }),

  // ----- ESTATISTICAS (URL relativa) -----
  http.get('/api/estatisticas', () => {
    return HttpResponse.json({
      totalPartituras: 150,
      totalUsuarios: 45,
      downloadsHoje: 12
    });
  }),

  // ===== HANDLERS PARA URLs ABSOLUTAS (producao) =====
  // ----- AUTH -----
  http.post(`${API_BASE}/api/check-user`, async ({ request }) => {
    const { username } = await request.json();

    if (username === 'musico.teste') {
      return HttpResponse.json({
        exists: true,
        user: { nome: mockUser.nome, instrumento: mockUser.instrumento }
      });
    }

    if (username === 'admin') {
      return HttpResponse.json({
        exists: true,
        user: { nome: mockAdminUser.nome, instrumento: null }
      });
    }

    return HttpResponse.json({ exists: false });
  }),

  http.post(`${API_BASE}/api/login`, async ({ request }) => {
    const { username, pin } = await request.json();

    if (username === 'musico.teste' && pin === '1234') {
      return HttpResponse.json({
        token: 'mock-jwt-token-user',
        user: mockUser,
        expiresIn: 86400
      });
    }

    if (username === 'admin' && pin === '0000') {
      return HttpResponse.json({
        token: 'mock-jwt-token-admin',
        user: mockAdminUser,
        expiresIn: 86400
      });
    }

    return HttpResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }),

  // ----- PARTITURAS -----
  http.get(`${API_BASE}/api/partituras`, () => {
    return HttpResponse.json(mockSheets);
  }),

  http.get(`${API_BASE}/api/partituras/:id`, ({ params }) => {
    const sheet = mockSheets.find(s => s.id === parseInt(params.id));
    if (sheet) {
      return HttpResponse.json(sheet);
    }
    return HttpResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }),

  http.get(`${API_BASE}/api/partituras/:id/partes`, ({ params }) => {
    const partes = mockPartes.filter(p => p.partitura_id === parseInt(params.id));
    return HttpResponse.json(partes);
  }),

  // ----- FAVORITOS -----
  http.get(`${API_BASE}/api/favoritos`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([{ partitura_id: 1 }]);
  }),

  http.post(`${API_BASE}/api/favoritos/:id`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true, partitura_id: parseInt(params.id) });
  }),

  http.delete(`${API_BASE}/api/favoritos/:id`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ----- DOWNLOAD -----
  http.get(`${API_BASE}/api/download/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Simula retorno de PDF
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF header
    return new HttpResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="partitura.pdf"'
      }
    });
  }),

  http.get(`${API_BASE}/api/download/parte/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    return new HttpResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="parte.pdf"'
      }
    });
  }),

  // ----- HEALTH CHECK -----
  http.get(`${API_BASE}/api/health`, () => {
    return HttpResponse.json({ status: 'ok', timestamp: Date.now() });
  }),

  // ----- ESTATISTICAS -----
  http.get(`${API_BASE}/api/estatisticas`, () => {
    return HttpResponse.json({
      totalPartituras: 150,
      totalUsuarios: 45,
      downloadsHoje: 12
    });
  })
];

// ===== HANDLERS DE ERRO =====
// Use estes para simular cenarios de falha
export const errorHandlers = {
  networkError: http.get(`${API_BASE}/api/*`, () => {
    return HttpResponse.error();
  }),

  serverError: http.get(`${API_BASE}/api/*`, () => {
    return HttpResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }),

  unauthorized: http.get(`${API_BASE}/api/*`, () => {
    return HttpResponse.json(
      { error: 'Token expirado' },
      { status: 401 }
    );
  }),

  favoriteError: http.post(`${API_BASE}/api/favoritos/:id`, () => {
    return HttpResponse.json(
      { error: 'Erro ao favoritar' },
      { status: 500 }
    );
  })
};
