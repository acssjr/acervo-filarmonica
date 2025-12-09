// ===== CATEGORIES DATA =====
// 13 generos musicais da Filarmonica
// IDs sincronizados com o banco de dados (schema.sql)
// Icons sao renderizados via CategoryIcon.jsx com SVGs customizados

export const CATEGORIES = [
  { id: 'dobrados', name: 'Dobrados' },
  { id: 'marchas', name: 'Marchas' },
  { id: 'marchas-funebres', name: 'Marchas Fúnebres' },
  { id: 'marchas-religiosas', name: 'Marchas Religiosas' },
  { id: 'fantasias', name: 'Fantasias' },
  { id: 'polacas', name: 'Polacas' },
  { id: 'boleros', name: 'Boleros' },
  { id: 'valsas', name: 'Valsas' },
  { id: 'arranjos', name: 'Arranjos' },
  { id: 'hinos', name: 'Hinos' },
  { id: 'hinos-civicos', name: 'Hinos Cívicos' },
  { id: 'hinos-religiosos', name: 'Hinos Religiosos' },
  { id: 'preludios', name: 'Prelúdios' }
];

// Map para lookup O(1)
export const CATEGORIES_MAP = new Map(CATEGORIES.map(cat => [cat.id, cat]));

export const getCategoryById = (id) => CATEGORIES_MAP.get(id);
export const getCategoryName = (id) => getCategoryById(id)?.name || id;

export default CATEGORIES;
