# Changelog

Todas as mudanças relevantes do Acervo Digital são registradas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não publicado]

## [3.2.0] - 2026-08-27

### Adicionado

- Compartilhamento de partituras por link, com Web Share API e cópia para a área de transferência como alternativa.
- Preview social dinâmico de cada obra com título, gênero e compositor, gerado por Cloudflare Pages Functions.
- Retorno automático à partitura depois do login ao abrir um link compartilhado.
- Suporte a até dois repertórios ativos, com duplicação, ordenação e filtros administrativos.
- Acesso rápido aos ensaios pela navegação e às partituras favoritas pela tela inicial.
- Contrato OpenAPI completo para as rotas do Worker e tipos gerados para o frontend.
- Health check de prontidão para banco, armazenamento, autenticação e rate limiters.

### Alterado

- Backend estabilizado sobre o entrypoint modular `worker/src/index.js`, com validações, operações atômicas no D1 e armazenamento R2 recuperável.
- Analytics reorganizado para registrar sessões e eventos com menor impacto no fluxo principal.
- Home e biblioteca passaram a ser carregadas sob demanda depois da autenticação.
- Pipeline atualizado para Node.js 22, Wrangler fixado pelo lockfile, compilação das Pages Functions e verificação da saúde da API após o deploy.
- Exclusão de partes passou a preservar a integridade do histórico de downloads.

### Corrigido

- Bombardino C e Bombardino Bb passaram a ser tratados como instrumentos distintos em upload, renomeação e downloads individuais ou de repertório.
- Nomes genéricos `Bombardino` e `Euphonium` passaram a representar Bombardino C, sem substituição silenciosa entre tonalidades.
- Download de repertório passou a conferir os PDFs no R2, listar obras ausentes e exigir confirmação antes de gerar pacote parcial.
- Autenticação passou a falhar de forma segura quando uma dependência obrigatória não está disponível.
- Limite de login passou a usar contador atômico por IP e usuário, com cinco tentativas por cinco minutos e limpeza após acesso válido.
- Consulta de usuário passou a ignorar respostas antigas e a distinguir conta inexistente, excesso de tentativas, indisponibilidade e falha de rede.
- Deploy do Worker deixou de aceitar configuração sem os três rate limiters obrigatórios.
- Deploy automático deixou de tentar executar migrations D1 com o token restrito de publicação.

### Migrações

- `0002_logs_download_instrument_text.sql`: preserva o instrumento como rótulo histórico nos logs de download.
- `0003_fix_bombardino_tonalidades.sql`: cria Bombardino Bb e corrige as partes auditadas de Bombardino C e Bb.
- `0004_login_rate_limits.sql`: cria o contador atômico de tentativas de login.

## [3.1.0] - 2026-04-03

### Adicionado

- Contador alternado entre próximo ensaio e próxima apresentação.
- Foto de perfil persistida no servidor e nome de exibição visível para outros usuários.
- Busca expandida no celular e acesso direto ao compositor selecionado.
- Histórico de ensaios com detalhes e estatísticas de presença.

### Alterado

- Telas de login, navegação, notificações, ensaios e administração receberam nova direção visual e melhor adaptação ao celular.
- Notificações passaram a atualizar imediatamente após uploads e novas partes.

### Corrigido

- Inicialização do frontend deixou de depender de configurações não críticas.
- Busca no celular passou a abrir corretamente a partitura escolhida.
- Modais de ensaio, perfil e calendário ficaram estáveis em diferentes tamanhos de tela.

## [3.0.0] - 2026-03-09

### Adicionado

- Compartilhamento de repertório como cartão de imagem.
- Tracking de sessões, buscas, downloads e atividades.
- Painel administrativo de analytics.

### Alterado

- Repertório e gestão de ensaios receberam novos fluxos administrativos.
- Nome de exibição passou a ser persistido no banco.

## [2.9.2] - 2026-02-15

### Adicionado

- Dashboard de analytics com indicadores, tendências, distribuição e atividade recente.
- Rastreamento de downloads por usuário e buscas sem resultado.

### Corrigido

- Datas dos registros e nomes com problemas de codificação.
- Estatísticas de presença deixaram de contabilizar o maestro como músico.

## [2.9.1] - 2026-02-14

### Adicionado

- Numeração sequencial dos ensaios no Livro de Registros.
- Campo de convidado no controle de presença.

### Alterado

- Domínio oficial migrado para `acervo.filarmonica25demarco.com`.

### Corrigido

- Datas do calendário, posicionamento de modais e visualização de fotos no celular.

## [2.9.0] - 2025-12-25

### Adicionado

- Carrinho para baixar várias partituras.
- Compartilhamento de arquivo pelo WhatsApp.
- Modo recesso e tutorial de primeiro acesso.

### Alterado

- Visualizador de PDF recebeu gesto de zoom e limite ampliado.
- Busca passou a exigir correspondência de todas as palavras.
- Aplicação recebeu ícones e configuração para instalação como PWA.

## [2.8.0] - 2025-12-14

### Adicionado

- Download e impressão de repertório por instrumento.
- Seleção ou criação de repertório ao adicionar uma obra.

### Corrigido

- Lista de instrumentos passou a refletir as partes realmente cadastradas.

## [2.7.0] - 2025-12-11

### Adicionado

- Transições entre páginas e modais.
- Opção “Lembrar meu acesso” com sessão de 30 dias.
- Detecção proativa de sessão expirada.

### Corrigido

- Detecção de categoria, duplicatas, partes protegidas e comportamento de scroll em modais.

## [2.6.0] - 2025-12-09

### Adicionado

- Backend modular por domínios, infraestrutura, middleware e rotas.
- Router com parâmetros de caminho e pipeline de middleware.
- Importação de várias obras e upload por arrastar pastas.
- Skeletons e feedback de progresso durante uploads.

### Alterado

- Entry point do Worker movido para `worker/src/index.js`.
- Contextos do frontend separados por autenticação, dados, interface e notificações.

## [2.5.0] - 2025-12-07

### Adicionado

- Edição de metadados e visualização de PDF no painel administrativo.
- Importação em lote com revisão antes do envio.
- Reconhecimento ampliado de instrumentos e categorias.

### Corrigido

- Acentuação da interface e detecção de instrumentos com hífen.

## [2.4.0] - 2025-12-06

### Adicionado

- Proteção do superadministrador e identificação visual de administradores.
- Alternância entre modo músico e administrador.
- Carrossel e página de compositores.
- Busca com transliteração de grafias antigas.

## [2.3.0] - 2025-12-06

### Adicionado

- Testes unitários e de ponta a ponta.
- Pipeline de integração contínua com lint, testes e build.
- Notificações reais de novas partituras.

## [2.2.0] - 2025-12-05

### Alterado

- Estado global dividido em contextos menores para reduzir renderizações e facilitar testes.

## [2.0.0] - 2025-12-04

### Adicionado

- Upload de pasta com várias partes.
- Detecção automática de instrumentos.
- Gestão de partes, favoritos sincronizados e painel administrativo.
- Autenticação JWT, PIN com PBKDF2, CORS restrito e rate limiting.

## [1.0.0] - 2025-11-29

### Adicionado

- Primeira versão integrada da aplicação React.
- Login por usuário e PIN, catálogo, busca, favoritos, temas e perfil.
- Layouts próprios para celular e desktop.

## [0.1.0] - 2025-11-28

### Adicionado

- Protótipo inicial do catálogo em uma única página HTML.
