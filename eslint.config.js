import js from '@eslint/js';
import globals from 'globals';

export default [
  // Ignorar tudo exceto worker/src e worker/*.js
  {
    ignores: [
      'frontend/**',
      'node_modules/**',
      '.wrangler/**',
      'database/**',
      'scripts/**',
      'e2e/**',
      'worker/tests/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['worker/src/**/*.js', 'worker/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.worker,
        ...globals.node,
        caches: 'readonly',
        console: 'readonly',
        crypto: 'readonly',
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'Workers não têm acesso ao window' },
        { name: 'document', message: 'Workers não têm acesso ao DOM' },
        { name: 'location', message: 'Use request.url em Workers' },
      ],
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
];
