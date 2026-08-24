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
  try {
    const result = execSync('npx wrangler d1 create acervo-db', { encoding: 'utf-8' });
    console.log(result);
    
    // Extrair database_id do output
    const match = result.match(/database_id = "([^"]+)"/);
    if (match) {
      const databaseId = match[1];
      
      // Atualizar wrangler.toml
      let wranglerContent = fs.readFileSync('wrangler.toml', 'utf-8');
      wranglerContent = wranglerContent.replace('SEU_DATABASE_ID_AQUI', databaseId);
      fs.writeFileSync('wrangler.toml', wranglerContent);
      
      console.log(`✅ Database ID atualizado: ${databaseId}\n`);
    }
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Banco já existe, continuando...\n');
    } else {
      throw error;
    }
  }
  
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
