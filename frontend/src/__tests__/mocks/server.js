// ===== MSW SERVER =====
// Servidor de mock para testes Node.js (Jest)
// Seguindo o guia: intercepta requisicoes no nivel de rede

import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

// Cria servidor com handlers padrao
export const server = setupServer(...handlers);
