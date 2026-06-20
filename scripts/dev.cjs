/**
 * Script de Inicialização de Dev - Acervo Digital (CommonJS)
 * Permite iniciar o dev local ou conectar à produção
 */

const { spawn } = require('child_process');

const args = process.argv.slice(2);

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
  console.log('\n💻 Iniciando servidor local (Wrangler Pages Dev)...');
  
  // Executa wrangler pages dev frontend --d1=ACERVO_DB --r2=ACERVO_BUCKET
  const child = spawn('npx', [
    'wrangler',
    'pages',
    'dev',
    'frontend',
    '--d1=ACERVO_DB',
    '--r2=ACERVO_BUCKET'
  ], {
    shell: true,
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
