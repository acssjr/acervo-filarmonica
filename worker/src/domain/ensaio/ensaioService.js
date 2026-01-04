// ===== ENSAIO SERVICE =====
// Lógica de negócio para gestão de partituras tocadas em ensaios

/**
 * Retorna todas as partituras tocadas em um ensaio específico
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @returns {Promise<Object>} - Lista de partituras com detalhes
 */
export async function getPartiturasEnsaio(env, dataEnsaio) {
  const result = await env.DB.prepare(`
    SELECT
      ep.id, ep.ordem, ep.partitura_id,
      p.titulo, p.compositor, p.categoria_id,
      c.nome as categoria_nome, c.cor as categoria_cor, c.emoji as categoria_emoji
    FROM ensaios_partituras ep
    JOIN partituras p ON ep.partitura_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    WHERE ep.data_ensaio = ?
    ORDER BY ep.ordem ASC
  `).bind(dataEnsaio).all();

  return { partituras: result.results || [] };
}

/**
 * Adiciona uma partitura ao ensaio
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @param {number} partituraId - ID da partitura
 * @param {number} adminId - ID do admin que está adicionando
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function addPartituraEnsaio(env, dataEnsaio, partituraId, adminId) {
  // Buscar próxima ordem
  const maxOrdem = await env.DB.prepare(`
    SELECT COALESCE(MAX(ordem), -1) + 1 as next_ordem
    FROM ensaios_partituras WHERE data_ensaio = ?
  `).bind(dataEnsaio).first();

  try {
    await env.DB.prepare(`
      INSERT INTO ensaios_partituras (data_ensaio, partitura_id, ordem, criado_por)
      VALUES (?, ?, ?, ?)
    `).bind(dataEnsaio, partituraId, maxOrdem.next_ordem, adminId).run();

    return { sucesso: true };
  } catch (error) {
    // Se erro é de UNIQUE constraint, já existe
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Partitura já foi adicionada a este ensaio');
    }
    throw error;
  }
}

/**
 * Remove uma partitura do ensaio
 * @param {Object} env - Cloudflare Worker environment
 * @param {number} id - ID do registro em ensaios_partituras
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function removePartituraEnsaio(env, id) {
  await env.DB.prepare(`DELETE FROM ensaios_partituras WHERE id = ?`)
    .bind(id).run();
  return { sucesso: true };
}

/**
 * Reordena as partituras de um ensaio
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @param {Array<Object>} ordens - Array de { id, ordem }
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function reorderPartiturasEnsaio(env, dataEnsaio, ordens) {
  // Atualizar ordem de cada partitura
  for (const item of ordens) {
    await env.DB.prepare(`
      UPDATE ensaios_partituras
      SET ordem = ?
      WHERE id = ? AND data_ensaio = ?
    `).bind(item.ordem, item.id, dataEnsaio).run();
  }

  return { sucesso: true };
}
