// ===== CATEGORIES DATA =====
// 11 generos musicais da Filarmonica
// Icons sao renderizados via CategoryIcon.jsx com SVGs customizados

export const CATEGORIES = [
  { id: 'dobrado', name: 'Dobrados' },
  { id: 'marcha', name: 'Marchas' },
  { id: 'marcha-funebre', name: 'Marchas Funebres' },
  { id: 'fantasia', name: 'Fantasias' },
  { id: 'polaca', name: 'Polacas' },
  { id: 'bolero', name: 'Boleros' },
  { id: 'valsa', name: 'Valsas' },
  { id: 'arranjo', name: 'Arranjos' },
  { id: 'hino', name: 'Hinos' },
  { id: 'hino-religioso', name: 'Hinos Religiosos' },
  { id: 'preludio', name: 'Preludios' }
];

// Map para lookup O(1)
export const CATEGORIES_MAP = new Map(CATEGORIES.map(cat => [cat.id, cat]));

export const getCategoryById = (id) => CATEGORIES_MAP.get(id);
export const getCategoryName = (id) => getCategoryById(id)?.name || id;

export default CATEGORIES;
