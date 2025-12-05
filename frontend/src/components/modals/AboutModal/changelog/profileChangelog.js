// Changelog completo para o app do usuario (ProfileScreen)
export const PROFILE_CHANGELOG = [
  {
    version: '2.2.0',
    isCurrent: true,
    items: [
      { bold: 'Arquitetura:', text: 'Contexts separados (Auth, UI, Data, Notifications)' },
      { bold: 'Performance:', text: 'Re-renders isolados por dominio' },
      { text: '30+ componentes migrados para nova arquitetura' }
    ]
  },
  {
    version: '2.1.0',
    items: [
      { bold: 'Seguranca:', text: 'JWT com expiracao de 24h' },
      { bold: 'Seguranca:', text: 'Senhas criptografadas com PBKDF2' },
      { bold: 'Seguranca:', text: 'Rate limiting contra ataques' },
      { bold: 'Admin:', text: 'Redirecionamento automatico' },
      { text: 'Toggle de tema no header admin' }
    ]
  },
  {
    version: '2.0.0',
    items: [
      { text: 'Upload de pasta com multiplas partes' },
      { text: 'Deteccao automatica de instrumentos' },
      { text: 'Gerenciamento de partes no admin' },
      { text: 'Seletor de partes multiplas no download' },
      { text: 'Download direto ao selecionar instrumento' },
      { text: 'Secao "Em Destaque" so com marcados' },
      { text: 'Correcao de bugs e melhorias gerais' }
    ]
  },
  {
    version: '1.5.0',
    items: [
      { text: 'Modal "Sobre" com changelog' },
      { text: 'Validacao PIN nao pode ser igual ao anterior' },
      { text: 'Espacamento entre cards no mobile' }
    ]
  },
  {
    version: '1.4.0',
    items: [
      { text: 'Perfil completo: foto, edicao de nome' },
      { text: 'Alteracao de PIN em 3 etapas' },
      { text: 'Contato via WhatsApp' },
      { text: 'Tema mobile: clique direto cicla opcoes' }
    ]
  },
  {
    version: '1.3.0',
    items: [
      { text: 'Login com usuario + PIN de 4 digitos' },
      { text: 'Auto-login ao completar PIN' },
      { text: 'Opcao "Lembrar meu acesso"' },
      { text: 'Otimizacao mobile para teclado virtual' }
    ]
  },
  {
    version: '1.2.0',
    items: [
      { text: 'Tema: Claro, Escuro, Sistema' },
      { text: 'Contador de proximo ensaio' },
      { text: 'Tela de login com glassmorphism' }
    ]
  },
  {
    version: '1.1.0',
    items: [
      { text: 'Modal de detalhes da partitura' },
      { text: 'Seletor de 27 instrumentos' },
      { text: 'Sistema de favoritos persistente' }
    ]
  },
  {
    version: '1.0.0',
    items: [
      { text: 'Layout desktop com sidebar' },
      { text: 'Toggle sidebar (260px - 72px)' },
      { text: 'Filtros por genero e compositor' },
      { text: 'Grid responsivo de cards' }
    ]
  }
];

// Versoes antigas colapsadas
export const PROFILE_LEGACY_VERSIONS = {
  '0.9': 'Notificacoes',
  '0.8': 'Header Home',
  '0.7': 'Cards em destaque',
  '0.6': 'Favoritos, busca fuzzy',
  '0.5': 'Tema claro/escuro',
  '0.4': 'Painel Admin',
  '0.3': 'Busca',
  '0.2': 'Acervo',
  '0.1': 'Versao inicial'
};

// Config padrao para ProfileScreen
export const PROFILE_ABOUT_CONFIG = {
  subtitle: 'Sociedade Filarmonica 25 de Marco',
  maxWidth: 420,
  infoCards: [
    { label: 'Versao', value: '2.2.0' },
    { label: 'Tecnologias', value: 'React • JS • CSS' },
    { label: 'Dev', value: 'Antonio Jr.', isHighlighted: true }
  ],
  footerText: 'Feira de Santana - BA • Fundada em 1868',
  showLegacyVersions: true
};
