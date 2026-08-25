/// <reference types="@cloudflare/vitest-plugin" />

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
    JWT_SECRET: string;
    ENVIRONMENT: string;
  }
}
