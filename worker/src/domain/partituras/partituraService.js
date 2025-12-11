// worker/src/domain/partituras/partituraService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';

/**
 * Listar todas as partituras
 *
 * Extraido de: worker/index.js linhas 396-432
 */
export async function getPartituras(request, env) {
  const url = new URL(request.url);
  const categoria = url.searchParams.get('categoria');
  const busca = url.searchParams.get('busca');
  const destaque = url.searchParams.get('destaque');

  let query = `
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor,
           (SELECT COUNT(*) FROM partes WHERE partitura_id = p.id) as total_partes
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.ativo = 1
  `;
  const params = [];

  if (categoria) {
    query += ' AND p.categoria_id = ?';
    params.push(categoria);
  }

  if (busca) {
    query += ' AND (p.titulo LIKE ? OR p.compositor LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`);
  }

  if (destaque === '1') {
    query += ' AND p.destaque = 1';
  }

  query += ' ORDER BY p.titulo ASC';

  const stmt = env.DB.prepare(query);
  const result = await (params.length ? stmt.bind(...params) : stmt).all();

  return jsonResponse(result.results, 200, request);
}

/**
 * Obter uma partitura
 *
 * Extraido de: worker/index.js linhas 434-448
 */
export async function getPartitura(id, request, env) {
  const result = await env.DB.prepare(`
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ? AND p.ativo = 1
  `).bind(id).first();

  if (!result) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  return jsonResponse(result, 200, request);
}

/**
 * Criar partitura (Admin)
 *
 * Extraido de: worker/index.js linhas 565-616
 */
export async function createPartitura(request, env, admin) {
  const formData = await request.formData();
  const titulo = formData.get('titulo');
  const compositor = formData.get('compositor');
  const arranjador = formData.get('arranjador');
  const categoria = formData.get('categoria');
  const ano = formData.get('ano');
  const descricao = formData.get('descricao');
  const destaque = formData.get('destaque') === '1' ? 1 : 0;
  const arquivo = formData.get('arquivo');

  if (!titulo || !compositor || !categoria || !arquivo) {
    return errorResponse('Campos obrigatórios: titulo, compositor, categoria, arquivo', 400, request);
  }

  // Verifica se já existe partitura com mesmo título (normalizado)
  const tituloNorm = titulo.trim().toLowerCase();
  const duplicada = await env.DB.prepare(`
    SELECT id, titulo FROM partituras
    WHERE LOWER(TRIM(titulo)) = ? AND ativo = 1
  `).bind(tituloNorm).first();

  if (duplicada) {
    return errorResponse(`Já existe uma partitura com o título "${duplicada.titulo}"`, 409, request);
  }

  const timestamp = Date.now();
  const nomeArquivo = `${timestamp}_${arquivo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  await env.BUCKET.put(nomeArquivo, arquivo.stream(), {
    httpMetadata: { contentType: 'application/pdf' },
  });

  const result = await env.DB.prepare(`
    INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, descricao, arquivo_nome, arquivo_tamanho, destaque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    titulo,
    compositor,
    arranjador || null,
    categoria,
    ano ? parseInt(ano) : null,
    descricao || null,
    nomeArquivo,
    arquivo.size,
    destaque
  ).run();

  // Registra atividade
  await registrarAtividade(env, 'nova_partitura', titulo, compositor, admin.id);

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Partitura adicionada com sucesso!'
  }, 201, request);
}

/**
 * Upload de pasta com múltiplas partes (Admin)
 *
 * Extraido de: worker/index.js linhas 618-702
 */
export async function uploadPastaPartitura(request, env, admin) {
  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const compositor = formData.get('compositor') || '';
    const arranjador = formData.get('arranjador') || '';
    const categoria = formData.get('categoria');
    const ano = formData.get('ano');
    const totalArquivos = parseInt(formData.get('total_arquivos') || '0');

    if (!titulo || !categoria || totalArquivos === 0) {
      return errorResponse('Campos obrigatórios: titulo, categoria, arquivos', 400, request);
    }

    // Verifica se já existe partitura com mesmo título (normalizado)
    const tituloNorm = titulo.trim().toLowerCase();
    const duplicada = await env.DB.prepare(`
      SELECT id, titulo FROM partituras
      WHERE LOWER(TRIM(titulo)) = ? AND ativo = 1
    `).bind(tituloNorm).first();

    if (duplicada) {
      return errorResponse(`Já existe uma partitura com o título "${duplicada.titulo}"`, 409, request);
    }

    // Cria a partitura principal
    const result = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, arquivo_nome, arquivo_tamanho, destaque)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(
      titulo,
      compositor,
      arranjador || null,
      categoria,
      ano ? parseInt(ano) : null,
      'multiplas_partes',
      0
    ).run();

    const partituraId = result.meta.last_row_id;
    const timestamp = Date.now();
    let partesAdicionadas = 0;

    // Processa cada arquivo
    for (let i = 0; i < totalArquivos; i++) {
      const arquivo = formData.get(`arquivo_${i}`);
      const instrumento = formData.get(`instrumento_${i}`);

      if (!arquivo || !instrumento) continue;

      const arrayBuffer = await arquivo.arrayBuffer();

      // Validar magic bytes do PDF (%PDF-)
      const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
      const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

      if (!isPdf) {
        // Se arquivo inválido, deleta a partitura criada e retorna erro
        await env.DB.prepare('DELETE FROM partituras WHERE id = ?').bind(partituraId).run();
        return errorResponse(`Arquivo "${arquivo.name}" não é um PDF válido`, 400, request);
      }

      const nomeArquivoStorage = `${timestamp}_${partituraId}_${instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

      await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
        httpMetadata: { contentType: 'application/pdf' }
      });

      await env.DB.prepare(`
        INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
        VALUES (?, ?, ?)
      `).bind(partituraId, instrumento, nomeArquivoStorage).run();

      partesAdicionadas++;
    }

    await registrarAtividade(env, 'nova_partitura', titulo, `${compositor} • ${partesAdicionadas} partes`, admin.id);

    return jsonResponse({
      success: true,
      id: partituraId,
      partes_criadas: partesAdicionadas,
      message: `Partitura criada com ${partesAdicionadas} partes!`
    }, 201, request);

  } catch (error) {
    console.error('Erro no upload:', error);
    return errorResponse('Erro no upload', 500, request);
  }
}

/**
 * Atualizar partitura (Admin)
 *
 * Extraido de: worker/index.js linhas 880-908
 */
export async function updatePartitura(id, request, env) {
  const data = await request.json();
  const { titulo, compositor, arranjador, categoria, categoria_id, ano, descricao, destaque } = data;

  const categoriaFinal = categoria || categoria_id;

  await env.DB.prepare(`
    UPDATE partituras
    SET titulo = ?, compositor = ?, arranjador = ?, categoria_id = ?, ano = ?, descricao = ?, destaque = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    titulo,
    compositor,
    arranjador || null,
    categoriaFinal,
    ano || null,
    descricao || null,
    destaque ? 1 : 0,
    id
  ).run();

  return jsonResponse({ success: true, message: 'Partitura atualizada!' }, 200, request);
}

/**
 * Deletar partitura (Admin) - soft delete
 *
 * Extraido de: worker/index.js linhas 910-922
 */
export async function deletePartitura(id, request, env) {
  await env.DB.prepare(
    'UPDATE partituras SET ativo = 0, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(id).run();

  return jsonResponse({ success: true, message: 'Partitura removida!' }, 200, request);
}
