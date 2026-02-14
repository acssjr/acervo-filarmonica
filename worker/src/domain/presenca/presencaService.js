// ===== PRESENCA SERVICE =====
// Lógica de negócio para controle de presença em ensaios



/**
 * Calcula o streak (sequência consecutiva) de presenças de um usuário
 * Baseado no calendário fixo de ensaios (segundas e quartas)
 * @param {Object} env - Cloudflare Worker environment
 * @param {number} usuarioId - ID do usuário
 * @returns {Promise<Object>} - Dados do streak e estatísticas
 */
export async function calcularStreak(env, usuarioId) {
  // Buscar todas presenças do usuário
  const presencasUsuario = await env.DB.prepare(`
    SELECT data_ensaio
    FROM presencas
    WHERE usuario_id = ?
    ORDER BY data_ensaio DESC
  `).bind(usuarioId).all();

  const presencasSet = new Set(presencasUsuario.results.map(p => p.data_ensaio));

  // Buscar os últimos 50 ensaios REAIS registrados no banco
  // Isso garante que o cálculo seja baseado no calendário real da banda
  const ultimosEnsaiosResult = await env.DB.prepare(`
    SELECT DISTINCT data_ensaio
    FROM presencas
    ORDER BY data_ensaio DESC
    LIMIT 50
  `).all();

  const ultimosEnsaios = (ultimosEnsaiosResult.results || []).map(r => r.data_ensaio);

  // Calcular streak: contar ensaios consecutivos com presença a partir do mais recente
  let streak = 0;
  // IMPORTANTE: O loop deve percorrer os ensaios REAIS em ordem decrescente (mais recente primeiro)
  for (const dataEnsaio of ultimosEnsaios) {
    if (presencasSet.has(dataEnsaio)) {
      streak++;
    } else {
      // Se o usuário não estava presente neste ensaio real, o streak quebra.
      // (Poderia haver lógica de "recesso" ou "falta justificada" aqui no futuro)
      break;
    }
  }

  // Estatísticas gerais
  const totalPresencas = presencasUsuario.results.length;
  // Total de ensaios considerados para o percentual (limitado aos ultimos 50 ou menos se houver poucos registros)
  const totalEnsaiosBase = ultimosEnsaios.length;

  // Percentual sobre os últimos N ensaios reais
  const percentual = totalEnsaiosBase > 0
    ? (ultimosEnsaios.filter(e => presencasSet.has(e)).length / totalEnsaiosBase) * 100
    : 0;

  return {
    streak,
    ultimo_ensaio: presencasUsuario.results[0]?.data_ensaio || null,
    total_presencas: totalPresencas,
    total_ensaios: totalEnsaiosBase,
    percentual_frequencia: Math.round(percentual * 10) / 10 // 1 casa decimal
  };
}

/**
 * Retorna dados completos de presença de um usuário (para frontend)
 * @param {Object} env - Cloudflare Worker environment
 * @param {number} usuarioId - ID do usuário
 * @returns {Promise<Object>} - Payload completo com streak, histórico, etc
 */
export async function getPresencaUsuario(env, usuarioId) {
  // 1. Buscar os últimos 100 ensaios REAIS registrados no banco
  // (datas onde houve pelo menos uma presença registrada por qualquer pessoa)
  const ultimasDatas = await env.DB.prepare(`
    SELECT DISTINCT data_ensaio
    FROM presencas
    ORDER BY data_ensaio DESC
    LIMIT 100
  `).all();

  const datasEnsaios = (ultimasDatas.results || []).map(r => r.data_ensaio);

  // Mapear numeração dos ensaios
  const allRehearsals = await env.DB.prepare(`
    SELECT DISTINCT data_ensaio FROM presencas ORDER BY data_ensaio ASC
  `).all();

  const rehearsalMap = new Map();
  (allRehearsals.results || []).forEach((r, index) => {
    rehearsalMap.set(r.data_ensaio, index + 1);
  });

  // Se não houver ensaios, retornar vazio
  if (datasEnsaios.length === 0) {
    return {
      streak: 0,
      ultimo_ensaio: null,
      ultimos_ensaios: [],
      total_presencas: 0,
      percentual_frequencia: 0
    };
  }

  // 2. Calcular streak e estatísticas
  const streakData = await calcularStreak(env, usuarioId);

  // 3. Buscar presenças do usuário nessas datas específicas
  const presencasUsuario = await env.DB.prepare(`
    SELECT data_ensaio FROM presencas
    WHERE usuario_id = ? AND data_ensaio IN (${datasEnsaios.map(() => '?').join(',')})
  `).bind(usuarioId, ...datasEnsaios).all();

  const presencasSet = new Set(presencasUsuario.results.map(p => p.data_ensaio));

  // 4. Buscar contagem de partituras por ensaio
  const partiturasPorEnsaio = await env.DB.prepare(`
    SELECT data_ensaio, COUNT(*) as total
    FROM ensaios_partituras
    WHERE data_ensaio IN (${datasEnsaios.map(() => '?').join(',')})
    GROUP BY data_ensaio
  `).bind(...datasEnsaios).all();

  const partiturasMap = new Map(
    partiturasPorEnsaio.results.map(p => [p.data_ensaio, p.total])
  );

  // 5. Montar array de ensaios com todas as informações
  const ultimosEnsaios = datasEnsaios.map(dataEnsaio => {
    // Adicionar T12:00:00Z para garantir que a data seja interpretada corretamente no dia (evita timezone shift)
    const data = new Date(dataEnsaio + 'T12:00:00Z');
    const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getUTCDay()];

    return {
      data_ensaio: dataEnsaio,
      dia_semana: diaSemana,
      usuario_presente: presencasSet.has(dataEnsaio) ? 1 : 0,
      total_partituras: partiturasMap.get(dataEnsaio) || 0,
      numero_ensaio: rehearsalMap.get(dataEnsaio) || 0
    };
  });

  return {
    ...streakData,
    ultimos_ensaios: ultimosEnsaios
  };
}

/**
 * Registra presenças de múltiplos usuários em um ensaio (batch)
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @param {Array<number>} usuariosIds - IDs dos usuários presentes
 * @param {number} adminId - ID do admin que está registrando
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function registrarPresencas(env, dataEnsaio, usuariosIds, adminId) {
  // Validar data não é futura
  const hoje = new Date().toISOString().split('T')[0];
  if (dataEnsaio > hoje) {
    throw new Error('Data não pode ser futura');
  }

  // Validar que há usuários
  if (!usuariosIds || usuariosIds.length === 0) {
    throw new Error('Nenhum usuário selecionado');
  }

  let registradas = 0;
  const erros = [];

  // Inserir cada presença (UNIQUE constraint previne duplicatas)
  for (const usuarioId of usuariosIds) {
    try {
      await env.DB.prepare(`
        INSERT INTO presencas (usuario_id, data_ensaio, criado_por)
        VALUES (?, ?, ?)
      `).bind(usuarioId, dataEnsaio, adminId).run();

      registradas++;
    } catch (error) {
      // Se erro é de UNIQUE constraint, ignorar (já existe)
      if (error.message.includes('UNIQUE constraint failed')) {
        continue; // Presença já registrada, não é erro
      }
      erros.push({ usuario_id: usuarioId, erro: error.message });
    }
  }

  return {
    sucesso: true,
    registradas,
    data_ensaio: dataEnsaio,
    erros: erros.length > 0 ? erros : undefined
  };
}

/**
 * Retorna todas as presenças agrupadas por ensaio (para admin)
 * @param {Object} env - Cloudflare Worker environment
 * @returns {Promise<Object>} - Lista de ensaios com presenças
 */
export async function getTodasPresencas(env) {
  // Buscar todos os ensaios (datas únicas) com contagem de presenças e partituras
  const ensaios = await env.DB.prepare(`
    SELECT
      p.data_ensaio,
      CASE CAST(strftime('%w', p.data_ensaio) AS INTEGER)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça'
        WHEN 3 THEN 'Quarta'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
      END as dia_semana,
      COUNT(DISTINCT CASE WHEN i.nome != 'Regente' THEN p.usuario_id END) as total_presencas,
      (SELECT COUNT(*) FROM ensaios_partituras ep
       WHERE ep.data_ensaio = p.data_ensaio) as total_partituras
    FROM presencas p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    GROUP BY p.data_ensaio
    ORDER BY p.data_ensaio DESC
    LIMIT 100
  `).all();

  // Mapear numeração dos ensaios
  const allRehearsals = await env.DB.prepare(`
    SELECT DISTINCT data_ensaio FROM presencas ORDER BY data_ensaio ASC
  `).all();

  const rehearsalMap = new Map();
  (allRehearsals.results || []).forEach((r, index) => {
    rehearsalMap.set(r.data_ensaio, index + 1);
  });

  const ensaiosComNumero = (ensaios.results || []).map(ensaio => ({
    ...ensaio,
    numero_ensaio: rehearsalMap.get(ensaio.data_ensaio) || 0
  }));

  return {
    ensaios: ensaiosComNumero
  };
}

/**
 * Retorna detalhes de um ensaio específico (presentes + partituras)
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @returns {Promise<Object>} - Detalhes do ensaio
 */
export async function getDetalheEnsaio(env, dataEnsaio) {
  const presentes = await env.DB.prepare(`
    SELECT p.id, p.usuario_id, u.nome, u.username, u.instrumento_id,
           i.nome as instrumento_nome, i.familia as instrumento_familia
    FROM presencas p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    WHERE p.data_ensaio = ?
    ORDER BY u.nome
  `).bind(dataEnsaio).all();

  const partituras = await env.DB.prepare(`
    SELECT ep.id, ep.partitura_id, p.titulo, p.compositor, c.nome as categoria_nome
    FROM ensaios_partituras ep
    JOIN partituras p ON ep.partitura_id = p.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE ep.data_ensaio = ?
    ORDER BY p.titulo
  `).bind(dataEnsaio).all();

  return {
    data_ensaio: dataEnsaio,
    presentes: presentes.results,
    partituras: partituras.results,
    total_presentes: presentes.results.length,
    total_partituras: partituras.results.length
  };
}

/**
 * Remove a presença de um usuário em um ensaio
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @param {number} usuarioId - ID do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function removerPresenca(env, dataEnsaio, usuarioId) {
  const result = await env.DB.prepare(
    'DELETE FROM presencas WHERE data_ensaio = ? AND usuario_id = ?'
  ).bind(dataEnsaio, usuarioId).run();

  return { sucesso: result.meta.changes > 0 };
}

/**
 * Exclui um ensaio completo (presenças + partituras)
 * @param {Object} env - Cloudflare Worker environment
 * @param {string} dataEnsaio - Data do ensaio (YYYY-MM-DD)
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function excluirEnsaio(env, dataEnsaio) {
  const results = await env.DB.batch([
    env.DB.prepare('DELETE FROM presencas WHERE data_ensaio = ?').bind(dataEnsaio),
    env.DB.prepare('DELETE FROM ensaios_partituras WHERE data_ensaio = ?').bind(dataEnsaio)
  ]);

  return {
    sucesso: true,
    presencas_removidas: results[0].meta.changes,
    partituras_removidas: results[1].meta.changes
  };
}
