import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [command, target, method] = process.argv.slice(2);
const prefix = '/api/admin/openbot';
const base = process.env.ACERVO_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev';
const keyPath = process.env.ACERVO_OPENBOT_KEY_FILE || fileURLToPath(new URL('.openbot-key', import.meta.url));
const options = {
  consultar: [prefix + '/consulta', 'POST', () => ({ destino: target })],
  propor: [prefix + '/operacoes', 'POST', () => ({
    destino: target,
    metodo: method?.toUpperCase(),
    dados: JSON.parse(readFileSync(0, 'utf8') || 'null')
  })],
  estado: [prefix + '/operacoes/' + encodeURIComponent(target || ''), 'GET', () => undefined]
};

try {
  if (!Object.hasOwn(options, command) || !target) throw new Error('Use consultar CAMINHO, propor CAMINHO MÉTODO ou estado ID.');
  const [path, verb, getBody] = options[command];
  const response = await fetch(new URL(path, base), {
    method: verb,
    redirect: 'error',
    headers: {
      'Content-Type': 'application/json',
      'X-Acervo-OpenBot-Key': readFileSync(keyPath, 'utf8').trim()
    },
    body: JSON.stringify(getBody()),
    signal: AbortSignal.timeout(20000)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'HTTP ' + response.status);
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
