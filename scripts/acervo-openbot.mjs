import { readFile } from 'node:fs/promises';
import { analisarPasta, verificarDuplicata } from '../frontend/src/utils/batchParser.js';
import { extrairInstrumento, normalizarTexto } from '../frontend/src/utils/instrumentParser.js';
import { canonicalizeInstrumentName } from '../worker/src/domain/instrumentos/instrumentUtils.js';

const api = process.env.ACERVO_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev';

async function request(path, options = {}) {
  const response = await fetch(api + path, {
    ...options,
    redirect: 'error',
    signal: AbortSignal.timeout(90_000),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || body.message || `HTTP ${response.status}`);
  return body;
}

async function catalog() {
  const [categories, scores] = await Promise.all([request('/api/categorias'), request('/api/partituras')]);
  return { categories, scores };
}

async function management(action, input) {
  const id = Number(input.obra);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('ID da obra inválido.');
  const path = `/api/partituras/${id}`;
  const secret = (await readFile(process.env.ACERVO_IMPORT_KEY_FILE, 'utf8')).trim();
  const headers = { 'X-Acervo-Import-Key': secret };
  const obra = await request(path);
  if (action === 'consultar-partes') return { obra, partes: await request(path + '/partes', { headers }) };

  const isPart = ['substituir-parte', 'excluir-parte'].includes(action);
  const parts = isPart ? await request(path + '/partes', { headers }) : [];
  const part = isPart ? parts.find(item => item.id === Number(input.parte)) : null;
  if (isPart && !part) throw new Error('A parte indicada não pertence a essa obra.');
  if (action === 'substituir-parte' || action === 'substituir-obra') {
    if (part && detectPart(input.nome) !== canonicalizeInstrumentName(part.instrumento)) {
      throw new Error(`O nome do PDF precisa identificar a parte "${part.instrumento}".`);
    }
    const form = new FormData();
    const pdf = new Blob([await readFile(input.arquivo)], { type: 'application/pdf' });
    form.set('arquivo', pdf, 'parte.pdf');
    if (!part) {
      await request(path, { method: 'PUT', headers, body: form });
      const confirmed = await request(path);
      if (!confirmed.arquivo_nome || confirmed.arquivo_nome === obra.arquivo_nome) {
        throw new Error('A API não confirmou a troca do PDF. Confira antes de tentar novamente.');
      }
      return { obra: confirmed.titulo, id, substituida: true };
    }
    await request(`/api/partes/${part.id}/substituir`, { method: 'PUT', headers, body: form });
    const confirmed = (await request(path + '/partes', { headers })).find(item => item.id === part.id);
    if (!confirmed || confirmed.instrumento !== part.instrumento || confirmed.arquivo_nome === part.arquivo_nome) {
      throw new Error('A API não confirmou a troca do PDF. Confira antes de tentar novamente.');
    }
    return { obra: obra.titulo, parte: confirmed.instrumento, id: part.id, substituida: true };
  }

  const target = part ? `/api/partes/${part.id}` : path;
  const targetId = part?.id ?? id;
  const result = await request(target, {
    method: 'DELETE', headers: { ...headers, 'X-Acervo-Confirm-Delete': String(targetId) },
  });
  if (result.success !== true) throw new Error('A API não confirmou a exclusão.');
  if (part) {
    if ((await request(path + '/partes', { headers })).some(item => item.id === part.id)) {
      throw new Error('A parte ainda aparece no Acervo. Confira antes de repetir.');
    }
  } else {
    const response = await fetch(api + path, { redirect: 'error', signal: AbortSignal.timeout(15_000) });
    if (response.status !== 404) throw new Error('A ausência da obra ainda não foi confirmada pela API.');
  }
  return { obra: obra.titulo, parte: part?.instrumento, id: targetId, excluida: true };
}

function detectPart(filename) {
  const part = extrairInstrumento(filename, { buscaParcial: false });
  return part.reconhecido ? canonicalizeInstrumentName(part.instrumento) : '';
}

function check(works, categories, scores) {
  const seen = new Set();
  for (const work of works) {
    const title = normalizarTexto(work.titulo || '');
    const issues = [];
    if (!title || !categories.some(category => category.id === work.categoria)) issues.push('Informe título e categoria do Acervo.');
    if (!work.compositor?.trim()) issues.push('Confirme o compositor ou informe autoria desconhecida.');
    if (work.ano && !/^[0-9]{4}$/.test(String(work.ano))) issues.push('Confira o ano.');
    if (!['pdf', 'partes'].includes(work.tipo) || (work.tipo === 'pdf' && work.arquivos.length !== 1)) {
      issues.push('Confirme se é um PDF único ou um conjunto de partes.');
    }
    if (seen.has(title)) issues.push('Título repetido no próprio lote.');
    seen.add(title);
    const duplicate = verificarDuplicata(work.titulo, scores);
    if (duplicate.duplicada) issues.push(`Já existe no Acervo (ID ${duplicate.partituraExistente.id}).`);
    if (work.tipo === 'partes') {
      const instruments = work.arquivos.map(file => {
        file.instrumento = canonicalizeInstrumentName(file.instrumento);
        if (!file.instrumento || file.instrumento !== detectPart(file.nome)) {
          issues.push(`Confira o instrumento explícito no nome de "${file.nome}".`);
        }
        return file.instrumento;
      });
      if (new Set(instruments).size !== instruments.length) issues.push('Confira partes repetidas ou numeração de vozes.');
    }
    if (new Set(work.arquivos.map(file => file.sha256)).size !== work.arquivos.length) issues.push('A obra contém PDFs idênticos.');
    work.pendencias = issues;
  }
  return works;
}

async function preview(input) {
  const { categories, scores } = await catalog();
  const works = input.map(group => {
    const parsed = analisarPasta(group.pasta, group.arquivos.map(file => ({ file: { name: file.nome } })), categories, scores);
    return {
      pasta: group.pasta,
      titulo: parsed.titulo,
      compositor: parsed.compositor,
      arranjador: parsed.arranjador,
      categoria: parsed.categoria,
      categoriaFonte: parsed.categoriaFonte,
      categoriaConfianca: parsed.categoriaConfianca,
      ano: '',
      tipo: parsed.arquivos.length > 1 ? 'partes' : '',
      arquivos: group.arquivos.map(file => ({
        ...file,
        instrumento: detectPart(file.nome),
      })),
    };
  });
  return { obras: check(works, categories, scores), categorias: categories.map(({ id, nome }) => ({ id, nome })) };
}

async function upload(work) {
  const form = new FormData();
  for (const field of ['titulo', 'compositor', 'arranjador', 'categoria', 'ano']) {
    form.set(field, String(work[field] || '').trim());
  }
  if (work.tipo === 'partes') form.set('total_arquivos', String(work.arquivos.length));
  for (const [index, file] of work.arquivos.entries()) {
    const pdf = new Blob([await readFile(file.local)], { type: 'application/pdf' });
    form.set(work.tipo === 'pdf' ? 'arquivo' : `arquivo_${index}`, pdf, file.nome);
    if (work.tipo === 'partes') {
      if (!file.instrumento || file.instrumento !== detectPart(file.nome)) {
        throw new Error(`O nome aprovado não corresponde ao PDF "${file.nome}".`);
      }
      form.set(`instrumento_${index}`, file.instrumento);
    }
  }
  const endpoint = work.tipo === 'pdf' ? '/api/partituras' : '/api/partituras/upload-pasta';
  const secret = (await readFile(process.env.ACERVO_IMPORT_KEY_FILE, 'utf8')).trim();
  const result = await request(endpoint, { method: 'POST', body: form, headers: { 'X-Acervo-Import-Key': secret } });
  if (!Number.isInteger(result.id) || result.id < 1) throw new Error('API não confirmou o ID cadastrado.');
  const saved = await request(`/api/partituras/${result.id}`);
  if (saved.id !== result.id || saved.titulo !== work.titulo.trim()) {
    throw new Error('O registro retornado não corresponde à obra enviada.');
  }
  if (work.tipo === 'partes' && result.partes_criadas !== work.arquivos.length) {
    throw new Error('A API retornou uma quantidade de partes diferente da aprovada.');
  }
  return result.id;
}

try {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const action = process.argv[2];
  if (action === 'preparar') {
    console.log(JSON.stringify(await preview(input)));
  } else if (action === 'revisar') {
    const { categories, scores } = await catalog();
    console.log(JSON.stringify(check(input, categories, scores)));
  } else if (action === 'enviar') {
    console.log(JSON.stringify(await upload(input)));
  } else if (['consultar-partes', 'substituir-parte', 'substituir-obra', 'excluir-obra', 'excluir-parte'].includes(action)) {
    console.log(JSON.stringify(await management(action, input)));
  } else {
    throw new Error('Comando inválido.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
