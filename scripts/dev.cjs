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

if (args.includes('prod')) {
  console.log('\n🚀 Iniciando Frontend conectado à API de PRODUÇÃO...');
  console.log('⚠️  ATENÇÃO: Mudanças afetarão dados reais da produção!\n');
  
  // Executa npm run dev:prod dentro do subdiretório frontend
  const child = spawn('npm', ['run', 'dev:prod'], {
    cwd: 'frontend',
    shell: true,
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log('\n💻 Iniciando Worker modular e frontend local...\n');

  const root = path.resolve(__dirname, '..');
  const children = [
    spawn('npm', ['run', 'dev:worker'], {
      cwd: root,
      shell: true,
      stdio: 'inherit'
    }),
    spawn('npm', ['run', 'dev'], {
      cwd: path.join(root, 'frontend'),
      shell: true,
      stdio: 'inherit'
    })
  ];

  let stopping = false;
  const stopAll = (exitCode = 0) => {
    if (stopping) return;
    stopping = true;
    for (const child of children) {
      if (!child.killed) child.kill();
    }
    process.exit(exitCode);
  };

  for (const child of children) {
    child.on('exit', (code) => stopAll(code || 0));
  }

  process.on('SIGINT', () => stopAll(0));
  process.on('SIGTERM', () => stopAll(0));
}
