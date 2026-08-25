/**
 * Script de Setup - Acervo Digital
 * Configura os recursos no Cloudflare
 */

const { execSync } = require('child_process');
const fs = require('fs');

function run(command, showOutput = true) {
  try {
    const result = execSync(command, { encoding: 'utf-8', stdio: showOutput ? 'inherit' : 'pipe' });
    return result;
  } catch (error) {
    console.error(`Erro ao executar: ${command}`);
    throw error;
  }
}

function extractDatabaseId(output) {
  const match = output.match(/database_id\s*=\s*"([^"]+)"/);
  return match?.[1] || null;
}

function findExistingDatabaseId() {
  const databases = JSON.parse(execSync('npx wrangler d1 list --json', { encoding: 'utf-8' }));
  const database = databases.find(item => item.name === 'acervo-db');
  return database?.uuid || database?.id || null;
}

function updateDatabaseBinding(databaseId) {
  const configPath = 'wrangler.toml';
  const lines = fs.readFileSync(configPath, 'utf-8').split(/\r?\n/);
  let inD1Block = false;
  let bindingIsDb = false;
  let databaseIdLine = -1;

  for (let index = 0; index < lines.length; index++) {
    const trimmed = lines[index].trim();
    if (trimmed.startsWith('[[')) {
      if (inD1Block && bindingIsDb && databaseIdLine >= 0) break;
      inD1Block = trimmed === '[[d1_databases]]';
      bindingIsDb = false;
      databaseIdLine = -1;
      continue;
    }
    if (!inD1Block) continue;
    if (/^binding\s*=\s*"DB"$/.test(trimmed)) bindingIsDb = true;
    if (/^database_id\s*=/.test(trimmed)) databaseIdLine = index;
  }

  if (!bindingIsDb || databaseIdLine < 0) {
    throw new Error('Binding D1 "DB" não encontrado em wrangler.toml');
  }

  lines[databaseIdLine] = `database_id = "${databaseId}"`;
  fs.writeFileSync(configPath, `${lines.join('\n')}\n`);
}

async function main() {
  console.log('\n🎺 ACERVO DIGITAL - Setup\n');
  console.log('Este script vai configurar os recursos no Cloudflare.\n');
  
  // Verificar se está logado
  console.log('📋 Verificando login no Cloudflare...\n');
  try {
    run('npx wrangler whoami', false);
  } catch {
    console.log('❌ Você não está logado. Fazendo login...\n');
    run('npx wrangler login');
  }
  
  // Criar banco D1
  console.log('\n📦 Criando banco de dados D1...\n');
  let databaseId = null;
  try {
    const result = execSync('npx wrangler d1 create acervo-db', { encoding: 'utf-8' });
    console.log(result);
    databaseId = extractDatabaseId(result);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Banco já existe; localizando o binding correto...\n');
      databaseId = findExistingDatabaseId();
    } else {
      throw error;
    }
  }

  if (!databaseId) {
    throw new Error('Não foi possível determinar o UUID do banco acervo-db');
  }
  updateDatabaseBinding(databaseId);
  console.log(`✅ Binding DB atualizado: ${databaseId}\n`);
  
  // Criar bucket R2
  console.log('📦 Criando bucket R2...\n');
  try {
    run('npx wrangler r2 bucket create acervo-pdfs');
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('⚠️  Bucket já existe, continuando...\n');
    }
  }
  
  // Executar migrations
  console.log('\n📋 Criando tabelas no banco...\n');
  run('npm run db:migrate:remote');
  
  console.log('\n✅ Setup concluído!\n');
  console.log('Próximos passos:');
  console.log('1. npx wrangler secret put JWT_SECRET - Configurar autenticação');
  console.log('2. Configurar o binding RATE_LIMIT no wrangler.toml');
  console.log('3. npm run deploy       - Deploy da API');
  console.log('4. npm run deploy:pages - Deploy do frontend\n');
}

main().catch(error => {
  console.error('❌ Erro no setup:', error.message);
  process.exit(1);
});
