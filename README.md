<div align="center">

# Acervo Digital da Filarmônica 25 de Março

### Sistema de gerenciamento e distribuição de partituras digitais

*Sociedade Filarmônica 25 de Março - Feira de Santana, BA - Desde 1868*

<br/>

[![Versão](https://img.shields.io/badge/versão-2.9.1-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica)
[![Status](https://img.shields.io/badge/status-em%20produção-success?style=for-the-badge)](https://acervo.filarmonica25demarco.com)
[![CI](https://img.shields.io/github/actions/workflow/status/acssjr/acervo-filarmonica/ci.yml?style=for-the-badge&label=CI&logo=github)](https://github.com/acssjr/acervo-filarmonica/actions)

<br/>

[**Acessar Sistema**](https://acervo.filarmonica25demarco.com)

<br/>

</div>

---

## Sobre o Projeto

O Acervo Digital da Filarmônica 25 de Março é um sistema web desenvolvido para digitalizar e facilitar o acesso ao extenso acervo de partituras da banda mais antiga da Bahia, fundada em 1868.

O sistema permite que músicos acessem suas partituras de qualquer lugar, baixem arquivos no formato correto para seu instrumento e acompanhem novidades do repertório.

---

## Funcionalidades

<table>
<tr>
<td width="33%" valign="top">

### Para Músicos
- Interface responsiva (mobile/desktop)
- Download de partituras por instrumento
- Busca inteligente com transliteração (grafias antigas)
- Sistema de favoritos
- Perfil com foto e alteração de PIN
- Temas claro/escuro/automático
- Notificações de novidades
- Carrossel de compositores em destaque
- Skeleton loading para melhor UX
- **Transições suaves entre páginas e modais**
- **"Lembrar meu acesso" com token de 30 dias**

</td>
<td width="33%" valign="top">

### Para Maestro
- Acesso à Grade completa de cada obra
- Download de todas as partes de uma partitura
- Visualização do acervo total
- Destaque automático de partituras recentes

</td>
<td width="33%" valign="top">

### Para Administradores
- **Drag & drop de pastas direto na tela**
- Upload de pasta completa (todas as partes)
- **Importação em lote** (dezenas de partituras de uma vez)
- Detecção automática de **100+ instrumentos**
- Detecção automática de **13 categorias**
- Correção automática de encoding (UTF-8/Latin-1)
- **Detecção de duplicatas** (impede partituras repetidas)
- Gerenciamento individual de partes (substituir/deletar)
- Modal de edição de partituras
- Visualização de PDF inline com zoom
- **Frases engraçadas animadas durante upload**
- Gestão de músicos com badges visuais
- Estatísticas de downloads
- Reset de PIN de usuários
- Toggle admin/usuário para testes
- Proteção do super admin

</td>
</tr>
</table>

---

## Inteligência do Sistema

### 🎯 Detecção Automática de Instrumentos

O sistema possui um **parser inteligente** que reconhece **100+ variações** de nomes de instrumentos, incluindo:

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
Barítono Bb/TC/BC (1, 2)
Trombone (1, 2, 3)
Bombardino, Eufônio
Baixo Eb/Bb, Tuba
```

**Percussão**
```
Caixa, Bombo, Pratos
Tímpano, Triângulo, Glockenspiel
Zabumba, Jam Block
```

**Regência**
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
| `BarÃ­tono.pdf` | Barítono *(corrige encoding)* |

### 📁 Detecção Automática de Categorias

Sistema **multi-camada** com níveis de confiança:

```
📂 Repertório/
   📂 Dobrados/           ← 95% confiança (estrutura de pastas)
      📂 Dois Corações/
         📄 Grade.pdf
         📄 Clarinetes.pdf
```

| Camada | Fonte | Confiança |
|--------|-------|:---------:|
| 1ª | Estrutura de pastas (pasta-pai) | 95% |
| 2ª | Nome da pasta (`Título - Categoria - Compositor`) | 85% |
| 3ª | Palavra-chave no título | 75% |

**Categorias detectadas:** Dobrado, Marcha, Marcha Fúnebre, Marcha Religiosa, Valsa, Fantasia, Polaca, Bolero, Hino, Hino Cívico, Hino Religioso, Prelúdio, Arranjo

### 📦 Importação em Lote

Importe **dezenas de partituras** de uma vez arrastando uma pasta com subpastas:

```
📂 Minha Coleção/
   📂 Dois Corações - Dobrado - Estevam Moura/
   📂 Saudades - Valsa - Autor Desconhecido/
   📂 Hino Nacional - Hino Cívico/
   ...
```

**Recursos:**
- Extração automática de título, categoria, compositor e arranjador
- Preview de todas as partituras antes do upload
- Edição individual de metadados
- Barra de progresso com **frases engraçadas** animadas
- Processamento paralelo otimizado

### 🔍 Busca com Transliteração

O sistema entende **grafias antigas e modernas**:

| Busca | Encontra |
|-------|----------|
| `nymphas` | ninfas |
| `philarmonica` | filarmônica |
| `symphonia` | sinfonia |
| `João` | Joao |

### 🖱️ Drag & Drop Inteligente

Arraste pastas diretamente para a tela do admin:

| O que você arrasta | O que acontece |
|-------------------|----------------|
| 📁 Pasta com PDFs | Abre **Upload de Pasta** (1 partitura) |
| 📁 Pasta com subpastas | Abre **Importação em Lote** (N partituras) |

### 🔐 Sistema de Autenticação

| Opção | Duração | Uso Recomendado |
|-------|:-------:|-----------------|
| Login normal | 24h | Computadores compartilhados |
| "Lembrar meu acesso" | 30 dias | Dispositivo pessoal |

O sistema detecta automaticamente tokens expirados e redireciona para login.

### 🎨 Temas Visuais

| Tema | Descrição |
|------|-----------|
| ☀️ Claro | Fundo claro, ideal para ambientes iluminados |
| 🌙 Escuro | Fundo escuro, ideal para leitura noturna |
| 🔄 Automático | Segue a preferência do sistema operacional |

---

## Stack Tecnológica

<div align="center">

| Camada | Tecnologia | Descrição |
|:------:|:----------:|:---------:|
| ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | **Frontend** | Interface SPA com Vite |
| ![Cloudflare](https://img.shields.io/badge/-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Backend** | API Serverless Edge |
| ![D1](https://img.shields.io/badge/-D1_SQLite-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Database** | Banco distribuído |
| ![R2](https://img.shields.io/badge/-R2_Storage-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Storage** | Arquivos PDF |
| ![Pages](https://img.shields.io/badge/-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Hosting** | CDN Global |

</div>

---

## Arquitetura do Backend

O backend segue uma **Arquitetura Hexagonal (Monolito Modular)** para facilitar manutenção e escalabilidade:

```
worker/src/
├── index.js                    # Entry point
├── config/                     # Constantes e configurações
│   ├── constants.js
│   └── index.js
├── infrastructure/             # Camada de infraestrutura
│   ├── security/               # CORS, crypto helpers
│   ├── auth/                   # JWT, hashing PBKDF2
│   ├── ratelimit/              # Rate limiting
│   ├── response/               # Response helpers
│   └── index.js
├── domain/                     # Lógica de negócio
│   ├── auth/                   # Autenticação (login, rememberMe)
│   ├── atividades/             # Registro de atividades
│   ├── categorias/             # Categorias de partituras
│   ├── estatisticas/           # Estatísticas e instrumentos
│   ├── favoritos/              # Sistema de favoritos
│   ├── partituras/             # CRUD de partituras
│   ├── perfil/                 # Perfil do usuário
│   └── usuarios/               # Gestão de usuários (admin)
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

## Segurança

| Recurso | Implementação |
|---------|---------------|
| **Autenticação** | JWT com expiração configurável (24h ou 30 dias) |
| **Senhas** | PBKDF2 (100k iterações) |
| **Rate Limiting** | Proteção contra brute-force |
| **CORS** | Whitelist de domínios |
| **Sessão** | Logout automático ao expirar + detecção proativa |
| **Super Admin** | Proteção total - invisível e imutável |

---

## Qualidade de Código

O projeto possui infraestrutura completa de testes automatizados:

- **216+ testes unitários** com Jest e Testing Library
- **16 testes E2E** com Playwright (8 mocked + 8 com backend real)
- **CI/CD automatizado** via GitHub Actions
- **ESLint** para padronização de código
- **Husky + lint-staged** para validação pré-commit

Pipeline automático em cada push:
```
Push/PR -> Lint -> Jest (216+) -> E2E Mocked (8) -> Build -> Deploy
```

---

## URLs do Sistema

| Ambiente | Frontend | API |
|----------|----------|-----|
| **Produção** | https://acervo.filarmonica25demarco.com | https://acervo-filarmonica-api.acssjr.workers.dev |
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

Isso cria as tabelas e insere usuários de teste para desenvolvimento local.

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run api` | Inicia backend local (porta 8787) |
| `npm run db:init` | Cria tabelas + seed inicial |
| `npm run db:seed` | Apenas seed (se tabelas existem) |
| `npm run db:reset` | Limpa dados e reaplica seed |
| `npm test` | Roda testes unitários |
| `npm run test:e2e` | Roda testes E2E |

---

## Changelog

<details open>
<summary><b>v2.8.0</b> - 14 de Dezembro de 2025</summary>

**Sistema de Repertório**
- Download em lote: baixe todas as partituras do repertório em PDF único ou ZIP
- Impressão direta: imprima todo o repertório de uma vez
- Lista de instrumentos corrigida: agora mostra todos os instrumentos reais das partituras (ex: "Bombardino C" e "Bombardino Bb")

**Melhorias de UX**
- Animações de hover nos botões administrativos (escala + sombra)
- Botão de repertório com UI otimista (resposta instantânea, reverte em caso de erro)
- Modal para selecionar/criar repertório ao adicionar partitura

</details>

<details>
<summary><b>v2.7.1</b> - 11 de Dezembro de 2025</summary>

**Melhorias na Detecção**
- Fix: detecção automática de categoria no upload individual usando análise multi-camada
- Detecção de duplicatas no backend (impede partituras com mesmo título)
- Correção de acentuação em todo o README

</details>

<details>
<summary><b>v2.7.0</b> - 11 de Dezembro de 2025</summary>

**Transições e Animações**
- Hook `useAnimatedVisibility` para gerenciar animações de entrada/saída
- Animações CSS para modais: backdrop blur, scale in/out, slide down
- Transição de página suave baseada na rota atual
- Frases engraçadas animadas durante upload em lote

**Autenticação Melhorada**
- "Lembrar meu acesso" agora gera token de 30 dias
- Login normal continua com token de 24 horas
- Detecção proativa de tokens expirados (limpa auth em qualquer 401)
- Estabilidade de sessão entre deploys

**Correções**
- Fix: scroll lock robusto em modais (Safari/desktop)
- Fix: erro 401 ao buscar partes da partitura
- Fix: teste flaky de login no CI

</details>

<details>
<summary><b>v2.6.1</b> - 9-10 de Dezembro de 2025</summary>

**Drag & Drop de Pastas**
- Arraste pastas diretamente para a tela do admin
- Overlay visual com instruções durante arraste
- Detecção automática: pasta simples → Upload, subpastas → Lote

**Melhorias no Upload**
- Modal redesenhado com header/footer fixos
- Grid compacto para partes detectadas
- Suporte a pré-carregamento de arquivos

**Sincronização**
- Categorias e instrumentos sincronizados com banco de dados
- Fallback local quando API indisponível
- Migration para corrigir categorias em produção

</details>

<details>
<summary><b>v2.6.0</b> - 8-9 de Dezembro de 2025</summary>

**Arquitetura Modular do Backend**
- Refatoração completa do worker monolítico (2014 linhas → ~50 arquivos)
- Arquitetura Hexagonal com separação Infrastructure/Domain
- Router customizado com suporte a path params e middleware pipeline
- Domain Services separados por responsabilidade

**Novo Domínio**
- Migração para `acervo.filarmonica25demarco.com` (Anteriormente `partituras.app`)
- Configuração de subdomínio via Cloudflare

**Melhorias de UX**
- Skeleton loading em todas as telas
- Correção de acentuação em português
- Melhorias visuais nas sidebars
- Animações Lottie no admin

**Admin**
- Modal de edição de partituras
- Importação em lote melhorada
- Detecção automática de categorias

</details>

<details>
<summary><b>v2.5.0</b> - 7 de Dezembro de 2025</summary>

**Melhorias de UX no Painel Admin**
- Visualização de PDF inline com zoom (Ctrl+Scroll)
- Contador de partes por partitura
- Hover individual nos botões de ação (substituir/deletar)
- Efeito visual de scale nos botões
- Fechamento do PDF ao clicar no backdrop

**Upload**
- Modal redesenhado com SVGs e animações
- Correção de detecção de instrumentos com hífen (ex: Caixa-Clara)
- Correção de race condition entre tutorial e modal

**Qualidade**
- Correção de bugs no carregamento de PDF
- Testes Playwright corrigidos

</details>

<details>
<summary><b>v2.4.0</b> - 6 de Dezembro de 2025</summary>

- **Super Admin:** Proteção total do @admin (invisível, imutável)
- **Badges:** Identificação visual de admins na lista
- **Equalizer:** Animação de loading no login
- **Constants:** Centralização de cores, mensagens e configs

</details>

<details>
<summary><b>v2.3.x</b> - 5 de Dezembro de 2025</summary>

- **Admin Toggle:** Alternar entre modo usuário/admin sem logout
- **Carrossel:** Compositores em destaque na home (mobile)
- **Busca:** Transliteração de grafias antigas
- **Testes:** 215 testes unitários + 16 E2E
- **CI/CD:** Pipeline automatizado com GitHub Actions

</details>

<details>
<summary><b>v2.2.0</b> - 4 de Dezembro de 2025</summary>

- **Arquitetura:** Contexts separados (Auth, UI, Data, Notifications)
- **Performance:** Re-renders isolados por domínio
- 30+ componentes migrados para nova arquitetura

</details>

<details>
<summary><b>Versões anteriores</b></summary>

**v2.1.0** - 3 de Dezembro de 2025
- JWT 24h, PBKDF2, Rate limiting, Redirect admin

**v2.0.0** - 2 de Dezembro de 2025
- Upload pasta, detecção instrumentos, gerenciamento partes

**v1.5.0** - 1 de Dezembro de 2025
- Modal "Sobre", validação PIN, melhorias mobile

**v1.4.0** - 30 de Novembro de 2025
- Perfil com foto, alteração PIN, seletor de tema

**v1.0.0** - 28 de Novembro de 2025
- Versão inicial

</details>

---

<div align="center">

### Desenvolvido por

**Antonio Junior**

*Para a Sociedade Filarmônica 25 de Março*

<br/>

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/acssjr)

---

<sub>Projeto privado - Todos os direitos reservados</sub>

<br/>

**Sociedade Filarmônica 25 de Março - Desde 1868**

</div>
