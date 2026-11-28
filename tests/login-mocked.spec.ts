// ===== LOGIN E2E TESTS (COM MOCKS) =====
// Testes end-to-end do fluxo de autenticacao
// Usa mocks - pode rodar no CI sem backend

import { test, expect } from '@playwright/test';
import { assertApiRequestsWereMocked, setupApiMocks, mockUser, loginWithMocks } from './mocks/api-mocks';

test.afterEach(({ page }) => assertApiRequestsWereMocked(page));

// Credenciais de teste - usuario mock
const TEST_USER = {
  username: 'musico.teste',
  pin: '1234'
};

test.describe('Login Flow (Mocked)', () => {
  test.beforeEach(async ({ page }) => {
    // Configura mocks ANTES de navegar
    await setupApiMocks(page);

    // Limpa localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('redireciona para tela de login quando nao autenticado', async ({ page }) => {
    await page.goto('/');

    // Deve redirecionar para /login
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('exibe formulario de login com campos corretos', async ({ page }) => {
    await page.goto('/login');

    // Aguarda o formulario aparecer
    await expect(page.locator('input[placeholder="seuusuario"]')).toBeVisible({ timeout: 10000 });

    // Verifica campos presentes
    await expect(page.getByText('Usuário', { exact: true })).toBeVisible();
    await expect(page.getByText('PIN', { exact: true })).toBeVisible();
    await expect(page.locator('text=Lembrar meu acesso')).toBeVisible();
  });

  test('valida usuario existente ao digitar', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda a verificacao do usuario (debounce de 300ms + API mockada)
    // Deve aparecer o nome do usuario ou indicador verde
    await expect(page.locator('.check-icon, [data-user-found="true"]').or(
      page.locator(`text=${mockUser.nome}`)
    )).toBeVisible({ timeout: 5000 });
  });

  test('realiza login com sucesso', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await expect(page.getByText(`Olá, ${mockUser.nome}`, { exact: true })).toBeVisible();

    // Digita o PIN
    const pinInputs = page.locator('input[type="password"]');
    const count = await pinInputs.count();

    if (count === 4) {
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill(TEST_USER.pin[i]);
      }
    } else if (count === 1) {
      await pinInputs.first().fill(TEST_USER.pin);
    }

    // Aguarda o login completar - toast ou redirecionamento
    await Promise.race([
      expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 }),
      page.waitForURL('**/', { timeout: 10000 })
    ]);

    // Deve redirecionar para a home
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('mostra erro com PIN incorreto', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await expect(page.getByText(`Olá, ${mockUser.nome}`, { exact: true })).toBeVisible();

    // Digita PIN incorreto
    const pinInputs = page.locator('input[type="password"]');
    const count = await pinInputs.count();

    if (count === 4) {
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill('9');
      }
    } else if (count === 1) {
      await pinInputs.first().fill('9999');
    }

    // Deve mostrar erro
    await expect(page.locator('text=/incorreto|invalido|erro/i')).toBeVisible({ timeout: 5000 });
  });

  test('mostra mensagem para usuario inexistente', async ({ page }) => {
    await page.goto('/login');

    // Digita username que nao existe
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill('usuario.inexistente');

    // Aguarda verificacao
    await expect(page.getByText('Não encontrado', { exact: true })).toBeVisible();

    // Nao deve mostrar indicador de usuario encontrado
    await expect(page.locator('.check-icon, [data-user-found="true"]')).not.toBeVisible();
  });
});

test.describe('Navigation after Login (Mocked)', () => {
  test.beforeEach(async ({ page }) => {
    // Configura mocks
    await setupApiMocks(page);

    // Faz login
    await loginWithMocks(page, { username: TEST_USER.username, pin: TEST_USER.pin });

    // Aguarda login completar - toast ou redirecionamento
    await Promise.race([
      expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 }),
      page.waitForURL('**/', { timeout: 10000 })
    ]);

    // Aguarda redirecionamento
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('exibe home apos login', async ({ page }) => {
    // Verifica que esta na home (nao no login)
    expect(page.url()).not.toContain('/login');
  });

  test('abre a partitura de um link e mostra apenas as partes cadastradas', async ({ page }) => {
    await page.route('**/api/partituras/1/partes', route => route.fulfill({
      json: [
        { id: 11, instrumento: 'Grade' },
        { id: 12, instrumento: 'Trompa F' },
      ],
    }));
    await page.goto('/acervo/dobrados/1');
    const sheet = page.getByRole('dialog', { name: 'Dobrado Bandeirantes' });
    await expect(sheet).toBeVisible();
    await sheet.getByRole('button', { name: 'Outro Instrumento' }).click();
    await expect(sheet.getByRole('option')).toHaveCount(2);
    await expect(sheet.getByRole('button', { name: 'Oboé', exact: true })).toHaveCount(0);
    await expect(sheet.getByRole('button', { name: 'Trompa F', exact: true })).toBeVisible();
    await expect(sheet.getByRole('button', { name: 'Grade', exact: true })).toBeVisible();
  });
});

test('abre as partes do link compartilhado com usuário salvo sem sessão e favoritos pendentes', async ({ page }) => {
  await setupApiMocks(page);
  await page.addInitScript(() => {
    localStorage.setItem('fil_version', '7');
    localStorage.setItem('fil_user', JSON.stringify({
      id: 1, username: 'musico.teste', name: 'Musico Teste', instrument: 'Trompete Bb 1'
    }));
    localStorage.removeItem('fil_authToken');
  });

  let releaseFavorites!: () => void;
  const favoritesReady = new Promise<void>(resolve => { releaseFavorites = resolve; });
  await page.route('**/api/favoritos/ids', async (route) => {
    await favoritesReady;
    await route.fulfill({ json: [] });
  });
  const partsStatuses: number[] = [];
  await page.route('**/api/partituras/1/partes', async (route) => {
    const partsStatus = route.request().headers().authorization ? 200 : 401;
    partsStatuses.push(partsStatus);
    if (partsStatus === 401) {
      await route.fulfill({ status: 401, json: { error: 'Não autorizado' } });
      return;
    }
    await route.fulfill({ json: [{ id: 11, instrumento: 'Trompete Bb 1' }] });
  });

  try {
    await page.goto('/acervo/dobrados/1');
    await expect(page).toHaveURL(/\/login$/, { timeout: 12000 });
    const sheet = page.getByRole('dialog', { name: 'Dobrado Bandeirantes' });
    await expect(sheet).toHaveCount(0);
    expect(partsStatuses).toEqual([]);
    await page.getByPlaceholder('seuusuario').fill(TEST_USER.username);
    await expect(page.getByText('Olá, Musico Teste', { exact: true })).toBeVisible();
    for (const [index, digit] of [...TEST_USER.pin].entries()) {
      await page.locator('input[type="password"]').nth(index).fill(digit);
    }

    await expect(page).toHaveURL(/\/acervo\/dobrados\/1$/, { timeout: 5000 });
    await expect(sheet).toBeVisible();
    await sheet.getByRole('button', { name: 'Outro Instrumento' }).click();
    await expect(sheet.getByRole('option', { name: /Trompete Bb 1/ })).toBeVisible();
    expect(partsStatuses).toEqual([200]);
    await expect(page.getByText('Não foi possível carregar as partes desta obra.')).toHaveCount(0);
  } finally {
    releaseFavorites();
  }
});