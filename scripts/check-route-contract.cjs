const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const routesDir = path.join(root, 'worker', 'src', 'routes');
const openapiPath = path.join(root, 'worker', 'openapi.yaml');

const routeFiles = fs.readdirSync(routesDir)
  .filter(file => file.endsWith('Routes.js'))
  .map(file => path.join(routesDir, file));

const registered = new Set();
const routePattern = /router\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;
for (const file of routeFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(routePattern)) {
    const method = match[1].toUpperCase();
    const routePath = match[2].replace(/:([A-Za-z][A-Za-z0-9_]*)/g, '{$1}');
    registered.add(`${method} ${routePath}`);
  }
}

const spec = fs.readFileSync(openapiPath, 'utf8');
const documented = new Set();
let currentPath = null;
for (const line of spec.split(/\r?\n/)) {
  const pathMatch = line.match(/^  (\/api\/[^:]+|\/api\/[^\s]+):\s*$/);
  if (pathMatch) {
    currentPath = pathMatch[1];
    continue;
  }
  const methodMatch = currentPath && line.match(/^    (get|post|put|patch|delete):\s*$/);
  if (methodMatch) documented.add(`${methodMatch[1].toUpperCase()} ${currentPath}`);
}

const missing = [...registered].filter(route => !documented.has(route)).sort();
if (missing.length) {
  console.error('Rotas ativas ausentes do OpenAPI:');
  for (const route of missing) console.error(`- ${route}`);
  process.exit(1);
}

console.log(`Contrato de rotas verificado: ${registered.size} rotas documentadas.`);

