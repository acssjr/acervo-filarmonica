import '@testing-library/jest-dom';

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
