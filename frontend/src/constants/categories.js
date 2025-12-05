// ===== CATEGORIES DATA =====
// 11 generos musicais da Filarmonica

export const CATEGORIES = [
  { id: 'dobrado', name: 'Dobrados', color: '#722F37', bgColor: '#F5E6E8', icon: 'Trumpet' },
  { id: 'marcha', name: 'Marchas', color: '#8B4513', bgColor: '#F5EDE6', icon: 'Drum' },
  { id: 'marcha-funebre', name: 'Marchas Funebres', color: '#4A3728', bgColor: '#EDE8E4', icon: 'Church' },
  { id: 'fantasia', name: 'Fantasias', color: '#B8860B', bgColor: '#F9F3E6', icon: 'Sparkles' },
  { id: 'polaca', name: 'Polacas', color: '#D4AF37', bgColor: '#FBF6E8', icon: 'Crown' },
  { id: 'bolero', name: 'Boleros', color: '#8B2252', bgColor: '#F5E6EC', icon: 'Rose' },
  { id: 'valsa', name: 'Valsas', color: '#6B3A3A', bgColor: '#F2E8E8', icon: 'Dancers' },
  { id: 'arranjo', name: 'Arranjos', color: '#5C4033', bgColor: '#F0EAE6', icon: 'MusicNotes' },
  { id: 'hino', name: 'Hinos', color: '#996515', bgColor: '#F7F0E4', icon: 'Crown' },
  { id: 'hino-religioso', name: 'Hinos Religiosos', color: '#4A2C2A', bgColor: '#EDE6E6', icon: 'Church' },
  { id: 'preludio', name: 'Preludios', color: '#7B3F3F', bgColor: '#F3E8E8', icon: 'Sparkles' }
];

export const getCategoryById = (id) => CATEGORIES.find(cat => cat.id === id);
export const getCategoryColor = (id) => getCategoryById(id)?.color || '#722F37';
export const getCategoryName = (id) => getCategoryById(id)?.name || id;

export default CATEGORIES;
