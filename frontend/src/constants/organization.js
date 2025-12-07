// ===== DADOS INSTITUCIONAIS =====
// Informacoes da organizacao centralizadas

export const ORGANIZATION = {
  // Nomes
  name: 'S.F. 25 de Março',
  fullName: 'Sociedade Filarmônica 25 de Março',
  shortName: '25 de Março',

  // Localizacao
  city: 'Feira de Santana',
  state: 'BA',
  location: 'Feira de Santana - BA',

  // Historia
  founded: 1868,
  foundedText: 'Fundada em 1868',

  // Acervo
  archiveName: 'Acervo Digital',
  archiveFullName: 'Acervo Digital de Partituras',

  // Assets
  logoPath: '/assets/images/ui/brasao-256x256.png',
  logoAlt: 'Brasão Filarmônica 25 de Março',

  // Contato
  whatsapp: '5575991234567', // Numero ficticio - atualizar com o real
};

// Labels padrao para UI
export const LABELS = {
  // Secoes
  featured: 'Em Destaque',
  featuredSubtitle: 'Partituras em estudo',
  inStudy: 'Em estudo',

  // Acoes
  searchPlaceholder: 'Buscar partituras...',
  loadingArchive: 'Carregando acervo...',
  dragHint: 'Arraste',

  // Admin
  adminBadge: 'Admin',
  inactive: '(inativo)',
  noMusician: 'Nenhum músico encontrado',
  noInstrument: 'Sem instrumento',

  // Navegacao
  backToArchive: 'Voltar ao Acervo',
  goToAdmin: 'Ir para Admin',
};

// Textos do footer
export const FOOTER = {
  version: (v) => `Acervo Digital de Partituras • Versão ${v}`,
  copyright: `${ORGANIZATION.location} • ${ORGANIZATION.foundedText}`,
};
