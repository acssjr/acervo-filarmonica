export const ORGANIZATION = {
  name: 'S.F. 25 de Março',
  fullName: 'Sociedade Filarmônica 25 de Março',
  shortName: '25 de Março',
  city: 'Feira de Santana',
  state: 'BA',
  location: 'Feira de Santana - BA',
  founded: 1868,
  foundedText: 'Fundada em 1868',
  archiveName: 'Acervo Digital',
  archiveFullName: 'Acervo Digital de Partituras',
  logoPath: '/assets/images/ui/brasao-256x256.png',
  logoAlt: 'Brasão Filarmônica 25 de Março',
  whatsapp: '5575991234567',
} as const;

export const LABELS = {
  featured: 'Em Destaque',
  featuredSubtitle: 'Partituras em estudo',
  inStudy: 'Em estudo',
  searchPlaceholder: 'Buscar partituras...',
  loadingArchive: 'Carregando acervo...',
  dragHint: 'Arraste',
  adminBadge: 'Admin',
  inactive: '(inativo)',
  noMusician: 'Nenhum músico encontrado',
  noInstrument: 'Sem instrumento',
  backToArchive: 'Voltar ao Acervo',
  goToAdmin: 'Ir para Admin',
} as const;

export const FOOTER = {
  version: (v: string) => `Acervo Digital de Partituras • Versão ${v}`,
  copyright: `${ORGANIZATION.location} • ${ORGANIZATION.foundedText}`,
};
