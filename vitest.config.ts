import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    // Pool de workers - executa testes no runtime workerd real
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          // Bindings disponíveis nos testes
          d1Databases: ['DB'],
          r2Buckets: ['BUCKET'],
          bindings: {
            JWT_SECRET: 'test-jwt-secret-for-testing',
            ENVIRONMENT: 'test',
          },
        },
      },
    },
    // Setup file para inicializar banco
    setupFiles: ['./worker/tests/setup.ts'],
    // Configurações gerais
    globals: true,
    include: ['worker/**/*.test.ts', 'worker/**/*.test.js'],
    exclude: ['node_modules', 'frontend'],
    // Timeout para testes de integração
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['worker/src/**/*.js'],
      exclude: ['worker/tests/**'],
    },
  },
});
