<div align="center">

# Acervo Digital da Filarmônica 25 de Março

Sistema web para organizar, consultar e distribuir o acervo de partituras da Sociedade Filarmônica 25 de Março, de Feira de Santana, Bahia.

[![Versão](https://img.shields.io/badge/versão-3.2.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica/blob/main/CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-em%20produção-success?style=for-the-badge)](https://acervo.filarmonica25demarco.com)
[![CI](https://img.shields.io/github/actions/workflow/status/acssjr/acervo-filarmonica/ci.yml?branch=main&style=for-the-badge&label=CI&logo=github)](https://github.com/acssjr/acervo-filarmonica/actions/workflows/ci.yml)

[Acessar o Acervo](https://acervo.filarmonica25demarco.com) · [Instalação](INSTALL.md) · [Arquitetura](docs/ARCHITECTURE.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md)

</div>

## Sobre o projeto

O Acervo Digital substitui a procura manual por pastas e arquivos dispersos por um catálogo acessível no celular e no computador. Músicos encontram a parte do próprio instrumento; maestro e administradores organizam repertórios, ensaios, presenças, usuários e o acervo completo.

O projeto começou como uma página HTML única e evoluiu para uma aplicação React com backend modular no Cloudflare Workers, banco D1 e armazenamento de PDFs no R2.

## O que o sistema oferece

### Para músicos

- busca por título, compositor e grafias antigas, com experiência própria para celular;
- biblioteca por gênero, compositor, favoritos e partituras em destaque;
- visualização, impressão e download da parte do instrumento cadastrado ou de outro instrumento;
- repertórios ativos, histórico de ensaios, avisos e estatísticas pessoais de presença;
- perfil com foto, nome de exibição, alteração de PIN e temas claro, escuro ou automático;
- compartilhamento de partitura como arquivo ou link, com texto pronto e preview social personalizado;
- sessão de 24 horas ou 30 dias quando “Lembrar meu acesso” está ativado.

### Para maestro e administradores

- acesso à grade e a todas as partes disponíveis de cada obra;
- criação, duplicação, ordenação e manutenção de até dois repertórios ativos;
- download ou impressão do repertório por instrumento, com conferência prévia de disponibilidade;
- upload de uma pasta completa e importação em lote de várias obras;
- reconhecimento e normalização de instrumentos, categorias e metadados nos nomes dos arquivos;
- substituição, renomeação e exclusão segura de partes;
- gestão de músicos, ensaios, presença, avisos, fundos visuais e configurações;
- painel de analytics e histórico de atividades administrativas.

## Regras importantes do acervo

### Bombardino C e Bombardino Bb

As duas tonalidades são tratadas como instrumentos diferentes em todo o fluxo. Um arquivo identificado apenas como `Bombardino` ou `Euphonium` é normalizado como **Bombardino C**, conforme a convenção do acervo.

Nos downloads de repertório:

- Bombardino C nunca recebe uma parte de Bombardino Bb como substituta;
- Bombardino Bb nunca recebe uma parte de Bombardino C como substituta;
- o sistema verifica o cadastro no D1 e a existência real do PDF no R2;
- obras sem a parte pedida são listadas antes do download;
- um pacote parcial só é gerado depois da confirmação do usuário.

### Arquivos e metadados

O D1 guarda usuários, obras, partes, repertórios, ensaios e demais metadados. Os PDFs e imagens ficam no R2. Essa separação evita transformar o banco relacional em armazenamento de arquivos e permite validar cada camada de forma independente.

### Links compartilhados

Cada partitura pode gerar uma URL própria em `/acervo/:categoria/:id`. O link exige login para abrir a obra no sistema, mas fornece aos aplicativos de mensagem um cartão Open Graph dinâmico com título, gênero e compositor. Quando o compartilhamento nativo não está disponível, o link é copiado para a área de transferência.

## Arquitetura

```text
Navegador / celular
        │
        ├── Cloudflare Pages ── React + Vite
        │          └─────────── Pages Functions (preview dos links)
        │
        └── Cloudflare Worker ─ API /api
                    ├────────── D1 (dados e migrações)
                    ├────────── R2 (PDFs e imagens)
                    └────────── PostHog (analytics opcional)
```

O backend executável é `worker/src/index.js`. Ele organiza as regras por domínio e mantém separadas as camadas de rotas, middleware, infraestrutura e negócio. O contrato HTTP está em `worker/openapi.yaml`, e os tipos consumidos pelo frontend são gerados a partir dele.

Fontes de verdade:

| Assunto | Local |
|---|---|
| Backend | `worker/src/` |
| Frontend | `frontend/src/` |
| Migrações D1 | `database/migrations/` |
| Contrato da API | `worker/openapi.yaml` |
| Configuração do Worker | `wrangler.toml` |
| Configuração do Pages | `frontend/wrangler.jsonc` |

Veja mais detalhes em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Tecnologias

| Camada | Tecnologias principais |
|---|---|
| Interface | React 18, Vite, React Router, GSAP, Framer Motion |
| API | Cloudflare Workers, JavaScript modular, OpenAPI |
| Dados | Cloudflare D1 (SQLite) |
| Arquivos | Cloudflare R2 |
| Hospedagem | Cloudflare Pages e Pages Functions |
| Testes | Vitest com `workerd`, Jest, Testing Library e Playwright |
| Qualidade | ESLint, TypeScript para o cliente da API, GitHub Actions e Semgrep |

## Segurança e disponibilidade

- autenticação por JWT com segredo obrigatório em produção;
- PIN protegido com PBKDF2 e salt individual;
- autorização administrativa revalidada no banco;
- limites separados para login, consulta de usuário e tracking;
- contador atômico de tentativas de login no D1;
- validação de entradas, nomes de arquivos e operações administrativas;
- health check de prontidão para D1, R2, JWT e rate limiters;
- CORS restrito aos domínios permitidos;
- operações relacionadas agrupadas no D1 e compensação em falhas de armazenamento.

Detalhes e orientações para reportar vulnerabilidades estão em [SECURITY.md](SECURITY.md).

## Desenvolvimento local

### Requisitos

- Node.js 22;
- npm;
- conta Cloudflare apenas para operações remotas.

### Instalação

```powershell
git clone https://github.com/acssjr/acervo-filarmonica.git
cd acervo-filarmonica
npm ci
npm ci --prefix frontend
npm run db:init
```

Inicie a API e o frontend em terminais separados:

```powershell
npm run api:local
```

```powershell
npm run dev --prefix frontend
```

| Serviço | Endereço local |
|---|---|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:8787` |
| Saúde da API | `http://localhost:8787/api/health` |

O seed local cria somente usuários de desenvolvimento. Ele nunca deve ser aplicado em produção. Consulte o passo a passo completo em [INSTALL.md](INSTALL.md).

## Comandos principais

| Comando | Finalidade |
|---|---|
| `npm run api:local` | Inicia o Worker com D1 e R2 locais |
| `npm run db:init` | Aplica migrações e insere o seed local |
| `npm run db:migrate:local` | Aplica migrações no D1 local |
| `npm run db:schema:test` | Confere o schema usado nos testes |
| `npm run api:contract:check` | Confere a paridade entre rotas e OpenAPI |
| `npm run api:types:check` | Confere os tipos gerados para o frontend |
| `npm test` | Executa os testes do Worker |
| `npm run lint:worker` | Valida Worker e Pages Functions |
| `npm test --prefix frontend -- --runInBand` | Executa os testes do frontend |
| `npm run lint --prefix frontend` | Valida o frontend |
| `npm run typecheck --prefix frontend` | Valida o cliente tipado da API |
| `npm run build --prefix frontend` | Gera o frontend de produção |

## Publicação

O push para `main` executa lint, testes, validações de contrato, build e deploy no Cloudflare. Migrações remotas **não são aplicadas automaticamente** pelo CI: o token de publicação segue o princípio do menor privilégio.

Quando houver migration pendente, a ordem segura é:

1. revisar e aplicar a migration no D1 com credencial autorizada;
2. publicar o Worker;
3. confirmar `/api/health` e os fluxos essenciais;
4. publicar o frontend;
5. observar logs e registrar o resultado.

Siga sempre o [checklist de publicação](docs/DEPLOYMENT-CHECKLIST.md). Não execute seed, reset ou migration remota apenas para desenvolver localmente.

## Documentação

| Documento | Conteúdo |
|---|---|
| [INSTALL.md](INSTALL.md) | Instalação e desenvolvimento local |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Fluxo da aplicação e fontes de verdade |
| [docs/TESTING-STRATEGY.md](docs/TESTING-STRATEGY.md) | Estratégia e camadas de testes |
| [docs/DEPLOYMENT-CHECKLIST.md](docs/DEPLOYMENT-CHECKLIST.md) | Migrações, publicação, smoke tests e rollback |
| [SECURITY.md](SECURITY.md) | Modelo de segurança e reporte responsável |
| [CHANGELOG.md](CHANGELOG.md) | Histórico das versões |

## Versão atual

Este repositório está na versão **3.2.0**, lançada em 27 de agosto de 2026. O projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/) e mantém as mudanças relevantes no [changelog](CHANGELOG.md).

## Autoria

Desenvolvido por **Antônio Júnior** para a **Sociedade Filarmônica 25 de Março**, fundada em 1868 em Feira de Santana, Bahia.
