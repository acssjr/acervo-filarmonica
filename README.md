<div align="center">

# 🎼 Acervo Digital da Filarmonica 25 de Marco

### Sistema de gerenciamento e distribuicao de partituras digitais

*Sociedade Filarmonica 25 de Marco - Feira de Santana, BA - Desde 1868*

<br/>

[![Versao](https://img.shields.io/badge/versao-2.2.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica-refatorado)
[![Status](https://img.shields.io/badge/status-em%20producao-success?style=for-the-badge)](https://acervo-filarmonica.pages.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

<br/>

[**🌐 Acessar Sistema**](https://acervo-filarmonica.pages.dev) &nbsp;&nbsp;•&nbsp;&nbsp; [**📡 API**](https://acervo-filarmonica-api.acssjr.workers.dev)

<br/>

</div>

---

## 📋 Indice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnologica](#-stack-tecnologica)
- [Arquitetura](#-arquitetura)
- [Seguranca](#-seguranca)
- [Instalacao](#-instalacao)
- [Deploy](#-deploy)
- [Banco de Dados](#-banco-de-dados)
- [Changelog](#-changelog)

---

## ✨ Funcionalidades

<table>
<tr>
<td width="33%" valign="top">

### 🎵 Para Musicos
- Interface responsiva (mobile/desktop)
- Download de partituras por instrumento
- Busca e filtros por categoria
- Sistema de favoritos
- Perfil com foto
- Temas claro/escuro/auto
- Notificacoes de novidades

</td>
<td width="33%" valign="top">

### 🎼 Para Maestro
- Acesso a Grade completa
- Download de todas as partes
- Visualizacao do acervo total

</td>
<td width="33%" valign="top">

### ⚙️ Para Admins
- Upload de pasta (multiplas partes)
- Deteccao automatica de instrumentos
- Gerenciamento de partes
- Gestao de musicos
- Estatisticas de downloads
- Reset de PIN

</td>
</tr>
</table>

---

## 🛠 Stack Tecnologica

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

## 🏗 Arquitetura

<details>
<summary><b>📁 Frontend (React)</b></summary>

```
frontend/src/
├── 📂 components/
│   ├── common/          # Toast, Header, ThemeSelector
│   ├── layout/          # BottomNav, Sidebar, DesktopHeader
│   ├── modals/          # SheetDetail, Notifications, ChangePin
│   └── music/           # FileCard, FeaturedCard, CategoryCard
│
├── 📂 contexts/         # Estado global (separado por dominio)
│   ├── AuthContext      # user, logout, isAuthenticated
│   ├── UIContext        # theme, toast, modals
│   ├── DataContext      # sheets, favorites, categories
│   └── NotificationContext
│
├── 📂 screens/          # Telas da aplicacao
│   ├── HomeScreen
│   ├── LibraryScreen
│   ├── SearchScreen
│   ├── ProfileScreen
│   └── admin/           # Painel administrativo
│
├── 📂 hooks/            # Hooks customizados
├── 📂 services/         # API client
├── 📂 styles/           # CSS modular
└── 📂 utils/            # Helpers
```

</details>

<details>
<summary><b>⚡ Backend (Worker)</b></summary>

```
worker/
└── index.js             # API completa
    ├── Auth             # JWT + PBKDF2
    ├── Sheets           # CRUD partituras
    ├── Files            # Upload/Download R2
    └── Users            # Gestao usuarios
```

</details>

<details>
<summary><b>🗄 Database (D1)</b></summary>

```
database/
├── schema.sql           # Schema principal
└── migrations/          # Migracoes
```

**Tabelas:** `usuarios` • `partituras` • `partes` • `instrumentos` • `categorias` • `favoritos` • `logs_download`

</details>

---

## 🔒 Seguranca

| Recurso | Implementacao |
|---------|---------------|
| 🔐 **Autenticacao** | JWT com expiracao de 24h |
| 🔑 **Senhas** | PBKDF2 (100k iteracoes) |
| 🛡 **Rate Limiting** | Protecao contra brute-force |
| 🌐 **CORS** | Whitelist de dominios |
| ⏰ **Sessao** | Logout automatico ao expirar |

---

## 💻 Instalacao

```bash
# Clonar repositorio
git clone https://github.com/acssjr/acervo-filarmonica-refatorado.git

# Instalar dependencias
cd acervo-filarmonica-refatorado/frontend
npm install

# Rodar em desenvolvimento
npm run dev

# Build de producao
npm run build

# Preview local
npm run preview
```

---

## 🚀 Deploy

**Pre-requisitos:** Node.js 18+ • Conta Cloudflare • Wrangler CLI

```bash
# Login Cloudflare
npx wrangler login

# Deploy API (Worker)
npx wrangler deploy

# Deploy Frontend (Pages)
cd frontend && npm run build
npx wrangler pages deploy dist --project-name=acervo-filarmonica
```

---

## 🗃 Banco de Dados

<details>
<summary><b>Comandos uteis D1</b></summary>

```bash
# Listar partituras
npx wrangler d1 execute acervo-db --remote \
  --command="SELECT * FROM partituras"

# Listar usuarios
npx wrangler d1 execute acervo-db --remote \
  --command="SELECT id, username, nome, instrumento_id, admin FROM usuarios"
```

</details>

---

## 📝 Changelog

<details open>
<summary><b>v2.2.0</b> - Dezembro 2025</summary>

- 🏗 **Arquitetura:** Contexts separados (Auth, UI, Data, Notifications)
- ⚡ **Performance:** Re-renders isolados por dominio
- 📦 30+ componentes migrados para nova arquitetura

</details>

<details>
<summary><b>v2.1.0</b> - Dezembro 2025</summary>

- 🔐 JWT com expiracao de 24h
- 🔑 Senhas criptografadas com PBKDF2
- 🛡 Rate limiting contra ataques
- 🔄 Redirecionamento automatico admin

</details>

<details>
<summary><b>v2.0.0</b> - Dezembro 2025</summary>

- 📁 Upload de pasta com multiplas partes
- 🎯 Deteccao automatica de instrumentos
- ⚙️ Gerenciamento de partes no admin

</details>

<details>
<summary><b>Versoes anteriores</b></summary>

**v1.5.0** - Modal "Sobre", validacao PIN, melhorias mobile

**v1.4.0** - Perfil com foto, alteracao PIN, seletor de tema

**v1.0.0** - Versao inicial

</details>

---

<div align="center">

### 👨‍💻 Desenvolvido por

**Antonio Junior**

*Para a Sociedade Filarmonica 25 de Marco*

<br/>

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/acssjr)

---

<sub>Projeto privado - Todos os direitos reservados</sub>

<br/>

**🎺 Sociedade Filarmonica 25 de Marco - Desde 1868 🎺**

</div>
