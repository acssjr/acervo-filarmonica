// ===== FUNCOES DE FORMATACAO =====
// Utilitarios para formatar datas, textos e dados de atividades

/**
 * Formata uma data para tempo relativo (ex: "5 min atras", "ontem")
 * @param {string|Date} dateString - Data a ser formatada
 * @param {boolean} short - Se true, usa formato curto (ex: "5min" ao inves de "5 min atras")
 * @returns {string} Tempo formatado
 */
export const formatTimeAgo = (dateString, short = false) => {
  // D1/SQLite retorna timestamps sem timezone (ex: '2026-03-02 18:00:00')
  // Adicionamos 'Z' para interpretar como UTC corretamente
  let normalized = dateString;
  if (dateString && !dateString.endsWith('Z') && !dateString.includes('+')) {
    normalized = dateString.replace(' ', 'T') + 'Z';
  }
  const date = new Date(normalized);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (short) {
    // Formato curto para admin dashboard
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}sem`;
  }

  // Formato longo para home screen
  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins} min atras`;
  if (diffHours < 24) return `${diffHours}h atras`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `${diffDays} dias atras`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana(s) atras`;
  return `${Math.floor(diffDays / 30)} mes(es) atras`;
};

/**
 * Mapeia tipo de atividade para informacoes de exibicao
 * @param {string} tipo - Tipo da atividade ('nova_partitura', 'download', 'favorito')
 * @param {boolean} short - Se true, usa textos curtos
 * @returns {{action: string, color: string}} Objeto com acao e cor
 */
export const getAtividadeInfo = (tipo, short = false) => {
  const mapLong = {
    'nova_partitura': { action: 'Nova partitura adicionada', color: '#43B97F' },
    'download': { action: 'Partitura baixada', color: '#5B8DEF' },
    'visualizacao': { action: 'Partitura visualizada', color: '#3498db' },
    'favorito': { action: 'Favorito adicionado', color: '#E54D87' },
    'login': { action: 'Acesso ao sistema', color: '#95a5a6' },
    'novo_repertorio': { action: 'Novo repertório criado', color: '#9B59D0' },
    'add_repertorio': { action: 'Adição ao repertório', color: '#9B59D0' }
  };

  const mapShort = {
    'nova_partitura': { action: 'Nova partitura', color: '#43B97F' },
    'download': { action: 'Download', color: '#5B8DEF' },
    'visualizacao': { action: 'Visualização', color: '#3498db' },
    'favorito': { action: 'Favorito', color: '#E54D87' },
    'login': { action: 'Login', color: '#95a5a6' },
    'novo_repertorio': { action: 'Novo repertório', color: '#9B59D0' },
    'add_repertorio': { action: 'Adicionado ao repertório', color: '#9B59D0' }
  };

  const map = short ? mapShort : mapLong;
  return map[tipo] || { action: tipo, color: '#999' };
};

/**
 * Formata numero com separador de milhares
 * @param {number} num - Numero a formatar
 * @returns {string} Numero formatado
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('pt-BR');
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizada
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
