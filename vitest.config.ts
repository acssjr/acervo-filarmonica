import { cloudflareTest } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.toml' },
      miniflare: {
        d1Databases: ['DB'],
        r2Buckets: ['BUCKET'],
        bindings: {
          JWT_SECRET: 'test-jwt-secret-for-testing',
          ENVIRONMENT: 'test',
        },
      },
    }),
  ],
  test: {
    // Setup file para inicializar banco
    setupFiles: ['./worker/tests/setup.ts'],
    // Configurações gerais
    globals: true,
    include: ['worker/**/*.test.ts', 'worker/**/*.test.js'],
    exclude: ['node_modules', 'frontend'],
    // Timeout para testes de integração
    testTimeout: 10000,
  },
});
