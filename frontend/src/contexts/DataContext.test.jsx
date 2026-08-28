import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockAPI = {
  healthCheck: jest.fn(),
  getPartituras: jest.fn(),
  getCategorias: jest.fn(),
  getInstrumentos: jest.fn(),
  getDiasEnsaio: jest.fn(),
  getModoRecesso: jest.fn(),
  getTutoriaisAtivos: jest.fn(),
  getRepertorioAtivo: jest.fn()
};

jest.unstable_mockModule('@services/api', () => ({
  API: mockAPI,
  USE_API: true
}));

jest.unstable_mockModule('@services/storage', () => ({
  default: {
    get: jest.fn((_key, fallback) => fallback),
    set: jest.fn()
  }
}));

const { DataProvider, useData } = await import('./DataContext.jsx');

const TutorialState = () => {
  const { isLoading, tutoriaisAtivos, tutoriaisLoading } = useData();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="tutorial-loading">{String(tutoriaisLoading)}</span>
      <span data-testid="tutorial-active">{String(tutoriaisAtivos)}</span>
    </div>
  );
};

describe('DataContext - configuração global dos tutoriais', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAPI.healthCheck.mockResolvedValue(true);
    mockAPI.getPartituras.mockRejectedValue(new Error('falha nas partituras'));
    mockAPI.getCategorias.mockResolvedValue([]);
    mockAPI.getInstrumentos.mockResolvedValue([]);
    mockAPI.getDiasEnsaio.mockResolvedValue(null);
    mockAPI.getModoRecesso.mockResolvedValue(null);
    mockAPI.getTutoriaisAtivos.mockResolvedValue({ ativo: false });
    mockAPI.getRepertorioAtivo.mockResolvedValue(null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('aplica a configuração mesmo quando uma carga principal falha', async () => {
    render(
      <DataProvider>
        <TutorialState />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('tutorial-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('tutorial-active')).toHaveTextContent('false');
    expect(mockAPI.getTutoriaisAtivos).toHaveBeenCalledTimes(1);
  });
});
