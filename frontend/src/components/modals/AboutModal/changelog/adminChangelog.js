// Changelog para o painel administrativo (AdminConfig)
export const ADMIN_CHANGELOG = [
  {
    version: '2.1.0',
    isCurrent: true,
    items: [
      { bold: 'Seguranca:', text: 'Autenticacao JWT com expiracao de 24h' },
      { bold: 'Seguranca:', text: 'Senhas criptografadas com PBKDF2' },
      { bold: 'Seguranca:', text: 'Rate limiting para protecao contra ataques' },
      { bold: 'Admin:', text: 'Redirecionamento automatico para /admin' },
      { bold: 'Admin:', text: 'Toggle de tema movido para o header' },
      { bold: 'UX:', text: 'Sessao expira com aviso ao usuario' },
      { text: 'Melhorias de performance e correcoes de bugs' }
    ]
  },
  {
    version: '2.0.0',
    items: [
      { text: 'Upload de pasta com multiplas partes' },
      { text: 'Deteccao automatica de instrumentos' },
      { text: 'Gerenciamento de partes no admin' },
      { text: 'Sistema de favoritos sincronizado' },
      { text: 'Correcao de bugs e melhorias gerais' }
    ]
  },
  {
    version: '1.0.0',
    items: [
      { text: 'Painel administrativo completo' },
      { text: 'Dashboard com estatisticas' },
      { text: 'Gerenciamento de musicos' },
      { text: 'Gerenciamento de partituras' },
      { text: 'Gerenciamento de categorias' }
    ]
  }
];

// Config padrao para AdminConfig
export const ADMIN_ABOUT_CONFIG = {
  subtitle: 'Painel Administrativo',
  maxWidth: 480,
  infoCards: [
    { label: 'Versao', value: '2.1.0' },
    { label: 'Backend', value: 'Cloudflare Workers' },
    { label: 'Dev', value: 'Antonio Jr.', isHighlighted: true }
  ],
  footerText: 'S.F. 25 de Marco • Feira de Santana, BA • Fundada em 1868',
  showLegacyVersions: false
};
