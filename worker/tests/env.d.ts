/// <reference types="@cloudflare/vitest-plugin" />

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
    LOGIN_RATE_LIMITER: RateLimit;
    CHECK_USER_RATE_LIMITER: RateLimit;
    TRACKING_RATE_LIMITER: RateLimit;
    JWT_SECRET: string;
    ENVIRONMENT: string;
  }
}
