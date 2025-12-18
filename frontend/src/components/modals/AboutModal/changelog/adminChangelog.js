// Changelog para o painel administrativo (AdminConfig)
export const ADMIN_CHANGELOG = [
  {
    version: '2.9.0',
    isCurrent: true,
    items: [
      { bold: 'Git Workflow:', text: 'Commitlint + pre-commit hooks para qualidade' },
      { bold: 'PR Template:', text: 'Template padronizado para pull requests' },
      { bold: 'Testes:', text: 'Suite completa com Vitest + Playwright E2E' },
      { bold: 'PDF:', text: 'Visualizador com pinch-to-zoom suave' },
      { bold: 'Instrumentos:', text: 'Matching inteligente de tonalidades e vozes' },
      { bold: 'Carrinho:', text: 'Botao flutuante visivel em todos navegadores' }
    ]
  },
  {
    version: '2.8.0',
    items: [
      { bold: 'Repertorio:', text: 'Modal para selecionar/criar repertorio ao adicionar partitura' },
      { bold: 'UI:', text: 'Animacoes de hover nos botoes (escala + sombra)' },
      { bold: 'UX:', text: 'Botao de repertorio com resposta instantanea (UI otimista)' },
      { bold: 'Fix:', text: 'Lista de instrumentos agora mostra todos os instrumentos reais' }
    ]
  },
  {
    version: '2.1.0',
    items: [
      { bold: 'Segurança:', text: 'Autenticação JWT com expiração de 24h' },
      { bold: 'Segurança:', text: 'Senhas criptografadas com PBKDF2' },
      { bold: 'Segurança:', text: 'Rate limiting para proteção contra ataques' },
      { bold: 'Admin:', text: 'Redirecionamento automático para /admin' },
      { bold: 'Admin:', text: 'Toggle de tema movido para o header' },
      { bold: 'UX:', text: 'Sessão expira com aviso ao usuário' },
      { text: 'Melhorias de performance e correções de bugs' }
    ]
  },
  {
    version: '2.0.0',
    items: [
      { text: 'Upload de pasta com múltiplas partes' },
      { text: 'Detecção automática de instrumentos' },
      { text: 'Gerenciamento de partes no admin' },
      { text: 'Sistema de favoritos sincronizado' },
      { text: 'Correção de bugs e melhorias gerais' }
    ]
  },
  {
    version: '1.0.0',
    items: [
      { text: 'Painel administrativo completo' },
      { text: 'Dashboard com estatísticas' },
      { text: 'Gerenciamento de músicos' },
      { text: 'Gerenciamento de partituras' },
      { text: 'Gerenciamento de categorias' }
    ]
  }
];

// Config padrão para AdminConfig
export const ADMIN_ABOUT_CONFIG = {
  subtitle: 'Painel Administrativo',
  maxWidth: 480,
  infoCards: [
    { label: 'Versao', value: '2.9.0' },
    { label: 'Backend', value: 'Cloudflare Workers' },
    { label: 'Dev', value: 'Antonio Jr.', isHighlighted: true }
  ],
  footerText: 'S.F. 25 de Marco • Feira de Santana, BA • Fundada em 1868',
  showLegacyVersions: false
};
