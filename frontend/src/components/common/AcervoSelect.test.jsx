import { describe, test, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import AcervoSelect from './AcervoSelect';

describe('seletor do acervo', () => {
  test('busca sem acentos, escolhe opção e devolve foco ao controle', () => {
    const change = jest.fn();
    render(<AcervoSelect ariaLabel="Partitura" value="" searchable onChange={change} options={[{ value: '1', label: 'Canção' }, { value: '2', label: 'Marcha' }]} />);
    const control = screen.getByRole('combobox');
    fireEvent.click(control);
    const search = screen.getByRole('searchbox');
    expect(search).toHaveFocus();
    fireEvent.change(search, { target: { value: 'cancao' } });
    expect(screen.queryByRole('option', { name: 'Marcha' })).not.toBeInTheDocument();
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith('1');
    expect(control).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  test('teclado navega e Escape fecha só o seletor; clique externo fecha', () => {
    const change = jest.fn();
    const escape = jest.fn();
    render(<div onKeyDown={escape}><AcervoSelect ariaLabel="Categoria" value="1" onChange={change} options={[{ value: '1', label: 'Marchas' }, { value: '2', label: 'Dobrados' }]} /></div>);
    const control = screen.getByRole('combobox');
    fireEvent.keyDown(control, { key: 'ArrowDown' });
    fireEvent.keyDown(control, { key: 'ArrowDown' });
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith('2');
    fireEvent.click(control);
    fireEvent.keyDown(control, { key: 'Escape' });
    expect(escape).not.toHaveBeenCalled();
    fireEvent.click(control);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
