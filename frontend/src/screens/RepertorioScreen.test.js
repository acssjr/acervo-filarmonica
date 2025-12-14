// ===== REPERTORIO SCREEN TESTS =====
// Testes unitários para a tela de Repertório - foco na API
// Os testes de componentes com Router são complexos e ficam para E2E

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock do storage
const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
};

jest.unstable_mockModule('@services/storage', () => ({
  default: mockStorage
}));

// Import API após mock
const { API } = await import('@services/api');

describe('Repertorio API Integration', () => {
  const createMockFetch = (response) => {
    return jest.fn().mockImplementation(async () => ({
      ok: response.ok !== false,
      status: response.status || 200,
      json: async () => response.data || response,
    }));
  };

  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    jest.clearAllMocks();
    mockStorage.get.mockReturnValue(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('getRepertorioAtivo()', () => {
    it('faz GET para /api/repertorio/ativo', async () => {
      global.fetch = createMockFetch({ data: { id: 1, nome: 'Teste' } });

      await API.getRepertorioAtivo();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/ativo'),
        expect.anything()
      );
    });

    it('retorna null quando não há repertório ativo', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        ok: true,
        status: 200,
        json: async () => null,
      }));

      const result = await API.getRepertorioAtivo();

      expect(result).toBeNull();
    });

    it('retorna repertório com partituras', async () => {
      const mockRepertorio = {
        id: 1,
        nome: 'Repertório Dezembro 2025',
        partituras: [
          { id: 1, titulo: 'Dobrado 1' },
          { id: 2, titulo: 'Dobrado 2' }
        ]
      };
      global.fetch = createMockFetch({ data: mockRepertorio });

      const result = await API.getRepertorioAtivo();

      expect(result).toEqual(mockRepertorio);
      expect(result.partituras).toHaveLength(2);
    });
  });

  describe('getRepertorio()', () => {
    it('faz GET para /api/repertorio/:id', async () => {
      global.fetch = createMockFetch({ data: { id: 5, nome: 'Teste' } });

      await API.getRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5'),
        expect.anything()
      );
    });
  });

  describe('getRepertorios()', () => {
    it('faz GET para /api/repertorios', async () => {
      global.fetch = createMockFetch({ data: [] });

      await API.getRepertorios();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/repertorios$/),
        expect.anything()
      );
    });

    it('retorna lista de repertórios', async () => {
      const mockLista = [
        { id: 1, nome: 'Repertório 1', ativo: 1 },
        { id: 2, nome: 'Repertório 2', ativo: 0 }
      ];
      global.fetch = createMockFetch({ data: mockLista });

      const result = await API.getRepertorios();

      expect(result).toHaveLength(2);
      expect(result[0].ativo).toBe(1);
    });
  });

  describe('createRepertorio()', () => {
    it('faz POST com dados do repertório', async () => {
      global.fetch = createMockFetch({ data: { success: true, id: 10 } });

      const data = { nome: 'Novo Repertório', descricao: 'Teste', ativo: true };
      await API.createRepertorio(data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/repertorios$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data)
        })
      );
    });
  });

  describe('updateRepertorio()', () => {
    it('faz PUT com dados atualizados', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      const data = { nome: 'Nome Atualizado' };
      await API.updateRepertorio(5, data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data)
        })
      );
    });
  });

  describe('deleteRepertorio()', () => {
    it('faz DELETE para o repertório', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.deleteRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('addPartituraToRepertorio()', () => {
    it('faz POST com partitura_id', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.addPartituraToRepertorio(1, 42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/1/partituras'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ partitura_id: 42 })
        })
      );
    });
  });

  describe('removePartituraFromRepertorio()', () => {
    it('faz DELETE para remover partitura', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.removePartituraFromRepertorio(1, 42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/1/partituras/42'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('reorderRepertorioPartituras()', () => {
    it('faz PUT com array de ordens', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      const ordens = [
        { partitura_id: 1, ordem: 0 },
        { partitura_id: 2, ordem: 1 }
      ];
      await API.reorderRepertorioPartituras(5, ordens);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5/reorder'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ ordens })
        })
      );
    });
  });

  describe('duplicarRepertorio()', () => {
    it('faz POST para duplicar', async () => {
      global.fetch = createMockFetch({ data: { success: true, id: 11 } });

      await API.duplicarRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5/duplicar'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('retorna ID do novo repertório', async () => {
      global.fetch = createMockFetch({ data: { success: true, id: 11 } });

      const result = await API.duplicarRepertorio(5);

      expect(result.id).toBe(11);
    });
  });

  describe('isPartituraInRepertorio()', () => {
    it('faz GET para verificar partitura no repertório', async () => {
      global.fetch = createMockFetch({ data: { inRepertorio: true } });

      const result = await API.isPartituraInRepertorio(42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/partituras/42/in-repertorio'),
        expect.anything()
      );
      expect(result.inRepertorio).toBe(true);
    });

    it('retorna false quando partitura não está no repertório', async () => {
      global.fetch = createMockFetch({ data: { inRepertorio: false } });

      const result = await API.isPartituraInRepertorio(42);

      expect(result.inRepertorio).toBe(false);
    });
  });

  describe('getRepertorioDownloadUrl()', () => {
    it('gera URL para download PDF', () => {
      const url = API.getRepertorioDownloadUrl(5, null, 'pdf');

      expect(url).toContain('/api/repertorio/5/download');
      expect(url).toContain('formato=pdf');
    });

    it('gera URL para download ZIP', () => {
      const url = API.getRepertorioDownloadUrl(5, null, 'zip');

      expect(url).toContain('formato=zip');
    });

    it('inclui instrumento quando especificado', () => {
      const url = API.getRepertorioDownloadUrl(5, 'Trompete', 'pdf');

      expect(url).toContain('instrumento=Trompete');
    });

    it('encoda caracteres especiais no instrumento', () => {
      const url = API.getRepertorioDownloadUrl(5, 'Saxofone Barítono', 'pdf');

      expect(url).toContain('instrumento=Saxofone%20Bar%C3%ADtono');
    });

    it('usa pdf como formato padrão', () => {
      const url = API.getRepertorioDownloadUrl(5, 'Trompete');

      expect(url).toContain('formato=pdf');
    });
  });
});
