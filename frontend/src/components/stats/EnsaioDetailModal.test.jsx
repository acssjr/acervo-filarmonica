import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockGetPartiturasEnsaio = jest.fn();
const mockUseMediaQuery = jest.fn();
const mockUseScrollLock = jest.fn();

jest.unstable_mockModule('@services/api', () => ({
  API: {
    getPartiturasEnsaio: (...args) => mockGetPartiturasEnsaio(...args)
  }
}));

jest.unstable_mockModule('@hooks/useMediaQuery', () => ({
  useMediaQuery: (...args) => mockUseMediaQuery(...args)
}));

jest.unstable_mockModule('@hooks/useScrollLock', () => ({
  useScrollLock: (...args) => mockUseScrollLock(...args)
}));

const { render, screen, waitFor } = await import('@testing-library/react');
const { default: EnsaioDetailModal } = await import('./EnsaioDetailModal.jsx');

const createDeferred = () => {
  let resolve;
  const promise = new Promise((res) => {
    resolve = res;
  });

  return { promise, resolve };
};

const mockEnsaio = {
  data_ensaio: '2026-04-01',
  dia_semana: 'Qua',
  usuario_presente: 1,
  numero_ensaio: 21
};

describe('EnsaioDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
  });

  test('abre com folha mobile estável durante o loading e mantém a mesma altura após carregar', async () => {
    const deferred = createDeferred();
    mockGetPartiturasEnsaio.mockReturnValue(deferred.promise);

    render(<EnsaioDetailModal ensaio={mockEnsaio} isOpen onClose={jest.fn()} />);

    const dialog = await screen.findByRole('dialog');
    const panel = screen.getByTestId('ensaio-detail-panel');
    const scrollArea = screen.getByTestId('ensaio-detail-scroll-area');

    expect(dialog).toBeInTheDocument();
    expect(panel).toHaveStyle('height: clamp(480px, 68dvh, 640px)');
    expect(panel).toHaveStyle('max-height: 90dvh');
    expect(scrollArea).toHaveStyle('min-height: 0');
    expect(screen.queryByText(/partitura tocada/i)).not.toBeInTheDocument();

    deferred.resolve({
      partituras: [
        {
          id: 1,
          titulo: 'Pref. José Ronaldo',
          compositor: 'Heráclio Guerreiro',
          categoria_nome: 'Dobrados',
          categoria_cor: '#f97316'
        }
      ],
      youtube_url: null
    });

    await waitFor(() => {
      expect(screen.getByText('1 partitura tocada')).toBeInTheDocument();
    });

    expect(panel).toHaveStyle('height: clamp(480px, 68dvh, 640px)');
  });

  test('usa backdrop mais leve com blur para preservar o contexto visual atrás do modal', async () => {
    mockGetPartiturasEnsaio.mockResolvedValue({
      partituras: [],
      youtube_url: null
    });

    render(<EnsaioDetailModal ensaio={mockEnsaio} isOpen onClose={jest.fn()} />);

    const backdrop = await screen.findByTestId('ensaio-detail-backdrop');

    expect(backdrop).toHaveStyle('background: linear-gradient(180deg, rgba(7, 10, 16, 0.08) 0%, rgba(7, 10, 16, 0.14) 46%, rgba(7, 10, 16, 0.22) 100%)');
    expect(backdrop.style.backdropFilter).toBe('blur(18px) saturate(110%)');
  });
});
