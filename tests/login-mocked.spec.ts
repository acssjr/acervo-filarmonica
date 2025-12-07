// ===== LOGIN E2E TESTS (COM MOCKS) =====
// Testes end-to-end do fluxo de autenticacao
// Usa mocks - pode rodar no CI sem backend

import { test, expect } from '@playwright/test';
import { setupApiMocks, mockUser, loginWithMocks } from './mocks/api-mocks';

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
    await expect(page.locator('text=Usuário')).toBeVisible();
    await expect(page.locator('text=PIN')).toBeVisible();
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
    await page.waitForTimeout(500);

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

    // Aguarda o login completar e o toast aparecer
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 });

    // Deve redirecionar para a home
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('mostra erro com PIN incorreto', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await page.waitForTimeout(500);

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
    await page.waitForTimeout(1000);

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

    // Aguarda login completar
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 });

    // Aguarda redirecionamento
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('exibe home apos login', async ({ page }) => {
    // Verifica que esta na home (nao no login)
    expect(page.url()).not.toContain('/login');
  });

  test('pode acessar categorias/acervo', async ({ page }) => {
    // Procura link para acervo
    const acervoLink = page.locator('text=Acervo').or(page.locator('text=Partituras')).or(page.locator('[aria-label*="Acervo"]'));

    if (await acervoLink.count() > 0) {
      await acervoLink.first().click();

      // Deve mostrar categorias mockadas
      await expect(page.locator('text=/Dobrados|Marchas|Hinos/i').first()).toBeVisible({ timeout: 5000 });
    }
  });
});
