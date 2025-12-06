// ===== JEST POLYFILLS =====
// Este arquivo roda ANTES do ambiente de teste ser configurado
// Necessario para MSW funcionar com Jest + JSDOM
// Ordem critica: streams -> fetch (undici precisa de streams)

import { TextEncoder, TextDecoder } from 'node:util';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { BroadcastChannel } from 'node:worker_threads';

// 1. TextEncoder/Decoder primeiro
Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
});

// 2. Web Streams ANTES de importar undici
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  WritableStream: { value: WritableStream },
});

// 3. BroadcastChannel para MSW
Object.defineProperties(globalThis, {
  BroadcastChannel: { value: BroadcastChannel },
});

// 4. Fetch API via undici (DEPOIS de streams estarem definidos)
const { fetch, Headers, Request, Response } = await import('undici');
Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Headers: { value: Headers },
  Request: { value: Request, configurable: true },
  Response: { value: Response },
});
