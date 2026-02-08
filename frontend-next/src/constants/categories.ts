export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
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
  { id: 'preludios', name: 'Prelúdios' },
];

export const CATEGORIES_MAP = new Map(CATEGORIES.map(cat => [cat.id, cat]));
export const getCategoryById = (id: string) => CATEGORIES_MAP.get(id);
export const getCategoryName = (id: string) => getCategoryById(id)?.name || id;
export default CATEGORIES;
