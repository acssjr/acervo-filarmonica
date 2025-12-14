import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

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
      'react-refresh': reactRefresh,
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

      // React Refresh - garante HMR correto no Vite
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // JavaScript rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none', // Permite catch sem variável
          destructuredArrayIgnorePattern: '^_', // Permite [_, value]
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Bloqueia console.log, permite warn/error
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-useless-escape': 'warn',
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
      'react-refresh/only-export-components': 'off', // Testes exportam utils, não só componentes
    },
  },

  // Contextos e hooks podem exportar funções além de componentes
  {
    files: [
      'src/contexts/**/*.{js,jsx}',
      'src/hooks/**/*.{js,jsx}',
      'src/constants/**/*.{js,jsx}',
      'src/screens/admin/AdminContext.jsx',
      'src/components/onboarding/TutorialOverlay.jsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
