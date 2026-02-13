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
  await env.DB.prepare(`
    INSERT INTO ensaios_partituras (data_ensaio, partitura_id, ordem, criado_por)
    VALUES (?, ?, COALESCE((SELECT MAX(ordem) FROM ensaios_partituras WHERE data_ensaio = ?), -1) + 1, ?)
    ON CONFLICT(data_ensaio, partitura_id) DO UPDATE SET
      ordem = COALESCE((SELECT MAX(ordem) FROM ensaios_partituras WHERE data_ensaio = excluded.data_ensaio), -1) + 1,
      criado_por = excluded.criado_por
  `).bind(dataEnsaio, partituraId, dataEnsaio, adminId).run();

  return { sucesso: true };
}

/**
 * Remove uma partitura do ensaio
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @param {number} partituraId - ID da partitura
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function removePartituraEnsaio(env, dataEnsaio, partituraId) {
  await env.DB.prepare(`DELETE FROM ensaios_partituras WHERE data_ensaio = ? AND partitura_id = ?`)
    .bind(dataEnsaio, partituraId).run();
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
