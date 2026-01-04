// ===== PRESENCA SERVICE =====
// Lógica de negócio para controle de presença em ensaios

/**
 * Gera as últimas N datas de ensaio (segundas e quartas)
 * @param {number} quantidade - Número de ensaios a buscar
 * @returns {string[]} - Array de datas no formato YYYY-MM-DD
 */
function gerarUltimosEnsaios(quantidade = 7) {
  const ensaios = [];
  const hoje = new Date();

  // Ajustar para meia-noite UTC para evitar problemas de timezone
  hoje.setUTCHours(0, 0, 0, 0);

  let dataAtual = new Date(hoje);

  while (ensaios.length < quantidade) {
    const diaSemana = dataAtual.getUTCDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb

    // Segundas (1) ou Quartas (3)
    if (diaSemana === 1 || diaSemana === 3) {
      // Formato YYYY-MM-DD em UTC
      const ano = dataAtual.getUTCFullYear();
      const mes = String(dataAtual.getUTCMonth() + 1).padStart(2, '0');
      const dia = String(dataAtual.getUTCDate()).padStart(2, '0');
      ensaios.push(`${ano}-${mes}-${dia}`);
    }

    // Voltar 1 dia
    dataAtual.setUTCDate(dataAtual.getUTCDate() - 1);
  }

  return ensaios;
}

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

  // Gerar os últimos 50 ensaios (para calcular streak e percentual)
  // 50 ensaios = ~6 meses de histórico
  const ultimosEnsaios = gerarUltimosEnsaios(50);

  // Calcular streak: contar ensaios consecutivos com presença a partir do mais recente
  let streak = 0;
  for (const dataEnsaio of ultimosEnsaios) {
    if (presencasSet.has(dataEnsaio)) {
      streak++;
    } else {
      break; // Streak quebrou - encontrou primeira falta
    }
  }

  // Estatísticas gerais
  const totalPresencas = presencasUsuario.results.length;
  const totalEnsaios = ultimosEnsaios.length;
  const percentual = totalEnsaios > 0
    ? (Array.from(ultimosEnsaios).filter(e => presencasSet.has(e)).length / totalEnsaios) * 100
    : 0;

  return {
    streak,
    ultimo_ensaio: presencasUsuario.results[0]?.data_ensaio || null,
    total_presencas: totalPresencas,
    total_ensaios: totalEnsaios,
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
  // Calcular streak e estatísticas
  const streakData = await calcularStreak(env, usuarioId);

  // Gerar datas dos últimos 7 ensaios (segundas e quartas)
  const datasEnsaios = gerarUltimosEnsaios(7);

  // Buscar presenças do usuário nessas datas
  const presencasUsuario = await env.DB.prepare(`
    SELECT data_ensaio FROM presencas
    WHERE usuario_id = ? AND data_ensaio IN (${datasEnsaios.map(() => '?').join(',')})
  `).bind(usuarioId, ...datasEnsaios).all();

  const presencasSet = new Set(presencasUsuario.results.map(p => p.data_ensaio));

  // Buscar contagem de partituras por ensaio
  const partiturasPorEnsaio = await env.DB.prepare(`
    SELECT data_ensaio, COUNT(*) as total
    FROM ensaios_partituras
    WHERE data_ensaio IN (${datasEnsaios.map(() => '?').join(',')})
    GROUP BY data_ensaio
  `).bind(...datasEnsaios).all();

  const partiturasMap = new Map(
    partiturasPorEnsaio.results.map(p => [p.data_ensaio, p.total])
  );

  // Montar array de ensaios com todas as informações
  const ultimosEnsaios = datasEnsaios.map(dataEnsaio => {
    const data = new Date(dataEnsaio + 'T00:00:00Z');
    const diaSemana = data.getUTCDay();
    const nomeDia = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][diaSemana];

    return {
      data_ensaio: dataEnsaio,
      dia_semana: nomeDia,
      usuario_presente: presencasSet.has(dataEnsaio) ? 1 : 0,
      total_partituras: partiturasMap.get(dataEnsaio) || 0
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
      COUNT(DISTINCT p.usuario_id) as total_presencas,
      (SELECT COUNT(*) FROM ensaios_partituras ep
       WHERE ep.data_ensaio = p.data_ensaio) as total_partituras
    FROM presencas p
    GROUP BY p.data_ensaio
    ORDER BY p.data_ensaio DESC
    LIMIT 30
  `).all();

  return {
    ensaios: ensaios.results || []
  };
}
