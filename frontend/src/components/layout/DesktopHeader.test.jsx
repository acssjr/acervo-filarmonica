import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';

let mockTheme = 'dark';
let mockDiasEnsaio = { dias: [1], hora: 19 };
let mockModoRecesso = false;
let mockRepertorioAtivo = {
  nome: '100 Anos do Paco Municipal',
  data_apresentacao: '2026-04-07'
};

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    theme: mockTheme,
    setShowNotifications: jest.fn()
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: [],
    favoritesSet: new Set(),
    toggleFavorite: jest.fn(),
    categoriesMap: new Map(),
    diasEnsaio: mockDiasEnsaio,
    modoRecesso: mockModoRecesso,
    repertorioAtivo: mockRepertorioAtivo
  })
}));

jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { isAdmin: false }
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({
    unreadCount: 0
  })
}));

jest.unstable_mockModule('@constants/icons', () => ({
  Icons: {
    Bell: () => null,
    Key: () => null,
    Heart: () => null
  }
}));

jest.unstable_mockModule('@hooks/useBellAnimation', () => ({
  useBellAnimation: () => {}
}));

jest.unstable_mockModule('@components/common/CategoryIcon', () => ({
  default: () => null
}));

jest.unstable_mockModule('@components/common/ThemePill', () => ({
  default: () => null
}));

const { default: DesktopHeader } = await import('./DesktopHeader.jsx');

describe('DesktopHeader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-03T12:00:00-03:00'));

    mockTheme = 'dark';
    mockDiasEnsaio = { dias: [1], hora: 19 };
    mockModoRecesso = false;
    mockRepertorioAtivo = {
      nome: '100 Anos do Paco Municipal',
      data_apresentacao: '2026-04-07'
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('prioriza o próximo ensaio e alterna para a próxima apresentação quando ambos existem', async () => {
    render(
      <MemoryRouter>
        <DesktopHeader />
      </MemoryRouter>
    );

    const stage = screen.getByTestId('musician-countdown-stage');

    expect(within(stage).getByText('Próximo ensaio')).toBeInTheDocument();
    expect(within(stage).getByText('segunda')).toBeInTheDocument();
    expect(within(stage).queryByText('100 Anos do Paco Municipal')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(within(stage).getByText('Próxima apresentação')).toBeInTheDocument();
    });

    expect(within(stage).getByText('100 Anos do Paco Municipal')).toBeInTheDocument();
  });

  test('pausa a rotação no hover e retoma quando o mouse sai', async () => {
    render(
      <MemoryRouter>
        <DesktopHeader />
      </MemoryRouter>
    );

    const countdown = screen.getByTestId('musician-countdown');
    const stage = screen.getByTestId('musician-countdown-stage');

    fireEvent.mouseEnter(countdown);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(within(stage).getByText('Próximo ensaio')).toBeInTheDocument();
    expect(within(stage).queryByText('Próxima apresentação')).not.toBeInTheDocument();

    fireEvent.mouseLeave(countdown);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(within(stage).getByText('Próxima apresentação')).toBeInTheDocument();
    });
  });
});
