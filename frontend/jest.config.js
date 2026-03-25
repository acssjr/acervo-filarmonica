export default {
  testEnvironment: 'jsdom',
  // setupFiles roda ANTES do ambiente, setupFilesAfterEnv roda DEPOIS
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  extensionsToTreatAsEsm: ['.jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@admin/(.*)$': '<rootDir>/src/screens/admin/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@gsap/react$': '<rootDir>/__mocks__/@gsap/react.js',
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy',
    '^gsap$': '<rootDir>/__mocks__/gsap.js',
    '^gsap/(.*)$': '<rootDir>/__mocks__/gsap.js',
    '^@gsap/react$': '<rootDir>/__mocks__/@gsap/react.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    'test-utils',
    '__tests__/mocks/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.d.ts'
  ]
};
