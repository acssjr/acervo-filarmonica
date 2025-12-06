// ===== LOGIN E2E TESTS =====
// Testes end-to-end do fluxo de autenticacao
// Usa o backend real (producao ou local)

import { test, expect } from '@playwright/test';

// Credenciais de teste - usuario real
const TEST_USER = {
  username: 'antoniojunior',
  pin: '1234'
};

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Limpa localStorage antes de cada teste
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('exibe pagina inicial com botao de login', async ({ page }) => {
    await page.goto('/');

    // Deve mostrar botao de login ou area de usuario
    await expect(page.locator('text=Entrar').or(page.locator('text=Login'))).toBeVisible({ timeout: 10000 });
  });

  test('exibe formulario de login com campos corretos', async ({ page }) => {
    await page.goto('/');

    // Clica no botao de login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    // Aguarda o formulario aparecer
    await expect(page.locator('input[placeholder="seuusuario"]')).toBeVisible({ timeout: 5000 });

    // Verifica campos presentes
    await expect(page.locator('text=Usuario')).toBeVisible();
    await expect(page.locator('text=PIN')).toBeVisible();
    await expect(page.locator('text=Lembrar meu acesso')).toBeVisible();
  });

  test('valida usuario existente ao digitar', async ({ page }) => {
    await page.goto('/');

    // Abre o login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda a verificacao do usuario (debounce de 300ms + API)
    // Deve aparecer o nome do usuario ou indicador verde
    await expect(page.locator('.check-icon, [data-user-found="true"]').or(
      page.locator('text=/Antonio|Junior/i')
    )).toBeVisible({ timeout: 5000 });
  });

  test('realiza login com sucesso', async ({ page }) => {
    await page.goto('/');

    // Abre o login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await page.waitForTimeout(500);

    // Digita o PIN (4 inputs separados)
    const pinInputs = page.locator('input[type="password"]');
    await pinInputs.nth(0).fill(TEST_USER.pin[0]);
    await pinInputs.nth(1).fill(TEST_USER.pin[1]);
    await pinInputs.nth(2).fill(TEST_USER.pin[2]);
    await pinInputs.nth(3).fill(TEST_USER.pin[3]);

    // Aguarda o login completar e o toast aparecer
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 });

    // Verifica que o formulario de login fechou
    await expect(page.locator('input[placeholder="seuusuario"]')).not.toBeVisible();
  });

  test('mostra erro com PIN incorreto', async ({ page }) => {
    await page.goto('/');

    // Abre o login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await page.waitForTimeout(500);

    // Digita PIN incorreto
    const pinInputs = page.locator('input[type="password"]');
    await pinInputs.nth(0).fill('9');
    await pinInputs.nth(1).fill('9');
    await pinInputs.nth(2).fill('9');
    await pinInputs.nth(3).fill('9');

    // Deve mostrar erro
    await expect(page.locator('text=/incorreto|invalido|erro/i')).toBeVisible({ timeout: 5000 });
  });

  test('mantem sessao apos refresh quando lembrar-me ativo', async ({ page }) => {
    await page.goto('/');

    // Abre o login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    // Marca lembrar-me
    const rememberCheckbox = page.locator('input[type="checkbox"]').or(
      page.locator('text=Lembrar meu acesso')
    );
    await rememberCheckbox.click();

    // Faz login
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    await page.waitForTimeout(500);

    const pinInputs = page.locator('input[type="password"]');
    await pinInputs.nth(0).fill(TEST_USER.pin[0]);
    await pinInputs.nth(1).fill(TEST_USER.pin[1]);
    await pinInputs.nth(2).fill(TEST_USER.pin[2]);
    await pinInputs.nth(3).fill(TEST_USER.pin[3]);

    // Aguarda login
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 });

    // Faz refresh
    await page.reload();

    // Deve continuar logado (nao aparece botao de login)
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Entrar')).not.toBeVisible();
  });
});

test.describe('Navigation after Login', () => {
  test.beforeEach(async ({ page }) => {
    // Faz login antes de cada teste
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Login
    await page.locator('text=Entrar').or(page.locator('text=Login')).click();

    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    await page.waitForTimeout(500);

    const pinInputs = page.locator('input[type="password"]');
    await pinInputs.nth(0).fill(TEST_USER.pin[0]);
    await pinInputs.nth(1).fill(TEST_USER.pin[1]);
    await pinInputs.nth(2).fill(TEST_USER.pin[2]);
    await pinInputs.nth(3).fill(TEST_USER.pin[3]);

    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 10000 });
  });

  test('pode navegar para o acervo', async ({ page }) => {
    // Clica em Acervo ou Partituras
    await page.locator('text=Acervo').or(page.locator('text=Partituras')).first().click();

    // Deve mostrar as categorias ou partituras
    await expect(page.locator('text=/Dobrados|Marchas|Hinos/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('pode fazer logout', async ({ page }) => {
    // Procura e clica no botao de logout
    const logoutButton = page.locator('[aria-label="Sair"]').or(
      page.locator('text=Sair')
    ).or(page.locator('button:has-text("logout")'));

    await logoutButton.click();

    // Deve voltar a mostrar botao de login
    await expect(page.locator('text=Entrar').or(page.locator('text=Login'))).toBeVisible({ timeout: 5000 });
  });
});
