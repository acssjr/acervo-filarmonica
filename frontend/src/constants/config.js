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
  // Toast durations
  toastDefault: 3000,
  toastDownload: 4000,
  toastError: 5000,

  // Debounce
  debounceSearch: 300,
  debounceInput: 150,

  // Transitions
  transitionFast: 150,
  transitionNormal: 300,
  transitionSlow: 500,

  // Focus delays
  focusDelay: 100,

  // Marquee animation (em segundos)
  marqueeDesktop: 80,
  marqueeMobile: 60,
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
  pinLength: 4,
  featuredMax: 8,
};

// Espacamento padrao (em px)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Tamanhos de componentes
export const SIZES = {
  // Botoes
  buttonSm: 32,
  buttonMd: 40,
  buttonLg: 48,

  // Cards
  featuredCardWidth: 200,
  featuredCardWidthDesktop: 280,
  featuredCardHeight: 120,

  // Avatar
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 48,

  // Icons
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,

  // Logo
  logoBadge: 38,
};

// Gap entre elementos (em px)
export const GAP = {
  cards: 14,
  cardsDesktop: 20,
  items: 8,
  sections: 24,
};
