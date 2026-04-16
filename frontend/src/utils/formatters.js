// ===== FUNCOES DE FORMATACAO =====
// Utilitarios para formatar datas, textos e dados de atividades

/**
 * Formata uma data para tempo relativo (ex: "5 min atrás", "ontem")
 * @param {string|Date} dateString - Data a ser formatada
 * @param {boolean} short - Se true, usa formato curto (ex: "5min" ao inves de "5 min atras")
 * @returns {string} Tempo formatado
 */
export const formatTimeAgo = (dateString, short = false) => {
  // D1/SQLite retorna timestamps sem timezone (ex: '2026-03-02 18:00:00')
  // Adicionamos 'Z' para interpretar como UTC corretamente
  let normalized = dateString;
  if (dateString instanceof Date) {
    normalized = dateString;
  } else if (typeof dateString === 'string' && !dateString.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateString)) {
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
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana(s) atrás`;
  return `${Math.floor(diffDays / 30)} mês(es) atrás`;
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
    'add_repertorio': { action: 'Adição ao repertório', color: '#9B59D0' },
    'update_repertorio': { action: 'Repertório atualizado', color: '#9B59D0' },
    'delete_repertorio': { action: 'Repertório removido', color: '#E74C3C' },
    'remove_repertorio': { action: 'Removido do repertório', color: '#E74C3C' },
    'reorder_repertorio': { action: 'Ordem do repertório atualizada', color: '#9B59D0' },
    'update_partitura': { action: 'Partitura atualizada', color: '#5B8DEF' },
    'delete_partitura': { action: 'Partitura removida', color: '#E74C3C' },
    'nova_parte': { action: 'Parte adicionada', color: '#43B97F' },
    'update_parte': { action: 'Parte atualizada', color: '#5B8DEF' },
    'delete_parte': { action: 'Parte removida', color: '#E74C3C' },
    'partitura_aberta': { action: 'Partitura aberta', color: '#D4AF37' },
    'pdf_visualizado_grade': { action: 'Grade visualizada', color: '#3498db' },
    'pdf_visualizado_parte': { action: 'Parte visualizada', color: '#3498db' },
    'download_grade': { action: 'Grade baixada', color: '#5B8DEF' },
    'download_parte': { action: 'Parte baixada', color: '#5B8DEF' },
    'busca_digitada': { action: 'Busca digitada', color: '#9B59D0' },
    'busca_realizada': { action: 'Busca realizada', color: '#9B59D0' },
    'download_historico': { action: 'Download histórico', color: '#5B8DEF' },
    'busca_historica': { action: 'Busca histórica', color: '#9B59D0' },
    'favorito_adicionado': { action: 'Favorito adicionado', color: '#E54D87' },
    'favorito_removido': { action: 'Favorito removido', color: '#E54D87' },
    'sessao_iniciada': { action: 'Sessão iniciada', color: '#95a5a6' },
    'sessao_encerrada': { action: 'Sessão encerrada', color: '#95a5a6' },
    'aviso_criado': { action: 'Aviso criado', color: '#43B97F' },
    'aviso_atualizado': { action: 'Aviso atualizado', color: '#5B8DEF' },
    'aviso_ativado': { action: 'Aviso ativado', color: '#43B97F' },
    'aviso_desativado': { action: 'Aviso desativado', color: '#E67E22' },
    'aviso_excluido': { action: 'Aviso excluído', color: '#E74C3C' }
  };

  const mapShort = {
    'nova_partitura': { action: 'Nova partitura', color: '#43B97F' },
    'download': { action: 'Download', color: '#5B8DEF' },
    'visualizacao': { action: 'Visualização', color: '#3498db' },
    'favorito': { action: 'Favorito', color: '#E54D87' },
    'login': { action: 'Login', color: '#95a5a6' },
    'novo_repertorio': { action: 'Novo repertório', color: '#9B59D0' },
    'add_repertorio': { action: 'Adicionado ao repertório', color: '#9B59D0' },
    'update_repertorio': { action: 'Repertório atualizado', color: '#9B59D0' },
    'delete_repertorio': { action: 'Repertório removido', color: '#E74C3C' },
    'remove_repertorio': { action: 'Removido do repertório', color: '#E74C3C' },
    'reorder_repertorio': { action: 'Ordem do repertório', color: '#9B59D0' },
    'update_partitura': { action: 'Partitura atualizada', color: '#5B8DEF' },
    'delete_partitura': { action: 'Partitura removida', color: '#E74C3C' },
    'nova_parte': { action: 'Parte adicionada', color: '#43B97F' },
    'update_parte': { action: 'Parte atualizada', color: '#5B8DEF' },
    'delete_parte': { action: 'Parte removida', color: '#E74C3C' },
    'partitura_aberta': { action: 'Partitura aberta', color: '#D4AF37' },
    'pdf_visualizado_grade': { action: 'Grade visualizada', color: '#3498db' },
    'pdf_visualizado_parte': { action: 'Parte visualizada', color: '#3498db' },
    'download_grade': { action: 'Grade baixada', color: '#5B8DEF' },
    'download_parte': { action: 'Parte baixada', color: '#5B8DEF' },
    'busca_digitada': { action: 'Busca digitada', color: '#9B59D0' },
    'busca_realizada': { action: 'Busca realizada', color: '#9B59D0' },
    'download_historico': { action: 'Download histórico', color: '#5B8DEF' },
    'busca_historica': { action: 'Busca histórica', color: '#9B59D0' },
    'favorito_adicionado': { action: 'Favorito adicionado', color: '#E54D87' },
    'favorito_removido': { action: 'Favorito removido', color: '#E54D87' },
    'sessao_iniciada': { action: 'Sessão iniciada', color: '#95a5a6' },
    'sessao_encerrada': { action: 'Sessão encerrada', color: '#95a5a6' },
    'aviso_criado': { action: 'Aviso criado', color: '#43B97F' },
    'aviso_atualizado': { action: 'Aviso atualizado', color: '#5B8DEF' },
    'aviso_ativado': { action: 'Aviso ativado', color: '#43B97F' },
    'aviso_desativado': { action: 'Aviso desativado', color: '#E67E22' },
    'aviso_excluido': { action: 'Aviso excluído', color: '#E74C3C' }
  };

  const map = short ? mapShort : mapLong;
  return map[tipo] || { action: 'Atividade registrada', color: '#999' };
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
