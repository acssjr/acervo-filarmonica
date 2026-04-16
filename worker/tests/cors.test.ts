import { describe, expect, it } from 'vitest';
import { getCorsHeaders } from '../src/infrastructure/security/cors.js';

describe('CORS headers', () => {
  it('does not wildcard requests without Origin outside development', () => {
    const headers = getCorsHeaders(new Request('https://api.example.test'), {
      ENVIRONMENT: 'production'
    } as any);

    expect(headers).not.toHaveProperty('Access-Control-Allow-Origin');
  });

  it('only wildcards requests without Origin in development', () => {
    const headers = getCorsHeaders(new Request('https://api.example.test'), {
      ENVIRONMENT: 'development'
    } as any);

    expect(headers).toEqual(expect.objectContaining({
      'Access-Control-Allow-Origin': '*'
    }));
  });
});
