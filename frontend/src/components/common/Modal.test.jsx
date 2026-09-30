import { describe, test, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('foco no modal', () => {
  test('Tab fecha o ciclo no último controle navegável, ignorando tabindex negativo e rádios não selecionados', () => {
    const visible = jest.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockReturnValue(document.body);
    try {
      render(<Modal isOpen onClose={() => {}} title="Teste"><button>Último botão</button><input type="radio" name="grupo" aria-label="Selecionado" defaultChecked /><input type="radio" name="grupo" aria-label="Não selecionado" /><button tabIndex={-1}>Ignorado</button></Modal>);
      const first = screen.getByRole('dialog').querySelector('button');
      screen.getByRole('radio', { name: 'Selecionado', exact: true }).focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(first).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(screen.getByRole('radio', { name: 'Selecionado', exact: true })).toHaveFocus();
    } finally { visible.mockRestore(); }
  });
});
