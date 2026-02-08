// ===== WALKTHROUGH STEPS =====
// Definicao dos passos do walkthrough para usuarios
// Passos separados para mobile e desktop devido as diferencas de layout

export interface WalkthroughStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  position: string;
  highlightPadding: number;
  action?: string;
}

// Passos para DESKTOP (sidebar, barra de busca no header)
export const DESKTOP_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'search',
    targetSelector: '[data-walkthrough="search"]',
    title: 'Busque partituras',
    description: 'Digite o nome da obra, compositor ou gênero para encontrar rapidamente.',
    position: 'bottom',
    highlightPadding: 12
  },
  {
    id: 'featured',
    targetSelector: '[data-walkthrough="featured"]',
    title: 'Destaques',
    description: 'Aqui aparecem as partituras em estudo e as mais acessadas.',
    position: 'bottom',
    highlightPadding: 16
  },
  {
    id: 'categories',
    targetSelector: '[data-walkthrough="categories"]',
    title: 'Gêneros musicais',
    description: 'Explore por categoria: dobrados, marchas, valsas e muito mais.',
    position: 'bottom',
    highlightPadding: 12
  },
  {
    id: 'favorite-btn',
    targetSelector: '[data-walkthrough="favorite-btn"]',
    title: 'Favorite suas partituras',
    description: 'Clique no coração para salvar e acessar depois rapidamente.',
    position: 'left',
    highlightPadding: 8
  },
  {
    id: 'sheet-card',
    targetSelector: '[data-walkthrough="sheet-card"]',
    title: 'Abra uma partitura',
    description: 'Clique em qualquer card para ver os detalhes e opcoes de download.',
    position: 'bottom',
    highlightPadding: 8
  },
  {
    id: 'quick-download',
    targetSelector: '[data-walkthrough="quick-download"]',
    title: 'Seu instrumento',
    description: 'Baixe direto a parte do seu instrumento com um clique.',
    position: 'bottom',
    highlightPadding: 8,
    action: 'openModal'
  },
  {
    id: 'instrument-selector',
    targetSelector: '[data-walkthrough="instrument-selector"]',
    title: 'Outros instrumentos',
    description: 'Baixe partes de outros instrumentos da banda.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'sheet-options',
    targetSelector: '[data-walkthrough="sheet-options"]',
    title: 'Acoes rapidas',
    description: 'Imprima, envie ou favorite a parte do seu instrumento.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'nav-favoritos',
    targetSelector: '[data-sidebar="favorites"]',
    title: 'Seus favoritos',
    description: 'Acesse aqui todas as partituras que voce salvou.',
    position: 'right',
    highlightPadding: 8,
    action: 'closeModal'
  },
  {
    id: 'nav-repertorio',
    targetSelector: '[data-sidebar="repertorio"]',
    title: 'Repertório',
    description: 'Veja as colecoes organizadas para ensaios e apresentacoes.',
    position: 'right',
    highlightPadding: 8
  }
];

// Passos para MOBILE (bottom nav, sem barra de busca na home)
export const MOBILE_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'featured',
    targetSelector: '[data-walkthrough="featured"]',
    title: 'Destaques',
    description: 'Aqui aparecem as partituras em estudo e as mais acessadas.',
    position: 'bottom',
    highlightPadding: 8
  },
  {
    id: 'categories',
    targetSelector: '[data-walkthrough="categories"]',
    title: 'Gêneros musicais',
    description: 'Explore por categoria: dobrados, marchas, valsas e muito mais.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'favorite-btn',
    targetSelector: '[data-walkthrough="favorite-btn"]',
    title: 'Favorite suas partituras',
    description: 'Toque no coração para salvar e acessar depois rapidamente.',
    position: 'top',
    highlightPadding: 12
  },
  {
    id: 'sheet-card',
    targetSelector: '[data-walkthrough="sheet-card"]',
    title: 'Abra uma partitura',
    description: 'Toque em qualquer card para ver os detalhes e opcoes de download.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'quick-download',
    targetSelector: '[data-walkthrough="quick-download"]',
    title: 'Seu instrumento',
    description: 'Baixe direto a parte do seu instrumento com um toque.',
    position: 'top',
    highlightPadding: 8,
    action: 'openModal'
  },
  {
    id: 'instrument-selector',
    targetSelector: '[data-walkthrough="instrument-selector"]',
    title: 'Outros instrumentos',
    description: 'Baixe partes de outros instrumentos da banda.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'sheet-options',
    targetSelector: '[data-walkthrough="sheet-options"]',
    title: 'Acoes rapidas',
    description: 'Imprima, envie ou favorite a parte do seu instrumento.',
    position: 'top',
    highlightPadding: 8
  },
  {
    id: 'nav-buscar',
    targetSelector: '[data-walkthrough="search"]',
    title: 'Busque partituras',
    description: 'Toque aqui para buscar por nome, compositor ou gênero.',
    position: 'top',
    highlightPadding: 12,
    action: 'closeModal'
  },
  {
    id: 'nav-favoritos',
    targetSelector: '[data-nav="favorites"]',
    title: 'Seus favoritos',
    description: 'Acesse aqui todas as partituras que voce salvou.',
    position: 'top',
    highlightPadding: 12
  },
  {
    id: 'nav-repertorio',
    targetSelector: '[data-nav="repertorio"]',
    title: 'Repertório',
    description: 'Veja as colecoes organizadas para ensaios e apresentacoes.',
    position: 'top',
    highlightPadding: 12
  }
];

export const USER_WALKTHROUGH_STORAGE_KEY = 'walkthrough_user_completed';
