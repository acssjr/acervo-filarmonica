import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    fireEvent.click(screen.getByRole('button', { name: 'Bombardino C' }));
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
});
