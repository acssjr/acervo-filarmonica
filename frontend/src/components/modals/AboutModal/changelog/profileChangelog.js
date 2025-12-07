// Changelog completo para o app do usuario (ProfileScreen)
export const PROFILE_CHANGELOG = [
  {
    version: '2.3.3',
    isCurrent: true,
    items: [
      { bold: 'Admin Toggle:', text: 'Botão para alternar entre modo usuário e admin' },
      { bold: 'Maestro:', text: 'Detecção correta de maestro/regente para download de grade' },
      { bold: 'Download:', text: 'Botão desabilitado quando grade não disponível' },
      { bold: 'Testes:', text: '214 testes automatizados passando' },
      { bold: 'CI/CD:', text: 'Pipeline GitHub Actions para testes e build' }
    ]
  },
  {
    version: '2.3.0',
    items: [
      { bold: 'Notificações:', text: 'Sistema real de notificações de novas partituras' },
      { bold: 'Compositores:', text: 'Carrossel de compositores em destaque na home' },
      { bold: 'Compositores:', text: 'Tela dedicada com cards e lista alfabética' },
      { bold: 'Busca:', text: 'Transliteração para grafias antigas (nymphas → ninfas)' },
      { bold: 'UI:', text: 'Badge de notificações redesenhado' },
      { text: 'Correções de acentuação em toda interface' }
    ]
  },
  {
    version: '2.2.0',
    items: [
      { bold: 'Arquitetura:', text: 'Contexts separados (Auth, UI, Data, Notifications)' },
      { bold: 'Performance:', text: 'Re-renders isolados por domínio' },
      { text: '30+ componentes migrados para nova arquitetura' }
    ]
  },
  {
    version: '2.1.0',
    items: [
      { bold: 'Segurança:', text: 'JWT com expiração de 24h' },
      { bold: 'Segurança:', text: 'Senhas criptografadas com PBKDF2' },
      { bold: 'Segurança:', text: 'Rate limiting contra ataques' },
      { bold: 'Admin:', text: 'Redirecionamento automático' },
      { text: 'Toggle de tema no header admin' }
    ]
  },
  {
    version: '2.0.0',
    items: [
      { text: 'Upload de pasta com múltiplas partes' },
      { text: 'Detecção automática de instrumentos' },
      { text: 'Gerenciamento de partes no admin' },
      { text: 'Seletor de partes múltiplas no download' },
      { text: 'Download direto ao selecionar instrumento' },
      { text: 'Seção "Em Destaque" só com marcados' },
      { text: 'Correção de bugs e melhorias gerais' }
    ]
  },
  {
    version: '1.5.0',
    items: [
      { text: 'Modal "Sobre" com changelog' },
      { text: 'Validação PIN não pode ser igual ao anterior' },
      { text: 'Espaçamento entre cards no mobile' }
    ]
  },
  {
    version: '1.4.0',
    items: [
      { text: 'Perfil completo: foto, edição de nome' },
      { text: 'Alteração de PIN em 3 etapas' },
      { text: 'Contato via WhatsApp' },
      { text: 'Tema mobile: clique direto cicla opções' }
    ]
  },
  {
    version: '1.3.0',
    items: [
      { text: 'Login com usuário + PIN de 4 dígitos' },
      { text: 'Auto-login ao completar PIN' },
      { text: 'Opção "Lembrar meu acesso"' },
      { text: 'Otimização mobile para teclado virtual' }
    ]
  },
  {
    version: '1.2.0',
    items: [
      { text: 'Tema: Claro, Escuro, Sistema' },
      { text: 'Contador de próximo ensaio' },
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
      { text: 'Filtros por gênero e compositor' },
      { text: 'Grid responsivo de cards' }
    ]
  }
];

// Versões antigas colapsadas
export const PROFILE_LEGACY_VERSIONS = {
  '0.9': 'Notificações',
  '0.8': 'Header Home',
  '0.7': 'Cards em destaque',
  '0.6': 'Favoritos, busca fuzzy',
  '0.5': 'Tema claro/escuro',
  '0.4': 'Painel Admin',
  '0.3': 'Busca',
  '0.2': 'Acervo',
  '0.1': 'Versão inicial'
};

// Config padrão para ProfileScreen
export const PROFILE_ABOUT_CONFIG = {
  subtitle: 'Sociedade Filarmônica 25 de Março',
  maxWidth: 420,
  infoCards: [
    { label: 'Versão', value: '2.3.3' },
    { label: 'Tecnologias', value: 'React • JS • CSS' },
    { label: 'Por', value: 'Antonio Jr.', isHighlighted: true }
  ],
  footerText: 'Feira de Santana - BA • Fundada em 1868',
  showLegacyVersions: true
};
