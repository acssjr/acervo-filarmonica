import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DownloadModal } from './RepertorioScreen';

describe('DownloadModal do repertório', () => {
  it('avisa as ausências e só baixa as partes disponíveis após confirmação', async () => {
    const onDownload = jest.fn().mockResolvedValue(undefined);
    const onCheckAvailability = jest.fn().mockResolvedValue({
      instrumento: 'Bombardino C',
      total: 2,
      disponiveis_count: 1,
      ausentes_count: 1,
      completo: false,
      disponiveis: [
        { id: 1, titulo: 'Marcha com C', ordem: 1, parte_id: 10, instrumento: 'Bombardino C' }
      ],
      ausentes: [
        { id: 2, titulo: 'Marcha somente Bb', ordem: 2, motivo: 'parte_ausente' }
      ]
    });

    render(
      <DownloadModal
        isOpen
        onClose={jest.fn()}
        sheets={[
          { id: 1, title: 'Marcha com C' },
          { id: 2, title: 'Marcha somente Bb' }
        ]}
        instruments={['Bombardino C', 'Bombardino Bb']}
        userInstrument=""
        downloading={false}
        onCheckAvailability={onCheckAvailability}
        onDownload={onDownload}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Bombardino C/ }));
    fireEvent.click(screen.getByRole('button', { name: 'PDF' }));

    expect(await screen.findByText('1 de 2 partituras disponíveis')).toBeInTheDocument();
    expect(screen.getAllByText(/Marcha somente Bb/)).toHaveLength(2);
    expect(screen.getByText('(parte não cadastrada)')).toBeInTheDocument();
    expect(screen.getByText(/não serão substituídas por outra tonalidade/)).toBeInTheDocument();
    expect(onDownload).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Baixar somente as 1 disponíveis' }));

    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith('pdf', 'Bombardino C', [1]);
    });
  });

  it('ignora a disponibilidade antiga quando o instrumento muda durante a consulta', async () => {
    let resolveFirstAvailability;
    const firstAvailability = new Promise(resolve => {
      resolveFirstAvailability = resolve;
    });
    const onDownload = jest.fn().mockResolvedValue(undefined);
    const onCheckAvailability = jest.fn()
      .mockReturnValueOnce(firstAvailability)
      .mockResolvedValueOnce({
        instrumento: 'Bombardino Bb',
        total: 2,
        disponiveis_count: 2,
        ausentes_count: 0,
        completo: true,
        disponiveis: [
          { id: 1, titulo: 'Marcha 1', ordem: 1, parte_id: 20, instrumento: 'Bombardino Bb' },
          { id: 2, titulo: 'Marcha 2', ordem: 2, parte_id: 21, instrumento: 'Bombardino Bb' }
        ],
        ausentes: []
      });

    render(
      <DownloadModal
        isOpen
        onClose={jest.fn()}
        sheets={[
          { id: 1, title: 'Marcha 1' },
          { id: 2, title: 'Marcha 2' }
        ]}
        instruments={['Bombardino C', 'Bombardino Bb']}
        userInstrument=""
        downloading={false}
        onCheckAvailability={onCheckAvailability}
        onDownload={onDownload}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bombardino C' }));
    fireEvent.click(screen.getByRole('button', { name: 'PDF' }));
    fireEvent.click(screen.getByRole('button', { name: /Bombardino C/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Bombardino Bb' }));

    await act(async () => {
      resolveFirstAvailability({
        instrumento: 'Bombardino C',
        total: 2,
        disponiveis_count: 1,
        ausentes_count: 1,
        completo: false,
        disponiveis: [
          { id: 1, titulo: 'Marcha 1', ordem: 1, parte_id: 10, instrumento: 'Bombardino C' }
        ],
        ausentes: [
          { id: 2, titulo: 'Marcha 2', ordem: 2, motivo: 'parte_ausente' }
        ]
      });
      await firstAvailability;
    });

    expect(screen.queryByText('1 de 2 partituras disponíveis')).not.toBeInTheDocument();
    expect(onDownload).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'PDF' }));

    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith('pdf', 'Bombardino Bb', [1, 2]);
    });
  });
});
