import { describe, expect, test } from '@jest/globals';
import { canExecutePendingAdminAction, shouldWaitForAdminTutorial } from './adminTutorial';

describe('controle do tutorial no upload administrativo', () => {
  test('abre o upload diretamente quando os tutoriais estão desativados', () => {
    expect(shouldWaitForAdminTutorial({
      tutoriaisAtivos: false,
      tutorialCompleted: false,
      isMobile: false
    })).toBe(false);
  });

  test('aguarda o tutorial no desktop quando ele está ativo e ainda não foi concluído', () => {
    expect(shouldWaitForAdminTutorial({
      tutoriaisAtivos: true,
      tutorialCompleted: false,
      isMobile: false
    })).toBe(true);
  });

  test('libera uma ação pendente se os tutoriais forem desativados', () => {
    expect(canExecutePendingAdminAction({
      loading: false,
      tutoriaisAtivos: false,
      tutorialCompleted: false,
      tutorialClosedThisSession: false,
      isMobile: false
    })).toBe(true);
  });

  test('libera uma ação pendente quando o viewport muda para mobile', () => {
    expect(canExecutePendingAdminAction({
      loading: false,
      tutoriaisAtivos: true,
      tutorialCompleted: false,
      tutorialClosedThisSession: false,
      isMobile: true
    })).toBe(true);
  });
});
