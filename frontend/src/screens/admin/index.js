// ===== ADMIN SCREENS INDEX =====
// Nota: Apenas AdminApp e AdminContext são exportados aqui.
// As telas individuais (Dashboard, Musicos, etc) são lazy-loaded
// dentro de AdminApp.jsx para code-splitting otimizado.

export { default as AdminApp } from './AdminApp';
export { default as AdminContext, useAdmin } from './AdminContext';
