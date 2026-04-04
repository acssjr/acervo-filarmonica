import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockSetUser = jest.fn();
const mockShowToast = jest.fn();
const mockClearNotifications = jest.fn();
const mockGetPresencaStats = jest.fn();

const cachedStats = {
  percentual_frequencia: 95,
  streak: 19,
  ensaios_mes: 1,
  total_ensaios_mes: 1,
  badges: [
    { id: 'primeiro_acorde', descricao: 'Participou do primeiro ensaio' },
    { id: 'assiduo', descricao: '90%+ de presença nos ensaios' }
  ]
};

jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Antonio Júnior',
      nome_exibicao: 'Antonio Júnior',
      instrumento_nome: 'Trompete',
      isAdmin: true
    },
    setUser: mockSetUser
  })
}));

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    showToast: mockShowToast
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({
    clearNotifications: mockClearNotifications
  })
}));

jest.unstable_mockModule('@services/storage', () => ({
  Storage: {
    get: (key, defaultValue = null) => {
      if (key === 'presencaStats_1') return cachedStats;
      if (key === 'profilePhoto_1') return null;
      return defaultValue;
    },
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn()
  }
}));

jest.unstable_mockModule('@services/api', () => ({
  API: {
    getPresencaStats: mockGetPresencaStats,
    uploadFotoPerfil: jest.fn(),
    updatePerfil: jest.fn()
  }
}));

jest.unstable_mockModule('@components/modals/ChangePinModal', () => ({
  default: () => null
}));

jest.unstable_mockModule('@components/modals/AboutModal', () => ({
  AboutModal: () => null,
  PROFILE_CHANGELOG: [],
  PROFILE_LEGACY_VERSIONS: [],
  PROFILE_ABOUT_CONFIG: {
    subtitle: '',
    maxWidth: '640px',
    infoCards: [{ value: '0.0.0' }],
    footerText: ''
  }
}));

jest.unstable_mockModule('@constants/icons', () => ({
  Icons: {
    Logout: () => null
  }
}));

const { default: ProfileScreen } = await import('./ProfileScreen.jsx');

describe('ProfileScreen', () => {
  beforeEach(() => {
    mockGetPresencaStats.mockResolvedValue(cachedStats);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('mantém as badges visíveis em StrictMode depois da animação inicial', async () => {
    render(
      <React.StrictMode>
        <ProfileScreen />
      </React.StrictMode>
    );

    const badgeTitle = await screen.findByText('Primeiro Acorde');
    const badgeCard = badgeTitle.closest('div')?.parentElement;

    expect(badgeCard).not.toBeNull();

    await waitFor(() => {
      expect(badgeCard.style.opacity).not.toBe('0');
    });
  });
});
