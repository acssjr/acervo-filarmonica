// ===== JEST SETUP =====
// Este arquivo roda DEPOIS do ambiente de teste ser configurado
// NOTA: Polyfills de TextEncoder, fetch, etc. estao em jest.polyfills.js

import '@testing-library/jest-dom';
import { jest, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// ===== MSW SERVER SETUP =====
// Seguindo o guia: intercepta requisicoes no nivel de rede
import { server } from './src/__tests__/mocks/server.js';

// Inicia servidor antes de todos os testes
// 'error' bloqueia requests nao interceptados (evita rede real)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reseta handlers entre testes para garantir isolamento
afterEach(() => server.resetHandlers());

// Fecha servidor ao final
afterAll(() => server.close());

// ===== MOCK DO localStorage =====
// Mock com suporte ao prefixo fil_ usado pela app
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: jest.fn(index => Object.keys(store)[index] || null),
    // Helper para testes - acesso direto ao store
    __getStore: () => store,
    __setStore: (newStore) => { store = newStore; }
  };
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Limpa localStorage entre testes
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ===== MOCK DO matchMedia =====
// Para testes de hooks responsivos
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ===== MOCK DO visualViewport =====
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    height: 800,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});

// ===== MOCKS PARA DOWNLOAD (Fase 3 do guia) =====
// Mock do URL.createObjectURL e revokeObjectURL
// Necessario para testar downloads de arquivos
let mockUrlCounter = 0;
window.URL.createObjectURL = jest.fn((blob) => {
  mockUrlCounter++;
  return `blob:http://localhost:3000/mock-blob-${mockUrlCounter}`;
});
window.URL.revokeObjectURL = jest.fn();

// ===== MOCK DO ResizeObserver =====
// JSDOM nao tem API de layout
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// ===== MOCK DO IntersectionObserver =====
// Para componentes com lazy loading
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverMock;
