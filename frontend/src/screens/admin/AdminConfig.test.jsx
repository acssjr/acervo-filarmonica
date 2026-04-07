import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockSetUser = jest.fn();
const mockShowToast = jest.fn();
const mockClearNotifications = jest.fn();
const mockSetModoRecesso = jest.fn();
const mockSetDiasEnsaio = jest.fn();
const mockStorageRemove = jest.fn();
const mockAPI = {
  logout: jest.fn(),
  setModoRecesso: jest.fn(),
  setDiasEnsaio: jest.fn(),
  uploadFotoPerfil: jest.fn(),
  updatePerfil: jest.fn()
};

jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, nome: 'Admin', username: 'admin' },
    setUser: mockSetUser
  })
}));

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    showToast: mockShowToast
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    modoRecesso: false,
    setModoRecesso: mockSetModoRecesso,
    diasEnsaio: { dias: ['terca'], hora: '20:00' },
    setDiasEnsaio: mockSetDiasEnsaio
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({
    clearNotifications: mockClearNotifications
  })
}));

jest.unstable_mockModule('@services/api', () => ({
  API: mockAPI
}));

jest.unstable_mockModule('@services/storage', () => ({
  Storage: {
    remove: mockStorageRemove
  }
}));

jest.unstable_mockModule('@components/modals', () => ({
  ChangePinModal: () => null,
  AboutModal: () => null,
  PROFILE_CHANGELOG: [],
  PROFILE_LEGACY_VERSIONS: [],
  PROFILE_ABOUT_CONFIG: {
    subtitle: '',
    maxWidth: '600px',
    footerText: '',
    infoCards: [{ value: '3.1.0' }]
  }
}));

const { default: AdminConfig } = await import('./AdminConfig.jsx');

describe('AdminConfig', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAPI.logout.mockResolvedValue();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('aguarda API.logout antes de limpar estado local e recarregar', async () => {
    let resolveLogout;
    mockAPI.logout.mockReturnValue(new Promise(resolve => {
      resolveLogout = resolve;
    }));

    render(<AdminConfig />);

    fireEvent.click(screen.getByText('Sair do Painel Admin'));

    expect(mockAPI.logout).toHaveBeenCalledTimes(1);
    expect(mockStorageRemove).not.toHaveBeenCalledWith('user');
    expect(mockClearNotifications).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalledWith(null);

    await act(async () => {
      resolveLogout();
    });

    await waitFor(() => {
      expect(mockStorageRemove).toHaveBeenCalledWith('user');
      expect(mockClearNotifications).toHaveBeenCalledTimes(1);
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });
});
