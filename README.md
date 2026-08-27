<div align="center">

# Acervo Digital da Filarmônica 25 de Março

Sistema web para organizar, consultar e distribuir o acervo de partituras da Sociedade Filarmônica 25 de Março, de Feira de Santana, Bahia.

[![Versão](https://img.shields.io/badge/versão-3.2.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica/blob/main/CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-em%20produção-success?style=for-the-badge)](https://acervo.filarmonica25demarco.com)
[![CI](https://img.shields.io/github/actions/workflow/status/acssjr/acervo-filarmonica/ci.yml?branch=main&style=for-the-badge&label=CI&logo=github)](https://github.com/acssjr/acervo-filarmonica/actions/workflows/ci.yml)

[Acessar o Acervo](https://acervo.filarmonica25demarco.com) · [Arquitetura](docs/ARCHITECTURE.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md)

</div>

## Sobre o projeto

O Acervo Digital reduz o trabalho de organizar, localizar e distribuir centenas de partes musicais. Em vez de cadastrar cada PDF manualmente ou procurar arquivos em pastas dispersas, a administração envia pastas completas, revisa o que foi reconhecido e publica tudo em um único fluxo.

No celular ou no computador, cada músico encontra a parte do próprio instrumento. Maestro e administradores organizam repertórios, ensaios, presenças, usuários e o acervo completo no mesmo lugar.

O projeto começou como uma página HTML única e evoluiu para uma aplicação React com backend modular no Cloudflare Workers, banco D1 e armazenamento de PDFs no R2.

Este é um projeto de uso institucional, desenvolvido para as necessidades da Sociedade Filarmônica 25 de Março. O repositório documenta sua evolução e manutenção, mas não é apresentado como template ou sistema genérico para clonagem.

## Como o Acervo poupa tempo

### Upload de pasta: uma obra completa de uma vez

Para cadastrar uma partitura, basta arrastar a pasta da obra para a área administrativa. Cada PDF dentro dela é analisado como uma parte da mesma peça.

```text
📂 Senhora Sant'Anna - Marcha - Tertuliano Santos/
├── 📄 Grade.pdf
├── 📄 01 - Flautim.pdf
├── 📄 02 - Clarinete Bb 1.pdf
├── 📄 03 - Clarinete Bb 2.pdf
├── 📄 Trompete Bb 1.pdf
├── 📄 Trombone 1.pdf
└── 📄 Bombo.pdf
```

Nesse fluxo, o sistema:

1. identifica título, gênero e compositor pelo nome e pela posição da pasta;
2. reconhece o instrumento de cada arquivo, mesmo com diferenças de numeração e escrita;
3. organiza todas as partes em uma única obra;
4. mostra uma revisão antes do envio;
5. permite corrigir metadados ou instrumentos sem renomear os arquivos no computador;
6. envia os PDFs com progresso visível e atualiza o acervo ao concluir.

### Importação em lote: várias obras no mesmo envio

Quando há muitas partituras para cadastrar, a pasta principal pode conter uma subpasta para cada obra:

```text
📂 Minha Coleção/
├── 📂 Dois Corações - Dobrado - Estevam Moura/
│   ├── 📄 Grade.pdf
│   ├── 📄 Clarinete Bb 1.pdf
│   └── 📄 Trompete Bb 1.pdf
├── 📂 Saudades - Valsa - Autor Desconhecido/
│   ├── 📄 Grade.pdf
│   └── 📄 Flauta.pdf
└── 📂 Hino Nacional - Hino Cívico/
    ├── 📄 Grade.pdf
    └── 📄 Trombone.pdf
```

O Acervo separa as obras, extrai os dados de cada pasta e apresenta uma revisão geral. Assim, dezenas de partituras podem ser preparadas no mesmo processo, mantendo edição individual quando alguma informação precisa de ajuste.

Também é possível organizar primeiro por gênero:

```text
📂 Repertório/
├── 📂 Dobrados/
│   ├── 📂 Dois Corações/
│   └── 📂 Cisne Branco/
├── 📂 Marchas/
│   └── 📂 Senhora Sant'Anna/
└── 📂 Hinos Religiosos/
    └── 📂 Hino de Nossa Senhora/
```

### O que é reconhecido automaticamente

O analisador aceita diferentes padrões encontrados em acervos antigos e atuais:

| Nome recebido | Interpretação |
|---|---|
| `01 - Clarinete Bb 1.pdf` | Clarinete Bb 1 |
| `15 III Trompete Bb.pdf` | Trompete Bb 3 |
| `I e II Clarinetes in Bb.pdf` | Clarinete Bb 1 e 2 |
| `Caixa-clara.pdf` | Caixa |
| `Barítono Bb TC.pdf` | Barítono Bb TC |
| `BarÃ­tono.pdf` | Barítono, com correção de codificação |

Para o gênero, a análise considera nesta ordem:

1. a pasta de gênero acima da obra;
2. o padrão `Título - Gênero - Compositor`;
3. palavras reconhecidas no título.

Antes do envio, nada é publicado automaticamente: o administrador pode conferir e corrigir o resultado.

### Arrastar e soltar decide o fluxo

| O que é arrastado | O que o Acervo abre |
|---|---|
| Uma pasta com PDFs | Upload de pasta para uma obra |
| Uma pasta com subpastas | Importação em lote para várias obras |

Além de poupar o cadastro manual, o sistema detecta possíveis duplicatas, permite substituir partes existentes e atualiza as notificações depois do upload.

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

## Distribuição e integridade do acervo

Nos downloads de repertório, o sistema confere tanto o cadastro da parte quanto a existência real do PDF. Se alguma obra não tiver o instrumento solicitado, ela é informada antes do download e um pacote parcial só é gerado depois da confirmação.

Tonalidades diferentes não são usadas como substitutas. Por exemplo, Bombardino C e Bombardino Bb permanecem separados; um arquivo identificado apenas como `Bombardino` ou `Euphonium` segue a convenção do acervo e é tratado como Bombardino C.

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

## Documentação técnica interna

| Documento | Conteúdo |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Fluxo da aplicação e fontes de verdade |
| [docs/TESTING-STRATEGY.md](docs/TESTING-STRATEGY.md) | Estratégia e camadas de testes |
| [docs/DEPLOYMENT-CHECKLIST.md](docs/DEPLOYMENT-CHECKLIST.md) | Publicação, migrações, verificações e rollback |
| [SECURITY.md](SECURITY.md) | Modelo de segurança e reporte responsável |
| [CHANGELOG.md](CHANGELOG.md) | Histórico das versões |

## Versão atual

Este repositório está na versão **3.2.0**, lançada em 27 de agosto de 2026. O projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/) e mantém as mudanças relevantes no [changelog](CHANGELOG.md).

## Autoria

Desenvolvido por **Antônio Júnior** para a **Sociedade Filarmônica 25 de Março**, fundada em 1868 em Feira de Santana, Bahia.
