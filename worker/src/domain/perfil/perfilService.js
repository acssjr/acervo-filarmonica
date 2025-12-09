// worker/src/domain/perfil/perfilService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';

/**
 * Obter perfil do usuário logado
 *
 * Extraido de: worker/index.js linhas 1596-1619
 */
export async function getPerfil(request, env, user) {
  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  return jsonResponse({
    id: user.id,
    username: user.username,
    nome: user.nome,
    admin: user.admin === 1,
    instrumento_id: user.instrumento_id,
    instrumento_nome: instrumentoNome,
    foto_url: user.foto_url,
  }, 200, request);
}

/**
 * Atualizar perfil do usuário logado
 *
 * Extraido de: worker/index.js linhas 1621-1653
 */
export async function updatePerfil(request, env, user) {
  const { nome, instrumento_id } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined && nome.trim()) {
    updates.push('nome = ?');
    params.push(nome.trim());
  }

  if (instrumento_id !== undefined) {
    updates.push('instrumento_id = ?');
    params.push(instrumento_id || null);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(user.id);

  await env.DB.prepare(`
    UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Perfil atualizado!' }, 200, request);
}

/**
 * Upload de foto de perfil - com validação de magic bytes
 *
 * Extraido de: worker/index.js linhas 1655-1724
 */
export async function uploadFotoPerfil(request, env, user) {
  const formData = await request.formData();
  const foto = formData.get('foto');

  if (!foto) {
    return errorResponse('Nenhuma foto enviada', 400, request);
  }

  // Verificar tamanho (max 2MB)
  if (foto.size > 2 * 1024 * 1024) {
    return errorResponse('Imagem muito grande (máximo 2MB)', 400, request);
  }

  // Verificar tipo MIME
  if (!foto.type.startsWith('image/')) {
    return errorResponse('Arquivo deve ser uma imagem', 400, request);
  }

  // Validar magic bytes
  const arrayBuffer = await foto.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer.slice(0, 8));

  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;

  if (!isJpeg && !isPng && !isGif && !isWebp) {
    return errorResponse('Formato de imagem inválido. Use JPEG, PNG, GIF ou WebP.', 400, request);
  }

  // Determinar extensão baseada nos magic bytes
  let ext = 'jpg';
  if (isPng) ext = 'png';
  else if (isGif) ext = 'gif';
  else if (isWebp) ext = 'webp';

  const nomeArquivo = `perfil_${user.id}_${Date.now()}.${ext}`;

  // Upload para R2
  await env.BUCKET.put(nomeArquivo, arrayBuffer, {
    httpMetadata: { contentType: foto.type },
  });

  // Deletar foto antiga se existir
  if (user.foto_url) {
    try {
      await env.BUCKET.delete(user.foto_url);
    } catch (e) {
      // Ignora erro se arquivo não existir
    }
  }

  // Atualizar no banco
  await env.DB.prepare(
    'UPDATE usuarios SET foto_url = ? WHERE id = ?'
  ).bind(nomeArquivo, user.id).run();

  return jsonResponse({
    success: true,
    foto_url: nomeArquivo,
    message: 'Foto atualizada!'
  }, 200, request);
}
