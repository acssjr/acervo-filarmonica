/**
 * Script de Inicialização de Dev - Acervo Digital (CommonJS)
 * Permite iniciar o dev local ou conectar à produção
 */

const { spawn } = require('node:child_process');
const path = require('node:path');

const args = process.argv.slice(2);
const validModes = new Set(['prod']);
const invalidMode = args.find(arg => !validModes.has(arg));
if (invalidMode) {
  console.error(`Modo inválido: ${invalidMode}. Use "npm run dev" ou "npm run dev:prod".`);
  process.exit(1);
}

function spawnNpm(npmArgs, cwd) {
  const windows = process.platform === 'win32';
  const command = windows ? (process.env.ComSpec || 'cmd.exe') : 'npm';
  const commandArgs = windows ? ['/d', '/s', '/c', 'npm', ...npmArgs] : npmArgs;
  return spawn(command, commandArgs, {
    cwd,
    shell: false,
    stdio: 'inherit',
    detached: process.platform !== 'win32'
  });
}

function terminateProcessTree(child, signal = 'SIGTERM') {
  if (!child?.pid || child.exitCode !== null) return Promise.resolve();

  if (process.platform === 'win32') {
    return new Promise(resolve => {
      const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
        stdio: 'ignore',
        windowsHide: true
      });
      killer.once('error', () => {
        if (!child.killed) child.kill(signal);
        resolve();
      });
      killer.once('exit', resolve);
    });
  }

  try {
    process.kill(-child.pid, signal);
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
  return Promise.resolve();
}

function supervise(children) {
  let stopping = false;

  const stopAll = async (exitCode = 0) => {
    if (stopping) return;
    stopping = true;
    await Promise.all(children.map(child => terminateProcessTree(child)));
    process.exit(exitCode);
  };

  for (const child of children) {
    child.on('exit', code => stopAll(code || 0));
  }

  process.on('SIGINT', () => stopAll(0));
  process.on('SIGTERM', () => stopAll(0));
}

if (args.includes('prod')) {
  console.log('\n🚀 Iniciando Frontend conectado à API de PRODUÇÃO...');
  console.log('⚠️  ATENÇÃO: Mudanças afetarão dados reais da produção!\n');

  // Executa npm run dev:prod dentro do subdiretório frontend
  supervise([spawnNpm(['run', 'dev:prod'], 'frontend')]);
} else {
  console.log('\n💻 Iniciando Worker modular e frontend local...\n');

  const root = path.resolve(__dirname, '..');
  const children = [
    spawnNpm(['run', 'dev:worker'], root),
    spawnNpm(['run', 'dev'], path.join(root, 'frontend'))
  ];
  supervise(children);
}
