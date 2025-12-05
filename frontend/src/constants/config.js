// ===== CONFIGURACOES GLOBAIS =====
// Valores centralizados para consistencia em todo o app

// Breakpoints para responsividade
export const BREAKPOINTS = {
  mobile: 768,    // < 768 = mobile
  tablet: 1024,   // >= 768 && < 1024 = tablet
  desktop: 1024   // >= 1024 = desktop
};

// Z-index para camadas de UI
export const Z_INDEX = {
  bottomNav: 100,
  header: 200,
  sidebar: 300,
  modal: 2000,
  toast: 3000,
  dropdown: 4000,
  tooltip: 5000,
  overlay: 9000,
  max: 9999
};

// Tempos de animacao e delays (em ms)
export const TIMING = {
  toastDefault: 3000,
  toastDownload: 4000,
  toastError: 5000,
  debounceSearch: 300,
  transitionFast: 150,
  transitionNormal: 300,
  transitionSlow: 500
};

// Tamanhos da sidebar
export const SIDEBAR = {
  expanded: 260,
  collapsed: 72
};

// Limites
export const LIMITS = {
  maxImageSize: 2 * 1024 * 1024,  // 2MB
  maxPdfSize: 50 * 1024 * 1024,   // 50MB
  searchMinLength: 2,
  pinLength: 4
};
