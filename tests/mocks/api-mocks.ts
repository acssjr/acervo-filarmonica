// ===== PLAYWRIGHT API MOCKS =====
// Mocks para interceptar requisicoes de API nos testes E2E
// Permite rodar testes sem backend real

import { Page } from '@playwright/test';

// ===== DADOS MOCK =====
export const mockUser = {
  id: 1,
  username: 'musico.teste',
  nome: 'Musico Teste',
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

export const mockCategorias = [
  { id: 1, nome: 'Dobrados', total: 45 },
  { id: 2, nome: 'Marchas', total: 32 },
  { id: 3, nome: 'Hinos', total: 18 },
  { id: 4, nome: 'Valsas', total: 12 }
];

export const mockPartituras = [
  {
    id: 1,
    titulo: 'Dobrado Bandeirantes',
    compositor: 'Anacleto Medeiros',
    categoria_id: 1,
    categoria_nome: 'Dobrados',
    criado_em: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    titulo: 'Marcha Soldado',
    compositor: 'Tertuliano Santos',
    categoria_id: 2,
    categoria_nome: 'Marchas',
    criado_em: '2024-02-01T00:00:00Z'
  }
];

// ===== SETUP MOCKS =====
export async function setupApiMocks(page: Page, options: {
  user?: typeof mockUser | typeof mockAdminUser;
  authenticated?: boolean;
} = {}) {
  const { user = mockUser, authenticated = true } = options;

  // ----- CHECK USER -----
  await page.route('**/api/check-user', async (route) => {
    const request = route.request();
    const body = request.postDataJSON();

    if (body?.username === 'musico.teste') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          exists: true,
          nome: mockUser.nome,
          instrumento: mockUser.instrumento_nome
        })
      });
    } else if (body?.username === 'admin') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          exists: true,
          nome: mockAdminUser.nome,
          instrumento: null
        })
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: false })
      });
    }
  });

  // ----- LOGIN -----
  await page.route('**/api/login', async (route) => {
    const request = route.request();
    const body = request.postDataJSON();

    if (body?.username === 'musico.teste' && body?.pin === '1234') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token-user',
          user: mockUser,
          expiresIn: 86400
        })
      });
    } else if (body?.username === 'admin' && body?.pin === '0000') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token-admin',
          user: mockAdminUser,
          expiresIn: 86400
        })
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'PIN incorreto' })
      });
    }
  });

  // ----- CATEGORIAS -----
  await page.route('**/api/categorias', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCategorias)
    });
  });

  // ----- PARTITURAS -----
  await page.route('**/api/partituras', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPartituras)
    });
  });

  await page.route('**/api/partituras/*', async (route) => {
    const url = route.request().url();
    const id = parseInt(url.split('/').pop() || '0');
    const partitura = mockPartituras.find(p => p.id === id);

    if (partitura) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(partitura)
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nao encontrado' })
      });
    }
  });

  // ----- FAVORITOS -----
  await page.route('**/api/favoritos/ids', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([1]) // Partitura 1 e favorita
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nao autorizado' })
      });
    }
  });

  await page.route('**/api/favoritos', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ partitura_id: 1 }])
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nao autorizado' })
      });
    }
  });

  // ----- ESTATISTICAS -----
  await page.route('**/api/estatisticas', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalPartituras: 150,
        totalUsuarios: 45,
        downloadsHoje: 12
      })
    });
  });

  // ----- ATIVIDADES (Admin) -----
  await page.route('**/api/atividades*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, tipo: 'download', titulo: 'Dobrado Teste', usuario_nome: 'Joao Silva', criado_em: new Date().toISOString() },
        { id: 2, tipo: 'upload', titulo: 'Marcha Nova', usuario_nome: 'Admin', criado_em: new Date(Date.now() - 3600000).toISOString() }
      ])
    });
  });

  // ----- HEALTH CHECK -----
  await page.route('**/api/health', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', timestamp: Date.now() })
    });
  });
}

// ===== HELPER: Login com mocks =====
export async function loginWithMocks(page: Page, options: {
  username?: string;
  pin?: string;
} = {}) {
  const { username = 'musico.teste', pin = '1234' } = options;

  // Vai para login
  await page.goto('/login');

  // Digita username
  const usernameInput = page.locator('input[placeholder="seuusuario"]');
  await usernameInput.fill(username);

  // Aguarda validacao
  await page.waitForTimeout(500);

  // Digita PIN
  const pinInputs = page.locator('input[type="password"]');
  const count = await pinInputs.count();

  if (count === 4) {
    for (let i = 0; i < 4; i++) {
      await pinInputs.nth(i).fill(pin[i]);
    }
  } else if (count === 1) {
    await pinInputs.first().fill(pin);
  }
}
