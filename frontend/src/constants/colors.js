// ===== CORES INSTITUCIONAIS =====
// Paleta de cores centralizada para consistencia visual

// Cores primarias da Filarmonica
export const COLORS = {
  // Dourado institucional (cor principal)
  gold: {
    primary: '#D4AF37',
    light: '#F4E4BC',
    dark: '#AA8C2C',
    darkest: '#B8860B',
  },

  // Vinho institucional
  wine: {
    primary: '#722F37',
    dark: '#5C1A1B',
    darkest: '#3D1518',
  },

  // Feedback
  success: {
    primary: '#27ae60',
    light: '#22C55E',
    dark: '#236B4A',
  },

  error: {
    primary: '#e74c3c',
    light: '#D64545',
    dark: '#C94A40',
  },

  // Texto (para referencia, usar CSS vars quando possivel)
  text: {
    cream: '#F4E4BC',
  }
};

// Funcoes helper para RGBA
export const rgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Variacoes RGBA pre-definidas (mais usadas)
export const COLORS_RGBA = {
  gold: {
    bg15: 'rgba(212, 175, 55, 0.15)',
    bg20: 'rgba(212, 175, 55, 0.20)',
    bg30: 'rgba(212, 175, 55, 0.30)',
    bg50: 'rgba(212, 175, 55, 0.50)',
    border30: 'rgba(212, 175, 55, 0.3)',
  },
  wine: {
    bg95: 'rgba(114, 47, 55, 0.95)',
    bg98: 'rgba(92, 26, 27, 0.98)',
  },
  error: {
    bg10: 'rgba(231, 76, 60, 0.1)',
    border30: 'rgba(231, 76, 60, 0.3)',
  },
  success: {
    bg10: 'rgba(39, 174, 96, 0.1)',
    border30: 'rgba(39, 174, 96, 0.3)',
  },
};
