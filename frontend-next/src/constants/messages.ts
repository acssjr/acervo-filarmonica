export const MESSAGES = {
  success: {
    pinChanged: 'PIN alterado com sucesso!',
    pinReset: 'PIN resetado com sucesso!',
    nameUpdated: 'Nome atualizado!',
    photoUpdated: 'Foto atualizada!',
    downloadStarted: 'Download iniciado!',
    saved: 'Salvo com sucesso!',
    deleted: 'Removido com sucesso!',
    logout: 'Você saiu da conta',
  },
  error: {
    imageTooLarge: 'Imagem muito grande (max 2MB)',
    downloadFailed: 'Erro ao baixar arquivo',
    connectionFailed: 'Erro ao conectar com o servidor',
    invalidPin: 'PIN atual incorreto',
    pinMismatch: 'Os PINs não conferem',
    samePinError: 'O novo PIN não pode ser igual ao atual',
    generic: 'Ocorreu um erro. Tente novamente.',
    userNotFound: 'Usuário não encontrado',
  },
  loading: {
    entering: 'Entrando...',
    preparing: 'Preparando',
    downloading: 'Baixando...',
    saving: 'Salvando...',
    loadingArchive: 'Carregando acervo...',
    changingPin: 'Alterando PIN...',
  },
  confirm: {
    logout: 'Deseja realmente sair?',
    delete: 'Deseja realmente remover?',
    resetPin: 'Deseja resetar o PIN deste usuário?',
  },
  pin: {
    currentLabel: 'Digite seu PIN atual',
    newLabel: 'Digite o novo PIN',
    confirmLabel: 'Confirme o novo PIN',
    incorrectRetry: 'PIN atual incorreto. Tente novamente.',
  },
  hints: {
    checkNotifications: 'Verifique a barra de notificações',
  },
} as const;
