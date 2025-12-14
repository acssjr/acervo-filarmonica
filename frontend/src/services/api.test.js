// ===== API SERVICE TESTS =====
// Testes unitarios para o servico de API

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock manual do Storage (ESM compativel)
const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
};

// Substituir Storage antes de importar API
jest.unstable_mockModule('./storage', () => ({
  default: mockStorage,
  Storage: mockStorage
}));

// Import dinamico apos mock
const { API } = await import('./api.js');

// Helper para criar mock de fetch
const createMockFetch = (response) => {
  return jest.fn().mockImplementation(async () => ({
    ok: response.ok !== false,
    status: response.status || 200,
    json: async () => response.data || response,
    text: async () => JSON.stringify(response.data || response)
  }));
};

describe('API Service', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    jest.clearAllMocks();
    // Reset do callback de token expirado
    API.setOnTokenExpired(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ============ TOKEN MANAGEMENT ============

  describe('Token Management', () => {
    describe('isTokenExpired()', () => {
      it('retorna false quando nao ha token (usuario nao logado)', () => {
        mockStorage.get.mockReturnValue(null);

        expect(API.isTokenExpired()).toBe(false);
      });

      it('retorna true quando ha token mas nao ha tokenExpiresAt (token antigo)', () => {
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return null;
          return null;
        });

        expect(API.isTokenExpired()).toBe(true);
      });

      it('retorna false quando token ainda e valido', () => {
        // Token expira em 1 hora
        const expiresAt = Date.now() + (60 * 60 * 1000);
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return expiresAt;
          return null;
        });

        expect(API.isTokenExpired()).toBe(false);
      });

      it('retorna true quando token expirou', () => {
        // Token expirou ha 1 hora
        const expiresAt = Date.now() - (60 * 60 * 1000);
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return expiresAt;
          return null;
        });

        expect(API.isTokenExpired()).toBe(true);
      });

      it('retorna true dentro do buffer de expiracao (5 min)', () => {
        // Token expira em 3 minutos (dentro do buffer de 5 min)
        const expiresAt = Date.now() + (3 * 60 * 1000);
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return expiresAt;
          return null;
        });

        expect(API.isTokenExpired()).toBe(true);
      });

      it('retorna false fora do buffer de expiracao', () => {
        // Token expira em 10 minutos (fora do buffer de 5 min)
        const expiresAt = Date.now() + (10 * 60 * 1000);
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return expiresAt;
          return null;
        });

        expect(API.isTokenExpired()).toBe(false);
      });
    });

    describe('clearAuth()', () => {
      it('remove todos os dados de autenticacao', () => {
        API.clearAuth();

        expect(mockStorage.remove).toHaveBeenCalledWith('authToken');
        expect(mockStorage.remove).toHaveBeenCalledWith('tokenExpiresAt');
        expect(mockStorage.remove).toHaveBeenCalledWith('user');
      });
    });

    describe('setOnTokenExpired()', () => {
      it('registra callback para expiracao de token', async () => {
        const callback = jest.fn();
        API.setOnTokenExpired(callback);

        // Token expirado (ha token mas expirou)
        mockStorage.get.mockImplementation((key) => {
          if (key === 'authToken') return 'some-token';
          if (key === 'tokenExpiresAt') return Date.now() - 1000;
          return null;
        });

        global.fetch = createMockFetch({ data: {} });

        await expect(API.request('/api/test')).rejects.toThrow('Sessão expirada');
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  // ============ REQUEST ============

  describe('request()', () => {
    it('faz requisicao com headers corretos', async () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === 'authToken') return 'test-token';
        if (key === 'tokenExpiresAt') return Date.now() + (60 * 60 * 1000);
        return null;
      });

      global.fetch = createMockFetch({ data: { success: true } });

      await API.request('/api/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    it('nao inclui Authorization quando nao ha token', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = createMockFetch({ data: { success: true } });

      await API.request('/api/test');

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    it('lanca erro em resposta 401', async () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === 'authToken') return 'test-token';
        if (key === 'tokenExpiresAt') return Date.now() + (60 * 60 * 1000);
        return null;
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Token expirado' })
      });

      const callback = jest.fn();
      API.setOnTokenExpired(callback);

      await expect(API.request('/api/test')).rejects.toThrow('Token expirado');
      expect(callback).toHaveBeenCalled();
    });

    it('lanca erro em resposta nao-ok', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Erro interno' })
      });

      await expect(API.request('/api/test')).rejects.toThrow('Erro interno');
    });

    it('lanca erro generico quando json falha', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      // Quando JSON falha, o catch retorna { error: 'Erro desconhecido' }
      await expect(API.request('/api/test')).rejects.toThrow('Erro desconhecido');
    });
  });

  // ============ LOGIN ============

  describe('login()', () => {
    it('armazena token e expiresAt apos login bem-sucedido', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = createMockFetch({
        data: {
          token: 'new-token',
          expiresIn: 86400, // 24 horas em segundos
          user: { id: 1, nome: 'Test' }
        }
      });

      await API.login('usuario', '1234');

      expect(mockStorage.set).toHaveBeenCalledWith('authToken', 'new-token');
      expect(mockStorage.set).toHaveBeenCalledWith(
        'tokenExpiresAt',
        expect.any(Number)
      );
    });

    it('calcula expiresAt corretamente', async () => {
      mockStorage.get.mockReturnValue(null);
      const now = Date.now();

      global.fetch = createMockFetch({
        data: {
          token: 'new-token',
          expiresIn: 3600 // 1 hora
        }
      });

      await API.login('usuario', '1234');

      const expiresAtCall = mockStorage.set.mock.calls.find(c => c[0] === 'tokenExpiresAt');
      const expiresAt = expiresAtCall[1];

      // Deve expirar aproximadamente em 1 hora (com margem de 1 segundo)
      expect(expiresAt).toBeGreaterThanOrEqual(now + 3600 * 1000 - 1000);
      expect(expiresAt).toBeLessThanOrEqual(now + 3600 * 1000 + 1000);
    });

    it('nao armazena token quando nao retornado', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Credenciais invalidas' })
      });

      try {
        await API.login('usuario', 'wrong');
      } catch {
        // Esperado
      }

      expect(mockStorage.set).not.toHaveBeenCalledWith('authToken', expect.anything());
    });

    it('envia username, pin e rememberMe no body', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = createMockFetch({ data: { token: 'test' } });

      await API.login('joao', '1234', true);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'joao', pin: '1234', rememberMe: true })
        })
      );
    });

    it('envia rememberMe como false por padrao', async () => {
      mockStorage.get.mockReturnValue(null);

      global.fetch = createMockFetch({ data: { token: 'test' } });

      await API.login('joao', '1234');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'joao', pin: '1234', rememberMe: false })
        })
      );
    });
  });

  // ============ PARTITURAS ============

  describe('Partituras', () => {
    beforeEach(() => {
      mockStorage.get.mockReturnValue(null);
    });

    it('getPartituras() faz GET sem filtros', async () => {
      global.fetch = createMockFetch({ data: [] });

      await API.getPartituras();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/partituras$/),
        expect.anything()
      );
    });

    it('getPartituras() inclui filtros na query string', async () => {
      global.fetch = createMockFetch({ data: [] });

      await API.getPartituras({ categoria: 'dobrados', busca: 'teste' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('categoria=dobrados'),
        expect.anything()
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('busca=teste'),
        expect.anything()
      );
    });

    it('getPartitura() busca por ID', async () => {
      global.fetch = createMockFetch({ data: { id: 123 } });

      await API.getPartitura(123);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/partituras/123'),
        expect.anything()
      );
    });

    it('updatePartitura() faz PUT com dados', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.updatePartitura(1, { title: 'Novo Titulo' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/partituras/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ title: 'Novo Titulo' })
        })
      );
    });

    it('deletePartitura() faz DELETE', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.deletePartitura(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/partituras/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  // ============ FAVORITOS ============

  describe('Favoritos', () => {
    beforeEach(() => {
      mockStorage.get.mockReturnValue(null);
    });

    it('getFavoritos() retorna lista de favoritos', async () => {
      global.fetch = createMockFetch({ data: [{ id: 1 }, { id: 2 }] });

      const result = await API.getFavoritos();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/favoritos'),
        expect.anything()
      );
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('getFavoritosIds() retorna apenas IDs', async () => {
      global.fetch = createMockFetch({ data: { ids: [1, 2, 3] } });

      const result = await API.getFavoritosIds();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/favoritos/ids'),
        expect.anything()
      );
      expect(result).toEqual({ ids: [1, 2, 3] });
    });

    it('addFavorito() faz POST', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.addFavorito(123);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/favoritos/123'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('removeFavorito() faz DELETE', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.removeFavorito(123);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/favoritos/123'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  // ============ HEALTH CHECK ============

  describe('healthCheck()', () => {
    beforeEach(() => {
      mockStorage.get.mockReturnValue(null);
    });

    it('retorna true quando status e ok', async () => {
      global.fetch = createMockFetch({ data: { status: 'ok' } });

      const result = await API.healthCheck();

      expect(result).toBe(true);
    });

    it('retorna false quando status nao e ok', async () => {
      global.fetch = createMockFetch({ data: { status: 'error' } });

      const result = await API.healthCheck();

      expect(result).toBe(false);
    });

    it('retorna false em erro de rede', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await API.healthCheck();

      expect(result).toBe(false);
    });
  });

  // ============ DOWNLOAD URL ============

  describe('getDownloadUrl()', () => {
    it('retorna URL sem instrumento', () => {
      const url = API.getDownloadUrl(123);

      expect(url).toContain('/api/download/123');
      expect(url).not.toContain('instrumento');
    });

    it('retorna URL com instrumento', () => {
      const url = API.getDownloadUrl(123, 'trompete');

      expect(url).toContain('/api/download/123');
      expect(url).toContain('instrumento=trompete');
    });
  });

  // ============ LOGOUT ============

  describe('logout()', () => {
    it('limpa dados de autenticacao', () => {
      API.logout();

      expect(mockStorage.remove).toHaveBeenCalledWith('authToken');
      expect(mockStorage.remove).toHaveBeenCalledWith('tokenExpiresAt');
      expect(mockStorage.remove).toHaveBeenCalledWith('user');
    });
  });

  // ============ CHANGE PIN ============

  describe('changePin()', () => {
    it('atualiza token apos mudanca de PIN bem-sucedida', async () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === 'authToken') return 'old-token';
        if (key === 'tokenExpiresAt') return Date.now() + (60 * 60 * 1000);
        return null;
      });

      global.fetch = createMockFetch({
        data: { success: true, token: 'new-token' }
      });

      await API.changePin('1234', '5678');

      expect(mockStorage.set).toHaveBeenCalledWith('authToken', 'new-token');
      expect(mockStorage.set).toHaveBeenCalledWith('tokenExpiresAt', expect.any(Number));
    });

    it('retorna erro em falha', async () => {
      mockStorage.get.mockImplementation((key) => {
        if (key === 'authToken') return 'token';
        if (key === 'tokenExpiresAt') return Date.now() + (60 * 60 * 1000);
        return null;
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'PIN atual incorreto' })
      });

      const result = await API.changePin('wrong', '5678');

      expect(result).toEqual({
        success: false,
        error: 'PIN atual incorreto'
      });
    });
  });

  // ============ REPERTORIO ============

  describe('Repertorio', () => {
    beforeEach(() => {
      mockStorage.get.mockImplementation((key) => {
        if (key === 'authToken') return 'test-token';
        if (key === 'tokenExpiresAt') return Date.now() + (60 * 60 * 1000);
        return null;
      });
    });

    it('getRepertorioAtivo() faz GET para /api/repertorio/ativo', async () => {
      global.fetch = createMockFetch({ data: { id: 1, nome: 'Repertório Ativo' } });

      const result = await API.getRepertorioAtivo();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/ativo'),
        expect.anything()
      );
      expect(result.nome).toBe('Repertório Ativo');
    });

    it('getRepertorio() faz GET para /api/repertorio/:id', async () => {
      global.fetch = createMockFetch({ data: { id: 5, nome: 'Repertório 5' } });

      await API.getRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5'),
        expect.anything()
      );
    });

    it('getRepertorios() faz GET para /api/repertorios', async () => {
      global.fetch = createMockFetch({ data: [{ id: 1 }, { id: 2 }] });

      const result = await API.getRepertorios();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/repertorios$/),
        expect.anything()
      );
      expect(result).toHaveLength(2);
    });

    it('createRepertorio() faz POST com dados', async () => {
      global.fetch = createMockFetch({ data: { success: true, id: 10 } });

      const data = { nome: 'Novo Repertório', descricao: 'Teste' };
      await API.createRepertorio(data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/repertorios$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data)
        })
      );
    });

    it('updateRepertorio() faz PUT com dados', async () => {
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

    it('deleteRepertorio() faz DELETE', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.deleteRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('addPartituraToRepertorio() faz POST com partitura_id', async () => {
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

    it('removePartituraFromRepertorio() faz DELETE', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      await API.removePartituraFromRepertorio(1, 42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/1/partituras/42'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('reorderRepertorioPartituras() faz PUT com ordens', async () => {
      global.fetch = createMockFetch({ data: { success: true } });

      const ordens = [{ partitura_id: 1, ordem: 0 }, { partitura_id: 2, ordem: 1 }];
      await API.reorderRepertorioPartituras(5, ordens);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5/reorder'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ ordens })
        })
      );
    });

    it('duplicarRepertorio() faz POST', async () => {
      global.fetch = createMockFetch({ data: { success: true, id: 11 } });

      await API.duplicarRepertorio(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repertorio/5/duplicar'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('isPartituraInRepertorio() faz GET para verificar', async () => {
      global.fetch = createMockFetch({ data: { inRepertorio: true } });

      const result = await API.isPartituraInRepertorio(42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/partituras/42/in-repertorio'),
        expect.anything()
      );
      expect(result.inRepertorio).toBe(true);
    });

    it('getRepertorioDownloadUrl() retorna URL sem instrumento', () => {
      const url = API.getRepertorioDownloadUrl(5);

      expect(url).toContain('/api/repertorio/5/download');
      expect(url).toContain('formato=pdf');
      expect(url).not.toContain('instrumento');
    });

    it('getRepertorioDownloadUrl() retorna URL com instrumento', () => {
      const url = API.getRepertorioDownloadUrl(5, 'trompete', 'zip');

      expect(url).toContain('/api/repertorio/5/download');
      expect(url).toContain('formato=zip');
      expect(url).toContain('instrumento=trompete');
    });

    it('getRepertorioDownloadUrl() encoda instrumento com caracteres especiais', () => {
      const url = API.getRepertorioDownloadUrl(5, 'Saxofone Barítono');

      expect(url).toContain('instrumento=Saxofone%20Bar%C3%ADtono');
    });

    it('getRepertorioDownloadUrl() inclui IDs de partituras selecionadas', () => {
      const url = API.getRepertorioDownloadUrl(5, 'trompete', 'pdf', [1, 2, 3]);

      expect(url).toContain('/api/repertorio/5/download');
      expect(url).toContain('formato=pdf');
      expect(url).toContain('instrumento=trompete');
      expect(url).toContain('partituras=1,2,3');
    });

    it('getRepertorioDownloadUrl() não inclui partituras se array vazio', () => {
      const url = API.getRepertorioDownloadUrl(5, 'trompete', 'pdf', []);

      expect(url).not.toContain('partituras');
    });

    it('getRepertorioDownloadUrl() não inclui partituras se null', () => {
      const url = API.getRepertorioDownloadUrl(5, 'trompete', 'pdf', null);

      expect(url).not.toContain('partituras');
    });
  });
});
