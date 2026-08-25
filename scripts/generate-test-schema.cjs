const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const migrationsPath = path.join(root, 'database', 'migrations');
const outputPath = path.join(root, 'worker', 'tests', 'schema.generated.ts');

function splitStatements(sql) {
  const withoutComments = sql
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

  return withoutComments
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

const migrationFiles = fs.readdirSync(migrationsPath)
  .filter((name) => name.endsWith('.sql'))
  .sort();
const statements = migrationFiles.flatMap((name) => (
  splitStatements(fs.readFileSync(path.join(migrationsPath, name), 'utf8'))
));
const output = [
  '// Gerado por scripts/generate-test-schema.cjs. Não edite manualmente.',
  `export const SCHEMA_MIGRATIONS = ${JSON.stringify(migrationFiles)};`,
  `export const SCHEMA_STATEMENTS = ${JSON.stringify(statements, null, 2)};`,
  ''
].join('\n');

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n')
    : '';
  if (current !== output) {
    console.error('Schema de testes desatualizado. Execute: npm run db:schema:generate');
    process.exit(1);
  }
  console.log(`Schema de testes sincronizado (${statements.length} statements).`);
  process.exit(0);
}

fs.writeFileSync(outputPath, output);
console.log(`Schema de testes gerado com ${statements.length} statements.`);
