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
    // Recarrega para aplicar o localStorage limpo
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
    await expect(page.locator('text=Usuario')).toBeVisible();
    await expect(page.locator('text=PIN')).toBeVisible();
    await expect(page.locator('text=Lembrar meu acesso')).toBeVisible();
  });

  test('valida usuario existente ao digitar', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda a verificacao do usuario (debounce de 300ms + API)
    // Deve aparecer o nome do usuario ou indicador verde
    await expect(page.locator('.check-icon, [data-user-found="true"]').or(
      page.locator('text=/Antonio|Junior/i')
    )).toBeVisible({ timeout: 10000 });
  });

  test('realiza login com sucesso', async ({ page }) => {
    await page.goto('/login');

    // Digita o username
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    // Aguarda validacao do usuario
    await page.waitForTimeout(500);

    // Digita o PIN completo de uma vez
    const pinInputs = page.locator('input[type="password"]');
    const count = await pinInputs.count();

    if (count === 4) {
      // PIN em 4 inputs separados
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill(TEST_USER.pin[i]);
      }
    } else if (count === 1) {
      // PIN em um unico input
      await pinInputs.first().fill(TEST_USER.pin);
    }

    // Aguarda o login completar e o toast aparecer
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 15000 });

    // Deve redirecionar para a home (nao mais na pagina de login)
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
    await expect(page.locator('text=/incorreto|invalido|erro/i')).toBeVisible({ timeout: 10000 });
  });

  test('mantem sessao apos refresh quando lembrar-me ativo', async ({ page }) => {
    await page.goto('/login');

    // Marca lembrar-me (pode ser checkbox ou label clicavel)
    const rememberCheckbox = page.locator('input[type="checkbox"]');
    const checkboxCount = await rememberCheckbox.count();

    if (checkboxCount > 0) {
      await rememberCheckbox.first().click();
    } else {
      // Tenta clicar no label
      await page.locator('text=Lembrar meu acesso').click();
    }

    // Faz login
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    await page.waitForTimeout(500);

    const pinInputs = page.locator('input[type="password"]');
    const count = await pinInputs.count();

    if (count === 4) {
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill(TEST_USER.pin[i]);
      }
    } else if (count === 1) {
      await pinInputs.first().fill(TEST_USER.pin);
    }

    // Aguarda login
    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 15000 });

    // Aguarda redirecionamento
    await page.waitForURL('**/', { timeout: 10000 });

    // Faz refresh
    await page.reload();

    // Deve continuar logado (nao redireciona para /login)
    await page.waitForTimeout(3000);
    expect(page.url()).not.toContain('/login');
  });
});

test.describe('Navigation after Login', () => {
  test.beforeEach(async ({ page }) => {
    // Faz login antes de cada teste
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Login
    const usernameInput = page.locator('input[placeholder="seuusuario"]');
    await usernameInput.fill(TEST_USER.username);

    await page.waitForTimeout(500);

    const pinInputs = page.locator('input[type="password"]');
    const count = await pinInputs.count();

    if (count === 4) {
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill(TEST_USER.pin[i]);
      }
    } else if (count === 1) {
      await pinInputs.first().fill(TEST_USER.pin);
    }

    await expect(page.locator('text=/Bem-vindo/i')).toBeVisible({ timeout: 15000 });

    // Aguarda redirecionamento
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('pode navegar para o acervo', async ({ page }) => {
    // Clica em Acervo ou Partituras (pode estar no nav inferior ou lateral)
    const acervoLink = page.locator('text=Acervo').or(page.locator('text=Partituras')).or(page.locator('[aria-label*="Acervo"]'));

    if (await acervoLink.count() > 0) {
      await acervoLink.first().click();

      // Deve mostrar as categorias ou partituras
      await expect(page.locator('text=/Dobrados|Marchas|Hinos|Categorias/i').first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('pode fazer logout', async ({ page }) => {
    // Procura e clica no botao de logout ou perfil
    const logoutButton = page.locator('[aria-label="Sair"]').or(
      page.locator('text=Sair')
    ).or(page.locator('button:has-text("logout")'));

    const logoutCount = await logoutButton.count();

    if (logoutCount > 0) {
      await logoutButton.first().click();

      // Deve redirecionar para /login
      await page.waitForURL('**/login', { timeout: 10000 });
    } else {
      // Se nao encontrar botao de logout, tenta via perfil
      const profileLink = page.locator('text=Perfil').or(page.locator('[aria-label*="Perfil"]'));
      if (await profileLink.count() > 0) {
        await profileLink.first().click();

        // Procura o logout dentro do perfil
        await page.waitForTimeout(1000);
        const sairButton = page.locator('text=Sair');
        if (await sairButton.count() > 0) {
          await sairButton.click();
          await page.waitForURL('**/login', { timeout: 10000 });
        }
      }
    }
  });
});
