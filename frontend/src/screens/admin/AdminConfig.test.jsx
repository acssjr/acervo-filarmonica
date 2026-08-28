import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockSetUser = jest.fn();
const mockShowToast = jest.fn();
const mockClearNotifications = jest.fn();
const mockSetModoRecesso = jest.fn();
const mockSetTutoriaisAtivos = jest.fn();
const mockSetDiasEnsaio = jest.fn();
const mockSetTutoriaisApi = jest.fn();
const mockDiasEnsaio = { dias: [1, 3], hora: 19 };
const mockStorageRemove = jest.fn();
const mockAPI = {
  setTutoriaisAtivos: mockSetTutoriaisApi,
  setModoRecesso: jest.fn(),
  setDiasEnsaio: jest.fn(),
  uploadFotoPerfil: jest.fn(),
  updatePerfil: jest.fn(),
  logout: jest.fn()
};

jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'admin', name: 'Administrador', isAdmin: true },
    setUser: mockSetUser
  })
}));

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({ showToast: mockShowToast })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    modoRecesso: false,
    setModoRecesso: mockSetModoRecesso,
    tutoriaisAtivos: true,
    setTutoriaisAtivos: mockSetTutoriaisAtivos,
    tutoriaisLoading: false,
    diasEnsaio: mockDiasEnsaio,
    setDiasEnsaio: mockSetDiasEnsaio
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({ clearNotifications: mockClearNotifications })
}));

jest.unstable_mockModule('@services/api', () => ({
  API: mockAPI
}));

jest.unstable_mockModule('@services/storage', () => ({
  Storage: { remove: mockStorageRemove }
}));

jest.unstable_mockModule('@components/modals', () => ({
  ChangePinModal: () => null,
  AboutModal: () => null,
  PROFILE_CHANGELOG: [],
  PROFILE_LEGACY_VERSIONS: [],
  PROFILE_ABOUT_CONFIG: {
    subtitle: '',
    maxWidth: '640px',
    infoCards: [{ value: '3.2.0' }],
    footerText: ''
  }
}));

const { default: AdminConfig } = await import('./AdminConfig.jsx');

describe('AdminConfig', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAPI.logout.mockResolvedValue();
    mockSetTutoriaisApi.mockResolvedValue({ ativo: false });
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

  test('desativa os tutoriais globalmente', async () => {
    const user = userEvent.setup();
    render(<AdminConfig />);

    const toggle = screen.getByRole('switch', { name: 'Ativar tutoriais de primeiro uso' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await user.click(toggle);

    await waitFor(() => {
      expect(mockSetTutoriaisApi).toHaveBeenCalledWith(false);
    });
    expect(mockSetTutoriaisAtivos).toHaveBeenCalledWith(false);
    expect(mockShowToast).toHaveBeenCalledWith('Tutoriais desativados');
  });

  test('restaura o estado quando a API falha', async () => {
    mockSetTutoriaisApi.mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    render(<AdminConfig />);

    await user.click(screen.getByRole('switch', { name: 'Ativar tutoriais de primeiro uso' }));

    await waitFor(() => {
      expect(mockSetTutoriaisAtivos).toHaveBeenLastCalledWith(true);
    });
    expect(mockSetTutoriaisAtivos).toHaveBeenNthCalledWith(1, false);
    expect(mockShowToast).toHaveBeenCalledWith('Erro ao atualizar tutoriais', 'error');
  });
});
