import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  // Ignorar arquivos de build e dependências
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // Configuração base para JavaScript
  js.configs.recommended,

  // Configuração para arquivos React
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Não precisa importar React em React 17+
      'react/prop-types': 'off', // Desativado - projeto usa JS, não TypeScript
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JavaScript rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // Permitir console.log
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-useless-escape': 'warn', // Apenas avisar sobre escapes desnecessários
    },
  },

  // Configuração específica para arquivos de teste
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}', 'src/mocks/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        global: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off', // Mais flexível em testes
      'react/prop-types': 'off', // Não exigir prop-types em testes
    },
  },
];
