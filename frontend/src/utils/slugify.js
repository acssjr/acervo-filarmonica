// ===== SLUGIFY UTILITY =====
// Converte strings para slugs URL-friendly

/**
 * Converte uma string para slug
 * @param {string} text - Texto a ser convertido
 * @returns {string} - Slug URL-friendly
 * @example slugify("Estevam Moura") => "estevam-moura"
 * @example slugify("Heráclio Guerreiro") => "heraclio-guerreiro"
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // Separa caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')    // Remove acentos
    .replace(/[^\w\s-]/g, '')           // Remove caracteres especiais
    .replace(/\s+/g, '-')               // Substitui espaços por hífens
    .replace(/--+/g, '-')               // Remove hífens duplicados
    .replace(/^-+/, '')                 // Remove hífen do início
    .replace(/-+$/, '');                // Remove hífen do final
};

/**
 * Converte slug de volta para texto legível
 * @param {string} slug - Slug a ser convertido
 * @returns {string} - Texto com palavras capitalizadas
 * @example deslugify("estevam-moura") => "Estevam Moura"
 */
export const deslugify = (slug) => {
  if (!slug) return '';

  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default slugify;
