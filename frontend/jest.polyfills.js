// ===== JEST POLYFILLS =====
// Este arquivo roda ANTES do ambiente de teste ser configurado
// Necessario para MSW funcionar com Jest + JSDOM
// Ordem critica: timers -> streams -> messaging -> fetch

import { TextEncoder, TextDecoder } from 'node:util';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { BroadcastChannel, MessageChannel, MessagePort } from 'node:worker_threads';
import { setImmediate, clearImmediate } from 'node:timers';

// 0. setImmediate/clearImmediate (requerido por undici no JSDOM)
Object.defineProperties(globalThis, {
  setImmediate: { value: setImmediate, writable: true, configurable: true },
  clearImmediate: { value: clearImmediate, writable: true, configurable: true },
});

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

// 3. MessageChannel e MessagePort (requerido por undici)
Object.defineProperties(globalThis, {
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
  BroadcastChannel: { value: BroadcastChannel },
});

// 4. Fetch API via undici (DEPOIS de streams e messaging estarem definidos)
// IMPORTANTE: configurable: true e writable: true para MSW poder interceptar
const { fetch, Headers, Request, Response, FormData } = await import('undici');
Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
  FormData: { value: FormData, writable: true, configurable: true },
});
