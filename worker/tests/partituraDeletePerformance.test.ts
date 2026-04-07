import { describe, expect, it, vi } from 'vitest';
import { deleteBucketObjects } from '../src/domain/partituras/partituraService.js';

describe('deleteBucketObjects', () => {
  it('dispara delecoes de R2 em paralelo e ignora falhas individuais', async () => {
    const resolvers: Array<() => void> = [];
    const calls: string[] = [];
    const bucket = {
      delete: vi.fn((key: string) => new Promise<void>((resolve, reject) => {
        calls.push(key);
        resolvers.push(() => {
          if (key === 'parte-2.pdf') reject(new Error('R2 offline'));
          else resolve();
        });
      })),
    };

    const promise = deleteBucketObjects(bucket, ['parte-1.pdf', 'parte-2.pdf', 'parte-3.pdf']);

    await Promise.resolve();
    expect(calls).toEqual(['parte-1.pdf', 'parte-2.pdf', 'parte-3.pdf']);

    resolvers.forEach(resolve => resolve());
    await expect(promise).resolves.toBeUndefined();
  });
});
