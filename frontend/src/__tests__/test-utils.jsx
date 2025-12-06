// ===== TEST UTILITIES =====
// Helpers e factories para testes do Acervo Filarmonica

import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// ===== FACTORIES =====

/**
 * Cria um usuario mock para testes
 * @param {Object} overrides - Propriedades para sobrescrever
 * @returns {Object} Usuario mock
 */
export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: 'joao.silva',
  nome: 'Joao Silva',
  instrumento: 'Trompete',
  instrumentoNormalizado: 'trompete',
  isAdmin: false,
  avatar: null,
  ...overrides
});

/**
 * Cria um usuario admin mock
 * @param {Object} overrides - Propriedades para sobrescrever
 * @returns {Object} Usuario admin mock
 */
export const createMockAdmin = (overrides = {}) => createMockUser({
  id: 99,
  username: 'admin',
  nome: 'Administrador',
  isAdmin: true,
  ...overrides
});

/**
 * Cria uma partitura mock para testes
 * @param {Object} overrides - Propriedades para sobrescrever
 * @returns {Object} Partitura mock
 */
export const createMockSheet = (overrides = {}) => ({
  id: 1,
  title: 'Dobrado Teste',
  composer: 'Estevam Moura',
  category: 'dobrados',
  year: 2020,
  description: 'Dobrado para teste',
  partes: [
    createMockParte({ id: 1, instrumento: 'Trompete 1' }),
    createMockParte({ id: 2, instrumento: 'Trompete 2' }),
    createMockParte({ id: 3, instrumento: 'Trombone' })
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

/**
 * Cria uma parte de partitura mock
 * @param {Object} overrides - Propriedades para sobrescrever
 * @returns {Object} Parte mock
 */
export const createMockParte = (overrides = {}) => ({
  id: 1,
  instrumento: 'Trompete 1',
  instrumentoNormalizado: 'trompete',
  arquivo: 'partes/dobrado-teste-trompete-1.pdf',
  ...overrides
});

/**
 * Cria uma lista de partituras mock
 * @param {number} count - Quantidade de partituras
 * @returns {Array} Lista de partituras mock
 */
export const createMockSheets = (count = 5) => {
  const categories = ['dobrados', 'marchas', 'hinos', 'valsas', 'polkas'];
  const composers = ['Estevam Moura', 'Tertuliano Santos', 'Amando Nobre', 'Heraclio Guerreiro', 'Anacleto Medeiros'];

  return Array.from({ length: count }, (_, i) => createMockSheet({
    id: i + 1,
    title: `Partitura ${i + 1}`,
    composer: composers[i % composers.length],
    category: categories[i % categories.length]
  }));
};

// ===== MOCK HELPERS =====

/**
 * Mock do fetch global
 * @param {Object|Function} response - Resposta ou funcao que retorna resposta
 * @returns {jest.Mock} Mock do fetch
 */
export const mockFetch = (response) => {
  const mockFn = jest.fn().mockImplementation(async (url, options) => {
    const result = typeof response === 'function' ? response(url, options) : response;

    return {
      ok: result.ok !== false,
      status: result.status || 200,
      json: async () => result.data || result,
      text: async () => JSON.stringify(result.data || result),
      blob: async () => new Blob(['test']),
      headers: new Headers(result.headers || {})
    };
  });

  global.fetch = mockFn;
  return mockFn;
};

/**
 * Mock do fetch que simula erro de rede
 * @returns {jest.Mock} Mock do fetch com erro
 */
export const mockFetchError = (errorMessage = 'Network error') => {
  const mockFn = jest.fn().mockRejectedValue(new Error(errorMessage));
  global.fetch = mockFn;
  return mockFn;
};

/**
 * Mock do fetch com respostas sequenciais
 * @param {Array} responses - Array de respostas em ordem
 * @returns {jest.Mock} Mock do fetch
 */
export const mockFetchSequence = (responses) => {
  let callIndex = 0;
  const mockFn = jest.fn().mockImplementation(async () => {
    const response = responses[callIndex] || responses[responses.length - 1];
    callIndex++;

    return {
      ok: response.ok !== false,
      status: response.status || 200,
      json: async () => response.data || response,
      text: async () => JSON.stringify(response.data || response),
      blob: async () => new Blob(['test'])
    };
  });

  global.fetch = mockFn;
  return mockFn;
};

/**
 * Restaura o fetch original
 */
export const restoreFetch = () => {
  if (global.originalFetch) {
    global.fetch = global.originalFetch;
  }
};

// ===== RENDER HELPERS =====

/**
 * Renderiza componente com Router
 * @param {React.ReactElement} ui - Componente a renderizar
 * @param {Object} options - Opcoes do render
 * @returns {Object} Resultado do render
 */
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

/**
 * Wrapper para todos os providers necessarios
 * Uso: render(<Component />, { wrapper: AllProviders })
 */
export const AllProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

/**
 * Renderiza componente com todos os providers
 * @param {React.ReactElement} ui - Componente a renderizar
 * @param {Object} options - Opcoes do render
 * @returns {Object} Resultado do render
 */
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

// ===== ASYNC HELPERS =====

/**
 * Espera um tempo especificado (para testes de debounce/throttle)
 * @param {number} ms - Milissegundos para esperar
 * @returns {Promise} Promise que resolve apos o tempo
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Avanca os timers do Jest e aguarda promises pendentes
 * @param {number} ms - Milissegundos para avancar
 */
export const advanceTimersAndFlush = async (ms) => {
  jest.advanceTimersByTime(ms);
  await Promise.resolve();
};

// ===== DATE HELPERS =====

/**
 * Cria uma data mock para testes de ensaio
 * @param {number} dayOfWeek - Dia da semana (0=dom, 1=seg, ..., 6=sab)
 * @param {number} hour - Hora
 * @param {number} minute - Minuto
 * @returns {Date} Data mock
 */
export const createMockDate = (dayOfWeek, hour = 12, minute = 0) => {
  // Encontra a proxima ocorrencia do dia da semana
  const now = new Date();
  const currentDay = now.getDay();
  const daysToAdd = (dayOfWeek - currentDay + 7) % 7;

  const mockDate = new Date(now);
  mockDate.setDate(now.getDate() + daysToAdd);
  mockDate.setHours(hour, minute, 0, 0);

  return mockDate;
};

/**
 * Mock do Date.now() e new Date() para um timestamp especifico
 * @param {Date|number} dateOrTimestamp - Data ou timestamp
 * @returns {Function} Funcao para restaurar Date original
 */
export const mockDate = (dateOrTimestamp) => {
  const timestamp = dateOrTimestamp instanceof Date
    ? dateOrTimestamp.getTime()
    : dateOrTimestamp;

  const RealDate = Date;

  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        return new RealDate(timestamp);
      }
      return new RealDate(...args);
    }

    static now() {
      return timestamp;
    }
  };

  return () => {
    global.Date = RealDate;
  };
};

// ===== STORAGE HELPERS =====

/**
 * Configura o localStorage com dados iniciais
 * @param {Object} data - Dados no formato { key: value }
 */
export const setupStorage = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(`fil_${key}`, JSON.stringify(value));
  });
};

/**
 * Obtem dados do localStorage (sem prefixo)
 * @param {string} key - Chave
 * @returns {any} Valor parseado ou null
 */
export const getStorageItem = (key) => {
  const item = localStorage.getItem(`fil_${key}`);
  return item ? JSON.parse(item) : null;
};

// ===== RE-EXPORTS =====

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
