import { act, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockUseMediaQuery = jest.fn();

let mockTheme = 'dark';
let mockDiasEnsaio = { dias: [1], hora: 19 };
let mockModoRecesso = false;
let mockRepertorioAtivo = {
  nome: '100 Anos do Paço Municipal',
  data_apresentacao: '2026-04-07'
};

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    theme: mockTheme
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    diasEnsaio: mockDiasEnsaio,
    modoRecesso: mockModoRecesso,
    repertorioAtivo: mockRepertorioAtivo
  })
}));

jest.unstable_mockModule('@hooks/useMediaQuery', () => ({
  useMediaQuery: (...args) => mockUseMediaQuery(...args)
}));

jest.unstable_mockModule('./HeaderActions', () => ({
  default: () => null
}));

jest.unstable_mockModule('./LogoBadge', () => ({
  default: () => null
}));

const { default: HomeHeader } = await import('./HomeHeader.jsx');

describe('HomeHeader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-03T12:00:00-03:00'));

    mockUseMediaQuery.mockReturnValue(false);
    mockTheme = 'dark';
    mockDiasEnsaio = { dias: [1], hora: 19 };
    mockModoRecesso = false;
    mockRepertorioAtivo = {
      nome: '100 Anos do Paço Municipal',
      data_apresentacao: '2026-04-07'
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('prioriza o próximo ensaio e alterna para a próxima apresentação quando ambos existem', async () => {
    render(<HomeHeader userName="Antonio Silva" />);

    const stage = screen.getByTestId('musician-countdown-stage');

    expect(within(stage).getByText('Próximo ensaio')).toBeInTheDocument();
    expect(within(stage).getByText(/segund/i)).toBeInTheDocument();
    expect(within(stage).queryByText('100 Anos do Paço Municipal')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(within(stage).getByText('Próxima apresentação')).toBeInTheDocument();
    });

    expect(within(stage).getByText('100 Anos do Paço Municipal')).toBeInTheDocument();
  });

  test('alinha o countdown do mobile à esquerda para seguir a mesma coluna da saudação', () => {
    render(<HomeHeader userName="Antonio Silva" />);

    const stage = screen.getByTestId('musician-countdown-stage');
    const surface = stage.querySelector('[data-countdown-kind="rehearsal"]');
    const title = within(stage).getByText(/segund/i);

    expect(surface).not.toBeNull();
    expect(screen.getByTestId('musician-countdown').style.alignItems).toBe('flex-start');
    expect(stage.style.justifyContent).toBe('flex-start');
    expect(surface.style.alignItems).toBe('flex-start');
    expect(title.style.textAlign).toBe('left');
  });
});
