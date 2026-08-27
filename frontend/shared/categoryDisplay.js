const SINGULAR_CATEGORY_NAMES = new Map([
  ['dobrados', 'Dobrado'],
  ['marchas', 'Marcha'],
  ['marchas fúnebres', 'Marcha Fúnebre'],
  ['marchas funebres', 'Marcha Fúnebre'],
  ['marchas-funebres', 'Marcha Fúnebre'],
  ['marchas religiosas', 'Marcha Religiosa'],
  ['marchas-religiosas', 'Marcha Religiosa'],
  ['fantasias', 'Fantasia'],
  ['polacas', 'Polaca'],
  ['boleros', 'Bolero'],
  ['valsas', 'Valsa'],
  ['arranjos', 'Arranjo'],
  ['hinos', 'Hino'],
  ['hinos cívicos', 'Hino Cívico'],
  ['hinos civicos', 'Hino Cívico'],
  ['hinos-civicos', 'Hino Cívico'],
  ['hinos religiosos', 'Hino Religioso'],
  ['hinos-religiosos', 'Hino Religioso'],
  ['prelúdios', 'Prelúdio'],
  ['preludios', 'Prelúdio']
]);

export const SHARE_PRESENTATION_VERSION = 'genre-singular-v1';

export const getSingularCategoryName = (categoryName) => {
  if (typeof categoryName !== 'string') return '';
  const trimmedName = categoryName.trim();
  if (!trimmedName) return '';
  return SINGULAR_CATEGORY_NAMES.get(trimmedName.toLocaleLowerCase('pt-BR')) || trimmedName;
};
