import '@testing-library/jest-dom';
import { jest, beforeEach } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill para TextEncoder/TextDecoder (necessario para react-router-dom)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock do localStorage com suporte ao prefixo fil_
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

// Mock do matchMedia para testes de hooks responsivos
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

// Mock do visualViewport
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    height: 800,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});
