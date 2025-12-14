import js from '@eslint/js';
import globals from 'globals';

export default [
  // Ignorar tudo exceto worker/src
  {
    ignores: [
      'frontend/**',
      'node_modules/**',
      '.wrangler/**',
      'database/**',
      'scripts/**',
      'e2e/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['worker/src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.worker, // fetch, Request, Response, etc.
        caches: 'readonly',
      },
    },
    rules: {
      // Proibir acidentalmente usar APIs do browser
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'Workers não têm acesso ao window' },
        { name: 'document', message: 'Workers não têm acesso ao DOM' },
        { name: 'location', message: 'Use request.url em Workers' },
      ],

      // Console restrito em serverless
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Padrão para variáveis
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
];
