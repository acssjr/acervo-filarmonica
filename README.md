<div align="center">

# Acervo Digital da Filarmonica 25 de Marco

### Sistema de gerenciamento e distribuicao de partituras digitais

*Sociedade Filarmonica 25 de Marco - Feira de Santana, BA - Desde 1868*

<br/>

[![Versao](https://img.shields.io/badge/versao-2.6.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica)
[![Status](https://img.shields.io/badge/status-em%20producao-success?style=for-the-badge)](https://partituras25.com)
[![CI](https://img.shields.io/github/actions/workflow/status/acssjr/acervo-filarmonica/ci.yml?style=for-the-badge&label=CI&logo=github)](https://github.com/acssjr/acervo-filarmonica/actions)

<br/>

[**Acessar Sistema**](https://partituras25.com)

<br/>

</div>

---

## Sobre o Projeto

O Acervo Digital da Filarmonica 25 de Marco e um sistema web desenvolvido para digitalizar e facilitar o acesso ao extenso acervo de partituras da banda mais antiga da Bahia, fundada em 1868.

O sistema permite que musicos acessem suas partituras de qualquer lugar, baixem arquivos no formato correto para seu instrumento e acompanhem novidades do repertorio.

---

## Funcionalidades

<table>
<tr>
<td width="33%" valign="top">

### Para Musicos
- Interface responsiva (mobile/desktop)
- Download de partituras por instrumento
- Busca inteligente com transliteracao (grafias antigas)
- Sistema de favoritos
- Perfil com foto e alteracao de PIN
- Temas claro/escuro/automatico
- Notificacoes de novidades
- Carrossel de compositores em destaque
- Skeleton loading para melhor UX

</td>
<td width="33%" valign="top">

### Para Maestro
- Acesso a Grade completa de cada obra
- Download de todas as partes de uma partitura
- Visualizacao do acervo total
- Destaque automatico de partituras recentes

</td>
<td width="33%" valign="top">

### Para Administradores
- Upload de pasta completa (multiplas partes de uma vez)
- Importacao em lote de partituras
- Deteccao automatica de instrumentos e categorias
- Gerenciamento individual de partes (substituir/deletar)
- Modal de edicao de partituras
- Visualizacao de PDF inline com zoom
- Gestao de musicos com badges visuais
- Estatisticas de downloads
- Reset de PIN de usuarios
- Toggle admin/usuario para testes
- Protecao do super admin

</td>
</tr>
</table>

---

## Detalhes das Funcionalidades

### Upload de Pasta

O sistema permite fazer upload de uma pasta inteira contendo todas as partes de uma partitura. Os instrumentos sao detectados automaticamente pelo nome dos arquivos:

| Nome do Arquivo | Instrumento Detectado |
|-----------------|----------------------|
| `Grade.pdf` | Grade |
| `Clarinetes.pdf` | Clarinetes |
| `Saxes Alto.pdf` | Saxes Alto |
| `Trompetes.pdf` | Trompetes |
| `Trombones.pdf` | Trombones |
| `Bombardinos.pdf` | Bombardinos |
| `Tubas.pdf` | Tubas |
| `Percussao.pdf` | Percussao |

### Busca com Transliteracao

O sistema entende grafias antigas e modernas:

- `nymphas` encontra `ninfas`
- `philarmonica` encontra `filarmonica`
- `symphonia` encontra `sinfonia`

### Sistema de Notificacoes

Usuarios recebem notificacoes sobre:
- Novas partituras adicionadas
- Partituras em destaque
- Atualizacoes do sistema

### Temas Visuais

- **Claro**: Fundo claro, ideal para ambientes iluminados
- **Escuro**: Fundo escuro, ideal para leitura noturna
- **Automatico**: Segue a preferencia do sistema operacional

---

## Stack Tecnologica

<div align="center">

| Camada | Tecnologia | Descricao |
|:------:|:----------:|:---------:|
| ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | **Frontend** | Interface SPA com Vite |
| ![Cloudflare](https://img.shields.io/badge/-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Backend** | API Serverless Edge |
| ![D1](https://img.shields.io/badge/-D1_SQLite-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Database** | Banco distribuido |
| ![R2](https://img.shields.io/badge/-R2_Storage-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Storage** | Arquivos PDF |
| ![Pages](https://img.shields.io/badge/-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Hosting** | CDN Global |

</div>

---

## Arquitetura do Backend

O backend segue uma **Arquitetura Hexagonal (Monolito Modular)** para facilitar manutencao e escalabilidade:

```
worker/src/
├── index.js                    # Entry point
├── config/                     # Constantes e configuracoes
│   ├── constants.js
│   └── index.js
├── infrastructure/             # Camada de infraestrutura
│   ├── security/               # CORS, crypto helpers
│   ├── auth/                   # JWT, hashing PBKDF2
│   ├── ratelimit/              # Rate limiting
│   ├── response/               # Response helpers
│   └── index.js
├── domain/                     # Logica de negocio
│   ├── auth/                   # Autenticacao
│   ├── atividades/             # Registro de atividades
│   ├── categorias/             # Categorias de partituras
│   ├── estatisticas/           # Estatisticas e instrumentos
│   ├── favoritos/              # Sistema de favoritos
│   ├── partituras/             # CRUD de partituras
│   ├── perfil/                 # Perfil do usuario
│   └── usuarios/               # Gestao de usuarios (admin)
├── middleware/                 # Middleware pipeline
│   ├── corsMiddleware.js
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── index.js
└── routes/                     # Rotas da API
    ├── router.js               # Router com path params
    ├── healthRoutes.js
    ├── authRoutes.js
    ├── favoritoRoutes.js
    ├── atividadeRoutes.js
    ├── categoriaRoutes.js
    ├── estatisticaRoutes.js
    ├── usuarioRoutes.js
    ├── perfilRoutes.js
    ├── partituraRoutes.js
    └── index.js
```

---

## Seguranca

| Recurso | Implementacao |
|---------|---------------|
| **Autenticacao** | JWT com expiracao de 24h |
| **Senhas** | PBKDF2 (100k iteracoes) |
| **Rate Limiting** | Protecao contra brute-force |
| **CORS** | Whitelist de dominios |
| **Sessao** | Logout automatico ao expirar |
| **Super Admin** | Protecao total - invisivel e imutavel |

---

## Qualidade de Codigo

O projeto possui infraestrutura completa de testes automatizados:

- **215+ testes unitarios** com Jest e Testing Library
- **16 testes E2E** com Playwright (8 mocked + 8 com backend real)
- **CI/CD automatizado** via GitHub Actions
- **ESLint** para padronizacao de codigo
- **Husky + lint-staged** para validacao pre-commit

Pipeline automatico em cada push:
```
Push/PR -> Lint -> Jest (215+) -> E2E Mocked (8) -> Build -> Deploy
```

---

## URLs do Sistema

| Ambiente | Frontend | API |
|----------|----------|-----|
| **Producao** | https://partituras25.com | https://api.partituras25.com |
| **Local** | http://localhost:5173 | http://localhost:8787 |

---

## Desenvolvimento Local

### Comandos Principais

```bash
# Terminal 1: Backend local (D1 + R2 locais)
npm run api

# Terminal 2: Frontend (proxy para localhost:8787)
cd frontend && npm run dev
```

### Primeiro uso (inicializar banco local)

```bash
npm run db:init
```

Isso cria as tabelas e insere dados de teste:
- **admin** / PIN: 1234 (administrador)
- **musico** / PIN: 1234 (usuario comum)

### Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run api` | Inicia backend local (porta 8787) |
| `npm run db:init` | Cria tabelas + seed inicial |
| `npm run db:seed` | Apenas seed (se tabelas existem) |
| `npm run db:reset` | Limpa dados e reaplica seed |
| `npm test` | Roda testes unitarios |
| `npm run test:e2e` | Roda testes E2E |

---

## Changelog

<details open>
<summary><b>v2.6.0</b> - Dezembro 2025</summary>

**Arquitetura Modular do Backend**
- Refatoracao completa do worker monolitico (2014 linhas → ~50 arquivos)
- Arquitetura Hexagonal com separacao Infrastructure/Domain
- Router customizado com suporte a path params e middleware pipeline
- Domain Services separados por responsabilidade
- Re-exports organizados por modulo

**Novo Dominio**
- Migracao para `partituras25.com` e `api.partituras25.com`
- Configuracao de rotas customizadas no Cloudflare

**Melhorias de UX**
- Skeleton loading em todas as telas
- Correcao de acentuacao em portugues
- Melhorias visuais nas sidebars
- Animacoes Lottie no admin

**Admin**
- Modal de edicao de partituras
- Importacao em lote melhorada
- Deteccao automatica de categorias
- Melhor UX nos botoes de acao

</details>

<details>
<summary><b>v2.5.0</b> - Dezembro 2025</summary>

**Melhorias de UX no Painel Admin**
- Visualizacao de PDF inline com zoom (Ctrl+Scroll)
- Contador de partes por partitura
- Hover individual nos botoes de acao (substituir/deletar)
- Efeito visual de scale nos botoes
- Fechamento do PDF ao clicar no backdrop
- Melhor feedback visual para parte sendo visualizada

**Qualidade**
- Correcao de bugs no carregamento de PDF
- Prevencao de interceptacao por gerenciadores de download (IDM)

</details>

<details>
<summary><b>v2.4.0</b> - Dezembro 2025</summary>

- **Super Admin:** Protecao total do @admin (invisivel, imutavel)
- **Badges:** Identificacao visual de admins na lista
- **Equalizer:** Animacao de loading no login
- **Constants:** Centralizacao de cores, mensagens e configs

</details>

<details>
<summary><b>v2.3.x</b> - Dezembro 2025</summary>

- **Admin Toggle:** Alternar entre modo usuario/admin sem logout
- **Carrossel:** Compositores em destaque na home (mobile)
- **Busca:** Transliteracao de grafias antigas
- **Testes:** 215 testes unitarios + 16 E2E
- **CI/CD:** Pipeline automatizado com GitHub Actions

</details>

<details>
<summary><b>v2.2.0</b> - Dezembro 2025</summary>

- **Arquitetura:** Contexts separados (Auth, UI, Data, Notifications)
- **Performance:** Re-renders isolados por dominio
- 30+ componentes migrados para nova arquitetura

</details>

<details>
<summary><b>Versoes anteriores</b></summary>

**v2.1.0** - JWT 24h, PBKDF2, Rate limiting, Redirect admin

**v2.0.0** - Upload pasta, deteccao instrumentos, gerenciamento partes

**v1.5.0** - Modal "Sobre", validacao PIN, melhorias mobile

**v1.4.0** - Perfil com foto, alteracao PIN, seletor de tema

**v1.0.0** - Versao inicial

</details>

---

<div align="center">

### Desenvolvido por

**Antonio Junior**

*Para a Sociedade Filarmonica 25 de Marco*

<br/>

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/acssjr)

---

<sub>Projeto privado - Todos os direitos reservados</sub>

<br/>

**Sociedade Filarmonica 25 de Marco - Desde 1868**

</div>
