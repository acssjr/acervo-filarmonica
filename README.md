<div align="center">

# Acervo Digital da Filarmonica 25 de Marco

### Sistema de gerenciamento e distribuicao de partituras digitais

*Sociedade Filarmonica 25 de Marco - Feira de Santana, BA - Desde 1868*

<br/>

[![Versao](https://img.shields.io/badge/versao-2.7.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica)
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
- **Transicoes suaves entre paginas e modais**
- **"Lembrar meu acesso" com token de 30 dias**

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
- **Drag & drop de pastas direto na tela**
- Upload de pasta completa (todas as partes)
- **Importacao em lote** (dezenas de partituras de uma vez)
- Deteccao automatica de **100+ instrumentos**
- Deteccao automatica de **13 categorias**
- Correcao automatica de encoding (UTF-8/Latin-1)
- Gerenciamento individual de partes (substituir/deletar)
- Modal de edicao de partituras
- Visualizacao de PDF inline com zoom
- **Frases engracadas animadas durante upload**
- Gestao de musicos com badges visuais
- Estatisticas de downloads
- Reset de PIN de usuarios
- Toggle admin/usuario para testes
- Protecao do super admin

</td>
</tr>
</table>

---

## Inteligencia do Sistema

### 🎯 Deteccao Automatica de Instrumentos

O sistema possui um **parser inteligente** que reconhece **100+ variacoes** de nomes de instrumentos, incluindo:

<table>
<tr>
<td width="50%">

**Madeiras**
```
Flautim, Flauta, Requinta, Oboe, Fagote
Clarinete Bb (1, 2, 3), Clarinete Baixo
```

**Saxofones**
```
Soprano, Alto (1, 2), Tenor (1, 2), Baritono
Sax Horn Eb
```

**Metais Agudos**
```
Trompete Bb (1, 2, 3)
Trompa F/Eb (1, 2, 3, 4)
```

</td>
<td width="50%">

**Metais Graves**
```
Baritono Bb/TC/BC (1, 2)
Trombone (1, 2, 3)
Bombardino, Eufonio
Baixo Eb/Bb, Tuba
```

**Percussao**
```
Caixa, Bombo, Pratos
Timpano, Triangulo, Glockenspiel
Zabumba, Jam Block
```

**Regencia**
```
Grade, Score, Conductor, Maestro
```

</td>
</tr>
</table>

#### Formatos Reconhecidos

O parser entende **qualquer formato** de nomenclatura:

| Entrada | Resultado |
|---------|-----------|
| `01 - Clarinete Bb 1.pdf` | Clarinete Bb 1 |
| `15 III Trompete Bb.pdf` | Trompete Bb 3 |
| `1º Trompete.pdf` | Trompete Bb 1 |
| `I e II Clarinetes in Bb.pdf` | Clarinete Bb 1 e 2 |
| `Caixa-clara.pdf` | Caixa |
| `Euphonium (bombardino).pdf` | Bombardino |
| `BarÃ­tono.pdf` | Baritono *(corrige encoding)* |

### 📁 Deteccao Automatica de Categorias

Sistema **multi-camada** com niveis de confianca:

```
📂 Repertorio/
   📂 Dobrados/           ← 95% confianca (estrutura de pastas)
      📂 Dois Coracoes/
         📄 Grade.pdf
         📄 Clarinetes.pdf
```

| Camada | Fonte | Confianca |
|--------|-------|:---------:|
| 1ª | Estrutura de pastas (pasta-pai) | 95% |
| 2ª | Nome da pasta (`Titulo - Categoria - Compositor`) | 85% |
| 3ª | Palavra-chave no titulo | 75% |

**Categorias detectadas:** Dobrado, Marcha, Marcha Funebre, Marcha Religiosa, Valsa, Fantasia, Polaca, Bolero, Hino, Hino Civico, Hino Religioso, Preludio, Arranjo

### 📦 Importacao em Lote

Importe **dezenas de partituras** de uma vez arrastando uma pasta com subpastas:

```
📂 Minha Colecao/
   📂 Dois Coracoes - Dobrado - Estevam Moura/
   📂 Saudades - Valsa - Autor Desconhecido/
   📂 Hino Nacional - Hino Civico/
   ...
```

**Recursos:**
- Extracao automatica de titulo, categoria, compositor e arranjador
- Preview de todas as partituras antes do upload
- Edicao individual de metadados
- Barra de progresso com **frases engracadas** animadas
- Processamento paralelo otimizado

### 🔍 Busca com Transliteracao

O sistema entende **grafias antigas e modernas**:

| Busca | Encontra |
|-------|----------|
| `nymphas` | ninfas |
| `philarmonica` | filarmonica |
| `symphonia` | sinfonia |
| `João` | Joao |

### 🖱️ Drag & Drop Inteligente

Arraste pastas diretamente para a tela do admin:

| O que voce arrasta | O que acontece |
|-------------------|----------------|
| 📁 Pasta com PDFs | Abre **Upload de Pasta** (1 partitura) |
| 📁 Pasta com subpastas | Abre **Importacao em Lote** (N partituras) |

### 🔐 Sistema de Autenticacao

| Opcao | Duracao | Uso Recomendado |
|-------|:-------:|-----------------|
| Login normal | 24h | Computadores compartilhados |
| "Lembrar meu acesso" | 30 dias | Dispositivo pessoal |

O sistema detecta automaticamente tokens expirados e redireciona para login.

### 🎨 Temas Visuais

| Tema | Descricao |
|------|-----------|
| ☀️ Claro | Fundo claro, ideal para ambientes iluminados |
| 🌙 Escuro | Fundo escuro, ideal para leitura noturna |
| 🔄 Automatico | Segue a preferencia do sistema operacional |

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
│   ├── auth/                   # Autenticacao (login, rememberMe)
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
| **Autenticacao** | JWT com expiracao configuravel (24h ou 30 dias) |
| **Senhas** | PBKDF2 (100k iteracoes) |
| **Rate Limiting** | Protecao contra brute-force |
| **CORS** | Whitelist de dominios |
| **Sessao** | Logout automatico ao expirar + deteccao proativa |
| **Super Admin** | Protecao total - invisivel e imutavel |

---

## Qualidade de Codigo

O projeto possui infraestrutura completa de testes automatizados:

- **216+ testes unitarios** com Jest e Testing Library
- **16 testes E2E** com Playwright (8 mocked + 8 com backend real)
- **CI/CD automatizado** via GitHub Actions
- **ESLint** para padronizacao de codigo
- **Husky + lint-staged** para validacao pre-commit

Pipeline automatico em cada push:
```
Push/PR -> Lint -> Jest (216+) -> E2E Mocked (8) -> Build -> Deploy
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

Isso cria as tabelas e insere usuarios de teste para desenvolvimento local.

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
<summary><b>v2.7.0</b> - 11 de Dezembro de 2025</summary>

**Transicoes e Animacoes**
- Hook `useAnimatedVisibility` para gerenciar animacoes de entrada/saida
- Animacoes CSS para modais: backdrop blur, scale in/out, slide down
- Transicao de pagina suave baseada na rota atual
- Frases engracadas animadas durante upload em lote

**Autenticacao Melhorada**
- "Lembrar meu acesso" agora gera token de 30 dias
- Login normal continua com token de 24 horas
- Deteccao proativa de tokens expirados (limpa auth em qualquer 401)
- Estabilidade de sessao entre deploys

**Correcoes**
- Fix: scroll lock robusto em modais (Safari/desktop)
- Fix: erro 401 ao buscar partes da partitura
- Fix: teste flaky de login no CI

</details>

<details>
<summary><b>v2.6.1</b> - 9-10 de Dezembro de 2025</summary>

**Drag & Drop de Pastas**
- Arraste pastas diretamente para a tela do admin
- Overlay visual com instrucoes durante arraste
- Deteccao automatica: pasta simples → Upload, subpastas → Lote

**Melhorias no Upload**
- Modal redesenhado com header/footer fixos
- Grid compacto para partes detectadas
- Suporte a pre-carregamento de arquivos

**Sincronizacao**
- Categorias e instrumentos sincronizados com banco de dados
- Fallback local quando API indisponivel
- Migration para corrigir categorias em producao

</details>

<details>
<summary><b>v2.6.0</b> - 8-9 de Dezembro de 2025</summary>

**Arquitetura Modular do Backend**
- Refatoracao completa do worker monolitico (2014 linhas → ~50 arquivos)
- Arquitetura Hexagonal com separacao Infrastructure/Domain
- Router customizado com suporte a path params e middleware pipeline
- Domain Services separados por responsabilidade

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

</details>

<details>
<summary><b>v2.5.0</b> - 7 de Dezembro de 2025</summary>

**Melhorias de UX no Painel Admin**
- Visualizacao de PDF inline com zoom (Ctrl+Scroll)
- Contador de partes por partitura
- Hover individual nos botoes de acao (substituir/deletar)
- Efeito visual de scale nos botoes
- Fechamento do PDF ao clicar no backdrop

**Upload**
- Modal redesenhado com SVGs e animacoes
- Correcao de deteccao de instrumentos com hifen (ex: Caixa-Clara)
- Correcao de race condition entre tutorial e modal

**Qualidade**
- Correcao de bugs no carregamento de PDF
- Testes Playwright corrigidos

</details>

<details>
<summary><b>v2.4.0</b> - 6 de Dezembro de 2025</summary>

- **Super Admin:** Protecao total do @admin (invisivel, imutavel)
- **Badges:** Identificacao visual de admins na lista
- **Equalizer:** Animacao de loading no login
- **Constants:** Centralizacao de cores, mensagens e configs

</details>

<details>
<summary><b>v2.3.x</b> - 5 de Dezembro de 2025</summary>

- **Admin Toggle:** Alternar entre modo usuario/admin sem logout
- **Carrossel:** Compositores em destaque na home (mobile)
- **Busca:** Transliteracao de grafias antigas
- **Testes:** 215 testes unitarios + 16 E2E
- **CI/CD:** Pipeline automatizado com GitHub Actions

</details>

<details>
<summary><b>v2.2.0</b> - 4 de Dezembro de 2025</summary>

- **Arquitetura:** Contexts separados (Auth, UI, Data, Notifications)
- **Performance:** Re-renders isolados por dominio
- 30+ componentes migrados para nova arquitetura

</details>

<details>
<summary><b>Versoes anteriores</b></summary>

**v2.1.0** - 3 de Dezembro de 2025
- JWT 24h, PBKDF2, Rate limiting, Redirect admin

**v2.0.0** - 2 de Dezembro de 2025
- Upload pasta, deteccao instrumentos, gerenciamento partes

**v1.5.0** - 1 de Dezembro de 2025
- Modal "Sobre", validacao PIN, melhorias mobile

**v1.4.0** - 30 de Novembro de 2025
- Perfil com foto, alteracao PIN, seletor de tema

**v1.0.0** - 28 de Novembro de 2025
- Versao inicial

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
