import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createElement } from 'react';

const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
};

const mockAPI = {
  logout: jest.fn(),
  setOnTokenExpired: jest.fn(),
  isTokenExpired: jest.fn(() => false)
};

jest.unstable_mockModule('@services/storage', () => ({
  default: mockStorage,
  Storage: mockStorage
}));

jest.unstable_mockModule('@services/api', () => ({
  API: mockAPI,
  USE_API: true
}));

const { AuthProvider, useAuth } = await import('./AuthContext.jsx');

const wrapper = ({ children }) => createElement(AuthProvider, null, children);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.get.mockReturnValue(null);
    mockAPI.logout.mockResolvedValue();
    mockAPI.isTokenExpired.mockReturnValue(false);
  });

  test('logout aguarda API.logout antes de limpar dados locais extras', async () => {
    let resolveLogout;
    mockAPI.logout.mockReturnValue(new Promise(resolve => {
      resolveLogout = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    let logoutPromise;
    act(() => {
      logoutPromise = result.current.logout();
    });

    expect(mockAPI.logout).toHaveBeenCalledTimes(1);
    expect(mockStorage.remove).not.toHaveBeenCalledWith('authToken');

    resolveLogout();
    await act(async () => {
      await logoutPromise;
    });

    expect(mockStorage.remove).toHaveBeenCalledWith('user');
    expect(mockStorage.remove).toHaveBeenCalledWith('favorites');
    expect(mockStorage.remove).toHaveBeenCalledWith('authToken');
  });
});
