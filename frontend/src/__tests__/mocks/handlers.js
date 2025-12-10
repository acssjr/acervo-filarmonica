// ===== MSW HANDLERS =====
// Handlers para interceptar requisicoes de rede nos testes
// Seguindo o guia: MSW opera no nivel de rede, nao da aplicacao

import { http, HttpResponse } from 'msw';

// API_BASE pode ser vazio (localhost) ou a URL de producao
// MSW precisa interceptar ambos
const API_BASE_PROD = 'https://api.partituras25.com';

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
// Estrutura que o backend retorna (useLoginForm espera esses campos)
export const mockUser = {
  id: 1,
  username: 'musico.teste',
  nome: 'Músico Teste',
  admin: false,
  instrumento_nome: 'Trompete Bb 1',
  instrumento_id: 1,
  foto_url: null
};

export const mockAdminUser = {
  id: 2,
  username: 'admin',
  nome: 'Administrador',
  admin: true,
  instrumento_nome: null,
  instrumento_id: null,
  foto_url: null
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

export const mockCategorias = [
  { id: 1, nome: 'Dobrados', ordem: 1, total: 45 },
  { id: 2, nome: 'Marchas', ordem: 2, total: 32 },
  { id: 3, nome: 'Hinos', ordem: 3, total: 18 },
  { id: 4, nome: 'Valsas', ordem: 4, total: 12 },
  { id: 5, nome: 'Polcas', ordem: 5, total: 8 }
];

export const mockInstrumentos = [
  { id: 1, nome: 'Trompete Bb 1' },
  { id: 2, nome: 'Trompete Bb 2' },
  { id: 3, nome: 'Trompete Bb 3' },
  { id: 4, nome: 'Trombone 1' },
  { id: 5, nome: 'Trombone 2' },
  { id: 6, nome: 'Trombone 3' },
  { id: 7, nome: 'Bombardino Bb' },
  { id: 8, nome: 'Bombardino C' },
  { id: 9, nome: 'Tuba Bb' },
  { id: 10, nome: 'Tuba C' },
  { id: 11, nome: 'Clarinete Bb 1' },
  { id: 12, nome: 'Clarinete Bb 2' },
  { id: 13, nome: 'Clarinete Bb 3' },
  { id: 14, nome: 'Sax Alto Eb' },
  { id: 15, nome: 'Sax Tenor Bb' },
  { id: 16, nome: 'Flauta' },
  { id: 17, nome: 'Flautim' },
  { id: 18, nome: 'Percussao' },
  { id: 19, nome: 'Grade' }
];

export const mockUsuarios = [
  { id: 1, username: 'musico.teste', nome: 'Musico Teste', admin: false, instrumento_id: 1, instrumento_nome: 'Trompete Bb 1' },
  { id: 2, username: 'admin', nome: 'Administrador', admin: true, instrumento_id: null, instrumento_nome: null },
  { id: 3, username: 'joao.silva', nome: 'Joao Silva', admin: false, instrumento_id: 4, instrumento_nome: 'Trombone 1' }
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

  http.get('/api/favoritos/ids', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    // Retorna array de IDs de partituras favoritas
    return HttpResponse.json([1]);
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
  // Nota: o hook useLoginForm espera data.nome diretamente, nao data.user.nome
  http.post('/api/check-user', async ({ request }) => {
    const { username } = await request.json();
    if (username === 'musico.teste') {
      return HttpResponse.json({
        exists: true,
        nome: mockUser.nome,
        instrumento: mockUser.instrumento_nome
      });
    }
    if (username === 'admin') {
      return HttpResponse.json({
        exists: true,
        nome: mockAdminUser.nome,
        instrumento: null
      });
    }
    return HttpResponse.json({ exists: false });
  }),

  http.post('/api/login', async ({ request }) => {
    const { username, pin } = await request.json();
    if (username === 'musico.teste' && pin === '1234') {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token-user',
        user: mockUser,
        expiresIn: 86400
      });
    }
    if (username === 'admin' && pin === '0000') {
      return HttpResponse.json({
        success: true,
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

  // ----- ATIVIDADES (URL relativa) -----
  http.get('/api/atividades', () => {
    return HttpResponse.json([
      {
        id: 1,
        tipo: 'nova_partitura',
        titulo: 'Dobrado Novo',
        detalhes: 'Compositor X',
        criado_em: '2024-12-01T10:00:00Z'
      },
      {
        id: 2,
        tipo: 'nova_partitura',
        titulo: 'Marcha Nova',
        detalhes: 'Compositor Y',
        criado_em: '2024-12-02T10:00:00Z'
      }
    ]);
  }),

  // ----- MINHAS ATIVIDADES (URL relativa) -----
  http.get('/api/minhas-atividades', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([
      {
        id: 1,
        tipo: 'download',
        titulo: 'Dobrado Teste',
        detalhes: 'Trompete Bb 1',
        criado_em: '2024-12-01T10:00:00Z'
      }
    ]);
  }),

  // ----- CATEGORIAS (URL relativa) -----
  http.get('/api/categorias', () => {
    return HttpResponse.json(mockCategorias);
  }),

  http.post('/api/categorias', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ id: 6, ...data, ordem: 6, total: 0 });
  }),

  http.put('/api/categorias/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data });
  }),

  http.delete('/api/categorias/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/categorias/reorder', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ----- INSTRUMENTOS (URL relativa) -----
  http.get('/api/instrumentos', () => {
    return HttpResponse.json(mockInstrumentos);
  }),

  // ----- PERFIL (URL relativa) -----
  http.get('/api/perfil', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json(mockUser);
  }),

  http.put('/api/perfil', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ ...mockUser, ...data });
  }),

  http.post('/api/perfil/foto', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true, foto_url: 'https://example.com/foto.jpg' });
  }),

  // ----- CHANGE PIN (URL relativa) -----
  http.post('/api/change-pin', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const { currentPin, newPin } = await request.json();
    if (currentPin === '1234' && newPin && newPin.length === 4) {
      return HttpResponse.json({ success: true, token: 'new-mock-jwt-token' });
    }
    return HttpResponse.json({ error: 'PIN atual incorreto' }, { status: 400 });
  }),

  // ----- USUARIOS ADMIN (URL relativa) -----
  http.get('/api/usuarios', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json(mockUsuarios);
  }),

  http.get('/api/usuarios/:id', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const user = mockUsuarios.find(u => u.id === parseInt(params.id));
    if (user) {
      return HttpResponse.json(user);
    }
    return HttpResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }),

  http.post('/api/usuarios', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ id: 4, ...data });
  }),

  http.put('/api/usuarios/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data });
  }),

  http.delete('/api/usuarios/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ----- ADMIN ESTATISTICAS (URL relativa) -----
  http.get('/api/admin/estatisticas', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({
      totalPartituras: 150,
      totalUsuarios: 45,
      totalDownloads: 1234,
      downloadsHoje: 12,
      downloadsEstaSemana: 85,
      topPartituras: [
        { id: 1, titulo: 'Dobrado Teste', downloads: 45 },
        { id: 2, titulo: 'Marcha Exemplo', downloads: 32 }
      ]
    });
  }),

  // ----- PARTITURAS CRUD ADMIN (URL relativa) -----
  http.post('/api/partituras', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ id: 3, success: true });
  }),

  http.put('/api/partituras/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data, success: true });
  }),

  http.delete('/api/partituras/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/partituras/upload-pasta', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ id: 3, titulo: 'Nova Partitura', partes_count: 5, success: true });
  }),

  // ----- PARTES CRUD (URL relativa) -----
  http.post('/api/partituras/:partituraId/partes', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ id: 4, success: true });
  }),

  http.put('/api/partes/:id/substituir', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.delete('/api/partes/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ===== HANDLERS PARA URLs ABSOLUTAS (producao) =====
  // ----- AUTH -----
  http.post(`${API_BASE}/api/check-user`, async ({ request }) => {
    const { username } = await request.json();

    if (username === 'musico.teste') {
      return HttpResponse.json({
        exists: true,
        nome: mockUser.nome,
        instrumento: mockUser.instrumento_nome
      });
    }

    if (username === 'admin') {
      return HttpResponse.json({
        exists: true,
        nome: mockAdminUser.nome,
        instrumento: null
      });
    }

    return HttpResponse.json({ exists: false });
  }),

  http.post(`${API_BASE}/api/login`, async ({ request }) => {
    const { username, pin } = await request.json();

    if (username === 'musico.teste' && pin === '1234') {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token-user',
        user: mockUser,
        expiresIn: 86400
      });
    }

    if (username === 'admin' && pin === '0000') {
      return HttpResponse.json({
        success: true,
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

  http.get(`${API_BASE}/api/favoritos/ids`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([1]);
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
  }),

  // ----- ATIVIDADES -----
  http.get(`${API_BASE}/api/atividades`, () => {
    return HttpResponse.json([
      {
        id: 1,
        tipo: 'nova_partitura',
        titulo: 'Dobrado Novo',
        detalhes: 'Compositor X',
        criado_em: '2024-12-01T10:00:00Z'
      },
      {
        id: 2,
        tipo: 'nova_partitura',
        titulo: 'Marcha Nova',
        detalhes: 'Compositor Y',
        criado_em: '2024-12-02T10:00:00Z'
      }
    ]);
  }),

  // ----- MINHAS ATIVIDADES -----
  http.get(`${API_BASE}/api/minhas-atividades`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([
      { id: 1, tipo: 'download', titulo: 'Dobrado Teste', detalhes: 'Trompete Bb 1', criado_em: '2024-12-01T10:00:00Z' }
    ]);
  }),

  // ----- CATEGORIAS -----
  http.get(`${API_BASE}/api/categorias`, () => {
    return HttpResponse.json(mockCategorias);
  }),

  http.post(`${API_BASE}/api/categorias`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ id: 6, ...data, ordem: 6, total: 0 });
  }),

  http.put(`${API_BASE}/api/categorias/:id`, async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data });
  }),

  http.delete(`${API_BASE}/api/categorias/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE}/api/categorias/reorder`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
  }),

  // ----- INSTRUMENTOS -----
  http.get(`${API_BASE}/api/instrumentos`, () => {
    return HttpResponse.json(mockInstrumentos);
  }),

  // ----- PERFIL -----
  http.get(`${API_BASE}/api/perfil`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json(mockUser);
  }),

  http.put(`${API_BASE}/api/perfil`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ ...mockUser, ...data });
  }),

  http.post(`${API_BASE}/api/perfil/foto`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true, foto_url: 'https://example.com/foto.jpg' });
  }),

  // ----- CHANGE PIN -----
  http.post(`${API_BASE}/api/change-pin`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const { currentPin, newPin } = await request.json();
    if (currentPin === '1234' && newPin && newPin.length === 4) {
      return HttpResponse.json({ success: true, token: 'new-mock-jwt-token' });
    }
    return HttpResponse.json({ error: 'PIN atual incorreto' }, { status: 400 });
  }),

  // ----- USUARIOS ADMIN -----
  http.get(`${API_BASE}/api/usuarios`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json(mockUsuarios);
  }),

  http.get(`${API_BASE}/api/usuarios/:id`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const user = mockUsuarios.find(u => u.id === parseInt(params.id));
    return user ? HttpResponse.json(user) : HttpResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }),

  http.post(`${API_BASE}/api/usuarios`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ id: 4, ...data });
  }),

  http.put(`${API_BASE}/api/usuarios/:id`, async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data });
  }),

  http.delete(`${API_BASE}/api/usuarios/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
  }),

  // ----- ADMIN ESTATISTICAS -----
  http.get(`${API_BASE}/api/admin/estatisticas`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({
      totalPartituras: 150, totalUsuarios: 45, totalDownloads: 1234,
      downloadsHoje: 12, downloadsEstaSemana: 85,
      topPartituras: [{ id: 1, titulo: 'Dobrado Teste', downloads: 45 }]
    });
  }),

  // ----- PARTITURAS CRUD ADMIN -----
  http.post(`${API_BASE}/api/partituras`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ id: 3, success: true });
  }),

  http.put(`${API_BASE}/api/partituras/:id`, async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const data = await request.json();
    return HttpResponse.json({ id: parseInt(params.id), ...data, success: true });
  }),

  http.delete(`${API_BASE}/api/partituras/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE}/api/partituras/upload-pasta`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ id: 3, titulo: 'Nova Partitura', partes_count: 5, success: true });
  }),

  // ----- PARTES CRUD -----
  http.post(`${API_BASE}/api/partituras/:partituraId/partes`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ id: 4, success: true });
  }),

  http.put(`${API_BASE}/api/partes/:id/substituir`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
  }),

  http.delete(`${API_BASE}/api/partes/:id`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return HttpResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json({ success: true });
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
