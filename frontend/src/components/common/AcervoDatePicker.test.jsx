import { describe, test, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import AcervoDatePicker from './AcervoDatePicker';
describe('calendário do acervo', () => {
  test('seleciona data bissexta e mantém formato da API', () => {
    const change = jest.fn();
    render(<AcervoDatePicker ariaLabel="Data" value="2024-02-01" onChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'Escolher data' }));
    fireEvent.click(screen.getByRole('button', { name: '29 de fevereiro de 2024' }));
    expect(change).toHaveBeenCalledWith('2024-02-29');
    expect(screen.getByRole('textbox')).toHaveValue('29/02/2024');
    expect(screen.getByRole('button', { name: 'Escolher data' })).toHaveFocus();
  });
  test('digitação não envia data inválida e aceita limpar', () => {
    const change = jest.fn();
    render(<AcervoDatePicker value="2026-09-30" onChange={change} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '31/02/2026' } });
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '15/10/2026' } });
    expect(change).toHaveBeenCalledWith('2026-10-15');
    fireEvent.click(screen.getByRole('button', { name: 'Escolher data' }));
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(change).toHaveBeenLastCalledWith('');
  });
});
